import React, { useState } from "react";

const UserMenu = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="flex items-center text-gray-600">
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <span className="hidden sm:block ml-2">John Doe</span>
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-md p-4">
          <h5 className="font-semibold text-gray-800">Hello John Doe</h5>
          <ul className="space-y-2">
            <li>
              <a href="/profile" className="text-sm text-gray-600 hover:text-gray-800">My Profile</a>
            </li>
            <li>
              <a href="/settings" className="text-sm text-gray-600 hover:text-gray-800">Settings</a>
            </li>
            <li>
              <a href="/logout" className="text-sm text-gray-600 hover:text-gray-800">Sign Out</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
