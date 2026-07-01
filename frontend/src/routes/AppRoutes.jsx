import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../modules/landing';
import ComingSoon from '../components/common/ComingSoon';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing / Public Website Layout */}
      <Route path="/" element={<LandingLayout />}>
        <Route index element={<LandingPage />} />
      </Route>

      {/* Authentication Layout */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<ComingSoon title="Authentication Login Coming Soon" />} />
        <Route path="register" element={<ComingSoon title="Authentication Register Coming Soon" />} />
      </Route>

      {/* Dashboard & Modules Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="dashboard" element={<ComingSoon title="Research Dashboard Coming Soon" />} />
        <Route path="profile" element={<ComingSoon title="Researcher Profile Coming Soon" />} />
        <Route path="publication" element={<ComingSoon title="Publication Management Coming Soon" />} />
        <Route path="search" element={<ComingSoon title="Research Discovery Search Coming Soon" />} />
        <Route path="settings" element={<ComingSoon title="System Settings Coming Soon" />} />
        <Route path="notifications" element={<ComingSoon title="Notifications Center Coming Soon" />} />
        <Route path="admin" element={<ComingSoon title="Administration Panel Coming Soon" />} />
        <Route path="analytics" element={<ComingSoon title="System Analytics Coming Soon" />} />
      </Route>

      {/* 404 & Wildcard Fallback */}
      <Route path="/404" element={<ComingSoon title="Page Not Found (404)" />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
