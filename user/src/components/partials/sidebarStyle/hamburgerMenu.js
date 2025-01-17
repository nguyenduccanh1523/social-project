import React from "react";

const HamburgerMenu = ({ toggleSidebar }) => {
  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden text-2xl p-4 text-gray-800"
    >
      <span className="material-icons">menu</span>
    </button>
  );
};

export default HamburgerMenu;
