import React, { useState } from "react";
import { FaUsers, FaChartBar, FaQuestionCircle, FaUserGraduate } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";

export default function Sidebar({ active, setActive, isSidebarOpen, setIsSidebarOpen }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <AiOutlineDashboard size={22} /> },
    { name: "Students", icon: <FaUserGraduate size={22} /> },
    { name: "Groups", icon: <FaUsers size={22} /> },
    { name: "Quizzes", icon: <MdOutlineQuiz size={22} /> },
    { name: "Results", icon: <FaChartBar size={22} /> },
    { name: "Help", icon: <FaQuestionCircle size={22} /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`bg-white border-r border-gray-200 flex flex-col justify-between h-screen transition-all duration-300
        absolute md:relative z-50
        ${isSidebarExpanded ? "w-56" : "w-20"}
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="text-xl">☰</button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-1 p-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 w-full text-left
                  ${active === item.name ? "border-r-4 border-[#0d1321] bg-white" : "hover:bg-gray-100"}`}
              >
                <div className="p-2 rounded-md bg-[#fde9df]">{item.icon}</div>
                {isSidebarExpanded && <span className="font-medium">{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 w-full p-3 rounded-md hover:bg-gray-100 transition">
            <div className="p-2 rounded-md bg-[#fde9df]">
              <IoMdLogOut size={22} />
            </div>
            {isSidebarExpanded && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
