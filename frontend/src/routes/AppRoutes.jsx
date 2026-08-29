import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import Home from '../pages/Home';
import CarListing from '../pages/CarListing';
import CarDetails from '../pages/CarDetails';
import Compare from '../pages/Compare';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import BookTestDrive from '../pages/BookTestDrive';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import About from '../pages/About';
import Configurator from '../pages/Configurator';
import Dealers from '../pages/Dealers';
import NotFound from '../pages/NotFound';

import AdminDashboard from '../pages/admin/Dashboard';
import ManageCars from '../pages/admin/ManageCars';
import ManageOrders from '../pages/admin/ManageOrders';
import ManageUsers from '../pages/admin/ManageUsers';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/cars" element={<CarListing />} />
        <Route path="/cars/:slug" element={<CarDetails />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/about" element={<About />} />
        <Route path="/configurator" element={<Configurator />} />
        <Route path="/configurator/:slug" element={<Configurator />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/book-test-drive" element={<BookTestDrive />} />
        <Route path="/book-test-drive/:slug" element={<BookTestDrive />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/:slug" element={<Checkout />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="cars" element={<ManageCars />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/profile" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
