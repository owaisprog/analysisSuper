import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaUser,
  FaComments,
  FaCog,
  FaBell,
  FaSearch,
  FaThLarge,
} from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const SuperAdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("SuperToken"); // 'token' is the name of the cookie
    navigate("/Login");
  };

  return (
    <nav className="bg-white shadow-lg rounded-lg relative ">
      <h2 className=" text-2xl text-[#444] font-normal absolute border border-[#bbb] bottom-0 left-1/2 translate-x-[-50%] rounded-lg translate-y-[50%] bg-gray-200 py-2 px-7">
        SUPER ADMIN
      </h2>
      <div className="max-w-[1280px] flex justify-between items-center w-[90%] mx-auto">
        {/* Logo and Brand */}
        <div className="flex justify-start items-center space-x-4">
          <div className="flex items-center  rounded-full ">
            <div className="w-[200px] h-[100px]">
              <img
                src="/LOGO.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{
            color: "black",
            borderColor: "#888",
            "&:hover": {
              borderColor: "#888",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;
