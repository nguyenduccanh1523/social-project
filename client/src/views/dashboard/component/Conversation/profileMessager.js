import React from "react";
import { Link } from "react-router-dom";
const ProfileMessager = ({ user }) => {
  return (
    <>
      <div className="user text-center mb-4">
        <Link className="avatar m-0" to="">
          <img
            loading="lazy"
            src={user?.profile_picture}
            alt="avatar"
            className="avatar-130 "
          />
        </Link>
        <div className="user-name mt-4">
          <h4 className="text-center">{user?.username}</h4>
        </div>
        <div className="user-desc">
          <p className="text-center">Online</p>
        </div>
      </div>
      <hr />
      <div className="user-detail text-left mt-4 ps-4 pe-4">
        <h5 className="mt-4 mb-4">About</h5>
        <p>
          {user?.bio}
        </p>
        <h5 className="mt-3 mb-3">Infomation</h5>
        <ul className="user-status p-0">
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-success pe-1"></i>
            <span>Phone: {user?.phone}</span>
          </li>
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-warning pe-1"></i>
            <span>Email: {user?.email}</span>
          </li>
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-danger pe-1"></i>
            <span>Birthday: {user?.date_of_birthday}</span>
          </li>
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-light pe-1"></i>
            <span>Live: {user?.live_in}</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProfileMessager;
