import React from 'react';
import Hero from '../components/Hero';
import Companies from '../components/Companies';
import Stats from '../components/Stats';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Categories from '../components/Categories';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <Hero />

      {/* Corporate Partners Slider */}
      <Companies />

      {/* Metrics Counters */}
      <Stats />

      {/* Capabilities */}
      <Features />

      {/* Workflow */}
      <HowItWorks />

      {/* Disciplines */}
      <Categories />

      {/* User Quotes */}
      <Testimonials />

      {/* Accordion Support */}
      <FAQ />

      {/* Footer Banner */}
      <CTA />
    </div>
  );
};

export default LandingPage;
