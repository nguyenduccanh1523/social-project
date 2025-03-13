import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Dropdown,
  Button,
  Tab,
  Nav,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import PostItem from "../postItem";
import { useQuery } from '@tanstack/react-query';
import { MdGroup, MdGroups, MdChat } from "react-icons/md";


//image
import user1 from "../../../../assets/images/user/05.jpg";
import small1 from "../../../../assets/images/small/07.png";
import small2 from "../../../../assets/images/small/08.png";
import small3 from "../../../../assets/images/small/09.png";
import img15 from "../../../../assets/images/page-img/profile-bg4.jpg";
import img16 from "../../../../assets/images/page-img/profile-bg5.jpg";
import img12 from "../../../../assets/images/page-img/profile-bg6.jpg";
import img13 from "../../../../assets/images/page-img/profile-bg7.jpg";
import img14 from "../../../../assets/images/page-img/profile-bg9.jpg";

import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../Share/createPost";
import ActionGroup from "./actionGroup";
import { convertToVietnamDate } from "../../others/format";
import { formatDistanceToNow } from "date-fns";
import IconEdit from "../../icons/uiverse/iconEdit";
import EditGroup from "./editGroup";
import InviteFriendsModal from "./actionGroup/modalInvited";
import MemberRequest from "./actionGroup/memberRequest";
import { apiGetGroupMembers } from "../../../../services/groupServices/groupMembers";
import { apiGetGroupPost } from "../../../../services/groupServices/groupPost";
import { apiGetGroupRequest } from "../../../../services/groupServices/groupRequest";
import { apiFindOneGroup } from "../../../../services/groupServices/group";


