
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full bg-white border-b border-gray-200 z-10 top-0 left-0 right-0">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/placeholder.svg" 
                alt="DVAN.AI Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-purple-700">DVAN.AI</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="ml-10 hidden md:flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link to="/portfolio" className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                Portfolio
              </Link>
              <a 
                href="https://datshdattashodhini.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4 mr-1" />
                DATSH.AI
              </a>
            </nav>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out",
        isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg border-t">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/portfolio" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Portfolio
          </Link>
          <a 
            href="https://datshdattashodhini.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 mr-1" />
            DATSH.AI
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
