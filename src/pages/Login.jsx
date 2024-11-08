import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Cookies from 'js-cookie';
import { CircularProgress } from "@mui/material";
import { IoEye, IoEyeOff } from "react-icons/io5"; // Import eye icons

function Login() {
  // State to manage form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Trim leading and trailing spaces from email and password
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      const response = await axios.post('https://gptbackend-xp1u.onrender.com/api/login', {
        email: trimmedEmail,
        password: trimmedPassword
      });

      if (response.data.role === 'superAdmin') {
        Cookies.set('SuperToken', response.data.token, { expires: 7 });
        navigate('/');
      } 
      // You can handle other roles or responses here if needed
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col items-center justify-center'>
      <div className='w-[200px] h-[200px] mb-8'>
        <img src="/LOGO.png" alt="Logo" className="w-full h-full object-contain" />
      </div>

      <div className="bg-gray-100 py-6 flex flex-col sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="email" // Changed to email for better validation
                      className="peer placeholder-transparent h-10 w-[400px] border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm 
                                 peer-placeholder-shown:text-base 
                                 peer-placeholder-shown:text-gray-440 
                                 peer-placeholder-shown:top-2 
                                 transition-all 
                                 peer-focus:-top-3.5 
                                 peer-focus:text-gray-600 
                                 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"} // Conditionally change input type
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600 pr-10" // Added padding-right for the icon
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm 
                                 peer-placeholder-shown:text-base 
                                 peer-placeholder-shown:text-gray-440 
                                 peer-placeholder-shown:top-2 
                                 transition-all 
                                 peer-focus:-top-3.5 
                                 peer-focus:text-gray-600 
                                 peer-focus:text-sm"
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
                  <div className="relative">
                    <button
                      type="submit"
                      className="border bg-black text-white rounded-md px-4 py-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
