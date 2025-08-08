"use client";

import React, { useState } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
} from "react-pro-sidebar";
 
import {
  FaBars,
  FaTimes,
  FaCheck,
  FaHome,
  FaUserGraduate,
  FaUsers,
  FaQuestionCircle,
  FaChartBar,
  FaClipboardList,
} from "react-icons/fa";

import "./sidebar.css";

const AppSidebar = ({ active, setActive }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: "Dashboard", label: "Dashboard", icon: <FaHome /> },
    { key: "Students", label: "Students", icon: <FaUserGraduate /> },
    { key: "Groups", label: "Groups", icon: <FaUsers /> },
    { key: "Quizzes", label: "Quizzes", icon: <FaClipboardList /> },
    { key: "Results", label: "Results", icon: <FaChartBar /> },
    { key: "Help", label: "Help", icon: <FaQuestionCircle /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div className="top-bar">
        <FaBars size={24} onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer" }} />
        <div className="top-icons">
          <FaTimes size={24} />
          <FaCheck size={24} />
        </div>
      </div>

      <Sidebar collapsed={collapsed} backgroundColor="#fff" rootStyles={{ height: "100%" }}>
        <Menu iconShape="square">
          {menuItems.map(({ key, label, icon }) => (
            <MenuItem
              key={key}
              icon={<div className={`icon-wrapper ${active === key ? "icon-active" : ""}`}>{icon}</div>}
              className={`custom-menu-item ${active === key ? "active-item" : ""}`}
              onClick={() => setActive(key)}
            >
              {!collapsed && label}
            </MenuItem>
          ))}
        </Menu>
      </Sidebar>
    </div>
  );
};


export default AppSidebar;