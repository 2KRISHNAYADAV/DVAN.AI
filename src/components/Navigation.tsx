import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/store';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  // Use reactive hook — NOT getState() — so the button updates on login/logout
  const isLoggedIn = useDashboardStore((s) => s.isLoggedIn);
  const setLoginModalOpen = useDashboardStore((s) => s.setLoginModalOpen);
  const setLoggedIn = useDashboardStore((s) => s.setLoggedIn);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinkClass = "text-[#E2E2E0]/65 hover:text-[#E2E2E0] hover:bg-[rgba(43,117,116,0.1)] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200";

  return (
    <header
      className={cn(
        "fixed w-full z-50 top-0 left-0 right-0 transition-all duration-300",
        scrolled
          ? "bg-[rgba(14,41,49,0.97)] backdrop-blur-xl border-b border-[rgba(43,117,116,0.15)] shadow-[0_4px_32px_-8px_rgba(0,0,0,0.4)]"
          : "bg-[rgba(14,41,49,0.85)] backdrop-blur-md border-b border-[rgba(43,117,116,0.08)]"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 flex items-center justify-center transition-all duration-300">
                <img src="/lovable-uploads/logo.png" alt="DVAN.AI Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-[#E2E2E0] tracking-tight group-hover:text-white transition-colors">
                  DVAN.AI
                </span>
                <span className="text-[9px] text-[#E2E2E0]/40 uppercase tracking-widest font-medium hidden sm:block">
                  Data Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-10 hidden md:flex items-center gap-1">
              <Link to="/" className={navLinkClass}>Home</Link>
              <Link to="/about" className={navLinkClass}>About</Link>
              {isLoggedIn && (
                <Link to="/business-analyst" className={cn(navLinkClass, "flex items-center gap-1.5")}>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Business Analyst
                </Link>
              )}
              <a
                href="https://datshdattashodhini.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(navLinkClass, "flex items-center gap-1.5")}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                DATSH.AI
              </a>
            </nav>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLoggedIn(false);
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setLoginModalOpen(true)}
                className="shadow-[0_0_20px_-6px_rgba(43,117,116,0.5)] hover:shadow-[0_0_28px_-6px_rgba(43,117,116,0.7)]"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#E2E2E0]/65 hover:text-[#E2E2E0] hover:bg-[rgba(43,117,116,0.12)] focus:outline-none transition-all duration-200"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pt-2 pb-4 space-y-1 bg-[rgba(14,41,49,0.98)] border-t border-[rgba(43,117,116,0.15)]">
          <Link
            to="/"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#E2E2E0]/70 hover:text-[#E2E2E0] hover:bg-[rgba(43,117,116,0.1)] transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#E2E2E0]/70 hover:text-[#E2E2E0] hover:bg-[rgba(43,117,116,0.1)] transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          {isLoggedIn && (
            <Link
              to="/business-analyst"
              className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-[#E2E2E0]/70 hover:text-[#E2E2E0] hover:bg-[rgba(43,117,116,0.1)] transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Business Analyst
            </Link>
          )}
          <a
            href="https://datshdattashodhini.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-[#E2E2E0]/70 hover:text-[#E2E2E0] hover:bg-[rgba(43,117,116,0.1)] transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            DATSH.AI
          </a>
          {isLoggedIn ? (
            <button
              onClick={() => {
                setLoggedIn(false);
                setIsMenuOpen(false);
                window.location.reload();
              }}
              className="block w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-[#E2E2E0]/75 hover:text-[#E2E2E0] border border-[rgba(43,117,116,0.25)] text-center mt-2 transition-all"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setLoginModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="block w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-[#E2E2E0] bg-[#2B7574] hover:bg-[#337e7d] text-center mt-2 transition-all shadow-[0_0_20px_-6px_rgba(43,117,116,0.4)]"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;