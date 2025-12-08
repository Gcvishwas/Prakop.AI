import { SignedIn, UserButton } from "@clerk/clerk-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  return (
    <div>
      <header className="flex items-center justify-between relative animate-slidedown">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center font-bold gap-2 text-lg"
          onClick={() => setMenu(false)}
        >
          <img src="/vite.svg" alt="" className="h-6 w-6" />
          <span className="font-bold bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent">
            प्रकोप.AI
          </span>
        </Link>
        {/* Centered Navbar */}
        {!isDashboardRoute && (
          <nav className="font-semibold text-gray-400 transform -translate-x-1/2 gap-10 items-center hidden md:flex absolute left-1/2">
            <Link to="/" className="hover:text-white transition">
              गृहपृष्ठ
            </Link>
            <Link to="/explore" className="hover:text-white transition">
              अन्वेषण
            </Link>
            <Link
              to="/emergency"
              className="text-red-400 hover:text-white transition"
            >
              आकस्मिक सम्पर्क
            </Link>
            <Link to="/dashboard" className="hover:text-white transition">
              च्याटबोट
            </Link>
          </nav>
        )}
        <div className="flex items-center gap-4">
          {/* Mobile Dropdown */}
          <MobileMenu />
        </div>
      </header>
    </div>
  );
};

export default Header;
