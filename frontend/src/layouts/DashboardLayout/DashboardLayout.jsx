import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthenticatedNavbar from '../Navbar/AuthenticatedNavbar';
import Sidebar from '../Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-bg-page text-text-primary">
      <AuthenticatedNavbar />
      <div className="flex flex-grow relative">
        <Sidebar />
        <main className="flex-grow p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
