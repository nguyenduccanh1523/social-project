import React from "react";
import { Link } from "react-router-dom";
import user1 from "../../../../assets/images/user/1.jpg";
const ProfileMessager = () => {
  return (
    <>
      <div className="user text-center mb-4">
        <Link className="avatar m-0" to="">
          <img loading="lazy" src={user1} alt="avatar" />
        </Link>
        <div className="user-name mt-4">
          <h4 className="text-center">Bni Jordan</h4>
        </div>
        <div className="user-desc">
          <p className="text-center">Web Designer</p>
        </div>
      </div>
      <hr />
      <div className="user-detail text-left mt-4 ps-4 pe-4">
        <h5 className="mt-4 mb-4">About</h5>
        <p>
          It is long established fact that a reader will be distracted by the
          readable.
        </p>
        <h5 className="mt-3 mb-3">Status</h5>
        <ul className="user-status p-0">
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-success pe-1"></i>
            <span>Online</span>
          </li>
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-warning pe-1"></i>
            <span>Away</span>
          </li>
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-danger pe-1"></i>
            <span>Do Not Disturb</span>
          </li>
          <li className="mb-1">
            <i className="ri-checkbox-blank-circle-fill text-light pe-1"></i>
            <span>Offline</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProfileMessager;
