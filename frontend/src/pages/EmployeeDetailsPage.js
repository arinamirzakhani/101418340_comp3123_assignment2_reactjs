// src/pages/EmployeeDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Box, Paper, Typography, Button } from "@mui/material";

const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const res = await axiosClient.get(`/employees/${id}`);
        setEmp(res.data);
      } catch (err) {
        console.error("Load employee error:", err);
        setError("Failed to load employee details");
      }
    };
    loadEmployee();
  }, [id]);

  if (error) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }} color="error">
        {error}
      </Typography>
    );
  }

  if (!emp) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>
    );
  }

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>
          View Employee Details
        </Typography>

        {emp.profileImageUrl && (
          <Box mb={2} display="flex" justifyContent="center">
            <img
              src={`http://localhost:5000${emp.profileImageUrl}`}
              alt={emp.name}
              style={{ width: 80, height: 80, borderRadius: "50%" }}
            />
          </Box>
        )}

        <Typography>
          <strong>Name:</strong> {emp.name}
        </Typography>
        <Typography>
          <strong>Email:</strong> {emp.email}
        </Typography>
        <Typography>
          <strong>Department:</strong> {emp.department}
        </Typography>
        <Typography>
          <strong>Position:</strong> {emp.position}
        </Typography>
        <Typography>
          <strong>Salary:</strong> {emp.salary}
        </Typography>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => navigate("/employees")}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/employees/${emp._id}/edit`)}
          >
            Update
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeeDetailsPage;
