import React from 'react';

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">CalcViz</div>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#demo" className="hover:text-indigo-600">Demo</a>
          <a href="#testimonials" className="hover:text-indigo-600">Testimonials</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;