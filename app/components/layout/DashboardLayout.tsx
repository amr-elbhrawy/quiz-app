"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
// import Dashboard from "../pages/Dashboard";
import Students from "@/app/instructor/students/page";
import Groups from "@/app/instructor/group/GroupsList";
import Quizzes from "@/app/instructor/Quizzes/page";
// import Results from "../pages/Results";
// import Help from "../pages/Help";

export default function DashboardLayout() {
  const [active, setActive] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (active) {
      // case "Dashboard": return <Dashboard />;
      case "Students": return <Students />;
      case "Groups": return <Groups />;
      case "Quizzes": return <Quizzes setActive={setActive} />;
      // case "Results": return <Results />;
      // case "Help": return <Help />;
      // default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full max-w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        active={active}
        setActive={setActive}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 bg-gray-50 min-h-0 w-full">
          <div className="w-full max-w-full overflow-hidden">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}