import React from "react";
import { Link } from "react-router-dom";

const Reply = () => {
  return (
    <form className="comment-text d-flex align-items-center m-2">
      <input
        type="text"
        className="form-control rounded"
        placeholder="Enter Your Comment"
      />
      <div className="comment-attagement d-flex">
        <Link to="#">
          <i className="ri-link me-3"></i>
        </Link>
        <Link to="#">
          <i className="ri-user-smile-line me-3"></i>
        </Link>
        <Link to="#">
          <i className="ri-camera-line me-3"></i>
        </Link>
      </div>
    </form>
  );
};

export default Reply;
