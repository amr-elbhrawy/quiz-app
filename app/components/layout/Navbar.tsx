'use client';
import React, { useState } from "react";

export default function Navbar({ setIsSidebarOpen, active }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Burger button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden rounded-sm bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Brand */}
          <h1 className="text-xl font-bold">{active}</h1>

          {/* Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
            >
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop"
                alt="Profile"
                className="size-10 object-cover"
              />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute end-0 z-10 mt-0.5 w-56 rounded-md border border-gray-100 bg-white shadow-lg">
                <div className="p-2">
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">My profile</a>
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">My data</a>
                  <a href="#" className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">Team settings</a>
                  <button className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
