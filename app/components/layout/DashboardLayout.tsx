"use client";

import React, { useState } from "react";
import AppSidebar from "./Sidebar";
import AppNavbar from "./Navbar";
import GroupsList from "../group/GroupsList";
import Students from "@/app/students/page";

const DashboardLayout = () => {
  const [active, setActive] = useState("Groups");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <AppSidebar active={active} setActive={setActive} />

      {/* Main content */}
      <div className="flex-1">
        <AppNavbar active={active} />
        {/* هنا تقدر تحط أي children أو محتوى صفحات تانية */}
        {active === "Groups" && <GroupsList />}
        {active === "Students" && <Students />}

      </div>
    </div>
  );
};

export default DashboardLayout;
