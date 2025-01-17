import React, { useState } from "react";
import SearchBar from "./headerStyle/searchBar";
import Notifications from "./headerStyle/notification";
import UserMenu from "./headerStyle/userMenu";
import HamburgerMenu from "./sidebarStyle/hamburgerMenu";
import Sidebar from "./sidebarStyle/sidebar";


const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="bg-white p-2 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M12 2L2 12H5V22H9V16H15V22H19V12H22L12 2Z"
            />
          </svg>
          <span className="text-xl font-bold">SocialV</span>
        </div>

        {/* Hamburger Menu */}
        <HamburgerMenu toggleSidebar={toggleSidebar} />

        {/* Search Bar */}
        <SearchBar />

        {/* User Icons and Dropdowns */}
        <div className="flex items-center gap-6">
          <Notifications />
          <UserMenu />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </header>
  );
};

export default Header;

