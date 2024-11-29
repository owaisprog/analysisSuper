import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowUpShortWide, FaArrowUpWideShort } from "react-icons/fa6";
import { CircularProgress } from "@mui/material";


const AllQueries = () => {
  const navigate = useNavigate();

  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          "https://api.talentspy.ai/api/getAllMessages"
        );
        setQueries(response.data);
        setFilteredQueries(response.data);
        setLoading(false)
      } catch (error) {}
    };
    fetchAdminData();
  }, []);

  // Search functionality
  useEffect(() => {
    const filteredData = queries.filter((query) =>
      Object.values(query).some((value) =>
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredQueries(filteredData);
  }, [searchText, queries]);

  // Sort functionality
  const handleSort = () => {
    const sortedData = [...filteredQueries].sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredQueries(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const columns = [
    "Sr # ",
    "Name",
    "Company Name",
    "Phone Number",
    "Email",
    "Message",
    "Date",
  ];

  return (
    <div className="max-w-[1360px] w-[90%] mx-auto">
      <div className="flex flex-col-reverse gap-3 w-full items-end translate-y-[-80px]">
        <button
          className="bg-[#047D16] hover:bg-[#0a5415] w-[197px] transition-all duration-200 text-white rounded-[20px] text-[16px] font-bold py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSort}
        >
          Sort{" "}
          {sortOrder === "asc" ? (
            <FaArrowUpShortWide className="ml-1" size={18} />
          ) : (
            <FaArrowUpWideShort className="ml-1" size={18} />
          )}
        </button>
        <button
          className="bg-[#047D16] hover:bg-[#0a5415] w-[197px] transition-all duration-200 text-white rounded-[20px] text-[16px] font-bold py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => navigate("/")}
        >
          All Admins
        </button>
      </div>
      <div className="flex rounded-[50px] translate-y-[-80px] mx-auto border w-[30%]  bg-[#1A73E8] overflow-hidden ">
        <input
          type="text"
          placeholder="Search Inquiries"
          className=" focus:text-[#222] rounded-bl-[50px] transition-all rounded-tl-[50px] focus:bg-white border-2 border-[#1A73E8] text-white outline-none bg-[#1A73E8] w-full placeholder:text-white text-xs font-bold px-5 py-3"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="button" className="flex items-center justify-center px-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="16px"
            className="fill-[#fff]"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
        </button>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "20px",
          transform: "translateY(-60px)",
          background: "#ededed",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column}
                  sx={{
                    fontSize: "16px",
                    fontWeight: "700",
                    fontFamily: "Montserrat, sans-serif",
                    borderBottom: "1px solid #bfbfbf", // Line between header cells
                    borderRight:
                      index < columns.length - 1 ? "1px solid #bfbfbf" : "none", // Line between header columns
                    textAlign: "center", // Center text horizontally
                    verticalAlign: "middle", // Center text vertically
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQueries.length > 0 ? (
              filteredQueries.map((query, index) => (
                <TableRow key={query.id}>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight:
                        index < columns.length - 1
                          ? "1px solid #bfbfbf"
                          : "none", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight:
                        index < columns.length - 1
                          ? "1px solid #bfbfbf"
                          : "none", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {query.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight:
                        index < columns.length - 1
                          ? "1px solid #bfbfbf"
                          : "none", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {query.companyName}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight:
                        index < columns.length - 1
                          ? "1px solid #bfbfbf"
                          : "none", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {query.phoneNumber}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight:
                        index < columns.length - 1
                          ? "1px solid #bfbfbf"
                          : "none", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {query.email}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight:
                        index < columns.length - 1
                          ? "1px solid #bfbfbf"
                          : "none", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: "150px",
                      }}
                    >
                      {query.message}
                    </div>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight:
                        index < columns.length - 1
                          ? "1px solid #bfbfbf"
                          : "none", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {new Date(query.createdAt).toLocaleDateString()} (
                    {new Date(query.createdAt).toLocaleTimeString()})
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: "16px",
                    color: "#333",
                    fontWeight: "700",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                  colSpan={7}
                  align="center"
                >
                  {
                    loading ? <CircularProgress size={30} color="#666" /> :"No Inquiries Found"
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllQueries;