const GroupDetail = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const location = useLocation();
  const { documentId } = location?.state || {};
  const { profile } = useSelector((state) => state.root.user || {});
  const images = [img12, img13, img14, img15, img16];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inviteModalShow, setInviteModalShow] = useState(false);


  const { data: GroupDatas } = useQuery({
    queryKey: ['groups', documentId],
    queryFn: () => apiFindOneGroup({ groupId: documentId }),
    enabled: !!documentId,
    staleTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
  });
  //console.log("GroupDatas", GroupDatas);
  const oldData = GroupDatas?.data?.data || {};

  const { data: groupMembersData } = useQuery({
    queryKey: ['groupMembers', oldData?.documentId],
    queryFn: () => apiGetGroupMembers({ groupId: oldData.documentId }),
    enabled: !!oldData?.documentId,
    staleTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const { data: groupPostsData } = useQuery({
    queryKey: ['groupPosts', oldData?.documentId],
    queryFn: () => apiGetGroupPost({ groupId: oldData.documentId }),
    enabled: !!oldData?.documentId,
    staleTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const {data: groupRequestsData} = useQuery({
    queryKey: ['groupRequests', oldData?.documentId],
    queryFn: () => apiGetGroupRequest({ groupId: oldData.documentId }),
    enabled: !!oldData?.documentId,
    staleTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
  });



  const groupMembers = groupMembersData?.data?.data || [];
  const groupPosts = groupPostsData?.data?.data || [];
  const groupRequests = groupRequestsData?.data?.data || [];
  const validGroupMembers = Array.isArray(groupMembers) ? groupMembers : [];


   //console.log("oldData  ", groupRequests);
  // console.log("groupMembers", groupMembers);
  // console.log("groupPosts", groupPosts);

  return (
    <>
      <div className="header-for-bg">
        <div className="background-header position-relative text-center" >
          <img src={oldData?.media?.file_path} className="img-fluid" alt="header-bg" style={{ width: '1000px', height: '350px' }} />
          <div className="title-on-header">
          </div>
        </div>
      </div>
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Col lg="12">
              <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                <div className="group-info d-flex align-items-center">
                  <div className="info">
                    <h4>{oldData?.group_name}</h4>
                    <p className="mb-0 text-primary align-items-center d-flex gap-2">
                      <span className="material-symbols-outlined">
                        {oldData?.type?.name === "private" ? "lock" : "public"}
                      </span>
                      {oldData?.type?.name === "private" ? "Private Group" : "Public Group"} .{" "}
                      {oldData?.member_ids?.length} members
                    </p>
                    <div className="iq-media-group me-3 mt-2 ">
                      {validGroupMembers
                        .slice(0, 8) // Change slice to show 8 members instead of 6
                        .map((member, index) => (
                          <Link to="#" className="iq-media" key={member?.users_id?.documentId || index}>
                            <img
                              className="img-fluid avatar-40 rounded-circle"
                              src={member?.users_id?.profile_picture || user1} // Use user1 as fallback
                              alt="profile-img"
                            />
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="group-member d-flex align-items-center mt-2 mt-md-0">
                  <Button variant="primary" className="mb-2 me-2 d-flex align-items-center" onClick={() => setInviteModalShow(true)}>
                    <span className="material-symbols-outlined">
                      add_circle
                    </span>Invite
                  </Button>
                  
                  <Button variant="danger" className="mb-2 me-2 d-flex align-items-center">
                    <span className="material-symbols-outlined">
                      share
                    </span>Share
                  </Button>

                  <Dropdown>
                    <Dropdown.Toggle as={Button} variant="secondary" className="mb-2 d-flex align-items-center gap-1">
                      <span className="material-symbols-outlined">groups</span>
                      Participated
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <ActionGroup oldData={oldData} profile={profile} />
                    </Dropdown.Menu>
                  </Dropdown>
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
                      <Nav.Link eventKey="f3" href="#">
                        Introduce
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="col-12 col-sm-2 p-0">
                      <Nav.Link eventKey="f1" href="#">
                        Dicussion
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="col-12 col-sm-2 p-0">
                      <Nav.Link className="" eventKey="f2" href="#">
                        Members
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Card>
              <Tab.Content className="forum-content">
                <Tab.Pane eventKey="f3">
                  <Row className="justify-content-center">
                    <Col lg="9">
                      <Card>
                        <Card.Header className="card-header d-flex justify-content-between">
                          <div className="header-title">
                            <h4 className="card-title">About this group</h4>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <ul className="list-inline p-0 m-0">
                            <li className="mb-3">
                              <p className="mb-0">{oldData?.description}</p>
                            </li>
                            <li className="mb-3">
                              {oldData?.type?.name === "private" ? (
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <i className="material-symbols-outlined">
                                      lock
                                    </i>
                                  </div>
                                  <div className="flex-grow-1 ms-3">
                                    <h6>Private</h6>
                                    <p className="mb-0">
                                      Only members can see everyone in the group and what they post.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <i className="material-symbols-outlined">
                                      public
                                    </i>
                                  </div>
                                  <div className="flex-grow-1 ms-3">
                                    <h6>Public</h6>
                                    <p className="mb-0">
                                      Anyone can see who's in the group and what they post.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </li>
                            <li className="mb-3">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <i className="material-symbols-outlined">
                                    visibility
                                  </i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6>Display</h6>
                                  <p className="mb-0">
                                    Anyone can find this group.
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <i className="material-symbols-outlined">
                                    history
                                  </i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6>History</h6>
                                  <p className="mb-0">
                                    {oldData?.createdAt && oldData?.updatedAt ? (
                                      <>
                                        Group created on {convertToVietnamDate(oldData?.createdAt)}. Last name changed on {convertToVietnamDate(oldData?.updatedAt)}.
                                      </>
                                    ) : (
                                      "Loading history..."
                                    )}
                                  </p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </Card.Body>
                      </Card>
                      <Card>
                        <Card.Header className="card-header d-flex justify-content-between">
                          <div className="header-title">
                            <h4 className="card-title">Work</h4>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <ul className="list-inline p-0 m-0">
                            <li className="mb-3">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <MdChat style={{ fontSize: '22px' }} />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6>There are {oldData?.posts?.length} posts</h6>
                                  <p className="mb-0">
                                    News post.
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li className="mb-3">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <MdGroup style={{ fontSize: '22px' }} />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6>Total {oldData?.member_ids?.length} members</h6>
                                  <p className="mb-0">
                                    Anyone can find this group.
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <MdGroups style={{ fontSize: '22px' }} />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6>Date Created: </h6>
                                  <p className="mb-0">
                                    {oldData?.createdAt && oldData?.updatedAt ? (
                                      <>
                                        {formatDistanceToNow(new Date(oldData?.createdAt), { addSuffix: true })}
                                      </>
                                    ) : (
                                      "Loading history..."
                                    )}
                                  </p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                    {oldData?.admin_id?.documentId === profile?.documentId && (
                      <Col lg="1" className="d-flex align-items-center">
                        <div onClick={() => setDrawerOpen(true)}>
                          <IconEdit />
                        </div>
                      </Col>
                    )}
                    <EditGroup oldData={oldData} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
                  </Row>
                </Tab.Pane>
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
                                src={profile?.profile_picture}
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
                          <ul className=" post-opt-block d-flex list-inline m-0 p-0 flex-wrap" onClick={handleShow}>
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
                                  </Dropdown>
                                </div>
                              </Button>
                            </li>
                          </ul>
                        </Card.Body>
                        <CreatePost show={show} handleClose={handleClose} profile={profile} group={oldData} />
                      </Card>
                      <Card>
                        <Card.Body>
                          {groupPosts?.map((post, index) => (
                            <PostItem
                              key={post?.documentId || index} // Use post documentId or index as key
                              post={post}
                            />
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg="4">
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
                              {oldData?.type?.name === "private" ? (
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <i className="material-symbols-outlined">
                                      lock
                                    </i>
                                  </div>
                                  <div className="flex-grow-1 ms-3">
                                    <h6>Private</h6>
                                    <p className="mb-0">
                                      Only members can see everyone in the group and what they post.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <i className="material-symbols-outlined">
                                      public
                                    </i>
                                  </div>
                                  <div className="flex-grow-1 ms-3">
                                    <h6>Public</h6>
                                    <p className="mb-0">
                                      Anyone can see who's in the group and what they post.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </li>
                            <li className="mb-3">
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <i className="material-symbols-outlined">
                                    visibility
                                  </i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6>Display</h6>
                                  <p className="mb-0">
                                    Anyone can find this group.
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
                  {groupRequests.length > 0 && oldData?.admin_id?.documentId === profile?.documentId && <MemberRequest requests={groupRequests} />}
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
                        <Col md={6} key={member?.users_id?.documentId || index}>
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
      <InviteFriendsModal oldData={oldData} profile={profile} show={inviteModalShow} handleClose={() => setInviteModalShow(false)} />
    </>
  );
};

export default GroupDetail;


