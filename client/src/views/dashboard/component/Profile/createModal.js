import React, { useEffect, useState } from "react";
import {
    Dropdown,
    Button,
    Modal,
} from "react-bootstrap";

import { Link } from "react-router-dom";
import "react-toastify/ReactToastify.css";

import small1 from "../../../../assets/images/small/07.png";
import small2 from "../../../../assets/images/small/08.png";
import small3 from "../../../../assets/images/small/09.png";
import small4 from "../../../../assets/images/small/10.png";
import small5 from "../../../../assets/images/small/11.png";
import small6 from "../../../../assets/images/small/12.png";

const CreateModal = ({ show, handleClose, profile }) => {

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                style={{ marginTop: "50px" }}
            >
                <Modal.Header className="d-flex justify-content-between">
                    <h5 className="modal-title" id="post-modalLabel">
                        Create Post
                    </h5>
                    <button
                        type="button"
                        className="btn btn-secondary lh-1"
                        onClick={handleClose}
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex align-items-center">
                        <div className="user-img">
                            <img
                                loading="lazy"
                                src={profile?.profile_picture}
                                alt="userimg"
                                className="avatar-60 rounded-circle img-fluid"
                            />
                        </div>
                        <form
                            className="post-text ms-3 w-100"
                            action=""
                        >
                            <input
                                type="text"
                                className="form-control rounded"
                                placeholder="Write something here..."
                                style={{ border: "none" }}
                            />
                        </form>
                    </div>
                    <hr />
                    <ul className="d-flex flex-wrap align-items-center list-inline m-0 p-0">
                        <li className="col-md-6 mb-3">
                            <div className="bg-soft-primary rounded p-2 pointer me-3">
                                <Link to="#"></Link>
                                <img
                                    loading="lazy"
                                    src={small1}
                                    alt="icon"
                                    className="img-fluid"
                                />{" "}
                                Photo/Video
                            </div>
                        </li>
                        <li className="col-md-6 mb-3">
                            <div className="bg-soft-primary rounded p-2 pointer me-3">
                                <Link to="#"></Link>
                                <img
                                    loading="lazy"
                                    src={small2}
                                    alt="icon"
                                    className="img-fluid"
                                />{" "}
                                Tag Friend
                            </div>
                        </li>
                        <li className="col-md-6 mb-3">
                            <div className="bg-soft-primary rounded p-2 pointer me-3">
                                <Link to="#"></Link>
                                <img
                                    loading="lazy"
                                    src={small3}
                                    alt="icon"
                                    className="img-fluid"
                                />{" "}
                                Feeling/Activity
                            </div>
                        </li>
                        <li className="col-md-6 mb-3">
                            <div className="bg-soft-primary rounded p-2 pointer me-3">
                                <Link to="#"></Link>
                                <img
                                    loading="lazy"
                                    src={small4}
                                    alt="icon"
                                    className="img-fluid"
                                />{" "}
                                Check in
                            </div>
                        </li>
                        <li className="col-md-6 mb-3">
                            <div className="bg-soft-primary rounded p-2 pointer me-3">
                                <Link to="#"></Link>
                                <img
                                    loading="lazy"
                                    src={small5}
                                    alt="icon"
                                    className="img-fluid"
                                />{" "}
                                Live Video
                            </div>
                        </li>
                        <li className="col-md-6 mb-3">
                            <div className="bg-soft-primary rounded p-2 pointer me-3">
                                <Link to="#"></Link>
                                <img
                                    loading="lazy"
                                    src={small6}
                                    alt="icon"
                                    className="img-fluid"
                                />{" "}
                                Gif
                            </div>
                        </li>
                    </ul>
                    <hr />
                    <div className="other-option">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div className="user-img me-3">
                                    <img
                                        loading="lazy"
                                        src={profile?.profile_picture}
                                        alt="userimg"
                                        className="avatar-60 rounded-circle img-fluid"
                                    />
                                </div>
                                <h6>Your Story</h6>
                            </div>
                            <div className="card-post-toolbar">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        role="button"
                                    >
                                        <span className="btn btn-primary">
                                            Public
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu clemassName="dropdown-menu m-0 p-0">
                                        <Dropdown.Item
                                            className="dropdown-item p-3"
                                            href="#"
                                        >
                                            <div className="d-flex align-items-top">
                                                <i className="ri-save-line h4"></i>
                                                <div className="data ms-2">
                                                    <h6>Public</h6>
                                                    <p className="mb-0">
                                                        Anyone on or off SocialV
                                                    </p>
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            className="dropdown-item p-3"
                                            href="#"
                                        >
                                            <div className="d-flex align-items-top">
                                                <i className="ri-notification-line h4"></i>
                                                <div className="data ms-2">
                                                    <h6>Only Me</h6>
                                                    <p className="mb-0">Only me</p>
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        className="d-block w-100 mt-3"
                    >
                        Post
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreateModal;
