import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Nav,
  Form,
  Card,
  Container,
  Image,
  Modal,
  Accordion,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "react-toastify/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Badge } from "antd";

import * as actions from "../../../actions/actions";
import {
  fetchUserProfile,
  fetchFriendRequest,
  confirmFriend,
  deleteFriend,
} from "../../../actions/actions";

//image
import user1 from "../../../assets/images/user/1.jpg";
import user2 from "../../../assets/images/user/02.jpg";
import user3 from "../../../assets/images/user/03.jpg";
import user4 from "../../../assets/images/user/04.jpg";
import user5 from "../../../assets/images/user/05.jpg";
import user6 from "../../../assets/images/page-img/19.jpg";
import user7 from "../../../assets/images/page-img/18.jpg";
import user8 from "../../../assets/images/page-img/20.jpg";
import user9 from "../../../assets/images/page-img/21.jpg";
import user10 from "../../../assets/images/page-img/22.jpg";
import user11 from "../../../assets/images/page-img/23.jpg";
import user12 from "../../../assets/images/page-img/24.jpg";
import user13 from "../../../assets/images/page-img/09.jpg";
import user14 from "../../../assets/images/page-img/03.jpg";
import user15 from "../../../assets/images/page-img/02.jpg";
import user16 from "../../../assets/images/page-img/01.jpg";
//Componets
import CustomToggle from "../../dropdowns";
import { useDispatch, useSelector } from "react-redux";
import Status from "./status";
// import DropdownMenu from "react-bootstrap/esm/DropdownMenu";

