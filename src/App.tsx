import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import FeaturesSection from './components/sections/FeaturesSection';
import DemoSection from './components/sections/DemoSection';
import TestimonialSection from './components/sections/TestimonialSection';

function App() {
  const [showDemo, setShowDemo] = useState(false);
  
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-emerald-50">
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection setShowDemo={setShowDemo} />
              <main className="container mx-auto py-20 px-4">
                <FeaturesSection />
                <DemoSection showDemo={showDemo} />
                <TestimonialSection />
              </main>
            </>
          } />
          <Route path="/features" element={<FeaturesSection />} />
          <Route path="/demo" element={<DemoSection showDemo={true} />} />
          <Route path="/testimonials" element={<TestimonialSection />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
