import React, { useEffect, useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { FaArrowUpShortWide, FaArrowUpWideShort } from 'react-icons/fa6';

const AllQueries = () => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          'https://gptbackend-xp1u.onrender.com/api/getAllMessages'
        );
        setQueries(response.data);
        setFilteredQueries(response.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
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
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredQueries(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="relative p-4 h-[90vh]">
      <div className="flex justify-between items-center mt-9 mb-3 max-w-[1280px] w-[90%] mx-auto">
        <input
          type="search"
          placeholder="Search queries..."
          className="rounded-md transition-all duration-150 ease-in-out py-2 px-2 border border-[#555] w-[25%] outline-none text-[#333] hover:bg-[#f5f5f5]"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="flex gap-3">
          <Button
            onClick={handleSort}
            variant="outlined"
            sx={{
              color: 'black',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              borderColor: '#888',
              '&:hover': {
                borderColor: '#888',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Sort {sortOrder === 'asc' ? <FaArrowUpShortWide className='ml-1' size={18} /> : <FaArrowUpWideShort className='ml-1' size={18} />}
          </Button>
        </div>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '10px',
          width: '90%',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f0f1f1' }}>
            <TableRow>
              <TableCell>Serial No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQueries.length > 0 ? (
              filteredQueries.map((query, index) => (
                <TableRow key={query.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{query.name}</TableCell>
                  <TableCell>{query.companyName}</TableCell>
                  <TableCell>{query.phoneNumber}</TableCell>
                  <TableCell>{query.email}</TableCell>
                  <TableCell>
                    <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '150px' }}>
                      {query.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(query.createdAt).toLocaleDateString()} (
                    {new Date(query.createdAt).toLocaleTimeString()})
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Queries Found
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
