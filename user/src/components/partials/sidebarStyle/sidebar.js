import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <ul className="mt-6">
          <li className="mb-4">
            <Link to="/" className="hover:text-gray-400">
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/profile" className="hover:text-gray-400">
              Profile
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/settings" className="hover:text-gray-400">
              Settings
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/messages" className="hover:text-gray-400">
              Messages
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
