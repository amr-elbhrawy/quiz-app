'use client';
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa";

export default function Navbar({ setIsSidebarOpen, active }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
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
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">My profile</a>
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">My data</a>
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">Team settings</a>
                  <button className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50">
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