const Header = () => {
  const minisidebar = () => {
    document.getElementsByTagName("ASIDE")[0].classList.toggle("sidebar-mini");
  };
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { isLoggedIn } = useSelector((state) => state.root.auth);
  const { profile } = useSelector((state) => state.root.user || {});
  const { pendingFriends } = useSelector((state) => state.root.friend || {});

  const document1 = profile?.documentId;
  useEffect(() => {
    if (document1) {
      dispatch(fetchFriendRequest(document1));
    }
  }, [document1, dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserProfile());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <>
      <div className="iq-top-navbar">
        <Nav
          expand="lg"
          variant="light"
          className="nav navbar navbar-expand-lg navbar-light iq-navbar p-lg-0"
        >
          <Container fluid className="navbar-inner">
            <div className="d-flex align-items-center gap-3  pb-2 pb-lg-0">
              <Link
                to="/"
                className="d-flex align-items-center gap-2 iq-header-logo"
              >
                <svg
                  width="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.67733 9.50001L7.88976 20.2602C9.81426 23.5936 14.6255 23.5936 16.55 20.2602L22.7624 9.5C24.6869 6.16666 22.2813 2 18.4323 2H6.00746C2.15845 2 -0.247164 6.16668 1.67733 9.50001ZM14.818 19.2602C13.6633 21.2602 10.7765 21.2602 9.62181 19.2602L9.46165 18.9828L9.46597 18.7275C9.48329 17.7026 9.76288 16.6993 10.2781 15.8131L12.0767 12.7195L14.1092 16.2155C14.4957 16.8803 14.7508 17.6132 14.8607 18.3743L14.9544 19.0239L14.818 19.2602ZM16.4299 16.4683L19.3673 11.3806C18.7773 11.5172 18.172 11.5868 17.5629 11.5868H13.7316L15.8382 15.2102C16.0721 15.6125 16.2699 16.0335 16.4299 16.4683ZM20.9542 8.63193L21.0304 8.5C22.1851 6.5 20.7417 4 18.4323 4H17.8353L17.1846 4.56727C16.6902 4.99824 16.2698 5.50736 15.9402 6.07437L13.8981 9.58676H17.5629C18.4271 9.58676 19.281 9.40011 20.0663 9.03957L20.9542 8.63193ZM14.9554 4C14.6791 4.33499 14.4301 4.69248 14.2111 5.06912L12.0767 8.74038L10.0324 5.22419C9.77912 4.78855 9.48582 4.37881 9.15689 4H14.9554ZM6.15405 4H6.00746C3.69806 4 2.25468 6.50001 3.40938 8.50001L3.4915 8.64223L4.37838 9.04644C5.15962 9.40251 6.00817 9.58676 6.86672 9.58676H10.2553L8.30338 6.22943C7.9234 5.57587 7.42333 5.00001 6.8295 4.53215L6.15405 4ZM5.07407 11.3833L7.88909 16.2591C8.05955 15.7565 8.28025 15.2702 8.54905 14.8079L10.4218 11.5868H6.86672C6.26169 11.5868 5.66037 11.5181 5.07407 11.3833Z"
                    fill="currentColor"
                  />
                </svg>

                <h3
                  className="logo-title d-none d-sm-block"
                  data-setting="app_name"
                >
                  Talk C
                </h3>
              </Link>
              <div
                className="sidebar-toggle"
                data-toggle="sidebar"
                data-active="true"
                onClick={minisidebar}
              >
                <div className="icon material-symbols-outlined iq-burger-menu">
                  menu
                </div>
              </div>
            </div>

            <div className="iq-search-bar device-search  position-relative">
              <form
                action="#"
                className="searchbox"
                onClick={handleShow}
                data-bs-toggle="modal"
                data-bs-target="#exampleModalFullscreenSm"
              >
                <Link className="search-link d-none d-lg-block" to="/">
                  <span className="material-symbols-outlined">search</span>
                </Link>
                <Form.Control
                  type="text"
                  className="text search-input form-control bg-soft-primary  d-none d-lg-block"
                  placeholder="Search here..."
                />
                <Link
                  className="d-lg-none d-flex d-none d-lg-block"
                  to="/"
                  onClick={handleShow}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalFullscreenSm"
                >
                  <span className="material-symbols-outlined">search</span>
                </Link>
              </form>

              <Modal
                show={show}
                onHide={handleClose}
                className="search-modal"
                id="post-modal"
              >
                <div className="modal-dialog modal-fullscreen-lg-down m-0">
                  <Modal.Header className="py-2">
                    <div className="d-flex align-items-center justify-content-between d-lg-none w-100">
                      <form
                        action="#"
                        className="searchbox w-50"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalFullscreenSm"
                        onClick={handleShow}
                      >
                        <Link className="search-link" to="/">
                          <span className="material-symbols-outlined">
                            search
                          </span>
                        </Link>

                        <Form.Control
                          type="text"
                          className="text search-input bg-soft-primary"
                          placeholder="Search here..."
                        />
                      </form>

                      <Link
                        to="/"
                        className="material-symbols-outlined text-dark"
                        onClick={handleClose}
                      >
                        close
                      </Link>
                    </div>
                    {/* <Modal.Title> */}
                    <div className="d-flex align-items-center justify-content-between ms-auto w-100">
                      <h5 className=" h4" id="exampleModalFullscreenLabel">
                        Recent
                      </h5>

                      <Link to="/" className="text-dark">
                        Clear All
                      </Link>
                    </div>
                    {/* </Modal.Title> */}
                  </Modal.Header>
                  <Modal.Body className="p-0">
                    <div className="d-flex d-lg-none align-items-center justify-content-between w-100 p-3 pb-0">
                      <h5 className=" h4" id="exampleModalFullscreenLabel">
                        Recent
                      </h5>

                      <Link to="/" className="text-dark">
                        Clear All
                      </Link>
                    </div>
                    <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                      <div className="flex-shrink-0">
                        <Image
                          className="align-self-center img-fluid avatar-50 rounded-pill"
                          src={user6}
                          alt=""
                          loading="lazy"
                        />
                      </div>

                      <div className="d-flex flex-column ms-3">
                        <Link to="/" className="h5">
                          Paige Turner
                        </Link>

                        <span>Paige001</span>
                      </div>

                      <div className="d-flex align-items-center ms-auto">
                        <Link to="/" className="me-3 d-flex align-items-center">
                          <small>Follow</small>{" "}
                        </Link>

                        <Link
                          to="/"
                          className="material-symbols-outlined text-dark"
                        >
                          close
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                      <div className="flex-shrink-0">
                        <Image
                          className="align-self-center img-fluid avatar-50 rounded-pill"
                          src={user7}
                          alt=""
                          loading="lazy"
                        />
                      </div>

                      <div className="d-flex flex-column ms-3">
                        <Link to="/" className="h5">
                          Monty Carlo
                        </Link>

                        <span>Carlo.m</span>
                      </div>

                      <div className="d-flex align-items-center ms-auto">
                        <Link to="/" className="me-3 d-flex align-items-center">
                          <small>Unfollow</small>{" "}
                        </Link>

                        <Link
                          to="/"
                          className="material-symbols-outlined text-dark"
                        >
                          close
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex align-items-center search-hover py-2 px-3 border-bottom">
                      <div className="flex-shrink-0">
                        <Image
                          className="align-self-center img-fluid avatar-50 rounded-pill"
                          src={user8}
                          alt=""
                          loading="lazy"
                        />
                      </div>

                      <div className="d-flex flex-column ms-3">
                        <Link to="/" className="h5">
                          Paul Molive
                        </Link>

                        <span>Paul.45</span>
                      </div>

                      <div className="d-flex align-items-center ms-auto">
                        <Link to="/" className="me-3 d-flex align-items-center">
                          <small>Request</small>{" "}
                        </Link>

                        <Link
                          to="/"
                          className="material-symbols-outlined text-dark"
                        >
                          close
                        </Link>
                      </div>
                    </div>
                    <div className="">
                      <h4 className="px-3 py-2">Suggestions</h4>

                      <div className="suggestion-card px-3 d-flex">
                        <div className="text-center story">
                          <div className="story-profile">
                            <Image
                              className="avatar-50 rounded-pill"
                              src={user8}
                              alt=""
                              loading="lazy"
                            />

                            <Link
                              to="/"
                              className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                            >
                              Ammy Paul
                            </Link>
                          </div>

                          <Link
                            to="/"
                            className="d-lg-none align-items-center d-flex"
                          >
                            <small>Follow</small>{" "}
                          </Link>
                        </div>

                        <div className="text-center story">
                          <div className="story-profile">
                            <Image
                              className="avatar-50 rounded-pill"
                              src={user9}
                              alt=""
                              loading="lazy"
                            />

                            <Link
                              to="/"
                              className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                            >
                              Roger Carlo
                            </Link>
                          </div>

                          <Link
                            to="/"
                            className="d-lg-none align-items-center d-flex"
                          >
                            <small>Unfollow</small>{" "}
                          </Link>
                        </div>

                        <div className="text-center story ">
                          <div className="story-profile">
                            <Image
                              className="avatar-50 rounded-pill"
                              src={user10}
                              alt=""
                              loading="lazy"
                            />

                            <Link
                              to="/"
                              className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                            >
                              Justin Molive
                            </Link>
                          </div>

                          <Link
                            to="/"
                            className="d-lg-none align-items-center d-flex"
                          >
                            <small>Follow</small>{" "}
                          </Link>
                        </div>

                        <div className="text-center story">
                          <div className="story-profile ">
                            <Image
                              className="avatar-50 rounded-pill"
                              src={user11}
                              alt=""
                              loading="lazy"
                            />

                            <Link
                              to="/"
                              className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                            >
                              Roy Fisher
                            </Link>
                          </div>

                          <Link
                            to="/"
                            className="d-lg-none align-items-center d-flex"
                          >
                            <small>Request</small>{" "}
                          </Link>
                        </div>

                        <div className="text-center story">
                          <div className="story-profile">
                            <Image
                              className="avatar-50 rounded-pill"
                              src={user12}
                              alt=""
                              loading="lazy"
                            />

                            <Link
                              to="/"
                              className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                            >
                              Johan Carlo
                            </Link>
                          </div>

                          <Link
                            to="/"
                            className="d-lg-none align-items-center d-flex"
                          >
                            <small>Follow</small>{" "}
                          </Link>
                        </div>

                        <div className="text-center story">
                          <div className="story-profile">
                            <Image
                              className="avatar-50 rounded-pill"
                              src={user13}
                              alt=""
                              loading="lazy"
                            />

                            <Link
                              to="/"
                              className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                            >
                              MedrLink Miles
                            </Link>
                          </div>

                          <Link
                            to="/"
                            className="d-lg-none align-items-center d-flex"
                          >
                            <small>Unfollow</small>{" "}
                          </Link>
                        </div>

                        <div className="text-center story">
                          <div className="story-profile">
                            <Image
                              className="avatar-50 rounded-pill"
                              src={user14}
                              alt=""
                              loading="lazy"
                            />

                            <Link
                              to="/"
                              className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                            >
                              Aohan Paul
                            </Link>
                          </div>

                          <Link
                            to="/"
                            className="d-lg-none align-items-center d-flex"
                          >
                            <small>Request</small>{" "}
                          </Link>
                        </div>

                        <div className="text-center story">
                          <div className="story-profile">
                            <Image
                              className="avatar-50 rounded-pill"
                              src={user15}
                              alt=""
                              loading="lazy"
                            />

                            <Link
                              to="/"
                              className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                            >
                              Rokni Joy
                            </Link>
                          </div>

                          <Link
                            to="/"
                            className="d-lg-none align-items-center d-flex"
                          >
                            <small>Follow</small>{" "}
                          </Link>
                        </div>

                        <div className="text-center story">
                          <div className="story-profile">
                            <Image
                              className="avatar-50 rounded-pill"
                              src={user16}
                              alt=""
                              loading="lazy"
                            />

                            <Link
                              to="/"
                              className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                            >
                              Sepid Ryan
                            </Link>
                          </div>

                          <Link
                            to="/"
                            className="d-lg-none align-items-center d-flex"
                          >
                            <small>Unfollow</small>{" "}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </div>
              </Modal>
            </div>

            <ul className="navbar-nav navbar-list">
              <Nav.Item as="li">
                <Link to="/" className="d-flex align-items-center">
                  <i className="material-symbols-outlined">home</i>
                  <span className="mobile-text d-none ms-3">Home</span>
                </Link>
              </Nav.Item>
              <Nav.Item as="li" className="d-lg-none">
                <div className="iq-search-bar device-search  position-relative">
                  <form
                    action="#"
                    className="searchbox"
                    onClick={handleShow}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalFullscreenSm"
                  >
                    <Link className="search-link d-none d-lg-block" to="/">
                      <span className="material-symbols-outlined">search</span>
                    </Link>
                    <Form.Control
                      type="text"
                      className="text search-input form-control bg-soft-primary  d-none d-lg-block"
                      placeholder="Search here..."
                    />
                    <Link
                      className="d-lg-none d-flex"
                      to="/"
                      onClick={handleShow}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalFullscreenSm"
                    >
                      <span className="material-symbols-outlined">search</span>
                    </Link>
                  </form>

                  <Modal
                    show={show}
                    onHide={handleClose}
                    className="search-modal"
                    id="post-modal"
                  >
                    <div className="modal-dialog modal-fullscreen-lg-down m-0">
                      <Modal.Header className="py-2">
                        <div className="d-flex align-items-center justify-content-between d-lg-none w-100">
                          <form
                            action="#"
                            className="searchbox w-50"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalFullscreenSm"
                            onClick={handleShow}
                          >
                            <Link className="search-link" to="/">
                              <span className="material-symbols-outlined">
                                search
                              </span>
                            </Link>

                            <Form.Control
                              type="text"
                              className="text search-input bg-soft-primary"
                              placeholder="Search here..."
                            />
                          </form>

                          <Link
                            to="/"
                            className="material-symbols-outlined text-dark"
                            onClick={handleClose}
                          >
                            close
                          </Link>
                        </div>
                        {/* <Modal.Title> */}
                        <div className="d-flex align-items-center justify-content-between ms-auto w-100">
                          <h5 className=" h4" id="exampleModalFullscreenLabel">
                            Recent
                          </h5>

                          <Link to="/" className="text-dark">
                            Clear All
                          </Link>
                        </div>
                        {/* </Modal.Title> */}
                      </Modal.Header>
                      <Modal.Body className="p-0">
                        <div className="d-flex d-lg-none align-items-center justify-content-between w-100 p-3 pb-0">
                          <h5 className=" h4" id="exampleModalFullscreenLabel">
                            Recent
                          </h5>

                          <Link to="/" className="text-dark">
                            Clear All
                          </Link>
                        </div>
                        <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                          <div className="flex-shrink-0">
                            <Image
                              className="align-self-center img-fluid avatar-50 rounded-pill"
                              src={user6}
                              alt=""
                              loading="lazy"
                            />
                          </div>

                          <div className="d-flex flex-column ms-3">
                            <Link to="/" className="h5">
                              Paige Turner
                            </Link>

                            <span>Paige001</span>
                          </div>

                          <div className="d-flex align-items-center ms-auto">
                            <Link
                              to="/"
                              className="me-3 d-flex align-items-center"
                            >
                              <small>Follow</small>{" "}
                            </Link>

                            <Link
                              to="/"
                              className="material-symbols-outlined text-dark"
                            >
                              close
                            </Link>
                          </div>
                        </div>
                        <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                          <div className="flex-shrink-0">
                            <Image
                              className="align-self-center img-fluid avatar-50 rounded-pill"
                              src={user7}
                              alt=""
                              loading="lazy"
                            />
                          </div>

                          <div className="d-flex flex-column ms-3">
                            <Link to="/" className="h5">
                              Monty Carlo
                            </Link>

                            <span>Carlo.m</span>
                          </div>

                          <div className="d-flex align-items-center ms-auto">
                            <Link
                              to="/"
                              className="me-3 d-flex align-items-center"
                            >
                              <small>Unfollow</small>{" "}
                            </Link>

                            <Link
                              to="/"
                              className="material-symbols-outlined text-dark"
                            >
                              close
                            </Link>
                          </div>
                        </div>
                        <div className="d-flex align-items-center search-hover py-2 px-3 border-bottom">
                          <div className="flex-shrink-0">
                            <Image
                              className="align-self-center img-fluid avatar-50 rounded-pill"
                              src={user8}
                              alt=""
                              loading="lazy"
                            />
                          </div>

                          <div className="d-flex flex-column ms-3">
                            <Link to="/" className="h5">
                              Paul Molive
                            </Link>

                            <span>Paul.45</span>
                          </div>

                          <div className="d-flex align-items-center ms-auto">
                            <Link
                              to="/"
                              className="me-3 d-flex align-items-center"
                            >
                              <small>Request</small>{" "}
                            </Link>

                            <Link
                              to="/"
                              className="material-symbols-outlined text-dark"
                            >
                              close
                            </Link>
                          </div>
                        </div>
                        <div className="">
                          <h4 className="px-3 py-2">Suggestions</h4>

                          <div className="suggestion-card px-3 d-flex">
                            <div className="text-center story">
                              <div className="story-profile">
                                <Image
                                  className="avatar-50 rounded-pill"
                                  src={user8}
                                  alt=""
                                  loading="lazy"
                                />

                                <Link
                                  to="/"
                                  className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                                >
                                  Ammy Paul
                                </Link>
                              </div>

                              <Link
                                to="/"
                                className="d-lg-none align-items-center d-flex"
                              >
                                <small>Follow</small>{" "}
                              </Link>
                            </div>

                            <div className="text-center story">
                              <div className="story-profile">
                                <Image
                                  className="avatar-50 rounded-pill"
                                  src={user9}
                                  alt=""
                                  loading="lazy"
                                />

                                <Link
                                  to="/"
                                  className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                                >
                                  Roger Carlo
                                </Link>
                              </div>

                              <Link
                                to="/"
                                className="d-lg-none align-items-center d-flex"
                              >
                                <small>Unfollow</small>{" "}
                              </Link>
                            </div>

                            <div className="text-center story ">
                              <div className="story-profile">
                                <Image
                                  className="avatar-50 rounded-pill"
                                  src={user10}
                                  alt=""
                                  loading="lazy"
                                />

                                <Link
                                  to="/"
                                  className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                                >
                                  Justin Molive
                                </Link>
                              </div>

                              <Link
                                to="/"
                                className="d-lg-none align-items-center d-flex"
                              >
                                <small>Follow</small>{" "}
                              </Link>
                            </div>

                            <div className="text-center story">
                              <div className="story-profile ">
                                <Image
                                  className="avatar-50 rounded-pill"
                                  src={user11}
                                  alt=""
                                  loading="lazy"
                                />

                                <Link
                                  to="/"
                                  className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                                >
                                  Roy Fisher
                                </Link>
                              </div>

                              <Link
                                to="/"
                                className="d-lg-none align-items-center d-flex"
                              >
                                <small>Request</small>{" "}
                              </Link>
                            </div>

                            <div className="text-center story">
                              <div className="story-profile">
                                <Image
                                  className="avatar-50 rounded-pill"
                                  src={user12}
                                  alt=""
                                  loading="lazy"
                                />

                                <Link
                                  to="/"
                                  className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                                >
                                  Johan Carlo
                                </Link>
                              </div>

                              <Link
                                to="/"
                                className="d-lg-none align-items-center d-flex"
                              >
                                <small>Follow</small>{" "}
                              </Link>
                            </div>

                            <div className="text-center story">
                              <div className="story-profile">
                                <Image
                                  className="avatar-50 rounded-pill"
                                  src={user13}
                                  alt=""
                                  loading="lazy"
                                />

                                <Link
                                  to="/"
                                  className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                                >
                                  MedrLink Miles
                                </Link>
                              </div>

                              <Link
                                to="/"
                                className="d-lg-none align-items-center d-flex"
                              >
                                <small>Unfollow</small>{" "}
                              </Link>
                            </div>

                            <div className="text-center story">
                              <div className="story-profile">
                                <Image
                                  className="avatar-50 rounded-pill"
                                  src={user14}
                                  alt=""
                                  loading="lazy"
                                />

                                <Link
                                  to="/"
                                  className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                                >
                                  Aohan Paul
                                </Link>
                              </div>

                              <Link
                                to="/"
                                className="d-lg-none align-items-center d-flex"
                              >
                                <small>Request</small>{" "}
                              </Link>
                            </div>

                            <div className="text-center story">
                              <div className="story-profile">
                                <Image
                                  className="avatar-50 rounded-pill"
                                  src={user15}
                                  alt=""
                                  loading="lazy"
                                />

                                <Link
                                  to="/"
                                  className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                                >
                                  Rokni Joy
                                </Link>
                              </div>

                              <Link
                                to="/"
                                className="d-lg-none align-items-center d-flex"
                              >
                                <small>Follow</small>{" "}
                              </Link>
                            </div>

                            <div className="text-center story">
                              <div className="story-profile">
                                <Image
                                  className="avatar-50 rounded-pill"
                                  src={user16}
                                  alt=""
                                  loading="lazy"
                                />

                                <Link
                                  to="/"
                                  className="h6 mt-0 mt-lg-2 ms-3 ms-lg-0 text-ellipsis short-2 small"
                                >
                                  Sepid Ryan
                                </Link>
                              </div>

                              <Link
                                to="/"
                                className="d-lg-none align-items-center d-flex"
                              >
                                <small>Unfollow</small>{" "}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Modal.Body>
                    </div>
                  </Modal>
                </div>
              </Nav.Item>
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle
                  href="/"
                  as={CustomToggle}
                  variant="d-flex align-items-center"
                >
                  <Badge count={pendingFriends?.length} size="small">
                    <span style={{ color: 'rgb(80, 154, 208)' }} className="material-symbols-outlined">group</span>
                  </Badge>
                </Dropdown.Toggle>
                <Dropdown.Menu className="sub-drop sub-drop-large">
                  <Card className="shadow-none m-0">
                    <Card.Header className="d-flex justify-content-between bg-primary">
                      <div className="header-title">
                        <h5 className="mb-0 text-white">Friend Request</h5>
                      </div>
                      <small className="badge  bg-light text-dark ">
                        {pendingFriends?.length}
                      </small>
                    </Card.Header>
                    <Card.Body
                      className="p-0"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      {pendingFriends && pendingFriends?.length > 0 ? (
                        pendingFriends.map((friend, index) => {
                          const friendData =
                            friend?.user_id?.documentId === document
                              ? friend?.friend_id
                              : friend?.user_id;

                          const handleConfirm = async (friendId) => {
                            try {
                              await dispatch(confirmFriend(friendId)); // Gọi API để cập nhật trạng thái thành "accepted"

                              // Tự động xóa bạn bè khỏi danh sách pending trong Redux
                              dispatch(fetchFriendRequest(document));

                              // Hiển thị thông báo thành công
                              toast.success(
                                "Friend request accepted successfully!",
                                {
                                  position: "top-right",
                                  autoClose: 3000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                }
                              );
                            } catch (error) {
                              // Hiển thị thông báo lỗi
                              toast.error("Failed to accept friend request.", {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                              });
                              console.error("Error confirming friend:", error);
                            }
                          };

                          const handleReject = async (friendId) => {
                            Swal.fire({
                              title: "Are you sure?",
                              text: "Do you really want to reject this friend request?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "Yes, reject it!",
                              cancelButtonText: "No, cancel",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                try {
                                  // Gọi API hoặc action để từ chối bạn bè
                                  await dispatch(deleteFriend(friendId));
                                  await dispatch(fetchFriendRequest(document)); // Làm mới danh sách

                                  Swal.fire(
                                    "Rejected!",
                                    "Friend request has been rejected.",
                                    "success"
                                  );
                                } catch (error) {
                                  Swal.fire(
                                    "Error!",
                                    "Failed to reject the friend request.",
                                    "error"
                                  );
                                  console.error(
                                    "Error rejecting friend:",
                                    error
                                  );
                                }
                              }
                            });
                          };
                          return (
                            <div
                              className="iq-friend-request"
                              key={`pending-${friend?.documentId || index}`}
                            >
                              <div className="iq-sub-card iq-sub-card-big d-flex align-items-center justify-content-between ">
                                {/* Avatar và thông tin bạn bè */}
                                <div className="d-flex align-items-center">
                                  <Image
                                    className="avatar-50 rounded"
                                    src={
                                      friendData?.profile_picture ||
                                      "default-profile.png"
                                    } // Avatar hoặc ảnh mặc định
                                    alt={`${friendData?.username || "User"
                                      }'s profile`}
                                    loading="lazy"
                                  />
                                  <div className="ms-3">
                                    <h6 className="mb-0">
                                      {friendData?.username}
                                    </h6>
                                    <p className="mb-0">
                                      {friend?.friendCount || 0} friends
                                    </p>
                                  </div>
                                </div>

                                {/* Nút Confirm và Delete Request */}
                                <div className="d-flex align-items-center">
                                  <Link
                                    to="#"
                                    onClick={() =>
                                      handleConfirm(friend?.documentId)
                                    }
                                    className="me-3 btn btn-primary rounded"
                                  >
                                    Confirm
                                  </Link>
                                  <Link
                                    to="#"
                                    onClick={() =>
                                      handleReject(friend?.documentId)
                                    }
                                    className="me-3 btn btn-warning rounded"
                                  >
                                    Rejected
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center w-100">
                          <p>No Friend Requests</p>
                        </div>
                      )}
                    </Card.Body>
                    <div className="text-center">
                      <Link
                        to="/user-profile#pill-closefriends"
                        className=" btn text-primary"
                      >
                        View More Request
                      </Link>
                    </div>
                  </Card>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown as="li" className="nav-item ">
                <Dropdown.Toggle
                  href="#"
                  as={CustomToggle}
                  variant="search-toggle d-flex align-items-center"
                >
                  <i className="material-symbols-outlined">notifications</i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="sub-drop">
                  <Card className="shadow-none m-0">
                    <Card.Header className="d-flex justify-content-between bg-primary">
                      <div className="header-title bg-primary">
                        <h5 className="mb-0 text-white ">All Notifications</h5>
                      </div>
                      <small className="badge  bg-light text-dark">4</small>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <Link to="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <Image
                              className="avatar-40 rounded"
                              src={user1}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div className="ms-3 w-100">
                            <h6 className="mb-0 ">Emma Watson Bni</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">95 MB</p>
                              <small className="float-right font-size-12">
                                Just Now
                              </small>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Link to="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <Image
                              className="avatar-40 rounded"
                              src={user2}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div className="ms-3 w-100">
                            <h6 className="mb-0 ">New customer is join</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">Cyst Bni</p>
                              <small className="float-right font-size-12">
                                5 days ago
                              </small>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Link to="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <Image
                              className="avatar-40 rounded"
                              src={user3}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div className="ms-3 w-100">
                            <h6 className="mb-0 ">Two customer is left</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">Cyst Bni</p>
                              <small className="float-right font-size-12">
                                2 days ago
                              </small>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Link to="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <Image
                              className="avatar-40 rounded"
                              src={user4}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div className="w-100 ms-3">
                            <h6 className="mb-0 ">New Mail from Fenny</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">Cyst Bni</p>
                              <small className="float-right font-size-12">
                                3 days ago
                              </small>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card.Body>
                  </Card>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown as="li" className="nav-item">
                <Dropdown.Toggle
                  href="#"
                  as={CustomToggle}
                  variant="d-flex align-items-center"
                >
                  <i className="material-symbols-outlined">mail</i>
                  <span className="mobile-text d-none ms-3">Message</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="sub-drop">
                  <Card className="shadow-none m-0">
                    <Card.Header className="d-flex justify-content-between bg-primary">
                      <div className="header-title bg-primary">
                        <h5 className="mb-0 text-white">All Message</h5>
                      </div>
                      <small className="badge bg-light text-dark">4</small>
                    </Card.Header>
                    <Card.Body className="p-0 ">
                      <Link to="#" className="iq-sub-card">
                        <div className="d-flex  align-items-center">
                          <div className="">
                            <Image
                              className="avatar-40 rounded"
                              src={user1}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div className=" w-100 ms-3">
                            <h6 className="mb-0 ">Bni Emma Watson</h6>
                            <small className="float-left font-size-12">
                              13 Jun
                            </small>
                          </div>
                        </div>
                      </Link>
                      <Link to="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <Image
                              className="avatar-40 rounded"
                              src={user2}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Lorem Ipsum Watson</h6>
                            <small className="float-left font-size-12">
                              20 Apr
                            </small>
                          </div>
                        </div>
                      </Link>
                      <Link to="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <Image
                              className="avatar-40 rounded"
                              src={user3}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Why do we use it?</h6>
                            <small className="float-left font-size-12">
                              30 Jun
                            </small>
                          </div>
                        </div>
                      </Link>
                      <Link to="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <Image
                              className="avatar-40 rounded"
                              src={user4}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Variations Passages</h6>
                            <small className="float-left font-size-12">
                              12 Sep
                            </small>
                          </div>
                        </div>
                      </Link>
                      <Link to="#" className="iq-sub-card">
                        <div className="d-flex align-items-center">
                          <div className="">
                            <Image
                              className="avatar-40 rounded"
                              src={user5}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 ">Lorem Ipsum generators</h6>
                            <small className="float-left font-size-12">
                              5 Dec
                            </small>
                          </div>
                        </div>
                      </Link>
                    </Card.Body>
                  </Card>
                </Dropdown.Menu>
              </Dropdown>
              {/* <Nav.Item as="li" className="d-lg-none">
              <Link
                to="/dashboard/app/notification"
                className="d-flex align-items-center"
              >
                <i className="material-symbols-outlined">notifications</i>
                <span className="mobile-text  ms-3 d-none">Notifications</span>
              </Link>
  </Nav.Item>*/}
              <Nav.Item className="nav-item d-none d-lg-none">
                <Link
                  to="#"
                  className="dropdown-toggle d-flex align-items-center"
                  id="mail-drop-1"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="material-symbols-outlined">mail</i>
                  <span className="mobile-text  ms-3">Message</span>
                </Link>
              </Nav.Item>
              <Dropdown as="li" className="nav-item user-dropdown">
                <Dropdown.Toggle
                  href="#"
                  as={CustomToggle}
                  variant="d-flex align-items-center"
                >
                  <Image
                    src={profile?.profile_picture}
                    className="img-fluid rounded-circle me-3"
                    alt="user"
                    loading="lazy"
                  />
                  <div className="caption d-none d-lg-block">
                    <h6 className="mb-0 line-height">{profile?.username}</h6>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="sub-drop caption-menu">
                  <Card className="shadow-none m-0">
                    <Card.Header>
                      <div className="header-title">
                        <h5 className="mb-0 ">Hello {profile?.username}</h5>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-0 ">
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <span className="material-symbols-outlined">
                          line_style
                        </span>
                        <div className="ms-3">
                          <Link to="/user-profile" className="mb-0 h6">
                            My Profile
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <span className="material-symbols-outlined">
                          edit_note
                        </span>
                        <div className="ms-3">
                          <Link to="#" className="mb-0 h6">
                            Edit Profile
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <span className="material-symbols-outlined">
                          manage_accounts
                        </span>
                        <div className="ms-3">
                          <Link
                            to="/account-setting"
                            className="mb-0 h6"
                          >
                            Account settings
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card border-0">
                        <span className="material-symbols-outlined">lock</span>
                        <div className="ms-3">
                          <Link
                            to="/privacy-setting"
                            className="mb-0 h6"
                          >
                            Privacy Settings
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center iq-sub-card">
                        <span className="material-symbols-outlined">login</span>
                        <div className="ms-3">
                          <Link
                            to="/sign-in"
                            className="mb-0 h6"
                            onClick={() => dispatch(actions.logout())}
                          >
                            Sign out
                          </Link>
                        </div>
                      </div>

                      <Status userId={profile} />
                    </Card.Body>
                  </Card>
                </Dropdown.Menu>
              </Dropdown>

              
            </ul>
          </Container>
        </Nav>
      </div>

      <ToastContainer />
    </>
  );
};

export default Header;
