import React, { useState } from "react";
import axios from "axios"; // Ensure axios is installed
import { useNavigate, useParams } from "react-router-dom"; // Combined imports
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";
import { IoEye, IoEyeOff } from "react-icons/io5"; // Import eye icons


function Login() {
  // State to manage form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate


  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to replace hyphens with spaces
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Trim leading and trailing spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      const response = await axios.post(
        `https://api.talentspy.ai/api/login/`,
        { email: trimmedEmail, password: trimmedPassword }
      );
      if (response.data.role === 'superAdmin') {
        Cookies.set('SuperToken', response.data.token, { expires: 7 });
        navigate('/');
      } 
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-[200px] h-[200px] mb-8 fixed top-[-50px] left-3">
          <img
            src="/LOGO.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <h3 className="text-[64px] font-bold text-center relative after:content-[''] after:block mb-12 mt-5 after:w-[100%] after:h-[2px] after:bg-[#1A73E8] after:mx-auto after:translate-y-[-10px]">
          LOGIN
        </h3>

        <div className="bg-[#f5f5f5] relative shadow-lg rounded-[50px] flex flex-col border-2 border-[#1A73E8] pt-8 pb-5 px-24 w-[700px]">
          <div className="absolute">
            <img src="" alt="" />
          </div>
          <form
            onSubmit={handleSubmit}
            className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
          >
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block py-2.5 px-0 font-semibold w-full text-gray-700 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-[#1A73E8] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute text-gray-600 font-semibold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#1A73E8] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative z-0 mb-6 w-full group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block py-2.5 px-0 font-semibold w-full text-gray-700 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-[#1A73E8] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute text-gray-600 font-semibold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#1A73E8] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-2 cursor-pointer text-gray-600"
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </span>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-center pt-5">
              <button
                type="submit"
                className=" bg-[#047D16] hover:bg-[#0a5415] w-[197px] transition-all duration-200 text-white rounded-[20px] text-[16px] font-bold py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    size={26}
                    sx={{ color: "white", margin: "0 auto" }}
                  />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
