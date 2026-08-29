import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import Compare from "./pages/Compare";
import About from "./pages/About";
import BookTestDrive from "./pages/BookTestDrive";
import Configurator from "./pages/Configurator";
import Dealers from "./pages/Dealers";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Login (public - separate from client login)
import AdminLogin from "./pages/admin/AdminLogin";

// Client Protected Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Admin Protected Pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageCars from "./pages/admin/Managecars";
import ManageOrders from "./pages/admin/Manageorders";
import ManageUsers from "./pages/admin/Manageusers";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:slug" element={<CarDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={<About />} />
          <Route path="/book-test-drive" element={<BookTestDrive />} />
          <Route path="/book-test-drive/:slug" element={<BookTestDrive />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/configurator/:slug" element={<Configurator />} />
          <Route path="/dealers" element={<Dealers />} />

          {/* Client Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Auth Route — separate portal, public-accessible to enter credentials */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Client Authenticated Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes (redirect to /admin/login if not admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cars"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageCars />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Fallback Route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;