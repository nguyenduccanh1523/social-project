import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Dropdown,
  Button,
  Modal,
  Form,
  Tab,
  Nav,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ProfileHeader from "../../../components/profile-header";
import PostItem from "../component/postItem";

//image
import user1 from "../../../assets/images/user/05.jpg";
import user9 from "../../../assets/images/user/1.jpg";
import img5 from "../../../assets/images/user/1.jpg";
import small1 from "../../../assets/images/small/07.png";
import small2 from "../../../assets/images/small/08.png";
import small3 from "../../../assets/images/small/09.png";
import small4 from "../../../assets/images/small/10.png";
import small5 from "../../../assets/images/small/11.png";
import small6 from "../../../assets/images/small/12.png";
import small7 from "../../../assets/images/small/13.png";
import small8 from "../../../assets/images/small/14.png";
import header from "../../../assets/images/page-img/profile-bg7.jpg";
import img15 from "../../../assets/images/page-img/profile-bg4.jpg";
import img16 from "../../../assets/images/page-img/profile-bg5.jpg";
import img12 from "../../../assets/images/page-img/profile-bg6.jpg";
import img13 from "../../../assets/images/page-img/profile-bg7.jpg";
import img14 from "../../../assets/images/page-img/profile-bg9.jpg";

import { fetchGroupMembers, fetchGroupPost } from "../../../actions/actions";
import { useDispatch, useSelector } from "react-redux";


