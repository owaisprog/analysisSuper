import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AllQueries from "../components/AllQueries";

function Queries() {
  const navigate = useNavigate();

  useEffect(() => {
    const SuperToken = Cookies.get("SuperToken");
    if (!SuperToken) {
      navigate("/Login");
    }
  }, [navigate]);

  
  const handleLogout = () => {
    Cookies.remove("SuperToken");
    navigate("/Login");
  };

  return (
    <div className="min-h-[100vh]">
      <h3 className="text-[64px] font-bold text-center relative after:content-[''] pt-5 after:block after:w-[20%] after:h-[2px] after:bg-[#1A73E8] after:mx-auto after:translate-y-[-7px] ">
        SUPER ADMIN
      </h3>
      <div className="w-[200px] h-[200px] mb-8 fixed top-[-50px] left-3">
        <img
          src="/LOGO.png"
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-[220px] h-[200px] mb-8 fixed bottom-[-150px] left-3">
        <button
          onClick={handleLogout}
          className="flex hover:bg-[#f5f5f5] hover:border rounded-[20px] hover:shadow-md transition-all duration-200 hover:border-[#1A73E8] py-3 px-7 justify-center items-center gap-2 font-bold text-[20px]"
        >
            <img src="/icons8-log-out-50 2.png" alt="" />
            <span> Logout </span>
        </button>
      </div>
      <div>
        <AllQueries />
      </div>
    </div>
  );
}

export default Queries;
