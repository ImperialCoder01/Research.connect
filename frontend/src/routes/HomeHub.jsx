import React from 'react';
import { useSelector } from 'react-redux';
import LandingPage from '../modules/landing';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer/Footer';
import AuthenticatedNavbar from '../layouts/Navbar/AuthenticatedNavbar';
import HomeFeed from '../modules/home/pages/HomeFeed';
import MessagesView from '../modules/message/components/MessagesView';

const HomeHub = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-page text-text-primary transition-colors duration-300">
        <AuthenticatedNavbar />
        <div className="flex flex-grow relative">
          <main className="flex-grow overflow-x-hidden">
            <HomeFeed />
          </main>
          <MessagesView />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-page text-text-primary transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
};

export default HomeHub;
