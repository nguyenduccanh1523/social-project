import React from "react";
import { FaSearch } from "react-icons/fa";
const SearchBar = () => {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500"
        placeholder="Search..."
      />
      <span className="absolute left-3 top-4 text-gray-500">
      <FaSearch />
      </span>
    </div>
  );
};

export default SearchBar;
