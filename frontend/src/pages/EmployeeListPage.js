// src/pages/EmployeeListPage.js
import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchEmployees = async () => {
  const res = await axiosClient.get("/employees");
  return res.data;
};

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const [search, setSearch] = useState({ department: "", position: "" });
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = {};
      if (search.department) params.department = search.department;
      if (search.position) params.position = search.position;

      const res = await axiosClient.get("/employees/search", { params });
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
      alert("Error searching employees. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await axiosClient.delete(`/employees/${id}`);
      // refresh main list
      queryClient.invalidateQueries(["employees"]);
      // also update filtered results if currently searching
      if (searchResults) {
        setSearchResults((prev) => prev.filter((e) => e._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting employee. Please try again.");
    }
  };

  const listToShow = searchResults || employees || [];

  if (isLoading) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>
    );
  }

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Employees List</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/employees/new")}
        >
          Add Employee
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" mb={1}>
          Search by Department / Position
        </Typography>
        <form onSubmit={handleSearch}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Department"
              value={search.department}
              onChange={(e) =>
                setSearch((prev) => ({ ...prev, department: e.target.value }))
              }
            />
            <TextField
              label="Position"
              value={search.position}
              onChange={(e) =>
                setSearch((prev) => ({ ...prev, position: e.target.value }))
              }
            />
            <Button type="submit" variant="outlined">
              Search
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setSearch({ department: "", position: "" });
                setSearchResults(null);
              }}
            >
              Clear
            </Button>
          </Box>
        </form>
      </Paper>

      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Profile</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listToShow.map((emp) => (
            <TableRow key={emp._id}>
              <TableCell>
                {emp.profileImageUrl && (
                  <img
                    src={`http://localhost:5000${emp.profileImageUrl}`}
                    alt={emp.name}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                  />
                )}
              </TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell>{emp.position}</TableCell>
              <TableCell>{emp.salary}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  component={Link}
                  to={`/employees/${emp._id}`}
                  sx={{ mr: 1 }}
                >
                  View
                </Button>
                <Button
                  size="small"
                  component={Link}
                  to={`/employees/${emp._id}/edit`}
                  sx={{ mr: 1 }}
                >
                  Update
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(emp._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {listToShow.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>No employees found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default EmployeeListPage;
