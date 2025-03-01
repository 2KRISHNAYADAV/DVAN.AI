
import React from 'react';
import { Link } from 'react-router-dom';
import UserNavigation from './UserNavigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';

const Navigation = () => {
  const { session } = useAuth();

  return (
    <header className="fixed w-full bg-white border-b border-gray-200 z-10 top-0 left-0 right-0">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-purple-700">
              DVAN.AI
            </Link>
            <nav className="ml-10 hidden md:flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              {session && (
                <>
                  <Link to="/about" className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                    About
                  </Link>
                  <Link to="/portfolio" className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                    Portfolio
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <UserNavigation />
            ) : (
              <Link to="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
