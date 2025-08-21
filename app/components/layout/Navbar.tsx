'use client';
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaChevronDown } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { logout } from "@/store/features/auth/authSlice";

interface NavbarProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  active: string;
}

export default function Navbar({ setIsSidebarOpen, active }: NavbarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Guest";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setIsProfileMenuOpen(false);
    window.location.href = '/auth';
  }, [dispatch]);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Burger button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden rounded-sm bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Brand */}
          <h1 className="text-xl font-bold">{active}</h1>

          {/* Profile Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer"
            >
              <span className="font-medium text-gray-700">{fullName}</span>
              <FaChevronDown className="text-gray-500 text-sm" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute end-0 z-10 mt-0.5 w-56 rounded-md border border-gray-100 bg-white shadow-lg">
                <div className="p-2">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <IoMdLogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}