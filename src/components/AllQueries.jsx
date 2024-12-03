import React, { useEffect, useState } from "react";
import {
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
import { GrSearch } from "react-icons/gr";


const AllQueries = () => {
  const navigate = useNavigate();

  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true)
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
      <div className="flex relative rounded-[50px] text-white translate-y-[-80px] mx-auto w-[30%] overflow-hidden focus-within:text-[#1A73E8]">
        <input
          type="text"
          placeholder="Search Inquiries"
          className=" focus:text-[#222] border-2  border-[#1A73E8] transition-all rounded-[50px] focus:bg-white outline-none bg-[#1A73E8] w-full placeholder:text-white text-xs font-bold px-5 py-3"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <span className="absolute right-4 bottom-[7px]">
    <GrSearch size={25} color="inherit" />
  </span>
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
