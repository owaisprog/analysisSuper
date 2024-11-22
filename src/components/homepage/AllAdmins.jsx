import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { FaArrowUpShortWide, FaArrowUpWideShort } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiDownloadCloud, FiEdit2 } from "react-icons/fi";
import jsPDF from "jspdf"; // Default import
import "jspdf-autotable"; // Side effect import to extend jsPDF

function AllAdmins() {
  const navigate = useNavigate();

  useEffect(() => {
    const SuperToken = Cookies.get("SuperToken");
    if (!SuperToken) {
      navigate("/");
    }
  }, [navigate]);

  const [openModel, setOpenModel] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userMaxLimit, setUserMaxLimit] = useState("");
  const [originalPassword, setOriginalPassword] = useState("");
  const [originalUserMaxLimit, setOriginalUserMaxLimit] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [getAdminData, setGetAdminData] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editAdmin, setEditAdmin] = useState(null);
  const [loadingDownload, setLoadingDownload] = useState({});

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          "https://api.talentspy.ai/api/getAllAdmins"
        );
        setAdminData(response.data);
      } catch (error) {
      }
    };

    fetchAdminData();
  }, [getAdminData]);

  const resetFormFields = () => {
    setEmail("");
    setPassword("");
    setUserMaxLimit("");
    setOriginalPassword("");
    setOriginalUserMaxLimit("");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAdminData =
    adminData &&
    adminData.filter((admin) =>
      ["companyName", "email", "password"].some(
        (field) =>
          typeof admin[field] === "string" &&
          admin[field].toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const handleSort = () => {
    const sortedData = [...adminData].sort((a, b) => {
      return sortOrder === "asc" ? a.users - b.users : b.users - a.users;
    });
    setAdminData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleOpenModel = (admin = null) => {
    setEditAdmin(admin);
    setOpenModel(true);
    if (admin) {
      setEmail(admin.email);
      setPassword(admin.password);
      setUserMaxLimit(admin.userMaxLimit || admin.users || "");
      setOriginalPassword(admin.password);
      setOriginalUserMaxLimit(admin.userMaxLimit || admin.users || "");
    } else {
      resetFormFields();
    }
  };

  const handleCloseModel = () => {
    setOpenModel(false);
    resetFormFields();
    setEditAdmin(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (password !== originalPassword) {
        // Update password
        await axios.put(
          `https://api.talentspy.ai/api/editPassword/${editAdmin.id}`,
          { password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (userMaxLimit !== originalUserMaxLimit) {
        // Update userMaxLimit
        await axios.put(
          `https://api.talentspy.ai/api/changeUserMaxLimit/${editAdmin.id}`,
          { userMaxLimit },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      setGetAdminData(getAdminData + 1);
      handleCloseModel();
    } catch (error) {
      setError("An error occurred while updating admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://api.talentspy.ai/api/deleteAdmin/${adminId}`
        );
        setGetAdminData(getAdminData + 1);
      } catch (error) {
        setError("Failed to delete admin. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = {
      email,
      password,
      userMaxLimit,
    };
    try {
      await axios.post(
        "https://api.talentspy.ai/api/createAdmin",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setGetAdminData(getAdminData + 1);
      handleCloseModel();
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAdminData = async (adminId) => {
    setLoadingDownload((prevState) => ({ ...prevState, [adminId]: true }));
    try {
      const response = await axios.get(
        `https://api.talentspy.ai/api/getAdminInfo/${adminId}`
      );
      const adminDataResponse = response.data;
      if (!adminDataResponse) {
        return;
      }

      // Exclude 'Logo' from adminInfo
      const { Logo, ...dataToDownload } = adminDataResponse;

      // Define key mappings for correct labels
      const keyMappings = {
        typeofBusiness: "Type of Business",
        websiteURL: "Website URL",
        // Add other key mappings if necessary
      };

      // Convert keys to more readable format and prepare data for autoTable
      const tableBody = [];
      for (const [key, value] of Object.entries(dataToDownload)) {
        let formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        if (keyMappings.hasOwnProperty(key)) {
          formattedKey = keyMappings[key];
        }
        tableBody.push([formattedKey, String(value)]);
      }

      // Generate PDF
      const doc = new jsPDF();

      // Add a title
      doc.setFontSize(18);
      doc.text("Admin Details", 14, 22);

      // Use autoTable to display data in a table
      doc.autoTable({
        startY: 30,
        head: [["Field", "Value"]],
        body: tableBody,
        columnStyles: {
          0: { cellWidth: 60 }, // Adjust as needed
          1: { cellWidth: 120 }, // Adjust as needed
        },
        styles: {
          fontSize: 11,
          cellPadding: 3,
          overflow: "linebreak",
          halign: "left",
          valign: "top",
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        theme: "striped",
      });

      // Save the PDF
      doc.save(`admin_${adminId}.pdf`);
    } catch (error) {
      setError("Failed to download PDF. Please try again.");
    } finally {
      setLoadingDownload((prevState) => ({ ...prevState, [adminId]: false }));
    }
  };

  const columns = ["ID number", "Date", "Users", "Name/Email", "Password","Max Limit", "Actions"];

  return (
    <div className="relative p-4 h-[90vh]">
      <div className="flex justify-between items-center mt-9 mb-3 max-w-[1280px] w-[90%] mx-auto">
        <input
          type="search"
          placeholder="Search admins ..."
          className="rounded-md transition-all duration-150 ease-in-out py-2 px-2 border border-[#555] w-[25%] outline-none text-[#333] hover:bg-[#f5f5f5]"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="flex gap-3">
          <Button
            variant="outlined"
            onClick={() => handleOpenModel()}
            sx={{
              color: "black",
              display: "flex",
              alignItems: "center",
              gap: "2px",
              borderColor: "#888",
              "&:hover": {
                borderColor: "#888",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <IoMdAdd size={20} /> Create Admin
          </Button>
          <Button
            variant="outlined"
            onClick={handleSort}
            sx={{
              color: "black",
              display: "flex",
              alignItems: "center",
              gap: "2px",
              borderColor: "#888",
              "&:hover": {
                borderColor: "#888",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Sort{" "}
            {sortOrder === "asc" ? (
              <FaArrowUpShortWide size={18} />
            ) : (
              <FaArrowUpWideShort size={18} />
            )}
          </Button>
        </div>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "10px",
          width: "90%",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f0f1f1" }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  align={column === "Actions" ? "center" : "left"}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdminData.length > 0 ? (
              filteredAdminData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleDateString()} (
                    {new Date(row.createdAt).toLocaleTimeString()})
                  </TableCell>
                  <TableCell>{row.users}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {row?.adminInfo?.Logo && (
                        <img
                          src={row.adminInfo.Logo}
                          alt="Logo"
                          className="w-[2.7rem] h-[2.7rem] object-cover rounded-full border border-[#bbb]"
                        />
                      )}
                      <div className="flex flex-col">
                        <h4 className="text-[#333] font-medium">
                          {row?.adminInfo?.companyName}
                        </h4>
                        <h5 className="text-[#777]">{row.email}</h5>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{row.password}</TableCell>
                  <TableCell>{row.userMaxLimit}</TableCell>
                  <TableCell sx={{ color: "#555" }} align="center">
                    <>
                      <IconButton
                        onClick={() => handleDownloadAdminData(row.id)}
                        disabled={!row.adminInfo}
                      >
                        {loadingDownload[row.id] ? (
                          <CircularProgress size={20} />
                        ) : (
                          <FiDownloadCloud size={20} className="text-[#444]" />
                        )}
                      </IconButton>
                      <IconButton onClick={() => handleDeleteAdmin(row.id)}>
                        <RiDeleteBinLine size={20} className="text-[#444]" />
                      </IconButton>
                      <IconButton onClick={() => handleOpenModel(row)}>
                        <FiEdit2 size={20} className="text-[#444]" />
                      </IconButton>
                    </>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No Admins Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {openModel && (
        <div className="bg-black bg-opacity-10 absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="w-[40%] mt-8 h-max py-1 bg-white rounded-md shadow-md">
            <div className="flex justify-end">
              <button
                onClick={handleCloseModel}
                className="mt-1 mr-[5px] cursor-pointer text-[1.5rem] text-white p-1 bg-black rounded-full"
                aria-label="Close"
              >
                <RxCross2 />
              </button>
            </div>

            <form
              onSubmit={editAdmin ? handleEditSubmit : handleSubmit}
              className="w-full flex justify-center items-start flex-col py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <div className="w-full flex justify-center">
                <h3 className="font-semibold text-xl">
                  {editAdmin ? "Edit Admin" : "Create Admin"}
                </h3>
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="w-[100%] space-y-10">
                  {/* Email input */}
                  <div className="w-[90%] mx-auto flex justify-between items-center gap-4">
                    <div className="relative w-full">
                      <input
                        autoComplete="off"
                        id="email"
                        name="email"
                        type="email"
                        required
                        disabled={!!editAdmin}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500 disabled:bg-gray-100"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Email
                      </label>
                    </div>
                  </div>

                  {/* Password input */}
                  <div className="w-[90%] mx-auto flex justify-between items-center gap-4">
                    <div className="relative w-full">
                      <input
                        id="password"
                        name="password"
                        type="text"
                        required
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label
                        htmlFor="password"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                    </div>
                  </div>

                  {/* User Max-Limit input */}
                  <div className="w-[90%] mx-auto flex justify-between items-center gap-4">
                    <div className="relative w-full">
                      <input
                        id="userMaxLimit"
                        name="userMaxLimit"
                        type="number"
                        required
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                        placeholder="Users Max Limit"
                        value={userMaxLimit}
                        onChange={(e) => setUserMaxLimit(e.target.value)}
                      />
                      <label
                        htmlFor="userMaxLimit"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Users Max Limit
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 font-semibold">{error}</p>}
              <div className="w-full text-center pt-3">
                <button
                  type="submit"
                  className="border bg-black text-white rounded-md px-3 py-1"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllAdmins;
