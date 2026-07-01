import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../modules/landing';
import ComingSoon from '../components/common/ComingSoon';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Website Wrapper */}
      <Route path="/" element={<MainLayout />}>
        {/* Landing Page */}
        <Route index element={<LandingPage />} />
        
        {/* Placeholder Routes */}
        <Route path="login" element={<ComingSoon title="Authentication Login Coming Soon" />} />
        <Route path="register" element={<ComingSoon title="Authentication Register Coming Soon" />} />
        <Route path="dashboard" element={<ComingSoon title="Research Dashboard Coming Soon" />} />
        <Route path="profile" element={<ComingSoon title="Researcher Profile Coming Soon" />} />
        
        {/* 404 Route */}
        <Route path="404" element={<ComingSoon title="Page Not Found (404)" />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
