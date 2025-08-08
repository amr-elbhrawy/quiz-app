"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "@heroui/react";
import { FaRegBell } from "react-icons/fa";
import { AiOutlineMail, AiOutlineArrowDown } from "react-icons/ai";
import { BsAlarm } from "react-icons/bs";

export default function AppNavbar({ active }: { active: string }) {
  return (
    <Navbar>
      {/* Title */}
      <NavbarBrand className="justify-start">
        <p className="font-bold text-inherit">{active}</p>
      </NavbarBrand>

      {/* Centered Content with vertical dividers */}
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {/* New Quiz Button */}
        <NavbarItem>
          <Button
            variant="bordered"
            className="gap-2 font-semibold text-black rounded-full px-4"
          >
            <span className="bg-black text-white p-1 rounded-full">
              <BsAlarm size={18} />
            </span>
            New quiz
          </Button>
        </NavbarItem>

        {/* Vertical Divider */}
        <div className="h-6 border-l border-gray-200 mx-2" />

        {/* Mail Icon */}
        <NavbarItem >
          <Badge
            content="10"
            shape="circle"
            style={{ backgroundColor: "#FFEDDF", color: "#000" }}
          >
            <AiOutlineMail size={24} />
          </Badge>
        </NavbarItem>

        {/* Vertical Divider */}
        <div className="h-6 border-l border-gray-200 mx-2" />

        {/* Bell Icon */}
        <NavbarItem>
          <Badge
            content="10"
            shape="circle"
            style={{ backgroundColor: "#FFEDDF", color: "#000" }}
          >
            <FaRegBell size={24} />
          </Badge>
        </NavbarItem>
      </NavbarContent>

      {/* Right Side - User Info with vertical divider */}
      <NavbarContent as="div" >
        <div className="h-6 border-l border-gray-200 mx-4 hidden sm:block" />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex flex-col items-start cursor-pointer">
              <div className="flex items-center gap-2">
                <h1 className="font-medium text-sm">Nwabuikwu Chizuruoke</h1>
                <AiOutlineArrowDown size={14} color="#D9D9D9" />
              </div>
              <span className="text-green-500 text-xs font-semibold">Tutor</span>
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
