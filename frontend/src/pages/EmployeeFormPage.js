// src/pages/EmployeeFormPage.js
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v).trim());

const EmployeeFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [fieldErr, setFieldErr] = useState({});

  useEffect(() => {
    const loadEmployee = async () => {
      if (!isEdit) return;
      try {
        const res = await axiosClient.get(`/employees/${id}`);
        const emp = res.data;
        setForm({
          name: emp.name || "",
          email: emp.email || "",
          department: emp.department || "",
          position: emp.position || "",
          salary: emp.salary ?? "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load employee details");
      }
    };
    loadEmployee();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErr((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErr({});

    // client-side validation
    const errs = {};
    if (!form.name) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!emailOk(form.email)) errs.email = "Enter a valid email";
    if (!form.department) errs.department = "Department is required";
    if (!form.position) errs.position = "Position is required";
    if (form.salary === "" || form.salary === null)
      errs.salary = "Salary is required";
    else if (!(Number(form.salary) > 0))
      errs.salary = "Salary must be a positive number";

    if (Object.keys(errs).length) {
      setFieldErr(errs);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("email", form.email.trim());
    formData.append("department", form.department.trim());
    formData.append("position", form.position.trim());
    formData.append("salary", String(form.salary).trim());
    if (file) formData.append("profileImage", file);

    try {
      if (isEdit) {
        await axiosClient.put(`/employees/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosClient.post(`/employees`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/employees");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" mb={2}>
          {isEdit ? "Edit Employee" : "Add Employee"}
        </Typography>
        {error && (
          <Typography color="error" mb={1}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
            error={Boolean(fieldErr.name)}
            helperText={fieldErr.name}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            error={Boolean(fieldErr.email)}
            helperText={fieldErr.email}
          />
          <TextField
            label="Department"
            name="department"
            fullWidth
            margin="normal"
            value={form.department}
            onChange={handleChange}
            error={Boolean(fieldErr.department)}
            helperText={fieldErr.department}
          />
          <TextField
            label="Position"
            name="position"
            fullWidth
            margin="normal"
            value={form.position}
            onChange={handleChange}
            error={Boolean(fieldErr.position)}
            helperText={fieldErr.position}
          />
          <TextField
            label="Salary"
            name="salary"
            type="number"
            fullWidth
            margin="normal"
            value={form.salary}
            onChange={handleChange}
            error={Boolean(fieldErr.salary)}
            helperText={fieldErr.salary}
          />

          <Box mt={2}>
            <Typography variant="body2" mb={1}>
              Profile Picture
            </Typography>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => navigate("/employees")}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {isEdit ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EmployeeFormPage;
