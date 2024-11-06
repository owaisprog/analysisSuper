import React from "react";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const SuperAdminNavbar = ({ queries }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("SuperToken");
    navigate("/Login");
  };

  return (
    <nav className="bg-white shadow-lg rounded-lg relative">
      <h2 className="text-2xl text-[#444] font-normal absolute border border-[#bbb] bottom-0 left-1/2 translate-x-[-50%] rounded-lg translate-y-[50%] bg-gray-200 py-2 px-7">
        SUPER ADMIN
      </h2>
      <div className="max-w-[1280px] flex justify-between items-center w-[90%] mx-auto">
        {/* Logo and Brand */}
        <div className="flex justify-start items-center space-x-4">
          <div className="flex items-center rounded-full">
            <div className="w-[200px] h-[100px]">
              <img src="/LOGO.png" alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{
              color: "black",
              marginRight: "12px",
              borderColor: "#888",
              "&:hover": {
                borderColor: "#888",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            All Users
          </Button>

          <div className="relative inline-block">
            <Button
              variant="outlined"
              onClick={() => navigate("/queries")}
              sx={{
                color: "black",
                marginRight: "12px",
                borderColor: "#888",
                "&:hover": {
                  borderColor: "#888",
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Queries
            </Button>
            {/* Badge for the number of queries */}
            {queries > 0 && (
              <span className="absolute top-[-5px] right-[2px] bg-[#333] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {queries}
              </span>
            )}
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
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;
