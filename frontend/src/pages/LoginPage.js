import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v).trim());

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErr, setFieldErr] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErr((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!emailOk(form.email)) errs.email = "Enter a valid email";

    if (!form.password) errs.password = "Password is required";

    if (Object.keys(errs).length) {
      setFieldErr(errs);
      return;
    }

    try {
      const res = await axiosClient.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });
      login(res.data.token, res.data.user);
      navigate("/employees");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        {error && <Typography color="error" mb={1}>{error}</Typography>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            name="email"
            type="email"                // ✅ browser-level email check
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            error={Boolean(fieldErr.email)}
            helperText={fieldErr.email}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            error={Boolean(fieldErr.password)}
            helperText={fieldErr.password}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>

        <Typography mt={2}>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
