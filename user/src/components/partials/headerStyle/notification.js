import React, { useState } from "react";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => setShowNotifications(!showNotifications);

  return (
    <div className="relative">
      <button onClick={toggleNotifications} className="text-gray-600">
        <FaBell className="text-2xl" />
      </button>
      {showNotifications && (
        <div className="absolute right-0 w-60 mt-2 bg-white shadow-lg rounded-md p-4">
          <h5 className="font-semibold text-gray-800">Notifications</h5>
          <ul className="space-y-2">
            <li className="text-sm text-gray-600">New comment on your post</li>
            <li className="text-sm text-gray-600">Your friend just posted a photo</li>
            <li className="text-sm text-gray-600">Someone liked your comment</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