const GroupDetail = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const location = useLocation();
  const { oldData } = location?.state || {};
  const { members } = useSelector((state) => state.root.group || {});
  const { posts } = useSelector((state) => state.root.post || {});
  const images = [img12, img13, img14, img15, img16];

  //console.log("oldData: ", posts);

  useEffect(() => {
    dispatch(fetchGroupMembers(oldData?.documentId)); // Truyền đúng giá trị groupId
    dispatch(fetchGroupPost(oldData?.documentId)); // Truyền đúng giá trị groupId
  }, [oldData, dispatch]);

  // Lấy thành viên của nhóm hiện tại từ Redux
  const groupMembers = members[oldData?.documentId]?.data || [];
  const groupPosts = posts[oldData?.documentId] || [];
  // Đảm bảo groupMembers là mảng trước khi gọi .slice()
  const validGroupMembers = Array.isArray(groupMembers) ? groupMembers : [];
  //console.log("groupMembers: ", groupPosts);

  return (
    <>
      <ProfileHeader img={header} title="Groups" />
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Col lg="12">
              <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                <div className="group-info d-flex align-items-center">
                  <div className="me-3">
                    <img
                      className="rounded-circle img-fluid avatar-100"
                      src={oldData?.image_group}
                      alt=""
                    />
                  </div>
                  <div className="info">
                    <h4>{oldData?.group_name}</h4>
                    <p className="mb-0">
                      <i className="ri-lock-fill pe-2"></i>Private Group .{" "}
                      {oldData?.member_ids?.length} members
                    </p>
                  </div>
                </div>
                <div
                  mt-md="0"
                  mt="2"
                  className="group-member d-flex align-items-center"
                >
                  <div className="iq-media-group me-3">
                    {validGroupMembers
                      .slice(0, 8) // Change slice to show 8 members instead of 6
                      .map((member, index) => (
                        <Link to="#" className="iq-media" key={index}>
                          <img
                            className="img-fluid avatar-40 rounded-circle"
                            src={member?.users_id?.profile_picture || user1} // Use user1 as fallback
                            alt="profile-img"
                          />
                        </Link>
                      ))}
                  </div>
                  <Button variant="secondary" className="mb-2 me-2">
                    <i className="ri-add-line me-1"></i>Invited
                  </Button>

                  <Button variant="danger" className="mb-2">
                    <i className="ri-add-line me-1"></i>Leave
                  </Button>
                </div>
              </div>
            </Col>
            <Tab.Container defaultActiveKey="f1">
              <Card>
                <div className="user-tabing">
                  <Nav
                    variant="pills"
                    className="d-flex  profile-feed-items p-0 m-0 round"
                  >
                    <Nav.Item as="li" className="col-12 col-sm-2 p-0">
                      <Nav.Link eventKey="f1" href="#">
                        Dicussion
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="col-12 col-sm-3 p-0">
                      <Nav.Link className="" eventKey="f2" href="#">
                        Members
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Card>
              <Tab.Content className="forum-content">
                <Tab.Pane eventKey="f1">
                  <Row>
                    <Col lg="8">
                      <Card id="post-modal-data">
                        <Card.Header className="d-flex justify-content-between">
                          <div className="header-title">
                            <h4 className="card-title">Create Post</h4>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex align-items-center">
                            <div className="user-img">
                              <img
                                src={user9}
                                alt="userimg"
                                className="avatar-60 rounded-circle"
                              />
                            </div>
                            <form
                              className="post-text ms-3 w-100 "
                              onClick={handleShow}
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
                          <ul className=" post-opt-block d-flex list-inline m-0 p-0 flex-wrap">
                            <li className="bg-soft-primary rounded p-2 pointer d-flex align-items-center me-3 mb-md-0 mb-2">
                              <img
                                src={small1}
                                alt="icon"
                                className="img-fluid me-2"
                              />{" "}
                              Photo/Video
                            </li>
                            <li className="bg-soft-primary rounded p-2 pointer d-flex align-items-center me-3 mb-md-0 mb-2">
                              <img
                                src={small2}
                                alt="icon"
                                className="img-fluid me-2"
                              />{" "}
                              Tag Friend
                            </li>
                            <li className="bg-soft-primary rounded p-2 pointer d-flex align-items-center me-3">
                              <img
                                src={small3}
                                alt="icon"
                                className="img-fluid me-2"
                              />{" "}
                              Feeling/Activity
                            </li>
                            <li>
                              <Button variant="soft-primary">
                                <div className="card-header-toolbar d-flex align-items-center">
                                  <Dropdown>
                                    <Dropdown.Toggle as="div" className="lh-1">
                                      <span className="material-symbols-outlined">
                                        more_horiz
                                      </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        onClick={handleShow}
                                        href="#"
                                      >
                                        Check in
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={handleShow}
                                        href="#"
                                      >
                                        Live Video
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={handleShow}
                                        href="#"
                                      >
                                        Gif
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={handleShow}
                                        href="#"
                                      >
                                        Watch Party
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={handleShow}
                                        href="#"
                                      >
                                        Play with Friend
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </Button>
                            </li>
                          </ul>
                        </Card.Body>
                        <Modal show={show} onHide={handleClose} size="lg">
                          <Modal.Header
                            className="d-flex justify-content-between"
                            closeButton
                          >
                            <h5 className="modal-title" id="post-modalLabel">
                              Create Post
                            </h5>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="d-flex align-items-center">
                              <div className="user-img">
                                <img
                                  src={img5}
                                  alt="userimg"
                                  className="avatar-60 rounded-circle img-fluid"
                                />
                              </div>
                              <Form className="post-text ms-3 w-100" action="">
                                <Form.Control
                                  type="text"
                                  className="rounded"
                                  placeholder="Write something here..."
                                  style={{ border: "none" }}
                                />
                              </Form>
                            </div>
                            <hr />
                            <ul className="d-flex flex-wrap align-items-center list-inline m-0 p-0">
                              <Col md="6" as="li" className="mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                  <Link to="#"></Link>
                                  <img
                                    src={small1}
                                    alt="icon"
                                    className="img-fluid"
                                  />{" "}
                                  Photo/Video
                                </div>
                              </Col>
                              <Col md="6" as="li" className="mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                  <Link to="#"></Link>
                                  <img
                                    src={small2}
                                    alt="icon"
                                    className="img-fluid"
                                  />{" "}
                                  Tag Friend
                                </div>
                              </Col>
                              <Col md="6" as="li" className="mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                  <Link to="#"></Link>
                                  <img
                                    src={small3}
                                    alt="icon"
                                    className="img-fluid"
                                  />{" "}
                                  Feeling/Activity
                                </div>
                              </Col>
                              <Col md="6" as="li" className="mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                  <Link to="#"></Link>
                                  <img
                                    src={small4}
                                    alt="icon"
                                    className="img-fluid"
                                  />{" "}
                                  Check in
                                </div>
                              </Col>
                              <Col md="6" as="li" className="mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                  <Link to="#"></Link>
                                  <img
                                    src={small5}
                                    alt="icon"
                                    className="img-fluid"
                                  />{" "}
                                  Live Video
                                </div>
                              </Col>
                              <Col md="6" as="li" className="mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                  <Link to="#"></Link>
                                  <img
                                    src={small6}
                                    alt="icon"
                                    className="img-fluid"
                                  />{" "}
                                  Gif
                                </div>
                              </Col>
                              <Col md="6" as="li" className="mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                  <Link to="#"></Link>
                                  <img
                                    src={small7}
                                    alt="icon"
                                    className="img-fluid"
                                  />{" "}
                                  Watch Party
                                </div>
                              </Col>
                              <Col md="6" as="li" className="mb-3">
                                <div className="bg-soft-primary rounded p-2 pointer me-3">
                                  <Link to="#"></Link>
                                  <img
                                    src={small8}
                                    alt="icon"
                                    className="img-fluid"
                                  />{" "}
                                  Play with Friends
                                </div>
                              </Col>
                            </ul>
                            <hr />
                            <div className="other-option">
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <div className="user-img me-3">
                                    <img
                                      src={user9}
                                      alt="userimg"
                                      className="avatar-60 rounded-circle img-fluid"
                                    />
                                  </div>
                                  <h6>Your Story</h6>
                                </div>
                                <div className="card-post-toolbar">
                                  <Dropdown>
                                    <Dropdown.Toggle>
                                      <span>Friend</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="m-0 p-0">
                                      <Dropdown.Item className="p-3" href="#">
                                        <div className="d-flex align-items-top">
                                          <i className="ri-save-line h4"></i>
                                          <div className="data ms-2">
                                            <h6>Public</h6>
                                            <p className="mb-0">
                                              Anyone on or off Facebook
                                            </p>
                                          </div>
                                        </div>
                                      </Dropdown.Item>
                                      <Dropdown.Item className="p-3" href="#">
                                        <div className="d-flex align-items-top">
                                          <i className="ri-close-circle-line h4"></i>
                                          <div className="data ms-2">
                                            <h6>Friends</h6>
                                            <p className="mb-0">
                                              Your Friend on facebook
                                            </p>
                                          </div>
                                        </div>
                                      </Dropdown.Item>
                                      <Dropdown.Item className="p-3" href="#">
                                        <div className="d-flex align-items-top">
                                          <i className="ri-user-unfollow-line h4"></i>
                                          <div className="data ms-2">
                                            <h6>Friends except</h6>
                                            <p className="mb-0">
                                              Don't show to some friends
                                            </p>
                                          </div>
                                        </div>
                                      </Dropdown.Item>
                                      <Dropdown.Item className="p-3" href="#">
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
                      </Card>       
                      <Card>
                        <Card.Body>
                          {groupPosts?.data?.map((post, index) => (
                            <PostItem
                              key={index} // Dùng index hoặc một ID duy nhất nếu có
                              post={post}
                            />
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4">
                      <Card>
                        <div className="card-header d-flex justify-content-between">
                          <div className="header-title">
                            <h4 className="card-title">Members</h4>
                          </div>
                        </div>
                        <Card.Body>
                          <ul className="media-story list-inline m-0 p-0">
                            {oldData?.admin_id && (
                              <li
                                className="d-flex mb-4 align-items-center"
                                key="admin"
                              >
                                <img
                                  className="rounded-circle img-fluid"
                                  src={
                                    oldData?.admin_id?.profile_picture || user1
                                  } // Use default image if no profile picture
                                  alt="profile-img"
                                />
                                <div className="stories-data ms-3">
                                  <h5>
                                    {oldData?.admin_id?.username || "Admin"}
                                  </h5>
                                  <p className="mb-0">Admin</p>
                                </div>
                              </li>
                            )}

                            {validGroupMembers
                              .filter(
                                (member) =>
                                  member?.users_id?.documentId !==
                                  oldData?.admin_id?.documentId
                              ) // Exclude admin from members
                              .slice(0, 8) // Change slice to show 8 members instead of 6
                              .map((member, index) => (
                                <li
                                  className="d-flex mb-4 align-items-center"
                                  key={index}
                                >
                                  <img
                                    className="rounded-circle img-fluid"
                                    src={
                                      member?.users_id?.profile_picture || user1
                                    } // Use user1 as fallback
                                    alt="profile-img"
                                  />
                                  <div className="stories-data ms-3">
                                    <h5>
                                      {member?.users_id?.username ||
                                        "Anonymous"}
                                    </h5>
                                    <p className="mb-0">Joined recently</p>
                                  </div>
                                </li>
                              ))}
                          </ul>
                          <Nav>
                            <Nav.Item>
                              <Nav.Link
                                eventKey="f2"
                                className="btn btn-primary d-block mt-3"
                                href="#"
                              >
                                See All
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Card.Body>
                      </Card>
                      <Card>
                        <Card.Header className="card-header d-flex justify-content-between">
                          <div className="header-title">
                            <h4 className="card-title">About</h4>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <ul className="list-inline p-0 m-0">
                            <li className="mb-3">
                              <p className="mb-0">{oldData?.description}</p>
                            </li>
                            <li className="mb-3">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <i className="material-symbols-outlined">
                                    lock
                                  </i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6>Private</h6>
                                  <p className="mb-0">
                                    Success in slowing economic activity.
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li className="mb-3">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <i className="material-symbols-outlined">
                                    visibility
                                  </i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6>Visible</h6>
                                  <p className="mb-0">
                                    Various versions have evolved over the years
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <i className="material-symbols-outlined">
                                    group
                                  </i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6>General group</h6>
                                  <p className="mb-0">
                                    There are many variations of passages
                                  </p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="f2">
                  <Row>
                    {oldData?.admin_id && (
                      <Col md={6}>
                        <Card className=" card-block card-stretch card-height">
                          <Card.Body className=" profile-page p-0">
                            <div className="profile-header-image">
                              <div className="cover-container">
                                <img
                                  loading="lazy"
                                  src={img15}
                                  alt="profile-bg"
                                  className="rounded img-fluid w-100"
                                />
                              </div>
                              <div className="profile-info p-4">
                                <div className="user-detail">
                                  <div className="d-flex flex-wrap justify-content-between align-items-start">
                                    <div className="profile-detail d-flex">
                                      <div className="profile-img pe-4">
                                        <img
                                          loading="lazy"
                                          src={
                                            oldData?.admin_id
                                              ?.profile_picture || user1
                                          }
                                          alt="profile-img"
                                          className="avatar-130 img-fluid"
                                        />
                                      </div>
                                      <div className="user-data-block">
                                        <h4>
                                          <Link to="/dashboard/app/friend-profile">
                                            {oldData?.admin_id?.username ||
                                              "Admin"}
                                          </Link>
                                        </h4>
                                        <h6>Admin</h6>
                                      </div>
                                    </div>
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                    >
                                      Following
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                    {validGroupMembers
                      .filter(
                        (member) =>
                          member?.users_id?.documentId !==
                          oldData?.admin_id?.documentId // Exclude admin from members
                      )
                      .map((member, index) => (
                        <Col md={6}>
                          <Card className=" card-block card-stretch card-height">
                            <Card.Body className=" profile-page p-0">
                              <div className="profile-header-image">
                                <div className="cover-container">
                                  <img
                                    loading="lazy"
                                    src={images[index % images.length]}
                                    alt="profile-bg"
                                    className="rounded img-fluid w-100"
                                  />
                                </div>
                                <div className="profile-info p-4">
                                  <div className="user-detail">
                                    <div className="d-flex flex-wrap justify-content-between align-items-start">
                                      <div className="profile-detail d-flex">
                                        <div className="profile-img pe-4">
                                          <img
                                            loading="lazy"
                                            src={
                                              member?.users_id
                                                ?.profile_picture || user1
                                            }
                                            alt="profile-img"
                                            className="avatar-130 img-fluid"
                                          />
                                        </div>
                                        <div className="user-data-block">
                                          <h4>
                                            <Link to="/dashboard/app/friend-profile">
                                              {member?.users_id?.username ||
                                                "Anonymous"}
                                            </Link>
                                          </h4>
                                          <h6>Member</h6>
                                        </div>
                                      </div>
                                      <button
                                        type="submit"
                                        className="btn btn-primary"
                                      >
                                        Following
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default GroupDetail;
