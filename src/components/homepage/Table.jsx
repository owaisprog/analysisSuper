import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { MdEdit, MdDelete } from 'react-icons/md';
import { IoCloudDownloadOutline } from "react-icons/io5";

const CustomTable = ({ adminData, onEdit, onDelete }) => {

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'Logo', headerName: 'Logo' },
    { field: 'companyName', headerName: 'Company Name' },
    { field: 'typeofBusiness', headerName: 'Type of Business' },
    { field: 'email', headerName: 'Email' },
    { field: 'users', headerName: 'Users' },

    { field: 'password', headerName: 'Password' },
    { field: 'actions', headerName: 'Actions' },
  ];

  return (
    <TableContainer component={Paper} sx={{borderRadius:"10px" , width:"90%" , maxWidth:"1280px", margin : "0 auto"}}>
      <Table >
        <TableHead sx={{bgcolor:"#f0f1f1"}}> 
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field}>{column.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody >
          {adminData.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ color:"#555"}} >
                  {column.field === 'Logo' ? (
                    <img src={row[column.field]} alt={row.companyName} width="50" />
                  ) : column.field === 'actions' ? (
                    <>
                      
                      <IconButton onClick={() => onDelete(row.id)}>
                        <MdDelete className='text-red-600' />
                      </IconButton>
                      <IconButton onClick={() => onEdit(row)}>
                        <IoCloudDownloadOutline className='text-blue-600' />
                      </IconButton>
                    </>
                  ) : (
                    row[column.field]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
