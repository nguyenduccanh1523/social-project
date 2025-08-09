import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Container,
  Dropdown,
  Nav,
  Tab,
  OverlayTrigger,
  Tooltip,
  Button,
  Modal,
} from "react-bootstrap";
import Card from "../../../components/Card";
import CustomToggle from "../../../components/dropdowns";
import ShareOffcanvas from "../../../components/share-offcanvas";
import { Link } from "react-router-dom";
import ReactFsLightbox from "fslightbox-react";
import Swal from "sweetalert2";
import "react-toastify/ReactToastify.css";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetUserById } from "../../../services/user";
import { apiUpdateFriendStatus } from "../../../services/friend";

// images
import img1 from "../../../assets/images/page-img/profile-bg1.jpg";
import img3 from "../../../assets/images/icon/08.png";
import img4 from "../../../assets/images/icon/09.png";
import img5 from "../../../assets/images/icon/10.png";
import img6 from "../../../assets/images/icon/11.png";
import img7 from "../../../assets/images/icon/12.png";
import img8 from "../../../assets/images/icon/13.png";
import g1 from "../../../assets/images/page-img/g1.jpg";
import g2 from "../../../assets/images/page-img/g2.jpg";
import g3 from "../../../assets/images/page-img/g3.jpg";
import g4 from "../../../assets/images/page-img/g4.jpg";
import g5 from "../../../assets/images/page-img/g5.jpg";
import g6 from "../../../assets/images/page-img/g6.jpg";
import g7 from "../../../assets/images/page-img/g7.jpg";
import g8 from "../../../assets/images/page-img/g8.jpg";
import g9 from "../../../assets/images/page-img/g9.jpg";
import loader from "../../../assets/images/page-img/page-load-loader.gif";
import small07 from "../../../assets/images/small/07.png";
import small08 from "../../../assets/images/small/08.png";
import small09 from "../../../assets/images/small/09.png";
import img51 from "../../../assets/images/page-img/51.jpg";
import img52 from "../../../assets/images/page-img/52.jpg";
import img53 from "../../../assets/images/page-img/53.jpg";
import img54 from "../../../assets/images/page-img/54.jpg";
import img55 from "../../../assets/images/page-img/55.jpg";
import img56 from "../../../assets/images/page-img/56.jpg";
import img57 from "../../../assets/images/page-img/57.jpg";
import img58 from "../../../assets/images/page-img/58.jpg";
import img59 from "../../../assets/images/page-img/59.jpg";
import img60 from "../../../assets/images/page-img/60.jpg";
import img61 from "../../../assets/images/page-img/61.jpg";
import img62 from "../../../assets/images/page-img/62.jpg";
import img64 from "../../../assets/images/page-img/64.jpg";
import img65 from "../../../assets/images/page-img/65.jpg";
import img63 from "../../../assets/images/page-img/63.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  fetchUserSocials,
  fetchFriendAccepted,
  fetchFriendsByDate,
  fetchFriendRequest,
  fetchFriendSent,
  confirmFriend,
  deleteFriend,
} from "../../../actions/actions";
import PostProfile from "../component/Profile/postProfile";
import CreatePost from "../component/Share/createPost";
import { apiGetFriendAccepted, apiGetFriendsByDate, apiGetFriendRequest, apiGetFriendSent } from "../../../services/friend";


// Fslightbox plugin
const FsLightbox = ReactFsLightbox.default
  ? ReactFsLightbox.default
  : ReactFsLightbox;

