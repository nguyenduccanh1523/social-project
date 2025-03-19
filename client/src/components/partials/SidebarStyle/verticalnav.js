import React, { useState, useContext } from "react";

//router
import { Link, useLocation } from "react-router-dom";

//react-bootstrap
import {
  Accordion,
  useAccordionButton,
  AccordionContext,
  Nav,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

function CustomToggle({ children, eventKey, onClick }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(eventKey, (active) =>
    onClick({ state: !active, eventKey: eventKey })
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <div
      to="#"
      aria-expanded={isCurrentEventKey ? "true" : "false"}
      className="nav-link"
      role="button"
      onClick={(e) => {
        decoratedOnClick(isCurrentEventKey);
      }}
    >
      {children}
    </div>
  );
}

const VerticalNav = React.memo(() => {
  const [activeMenu, setActiveMenu] = useState(false);
  const [active, setActive] = useState("");
  //location
  let location = useLocation();
  // console.log(document);

  return (
    <React.Fragment>
      <Accordion as="ul" className="navbar-nav iq-main-menu" id="sidebar-menu">
        <li className="nav-item static-item">
          <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
            <span className="default-icon">Social</span>
            <span
              className="mini-icon"
              data-bs-toggle="tooltip"
              title="Social"
              data-bs-placement="right"
            >
              -
            </span>
          </Link>
        </li>
        <li
          className={`${location.pathname === "/" ? "active" : ""} nav-item `}
        >
          <Link
            className={`${location.pathname === "/" ? "active" : ""} nav-link `}
            aria-current="page"
            to="/"
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Newsfeed</Tooltip>}
            >
              <i className="icon material-symbols-outlined">newspaper</i>
            </OverlayTrigger>
            <span className="item-name">Newsfeed</span>
          </Link>
        </li>
        <Accordion.Item
          as="li"
          eventKey="profile-menu"
          bsPrefix={`nav-item ${active === "profile" ? "active" : ""} `}
          onClick={() => setActive("profile")}
        >
          <CustomToggle
            eventKey="profile-menu"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Profiles</Tooltip>}
            >
              <i className="icon material-symbols-outlined">person</i>
            </OverlayTrigger>
            <span className="item-name">Profiles</span>
            <i className="right-icon material-symbols-outlined">chevron_right</i>
          </CustomToggle>
          <Accordion.Collapse eventKey="profile-menu" >
            <ul className="sub-nav">
              <Nav.Item as="li">
                <Link className={`${location.pathname === '/user-profile' ? 'active' : ''} nav-link`} to="/user-profile">
                  <i className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                      <g>
                        <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger placement="right" overlay={<Tooltip>Profile</Tooltip>}>
                    <i className="sidenav-mini-icon"> P </i>
                  </OverlayTrigger>
                  <span className="item-name"> Profile </span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link className={`${location.pathname === '/mark-post' ? 'active' : ''} nav-link`} to="/mark-post">
                  <i className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" viewBox="0 0 24 24" fill="currentColor">
                      <g>
                        <circle cx="12" cy="12" r="8" fill="currentColor"></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger placement="right" overlay={<Tooltip>Mark Post</Tooltip>}>
                    <i className="sidenav-mini-icon"> MP </i>
                  </OverlayTrigger>
                  <span className="item-name"> Mark Post</span>
                </Link>
              </Nav.Item>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Accordion.Item as="li" eventKey="friends-menu" bsPrefix="nav-item">
          <CustomToggle
            eventKey="friends-menu"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Friend</Tooltip>}
            >
              <i className="icon material-symbols-outlined">people</i>
            </OverlayTrigger>
            <span className="item-name">Friend</span>
            <i className="right-icon material-symbols-outlined">
              chevron_right
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="friends-menu">
            <ul className="sub-nav">
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/friend-list"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/friend-list"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Friend List</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> FL </i>
                  </OverlayTrigger>
                  <span className="item-name">Friend List</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/friend-request"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/friend-request"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Friend Request</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> FR </i>
                  </OverlayTrigger>
                  <span className="item-name">Friend Request</span>
                </Link>
              </Nav.Item>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>

        <Accordion.Item as="li" eventKey="event-menu" bsPrefix="nav-item">
          <CustomToggle
            eventKey="event-menu"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Event</Tooltip>}
            >
              <i className="icon material-symbols-outlined">event</i>
            </OverlayTrigger>
            <span className="item-name">Event</span>
            <i className="right-icon material-symbols-outlined">
              chevron_right
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="event-menu">
            <ul className="sub-nav">
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/events"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/events"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Other Event</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> Other Event </i>
                  </OverlayTrigger>
                  <span className="item-name">Other Event</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/my-events"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/my-events"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>My Event</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> My Event </i>
                  </OverlayTrigger>
                  <span className="item-name">My Event</span>
                </Link>
              </Nav.Item>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Accordion.Item as="li" eventKey="groups-menu" bsPrefix="nav-item">
          <CustomToggle
            eventKey="groups-menu"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Group</Tooltip>}
            >
              <i className="icon material-symbols-outlined">groups</i>
            </OverlayTrigger>
            <span className="item-name">Group</span>
            <i className="right-icon material-symbols-outlined">
              chevron_right
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="groups-menu">
            <ul className="sub-nav">
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/groups" ? "active" : ""
                    } nav-link`}
                  to="/groups"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>All Groups</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> AL </i>
                  </OverlayTrigger>
                  <span className="item-name">All Groups</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/my-groups" ? "active" : ""
                    } nav-link`}
                  to="/my-groups"
                >
                  <i className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>My Groups</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> MG </i>
                  </OverlayTrigger>
                  <span className="item-name">My Groups</span>
                </Link>
              </Nav.Item>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Accordion.Item as="li" eventKey="sidebar-special" bsPrefix="nav-item">
          <CustomToggle
            eventKey="sidebar-special"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Special Pages</Tooltip>}
            >
              <i className="icon material-symbols-outlined">assignment</i>
            </OverlayTrigger>
            <span className="item-name">Special Pages</span>
            <i className="right-icon material-symbols-outlined">
              chevron_right
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="sidebar-special">
            <ul className="sub-nav">
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/pages"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/pages"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Pages</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> P </i>
                  </OverlayTrigger>
                  <span className="item-name">Pages</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/dashboard/extrapages/pages-invoice"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/dashboard/extrapages/pages-invoice"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>My Page</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> MP </i>
                  </OverlayTrigger>
                  <span className="item-name">My Page</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/dashboard/extrapages/pages-pricing"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/dashboard/extrapages/pages-pricing"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Create Page</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> CP </i>
                  </OverlayTrigger>
                  <span className="item-name">Create Page</span>
                </Link>
              </Nav.Item>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Accordion.Item as="li" eventKey="blog-menu" bsPrefix="nav-item">
          <CustomToggle
            eventKey="blog-menu"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Blogs</Tooltip>}
            >
              <i className="icon material-symbols-outlined">article</i>
            </OverlayTrigger>
            <span className="item-name">Blogs</span>
            <i className="right-icon material-symbols-outlined">
              chevron_right
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="blog-menu">
            <ul className="sub-nav">
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/blogs"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/blogs"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Blog Document</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> BD </i>
                  </OverlayTrigger>
                  <span className="item-name">Blog Document</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/my-blogs"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/my-blogs"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>My Document</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> MD </i>
                  </OverlayTrigger>
                  <span className="item-name">My Document</span>
                </Link>
              </Nav.Item>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
        <Nav.Item as="li">
          <Link
            className={`${location.pathname === "/notification"
              ? "active"
              : ""
              } nav-link `}
            aria-current="page"
            to="/notification"
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Notification</Tooltip>}
            >
              <i className="icon material-symbols-outlined">notifications</i>
            </OverlayTrigger>
            <span className="item-name">Notification</span>
          </Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Link className={`${location.pathname === '/chat' ? 'active' : ''} nav-link `} aria-current="page" to="/chat" >
            <OverlayTrigger placement="right" overlay={<Tooltip>Chat</Tooltip>}>
              <i className="icon material-symbols-outlined">
                message
              </i>
            </OverlayTrigger>
            <span className="item-name">Chat</span>
          </Link>
        </Nav.Item>
        <Accordion.Item as="li" eventKey="support-menu" bsPrefix="nav-item">
          <CustomToggle
            eventKey="support-menu"
            onClick={(activeKey) => setActiveMenu(activeKey)}
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Support</Tooltip>}
            >
              <i className="icon material-symbols-outlined">support_agent</i>
            </OverlayTrigger>
            <span className="item-name">Support</span>
            <i className="right-icon material-symbols-outlined">
              chevron_right
            </i>
          </CustomToggle>
          <Accordion.Collapse eventKey="support-menu">
            <ul className="sub-nav">
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/faq"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/faq"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>FAQ</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> FAQ </i>
                  </OverlayTrigger>
                  <span className="item-name">Faq</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/guide"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/guide"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Guide</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> Guide </i>
                  </OverlayTrigger>
                  <span className="item-name">Guide</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/contact"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/contact"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Contact</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> Contact </i>
                  </OverlayTrigger>
                  <span className="item-name">Contact</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Link
                  className={`${location.pathname === "/update"
                    ? "active"
                    : ""
                    } nav-link`}
                  to="/update"
                >
                  <i className="icon">
                    <svg
                      className="icon-10"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <g>
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          fill="currentColor"
                        ></circle>
                      </g>
                    </svg>
                  </i>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Update</Tooltip>}
                  >
                    <i className="sidenav-mini-icon"> Update </i>
                  </OverlayTrigger>
                  <span className="item-name">Update</span>
                </Link>
              </Nav.Item>
            </ul>
          </Accordion.Collapse>
        </Accordion.Item>
      </Accordion>
    </React.Fragment>
  );
});

export default VerticalNav;
