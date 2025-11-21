
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeFormPage from "./pages/EmployeeFormPage";
import EmployeeDetailsPage from "./pages/EmployeeDetailsPage";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <EmployeeListPage />
              </PrivateRoute>
            }
          />

          {/* View employee details */}
          <Route
            path="/employees/:id"
            element={
              <PrivateRoute>
                <EmployeeDetailsPage />
              </PrivateRoute>
            }
          />

          {/* Add new employee */}
          <Route
            path="/employees/new"
            element={
              <PrivateRoute>
                <EmployeeFormPage />
              </PrivateRoute>
            }
          />

          {/* Update existing employee */}
          <Route
            path="/employees/:id/edit"
            element={
              <PrivateRoute>
                <EmployeeFormPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
