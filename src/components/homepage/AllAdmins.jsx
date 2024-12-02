import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { IoEye, IoEyeOff } from "react-icons/io5"; // Import eye icons
import { GrSearch } from "react-icons/gr";
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
  Modal,
} from "@mui/material";
import { IoMdAdd } from "react-icons/io";
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
  const [deleteOpenModel, setDeleteOpenModel] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userMaxLimit, setUserMaxLimit] = useState("");
  const [interviewUserMaxLimit, setInterviewUserMaxLimit] = useState("");
  const [originalPassword, setOriginalPassword] = useState("");
  const [originalUserMaxLimit, setOriginalUserMaxLimit] = useState("");
  const [originalInterviewUserMaxLimit, setOriginalInterviewUserMaxLimit] =
    useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [getAdminData, setGetAdminData] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editAdmin, setEditAdmin] = useState(null);
  const [loadingDownload, setLoadingDownload] = useState({});
  const [mainloading, setMainLoading] = useState(true);

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to replace hyphens with spaces
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      setMainLoading(true);
      try {
        const response = await axios.get(
          "https://api.talentspy.ai/api/getAllAdmins"
        );
        setMainLoading(false);
        setAdminData(response.data);
      } catch (error) {}
    };

    fetchAdminData();
  }, [getAdminData]);

  const resetFormFields = () => {
    setEmail("");
    setPassword("");
    setUserMaxLimit("");
    setInterviewUserMaxLimit("");
    setOriginalPassword("");
    setOriginalUserMaxLimit("");
    setOriginalInterviewUserMaxLimit("");
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
      setInterviewUserMaxLimit(admin.interviewUserMaxLimit || "");
      setOriginalPassword(admin.password);
      setOriginalUserMaxLimit(admin.userMaxLimit || admin.users || "");
      setOriginalInterviewUserMaxLimit(admin.interviewUserMaxLimit);
    } else {
      resetFormFields();
    }
  };
  const handleOpenDeleteModel = (id) => {
    setDeleteId(id);
    setDeleteOpenModel(true);
  };

  const handleCloseModel = () => {
    setOpenModel(false);
    resetFormFields();
    setEditAdmin(null);
  };

  const handleCloseDeleteModel = () => {
    setDeleteId(null);
    setDeleteOpenModel(false);
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

      if (interviewUserMaxLimit !== originalInterviewUserMaxLimit) {
        // Update userMaxLimit
        await axios.put(
          `https://api.talentspy.ai/api/changeInterviewUserMaxLimit/${editAdmin.id}`,
          { interviewUserMaxLimit },
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
    setDeleteLoading(true);

    try {
      await axios.delete(`https://api.talentspy.ai/api/deleteAdmin/${adminId}`);
      setGetAdminData(getAdminData + 1);
      setDeleteLoading(false);
      handleCloseDeleteModel();
    } catch (error) {
      setDeleteLoading(false);
      handleCloseDeleteModel();

      setError("Failed to delete admin. Please try again.");
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
      interviewUserMaxLimit,
    };
    try {
      await axios.post("https://api.talentspy.ai/api/createAdmin", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
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

  const columns = [
    "ID ",
    "Date",
    "Users",
    "Name/Email",
    "Password",
    "Max Performers",
    "Max Interviews /month",
    "Actions",
  ];

  return (
    <div className="max-w-[1360px] w-[90%] mx-auto">
      <div className="flex flex-col-reverse gap-3 w-full items-end translate-y-[-80px]">
        <button
          className="bg-[#047D16] hover:bg-[#0a5415] w-[197px] transition-all duration-200 text-white rounded-[20px] text-[16px] font-bold py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleOpenModel()}
        >
          <IoMdAdd size={20} className="mr-1" /> Create Admin
        </button>
        <button
          className="bg-[#047D16] hover:bg-[#0a5415] w-[197px] transition-all duration-200 text-white rounded-[20px] text-[16px] font-bold py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => navigate("/queries")}
        >
          Inquiries
        </button>
      </div>
      <div className="flex relative rounded-[50px] text-white translate-y-[-80px] mx-auto border-2 w-[30%] border-[#1A73E8] overflow-hidden focus-within:text-[#1A73E8]">
        <input
          type="text"
          placeholder="Search Admins"
          className="focus:text-[#222] rounded-bl-[50px] transition-all rounded-tl-[50px] focus:bg-white outline-none bg-[#1A73E8] w-full placeholder:text-white text-xs font-bold px-5 py-3"
          value={searchTerm}
          onChange={handleSearch}
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
            {filteredAdminData.length > 0 ? (
              filteredAdminData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight: "1px solid #bfbfbf", // Line between body columns
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
                      borderRight: "1px solid #bfbfbf", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {new Date(row.createdAt).toLocaleDateString()} (
                    {new Date(row.createdAt).toLocaleTimeString()})
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight: "1px solid #bfbfbf", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {row.users}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight: "1px solid #bfbfbf", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    <div className="flex gap-2 justify-center">
                      {row?.adminInfo?.Logo && (
                        <img
                          src={row.adminInfo.Logo}
                          alt="Logo"
                          className="w-[2.7rem] h-[2.7rem] object-cover rounded-full border border-[#bbb]"
                        />
                      )}
                      <div className="flex flex-col">
                        <h4 className="text-[#222]">
                          {row?.adminInfo?.companyName}
                        </h4>
                        <h5 className="text-[#777]">{row.email}</h5>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight: "1px solid #bfbfbf", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {row.password}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight: "1px solid #bfbfbf", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {row.userMaxLimit}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      borderRight: "1px solid #bfbfbf", // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                  >
                    {row.interviewUserMaxLimit}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#555",
                      fontWeight: "700",
                      fontFamily: "Montserrat, sans-serif",
                      borderBottom: "1px solid #bfbfbf", // Line between body rows
                      // Line between body columns
                      textAlign: "center", // Center text horizontally
                      verticalAlign: "middle", // Center text vertically
                    }}
                    align="center"
                  >
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
                      <IconButton onClick={() => handleOpenDeleteModel(row.id)}>
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
                <TableCell
                  sx={{
                    fontSize: "16px",
                    color: "#333",
                    fontWeight: "700",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                  colSpan={columns.length}
                  align="center"
                >
                  {mainloading ? (
                    <CircularProgress size={30} color="#666" />
                  ) : (
                    "No Admins Found"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {openModel && (
        <Modal open={openModel} onClose={handleCloseModel}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-60">
            <div className="bg-white border-2 border-[#ff0000] w-full max-w-xl mx-4 rounded-[50px] shadow-lg py-10 px-9 transform transition-all">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseModel}
                  className=" cursor-pointer text-[1.6rem] translate-x-[9px] translate-y-[-9px] text-white p-[5px] bg-black rounded-full"
                  aria-label="Close"
                >
                  <RxCross2 />
                </button>
              </div>

              <form
                onSubmit={editAdmin ? handleEditSubmit : handleSubmit}
                className="w-full flex justify-center items-start flex-col pb-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              >
                <div className="w-full flex justify-center">
                  <h3 className="font-semibold text-[32px] mb-5 mt-1">
                    {editAdmin ? "Edit Admin" : "Create Admin"}
                  </h3>
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="w-[100%] space-y-10">
                    {/* Email input */}
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

                    {/* Password input */}
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
                        {showPassword ? (
                          <IoEyeOff size={20} />
                        ) : (
                          <IoEye size={20} />
                        )}
                      </span>
                    </div>

                    {/* User Max-Limit input */}
                    <div className="relative z-0 mb-6 w-full group">
                      <input
                        id="userMaxLimit"
                        name="userMaxLimit"
                        type="number"
                        required
                        className="block py-2.5 px-0 font-semibold w-full text-gray-700 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-[#1A73E8] peer"
                        placeholder=""
                        value={userMaxLimit}
                        onChange={(e) => setUserMaxLimit(e.target.value)}
                      />
                      <label
                        htmlFor="userMaxLimit"
                        className="absolute text-gray-600 font-semibold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#1A73E8] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Users Max Limit
                      </label>
                    </div>

                    <div className="relative z-0 mb-6 w-full group">
                      <input
                        id="interviewUserMaxLimit"
                        name="interviewUserMaxLimit"
                        type="number"
                        required
                        className="block py-2.5 px-0 font-semibold w-full text-gray-700 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-[#1A73E8] peer"
                        placeholder=""
                        value={interviewUserMaxLimit}
                        onChange={(e) =>
                          setInterviewUserMaxLimit(e.target.value)
                        }
                      />
                      <label
                        htmlFor="interviewUserMaxLimit"
                        className="absolute text-gray-600 font-semibold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#1A73E8] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Interview Users Max Limit (Monthly)
                      </label>
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 font-semibold">{error}</p>}
                <div className="w-full pt-3">
                  <button
                    type="submit"
                    className="bg-[#047D16] hover:bg-[#0a5415] mx-auto w-[180px] transition-all duration-200 text-white rounded-[20px] text-[16px] font-bold py-[10px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress
                        size={26}
                        color="inherit"
                        sx={{ margin: "0 13px 0px 13px" }}
                      />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {deleteOpenModel && (
        <Modal open={deleteOpenModel} onClose={handleCloseDeleteModel}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-60">
            <div className="bg-white border-2 border-[#ff0000] w-full max-w-xl mx-4 rounded-[50px] shadow-lg py-10 px-9 transform transition-all">
              <div className="flex justify-end">
                <button
                  onClick={handleCloseDeleteModel}
                  className=" cursor-pointer text-[1.6rem] translate-x-[9px] translate-y-[-9px] text-white p-[5px] bg-black rounded-full"
                  aria-label="Close"
                >
                  <RxCross2 />
                </button>
              </div>

              <div className="w-full flex justify-center">
                <h3 className="font-semibold text-[32px] text-[#222] mb-5 mt-1">
                  Delete Admin
                </h3>
              </div>
              <p className="font-bold text-[#333] text-[18px] text-center mb-7">
                Are you sure you want to delete this admin ?{" "}
              </p>
              <div className="flex justify-between w-full">
                <button
                  type="submit"
                  className="bg-[#047D16] hover:bg-[#0a5415] mx-auto w-[180px] transition-all duration-200 text-white rounded-[20px] text-[16px] font-bold py-[10px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCloseDeleteModel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800/90 mx-auto w-[180px] transition-all duration-200 text-white rounded-[20px] text-[16px] font-bold py-[10px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deleteLoading}
                  onClick={() => handleDeleteAdmin(deleteId)}
                >
                  {deleteLoading ? (
                    <CircularProgress
                      size={26}
                      color="inherit"
                      sx={{ margin: "0 13px 0px 13px" }}
                    />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AllAdmins;