const UserProfile = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();
  const toastId = "confirm-toast";
  const queryClient = useQueryClient();

  
  // const { profile } = useSelector((state) => state.root.user || {});
  const { user } = useSelector((state) => state.root.auth || {});
  const { token } = useSelector((state) => state.root.auth || {});

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', user?.documentId, token],
    queryFn: () => apiGetUserById({ userId: user?.documentId, token }),
    enabled: !!user?.documentId && !!token,
    onSuccess: (data) => {
      console.log("User data fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
      toast.error("Không thể lấy thông tin người dùng");
    }
  });

  const { data: userAcceptData, isLoading: userAcceptLoading } = useQuery({
    queryKey: ['userAccept', user?.documentId, token],
    queryFn: () => apiGetFriendAccepted({ documentId: user?.documentId, token }),
    enabled: !!user?.documentId && !!token,
    onSuccess: (data) => {
      console.log("User data fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
    }
  });

  const { data: friendsByDateData, isLoading: friendsByDateLoading } = useQuery({
    queryKey: ['friendsByDate', user?.documentId, token],
    queryFn: () => apiGetFriendsByDate({ documentId: user?.documentId, token }),
    enabled: !!user?.documentId && !!token,
  });

  const { data: friendRequestData, isLoading: friendRequestLoading } = useQuery({
    queryKey: ['friendRequest', user?.documentId, token],
    queryFn: () => apiGetFriendRequest({ documentId: user?.documentId, token }),
    enabled: !!user?.documentId && !!token,
  });
  

  const users = userData?.data?.data || {};
  const userAccepts = userAcceptData?.data?.data || {};
  const friendsByDate = friendsByDateData?.data?.data || {};
  const friendRequest = friendRequestData?.data?.data || {};

  const { socials } = useSelector((state) => state.root.userSocials || {});
  // const { acceptedFriends } = useSelector((state) => state.root.friend || {});

  const document = user?.documentId;

  useEffect(() => {
    if (document) {
      dispatch(fetchUserSocials(document, token));
    }
  }, [document, dispatch]);

  const handleConfirm = async (friendId) => {
    try {
      // Sử dụng API update friend status với trạng thái accept
      await apiUpdateFriendStatus({ 
        friendId, 
        status_action_id: "vr8ygnd5y17xs4vcq6du3q7c", 
        token 
      });


      // Hiển thị thông báo thành công
      toast.success("Friend request accepted successfully!", {
        toastId,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      queryClient.invalidateQueries('friendRequest');
      queryClient.invalidateQueries('friendAccepted');
    } catch (error) {
      // Hiển thị thông báo lỗi
      toast.error("Failed to accept friend request.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
          // Sử dụng API update friend status với trạng thái refuse
          await apiUpdateFriendStatus({ 
            friendId, 
            status_action_id: "aei7fjtmxrzz3hkmorgwy0gm", 
            token 
          });
          
          Swal.fire(
            "Rejected!",
            "Friend request has been rejected.",
            "success"
          );
          queryClient.invalidateQueries('friendRequest');
          queryClient.invalidateQueries('friendAccepted');
        } catch (error) {
          Swal.fire("Error!", "Failed to reject the friend request.", "error");
          console.error("Error rejecting friend:", error);
        }
      }
    });
  };

  const [imageController, setImageController] = useState({
    toggler: false,
    slide: 1,
  });

  function imageOnSlide(number) {
    setImageController({
      toggler: !imageController.toggler,
      slide: number,
    });
  }

  return (
    <>
      <FsLightbox
        toggler={imageController.toggler}
        sources={[
          g1,
          g2,
          g3,
          g4,
          g5,
          g6,
          g7,
          g8,
          g9,
          img51,
          img52,
          img53,
          img54,
          img55,
          img56,
          img57,
          img58,
          img59,
          img60,
          img61,
          img62,
          img63,
          img64,
          img65,
          img51,
          img52,
          img53,
          img54,
          img55,
          img56,
          img57,
          img58,
          img51,
          img52,
          img53,
          img54,
          img55,
          img56,
          img57,
          img58,
          img59,
          img60,
        ]}
        slide={imageController.slide}
      />
      <Container>
        <Row>
          <Col sm={12}>
            <Card>
              <Card.Body className=" profile-page p-0">
                <div className="profile-header">
                  <div className="position-relative">
                    <img
                      loading="lazy"
                      src={img1}
                      alt="profile-bg"
                      className="rounded img-fluid"
                    />
                    <ul className="header-nav list-inline d-flex flex-wrap justify-end p-0 m-0">
                      <li>
                        <Link to="#" className="material-symbols-outlined">
                          edit
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="material-symbols-outlined">
                          settings
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="user-detail text-center mb-3">
                    <div className="profile-img">
                      <img
                        loading="lazy"
                        src={users?.avatarMedia?.file_path}
                        alt="profile-img1"
                        className="avatar-130 img-fluid"
                      />
                    </div>
                    <div className="profile-detail">
                      <h2 style={{fontWeight: 'bold'}}>{users?.fullname}</h2>
                    </div>
                  </div>
                  <div className="profile-info p-3 d-flex align-items-center justify-content-between position-relative">
                    <div className="social-links">
                      <ul className="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
                        {socials?.data?.map((social, index) => (
                          <li className="text-center pe-3" key={index}>
                            <Link
                              to={social.account_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                loading="lazy"
                                src={
                                  social.platform === "facebook"
                                    ? img3 // Đường dẫn ảnh Facebook
                                    : social.platform === "instagram"
                                    ? img5 // Đường dẫn ảnh Instagram
                                    : social.platform === "youtube"
                                    ? img7 // Đường dẫn ảnh YouTube
                                    : social.platform === "twitter"
                                    ? img4 // Đường dẫn ảnh Twitter
                                    : social.platform === "linkedin"
                                    ? img8 // Đường dẫn ảnh LinkedIn
                                    : img6 // Đường dẫn ảnh mặc định
                                }
                                className="img-fluid rounded"
                                alt={social.platform}
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="social-info">
                      <ul className="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
                        <li className="text-center ps-3">
                          <h4 style={{fontWeight: 'bold'}}>Posts</h4>
                          <b className="mb-0">690</b>
                        </li>
                        <li className="text-center ps-3">
                          <h4 style={{fontWeight: 'bold'}}>Friends</h4>
                          <b className="mb-0">{userAccepts.length}</b>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Card className="p-0">
              <Card.Body className="p-0">
                <div className="user-tabing">
                  <Nav
                    as="ul"
                    variant="pills"
                    className="d-flex align-items-center justify-content-center profile-feed-items p-0 m-0"
                  >
                    <Nav.Item as="li" className=" col-12 col-sm-3 p-0 ">
                      <Nav.Link
                        href="#pills-timeline-tab"
                        eventKey="first"
                        role="button"
                        className=" text-center p-3"
                      >
                        Timeline
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="col-12 col-sm-3 p-0">
                      <Nav.Link
                        href="#pills-about-tab"
                        eventKey="second"
                        role="button"
                        className="text-center p-3"
                      >
                        About
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className=" col-12 col-sm-3 p-0">
                      <Nav.Link
                        href="#pills-friends-tab"
                        eventKey="third"
                        role="button"
                        className="text-center p-3"
                      >
                        Friends
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="col-12 col-sm-3 p-0">
                      <Nav.Link
                        href="#pills-photos-tab"
                        eventKey="forth"
                        role="button"
                        className="text-center p-3"
                      >
                        Photos
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Card.Body>
            </Card>
            <Col sm={12}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Card.Body className=" p-0">
                    <Row>
                      <Col lg={4}>
                        <Card>
                          <div className="card-header d-flex justify-content-between">
                            <div className="header-title">
                              <h4 className="card-title">Photos</h4>
                            </div>
                            <div className="card-header-toolbar d-flex align-items-center">
                              <p className="m-0">
                                <Link to="#">Add Photo </Link>
                              </p>
                            </div>
                          </div>
                          <Card.Body>
                            <ul className="profile-img-gallary p-0 m-0 list-unstyled">
                              <li>
                                <Link onClick={() => imageOnSlide(1)} to="#">
                                  <img
                                    loading="lazy"
                                    src={g1}
                                    alt="gallary"
                                    className="img-fluid"
                                  />
                                </Link>
                              </li>
                              <li>
                                <Link onClick={() => imageOnSlide(2)} to="#">
                                  <img
                                    loading="lazy"
                                    src={g2}
                                    alt="gallary"
                                    className="img-fluid"
                                  />
                                </Link>
                              </li>
                              <li>
                                <Link onClick={() => imageOnSlide(3)} to="#">
                                  <img
                                    loading="lazy"
                                    src={g3}
                                    alt="gallary"
                                    className="img-fluid"
                                  />
                                </Link>
                              </li>
                              <li>
                                <Link onClick={() => imageOnSlide(4)} to="#">
                                  <img
                                    loading="lazy"
                                    src={g4}
                                    alt="gallary"
                                    className="img-fluid"
                                  />
                                </Link>
                              </li>
                              <li>
                                <Link onClick={() => imageOnSlide(5)} to="#">
                                  <img
                                    loading="lazy"
                                    src={g5}
                                    alt="gallary"
                                    className="img-fluid"
                                  />
                                </Link>
                              </li>
                              <li>
                                <Link onClick={() => imageOnSlide(6)} to="#">
                                  <img
                                    loading="lazy"
                                    src={g6}
                                    alt="gallary"
                                    className="img-fluid"
                                  />
                                </Link>
                              </li>
                              <li>
                                <Link onClick={() => imageOnSlide(7)} to="#">
                                  <img
                                    loading="lazy"
                                    src={g7}
                                    alt="gallary"
                                    className="img-fluid"
                                  />
                                </Link>
                              </li>
                              <li>
                                <Link onClick={() => imageOnSlide(8)} to="#">
                                  <img
                                    loading="lazy"
                                    src={g8}
                                    alt="gallary"
                                    className="img-fluid"
                                  />
                                </Link>
                              </li>
                              <li>
                                <Link onClick={() => imageOnSlide(9)} to="#">
                                  <img
                                    loading="lazy"
                                    src={g9}
                                    alt="gallary"
                                    className="img-fluid"
                                  />
                                </Link>
                              </li>
                            </ul>
                          </Card.Body>
                        </Card>
                        <Card>
                          <div className="card-header d-flex justify-content-between">
                            <div className="header-title">
                              <h4 className="card-title">Friends</h4>
                            </div>
                            <div className="card-header-toolbar d-flex align-items-center">
                              <p className="m-0">
                                <Link to="javacsript:void();">Add New </Link>
                              </p>
                            </div>
                          </div>
                          <Card.Body>
                            <ul className="profile-img-gallary p-0 m-0 list-unstyled">
                              {userAccepts &&
                              userAccepts?.length > 0 ? (
                                userAccepts.map((friend, index) => {
                                  const friendData =
                                    friend?.user?.documentId === users?.documentId
                                      ? friend?.friend
                                      : friend?.user;

                                  return (
                                    <li key={friend?.id || index}>
                                      <Link to="#">
                                        <img
                                          loading="lazy"
                                          src={friendData?.avatarMedia?.file_path}
                                          alt={friendData?.fullname}
                                          className="img-fluid"
                                          style={{
                                            width: "100px", // Đặt kích thước cố định
                                            height: "100px", // Đặt kích thước cố định
                                            objectFit: "cover", // Đảm bảo ảnh vừa khung
                                            borderRadius: "50%", // Làm tròn ảnh
                                          }}
                                        />
                                      </Link>
                                      <h6 className="mt-2 text-center">
                                        {friendData?.fullname}
                                      </h6>
                                    </li>
                                  );
                                })
                              ) : (
                                <li className="text-center w-100">
                                  <p>No Friends</p>
                                </li>
                              )}
                            </ul>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={8}>
                        <Card id="post-modal-data">
                          <div className="card-header d-flex justify-content-between">
                            <div className="header-title">
                              <h4 className="card-title">Create Post</h4>
                            </div>
                          </div>
                          <Card.Body>
                            <div className="d-flex align-items-center">
                              <div className="user-img">
                                <img
                                  loading="lazy"
                                  src={users?.avatarMedia?.file_path}
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
                            <ul className=" post-opt-block d-flex list-inline m-0 p-0 flex-wrap" onClick={handleShow} >
                              <li className="bg-soft-primary rounded p-2 pointer d-flex align-items-center me-3 mb-md-0 mb-2">
                                <img
                                  loading="lazy"
                                  src={small07}
                                  alt="icon"
                                  className="img-fluid me-2"
                                />{" "}
                                Photo/Video
                              </li>
                              <li className="bg-soft-primary rounded p-2 pointer d-flex align-items-center me-3 mb-md-0 mb-2">
                                <img
                                  loading="lazy"
                                  src={small08}
                                  alt="icon"
                                  className="img-fluid me-2"
                                />{" "}
                                Tag Friend
                              </li>
                              <li className="bg-soft-primary rounded p-2 pointer d-flex align-items-center me-3">
                                <img
                                  loading="lazy"
                                  src={small09}
                                  alt="icon"
                                  className="img-fluid me-2"
                                />{" "}
                                Feeling/Activity
                              </li>
                              <li className="bg-soft-primary rounded p-2 pointer text-center">
                                <div className="card-header-toolbar d-flex align-items-center">
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      as={CustomToggle}
                                      id="post-option"
                                    >
                                      <span className="material-symbols-outlined">
                                        more_horiz
                                      </span>
                                    </Dropdown.Toggle>
                                  </Dropdown>
                                </div>
                              </li>
                            </ul>
                          </Card.Body>
                          <CreatePost show={show} handleClose={handleClose} profile={users}/>
                        </Card>
                        <Card>
                          <Card.Body>
                            <PostProfile userId={users} />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Tab.Container
                    id="left-tabs-example"
                    defaultActiveKey="about1"
                  >
                    <Row>
                      <Col md={4}>
                        <Card>
                          <Card.Body>
                            <Nav
                              variant="pills"
                              className=" basic-info-items list-inline d-block p-0 m-0"
                            >
                              <Nav.Item>
                                <Nav.Link href="#" eventKey="about1">
                                  Contact and Basic Info
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link href="#" eventKey="about2">
                                  About
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={8} className=" ps-4">
                        <Card>
                          <Card.Body>
                            <Tab.Content>
                              <Tab.Pane eventKey="about1">
                                <h4>Personal Info</h4>
                                <hr />
                                <Row className="mb-2">
                                  <div className="col-3">
                                    <h6>Email:</h6>
                                  </div>
                                  <div className="col-9">
                                    <p className="mb-0">{users?.email}</p>
                                  </div>
                                </Row>
                                <Row className="mb-2">
                                  <div className="col-3">
                                    <h6>Mobile:</h6>
                                  </div>
                                  <div className="col-9">
                                    <p className="mb-0">{users?.phone}</p>
                                  </div>
                                </Row>
                                <Row className="mb-2">
                                  <div className="col-3">
                                    <h6>BirthDay:</h6>
                                  </div>
                                  <div className="col-9">
                                    <p className="mb-0">
                                      {new Date(
                                        users?.date_of_birth
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </Row>
                                <Row className="mb-2">
                                  <div className="col-3">
                                    <h6>Lives in:</h6>
                                  </div>
                                  <div className="col-9">
                                    <p className="mb-0">{users?.nation?.name}</p>
                                  </div>
                                </Row>
                                <Row className="mb-2">
                                  <div className="col-3">
                                    <h6>Gender:</h6>
                                  </div>
                                  <div className="col-9">
                                    <p className="mb-0">{users?.gender}</p>
                                  </div>
                                </Row>
                                <Row className="mb-2">
                                  <div className="col-3">
                                    <h6>language:</h6>
                                  </div>
                                  <div className="col-9">
                                    <p className="mb-0">{users?.language}</p>
                                  </div>
                                </Row>
                                <Row className="mb-2">
                                  <div className="col-3">
                                    <h6>Joined:</h6>
                                  </div>
                                  <div className="col-9">
                                    <p className="mb-0">
                                      {new Date(
                                        users?.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </Row>
                                <Row className="mb-2">
                                  <div className="col-3">
                                    <h6>Status:</h6>
                                  </div>
                                  <div className="col-9">
                                    <p className="mb-0">
                                      {users?.relationship_status}
                                    </p>
                                  </div>
                                </Row>
                                <h4 className="mt-2">
                                  Websites and Social Links
                                </h4>
                                <hr />
                                {socials?.data?.map((social, index) => (
                                  <Row className="mb-2" key={index}>
                                    <div className="col-3">
                                      <Link
                                        to={social.accountUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <img
                                          loading="lazy"
                                          src={
                                            social.platform ===
                                            "facebook"
                                              ? img3 // Thay bằng đường dẫn ảnh Facebook
                                              : social.platform ===
                                                "instagram"
                                              ? img5 // Thay bằng đường dẫn ảnh Twitter
                                              : social.platform ===
                                                "youtube"
                                              ? img7
                                              : social.platform ===
                                                "twitter"
                                              ? img4
                                              : social.platform ===
                                                "linkedin"
                                              ? img8
                                              : img6
                                          }
                                          className="img-fluid rounded"
                                          alt={social.platform}
                                        />
                                      </Link>
                                    </div>
                                    <div className="col-9">
                                      <p className="mb-0">
                                        {social.accountUrl}
                                      </p>
                                    </div>
                                  </Row>
                                ))}
                              </Tab.Pane>
                              <Tab.Pane eventKey="about2">
                                <h4 className="mt-2">Abouts</h4>
                                <hr />                             
                                <p>{user?.about || 'No About'} </p>
                              </Tab.Pane>
                            </Tab.Content>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Container>
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <Tab.Container
                    id="left-tabs-example"
                    defaultActiveKey="all-friends"
                  >
                    <Card>
                      <Card.Body>
                        <h2>Friends</h2>
                        <div className="friend-list-tab mt-2">
                          <Nav
                            variant="pills"
                            className=" d-flex align-items-center justify-content-left friend-list-items p-0 mb-2"
                          >
                            <Nav.Item>
                              <Nav.Link
                                href="#pill-all-friends"
                                eventKey="all-friends"
                              >
                                All Friends
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link
                                href="#pill-recently-add"
                                eventKey="recently-add"
                              >
                                Recently Added
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link
                                href="#pill-closefriends"
                                eventKey="closefriends"
                              >
                                {" "}
                                Friend Request
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link
                                href="#pill-following"
                                eventKey="friendsent"
                              >
                                Friend Sent
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                          <Tab.Content>
                            <Tab.Pane eventKey="all-friends">
                              <Card.Body className="p-0">
                                <Row>
                                  {userAccepts &&
                                  userAccepts?.length > 0 ? (
                                    userAccepts.map((friend, index) => {
                                      const friendData =
                                        friend?.user?.documentId === users?.documentId
                                          ? friend?.friend
                                          : friend?.user;

                                      return (
                                        <div
                                          className="col-md-6 col-lg-6 mb-3"
                                          key={`${
                                            friend?.documentId || "unknown"
                                          }-${index}`} // Sử dụng `friend.id` nếu có, nếu không thì dùng `index`
                                        >
                                          <div className="iq-friendlist-block">
                                            <div className="d-flex align-items-center justify-content-between">
                                              <div className="d-flex align-items-center">
                                                <Link to="#">
                                                  <img
                                                    loading="lazy"
                                                    src={
                                                      friendData?.avatarMedia?.file_path
                                                    }
                                                    alt="profile-img"
                                                    width={150}
                                                    height={150}
                                                    style={{
                                                      objectFit: "cover",
                                                      borderRadius: "8px",
                                                    }}
                                                  />
                                                </Link>
                                                <div className="friend-info ms-3">
                                                  <h5>
                                                    {friendData?.fullname}
                                                  </h5>
                                                  <p className="mb-0">
                                                    {friendData?.friendCount || 0}{" "}
                                                    friends
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="card-header-toolbar d-flex align-items-center">
                                                <Dropdown>
                                                  <Dropdown.Toggle variant="secondary me-2 d-flex align-items-center">
                                                    <i className="material-symbols-outlined me-2">
                                                      done
                                                    </i>
                                                    Friend
                                                  </Dropdown.Toggle>
                                                  <Dropdown.Menu className="dropdown-menu-right">
                                                    <Dropdown.Item href="#">
                                                      Get Notification
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#">
                                                      Close Friend
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#">
                                                      Unfollow
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#">
                                                      Unfriend
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#">
                                                      Block
                                                    </Dropdown.Item>
                                                  </Dropdown.Menu>
                                                </Dropdown>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="text-center w-100">
                                      <p>No Friends</p>{" "}
                                    </div>
                                  )}
                                </Row>
                              </Card.Body>
                            </Tab.Pane>
                            <Tab.Pane eventKey="recently-add">
                              <div className="card-body p-0">
                                <div className="row">
                                  {friendsByDate &&
                                  friendsByDate?.length > 0 ? (
                                    friendsByDate?.map((friend, index) => {
                                      const friendData =
                                        friend?.user?.documentId === users?.documentId
                                          ? friend?.friend
                                          : friend?.user;

                                      return (
                                        <div
                                          className="col-md-6 col-lg-6 mb-3"
                                          key={`${
                                            friend?.documentId || "unknown"
                                          }-${index}`} // Sử dụng `friend.id` nếu có, nếu không thì dùng `index`
                                        >
                                          <div className="iq-friendlist-block">
                                            <div className="d-flex align-items-center justify-content-between">
                                              <div className="d-flex align-items-center">
                                                <Link to="#">
                                                  <img
                                                    loading="lazy"
                                                    src={
                                                      friendData?.avatarMedia?.file_path
                                                    }
                                                    alt="profile-img"
                                                    width={150}
                                                    height={150}
                                                    style={{
                                                      objectFit: "cover",
                                                      borderRadius: "8px",
                                                    }}
                                                  />
                                                </Link>
                                                <div className="friend-info ms-3">
                                                  <h5>
                                                    {friendData?.fullname}
                                                  </h5>
                                                  <p className="mb-0">
                                                    {friendData?.friendCount || 0}{" "}
                                                    friends
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="card-header-toolbar d-flex align-items-center">
                                                <Dropdown>
                                                  <Dropdown.Toggle variant="secondary me-2 d-flex align-items-center">
                                                    <i className="material-symbols-outlined me-2">
                                                      done
                                                    </i>
                                                    Friend
                                                  </Dropdown.Toggle>
                                                  <Dropdown.Menu className="dropdown-menu-right">
                                                    <Dropdown.Item href="#">
                                                      Get Notification
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#">
                                                      Close Friend
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#">
                                                      Unfollow
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#">
                                                      Unfriend
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#">
                                                      Block
                                                    </Dropdown.Item>
                                                  </Dropdown.Menu>
                                                </Dropdown>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="text-center w-100">
                                      <p>No Friends</p>{" "}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="closefriends">
                              <div className="card-body p-0">
                                <div className="row">
                                  {friendRequest &&
                                  friendRequest?.length > 0 ? (
                                    friendRequest
                                      .filter(friend => friend?.friend?.documentId === users?.documentId)
                                      .map((friend, index) => {
                                        const friendData =
                                          friend?.user?.documentId === users?.documentId
                                            ? friend?.friend
                                            : friend?.user;

                                        return (
                                          <div
                                            className="col-md-6 col-lg-6 mb-3"
                                            key={`pending-${
                                              friend?.documentId || index
                                            }`} // Sử dụng `friend.id` nếu có, nếu không thì dùng `index`
                                          >
                                            <div className="iq-friendlist-block">
                                              <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                  <Link to="#">
                                                    <img
                                                      loading="lazy"
                                                      src={
                                                        friendData?.avatarMedia?.file_path
                                                      }
                                                      alt="profile-img"
                                                      width={150}
                                                      height={150}
                                                      style={{
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                      }}
                                                    />
                                                  </Link>
                                                  <div className="friend-info ms-3">
                                                    <h5>
                                                      {friendData?.fullname}
                                                    </h5>
                                                    <p className="mb-0">
                                                      {friendData?.friendCount || 0}{" "}
                                                      friends
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                  <Link
                                                    to="#"
                                                    onClick={() =>
                                                      handleConfirm(
                                                        friend?.documentId
                                                      )
                                                    }
                                                    className="me-3 btn btn-primary rounded"
                                                  >
                                                    Confirm
                                                  </Link>
                                                  <Link
                                                    to="#"
                                                    onClick={() =>
                                                      handleReject(
                                                        friend?.documentId
                                                      )
                                                    }
                                                    className="me-3 btn btn-warning rounded"
                                                  >
                                                    Rejected
                                                  </Link>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })
                                  ) : (
                                    <div className="text-center w-100">
                                      <p>No Friends</p>{" "}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="friendsent">
                              <div className="card-body p-0">
                                <div className="row">
                                  {friendRequest &&
                                  friendRequest?.length > 0 ? (
                                    friendRequest
                                      .filter(friend => friend?.user?.documentId === users?.documentId)
                                      .map((friend, index) => {
                                        const friendData =
                                          friend?.user?.documentId === users?.documentId
                                            ? friend?.friend
                                            : friend?.user;

                                      return (
                                        <div
                                          className="col-md-6 col-lg-6 mb-3"
                                          key={friend?.documentId || index} // Sử dụng `friend.id` nếu có, nếu không thì dùng `index`
                                        >
                                          <div className="iq-friendlist-block">
                                            <div className="d-flex align-items-center justify-content-between">
                                              <div className="d-flex align-items-center">
                                                <Link to="#">
                                                  <img
                                                    loading="lazy"
                                                    src={
                                                      friendData?.avatarMedia?.file_path
                                                    }
                                                    alt="profile-img"
                                                    width={150}
                                                    height={150}
                                                    style={{
                                                      objectFit: "cover",
                                                      borderRadius: "8px",
                                                    }}
                                                  />
                                                </Link>
                                                <div className="friend-info ms-3">
                                                  <h5>
                                                    {friendData?.fullname}
                                                  </h5>
                                                  <p className="mb-0">
                                                    {friendData?.friendCount || 0}{" "}
                                                    friends
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="d-flex align-items-center">
                                                <Link
                                                  to="#"
                                                  className="d-flex align-items-center justify-content-center me-3 btn btn-primary rounded"
                                                  style={{
                                                    minWidth: "80px",
                                                    height: "40px",
                                                  }}
                                                >
                                                  <i
                                                    className="material-symbols-outlined me-1"
                                                    style={{ fontSize: "18px" }}
                                                  >
                                                    done
                                                  </i>
                                                  <span
                                                    style={{ fontSize: "14px" }}
                                                  >
                                                    Sent
                                                  </span>
                                                </Link>

                                                <Link
                                                  to="#"
                                                  onClick={() =>
                                                    handleReject(
                                                      friend?.documentId
                                                    )
                                                  }
                                                  className="me-3 btn btn-danger rounded"
                                                >
                                                  Cancel
                                                </Link>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="text-center w-100">
                                      <p>No Friends</p>{" "}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Container>
                </Tab.Pane>
                <Tab.Pane eventKey="forth">
                  <Tab.Container id="left-tabs-example" defaultActiveKey="p1">
                    <Card>
                      <Card.Body>
                        <h2>Photos</h2>
                        <div className="friend-list-tab mt-2">
                          <Nav
                            variant="pills"
                            className=" d-flex align-items-center justify-content-left friend-list-items p-0 mb-2"
                          >
                            <li>
                              <Nav.Link eventKey="p1" href="#pill-photosofyou">
                              
                              </Nav.Link>
                            </li>
                          </Nav>
                          <Tab.Content>
                            <Tab.Pane eventKey="p1">
                              <Card.Body className="p-0">
                                <div className="d-grid gap-2 d-grid-template-1fr-13">
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <div
                                        onClick={() => imageOnSlide(10)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img51}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </div>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(11)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img52}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(12)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img53}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(13)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img54}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(14)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img55}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(15)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img56}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(16)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img57}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(17)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img58}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(18)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img59}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(19)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img60}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(20)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img61}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(21)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img62}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(22)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img63}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(23)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img64}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(24)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img65}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(25)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img51}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(26)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img52}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(27)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img53}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(28)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img54}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(29)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img55}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(30)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img56}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(31)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img57}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="user-images position-relative overflow-hidden">
                                      <Link
                                        onClick={() => imageOnSlide(32)}
                                        to="#"
                                      >
                                        <img
                                          loading="lazy"
                                          src={img58}
                                          className="img-fluid rounded"
                                          alt="Responsive"
                                        />
                                      </Link>
                                      <div className="image-hover-data">
                                        <div className="product-elements-icon">
                                          <ul className="d-flex align-items-center m-0 p-0 list-inline">
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                60{" "}
                                                <i className="material-symbols-outlined md-14 ms-1">
                                                  thumb_up
                                                </i>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                30{" "}
                                                <span className="material-symbols-outlined  md-14 ms-1">
                                                  chat_bubble_outline
                                                </span>{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                to="#"
                                                className="pe-3 text-white d-flex align-items-center"
                                              >
                                                {" "}
                                                10{" "}
                                                <span className="material-symbols-outlined md-14 ms-1">
                                                  forward
                                                </span>{" "}
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>Edit or Remove</Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          className="image-edit-btn material-symbols-outlined md-16"
                                        >
                                          drive_file_rename_outline
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                </div>
                              </Card.Body>
                            </Tab.Pane>
                          </Tab.Content>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Container>
                </Tab.Pane>
                <div className="col-sm-12 text-center">
                  <img
                    loading="lazy"
                    src={loader}
                    alt="loader"
                    style={{ height: "100px" }}
                  />
                </div>
              </Tab.Content>
            </Col>
          </Tab.Container>
        </Row>
      </Container>
    </>
  );
};

export default UserProfile;
