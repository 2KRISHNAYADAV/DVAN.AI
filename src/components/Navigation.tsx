import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info, FolderKanban, Terminal, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <img 
              src="/lovable-uploads/02d0e3fb-c750-4fbf-84e2-f0da643878f5.png" 
              alt="DVAN.AI Logo" 
              className="w-6 h-6"
            />
            <span className="font-bold text-xl">DVAN.AI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                    onClick={() => window.open('https://datshdattashodhini.vercel.app/', '_blank')}
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    DATSH.AI
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dattashodhini AI – Empowering Precision Through Intelligent Data Cleaning</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Link to="/about">
              <Button
                variant="ghost"
                className="hover:bg-gray-100 transition-colors"
              >
                <Info className="w-4 h-4 mr-2" />
                About
              </Button>
            </Link>

            <Link to="/portfolio">
              <Button
                variant="ghost"
                className="hover:bg-gray-100 transition-colors"
              >
                <FolderKanban className="w-4 h-4 mr-2" />
                Portfolio
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => window.open('https://datshdattashodhini.vercel.app/', '_blank')}>
                  <Terminal className="w-4 h-4 mr-2" />
                  <span>DATSH.AI</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    <span>About</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/portfolio" className="flex items-center">
                    <FolderKanban className="w-4 h-4 mr-2" />
                    <span>Portfolio</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;