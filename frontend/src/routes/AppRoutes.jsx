import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../modules/landing';
import ComingSoon from '../components/common/ComingSoon';
import HomeHub from './HomeHub';

// Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Pages
import LoginPage from '../modules/authentication/pages/LoginPage';
import RegisterPage from '../modules/authentication/pages/RegisterPage';
import OtpVerificationPage from '../modules/authentication/pages/OtpVerificationPage';
import ForgotPasswordPage from '../modules/authentication/pages/ForgotPasswordPage';
import ResetPasswordPage from '../modules/authentication/pages/ResetPasswordPage';
import SuccessPage from '../modules/authentication/pages/SuccessPage';
import AiWorkspacePage from '../modules/ai-workspace/pages/AiWorkspacePage';
import ProfilePage from '../modules/profile/pages/ProfilePage';
import ResearchIdentityPage from '../modules/profile/pages/ResearchIdentityPage';
import ProfileRedirect from '../modules/profile/components/ProfileRedirect';
import MessagesRoute from './MessagesRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Dynamic Landing / Feed Hub */}
      <Route path="/" element={<HomeHub />} />

      {/* Authentication Layout */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        <Route path="otp" element={
          <PublicRoute>
            <OtpVerificationPage />
          </PublicRoute>
        } />
        <Route path="forgot-password" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />
        <Route path="reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } />
        <Route path="success" element={
          <PublicRoute>
            <SuccessPage />
          </PublicRoute>
        } />
      </Route>

      {/* Dashboard & Modules Layout */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="ai-workspace" element={<AiWorkspacePage />} />
        <Route path="profile" element={<ProfileRedirect />} />
        <Route path="research-identity" element={<ResearchIdentityPage />} />
        <Route path="publication" element={<ComingSoon title="Publication Management Coming Soon" />} />
        <Route path="messages" element={<MessagesRoute />} />
        <Route path="search" element={<ComingSoon title="Research Discovery Search Coming Soon" />} />
        <Route path="settings" element={<ComingSoon title="System Settings Coming Soon" />} />
        <Route path="notifications" element={<ComingSoon title="Notifications Center Coming Soon" />} />
        <Route path="admin" element={<ComingSoon title="Administration Panel Coming Soon" />} />
        <Route path="analytics" element={<ComingSoon title="System Analytics Coming Soon" />} />
      </Route>

      {/* Public Profile Route */}
      <Route element={<DashboardLayout />}>
        <Route path="/profile/:profileSlug" element={<ProfilePage />} />
      </Route>

      {/* 404 & Wildcard Fallback */}
      <Route path="/404" element={<ComingSoon title="Page Not Found (404)" />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
