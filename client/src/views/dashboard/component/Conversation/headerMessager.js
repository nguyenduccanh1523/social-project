import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import CustomToggle from "../../../../components/dropdowns";
const HeaderMessager = () => {
  return (
    <>
      <div className="chat-header-icons d-flex">
        <Link
          to="#"
          className="chat-icon-phone bg-soft-primary d-flex justify-content-center align-items-center"
        >
          <i className="material-symbols-outlined md-18">phone</i>
        </Link>
        <Link
          to="#"
          className="chat-icon-phone bg-soft-primary d-flex justify-content-center align-items-center"
        >
          <i className="material-symbols-outlined md-18">videocam</i>
        </Link>
        <Link
          to="#"
          className="chat-icon-phone bg-soft-primary d-flex justify-content-center align-items-center"
        >
          <i className="material-symbols-outlined md-18">delete</i>
        </Link>
        <Dropdown
          className="bg-soft-primary d-flex justify-content-center align-items-center"
          as="span"
        >
          <Dropdown.Toggle
            as={CustomToggle}
            variant="material-symbols-outlined cursor-pointer md-18 nav-hide-arrow pe-0 show"
          >
            more_vert
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-right">
            <Dropdown.Item className="d-flex align-items-center" href="#">
              <i className="material-symbols-outlined md-18 me-1">push_pin</i>
              Pin to top
            </Dropdown.Item>
            <Dropdown.Item className="d-flex align-items-center" href="#">
              <i className="material-symbols-outlined md-18 me-1">
                delete_outline
              </i>
              Delete chat
            </Dropdown.Item>
            <Dropdown.Item className="d-flex align-items-center" href="#">
              <i className="material-symbols-outlined md-18 me-1">
                watch_later
              </i>
              Block
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default HeaderMessager;
