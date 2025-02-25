import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Container,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Card from "../../../components/Card";
import CustomToggle from "../../../components/dropdowns";
//import ShareOffcanvas from '../../components/share-offcanvas'
import SuggestedPage from "../component/Home/SuggestedPage";
import SuggestedGroup from "../component/Home/SuggestedGroup";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//image
import user1 from "../../../assets/images/user/1.jpg";
import user01 from "../../../assets/images/user/01.jpg";
import user2 from "../../../assets/images/user/02.jpg";
import img1 from "../../../assets/images/small/07.png";
import img2 from "../../../assets/images/small/08.png";
import img3 from "../../../assets/images/small/09.png";
import img4 from "../../../assets/images/small/10.png";
import img5 from "../../../assets/images/small/11.png";
import img6 from "../../../assets/images/small/12.png";
import img7 from "../../../assets/images/small/13.png";
import img8 from "../../../assets/images/small/14.png";
import s1 from "../../../assets/images/page-img/s1.jpg";
import s2 from "../../../assets/images/page-img/s2.jpg";
import s3 from "../../../assets/images/page-img/s3.jpg";
import s4 from "../../../assets/images/page-img/s4.jpg";
import s5 from "../../../assets/images/page-img/s5.jpg";


import loader from "../../../assets/images/page-img/page-load-loader.gif";
import { useSelector, useDispatch } from "react-redux";

import PostHome from "../component/Home/postHome";
import { getAllPosts } from "../../../services/post";
import { apiGetPageDetail } from "../../../services/page";
const Index = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.root.auth || {});

  
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageInfoMap, setPageInfoMap] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchPageInfo = async (pageId) => {
    try {
      const response = await apiGetPageDetail(pageId);
      return response.data; // Trả về dữ liệu
    } catch (error) {
      console.error("Error fetching page info:", error);
      return null;
    }
  };

  // Fetch posts ban đầu
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        const response = await getAllPosts({ page: 1 });
        const posts = response.data?.data || [];
        const pagination = response.data?.meta?.pagination;

        // Kiểm tra và lấy thông tin page cho các post
        const updatedPosts = await Promise.all(posts.map(async (post) => {
          if (post?.page?.documentId) {
            const pageInfo = await fetchPageInfo(post.page.documentId);
            if (pageInfo) {
              setPageInfoMap(prev => ({
                ...prev,
                [post.page.documentId]: pageInfo // Lưu thông tin page vào map
              }));
            }
          }
          return post;
        }));

        // Random hóa các bài viết
        const shuffledPosts = shuffleArray(updatedPosts);
        setDisplayPosts(shuffledPosts);
      } catch (error) {
        console.error("Error fetching initial posts:", error);
      }
    };

    fetchInitialPosts();
  }, []);

  // Hàm shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load thêm posts khi scroll
  const loadMorePosts = React.useCallback(async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      console.log('Loading page:', nextPage);

      const response = await getAllPosts({ page: nextPage });
      const newPosts = response.data?.data || [];
      const pagination = response.data?.meta?.pagination;

      // Kiểm tra và lấy thông tin page cho các post mới
      const updatedPosts = await Promise.all(newPosts.map(async (post) => {
        if (post?.page?.documentId) {
          const pageInfo = await fetchPageInfo(post.page.documentId);
          if (pageInfo) {
            setPageInfoMap(prev => ({
              ...prev,
              [post.page.documentId]: pageInfo // Lưu thông tin page vào map
            }));
          }
        }
        return post;
      }));

      setDisplayPosts(prev => {
        const shuffledPosts = shuffleArray(updatedPosts);
        return [...prev, ...shuffledPosts];
      });
      setCurrentPage(nextPage);
      setHasMore(nextPage < pagination?.pageCount);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, loadingMore]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Trigger load more khi scroll gần đến cuối
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        if (!loadingMore && hasMore) {
          console.log('Loading more posts, current page:', currentPage);
          loadMorePosts();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, hasMore, loadingMore, loadMorePosts]);

  // Welcome toast
  useEffect(() => {
    if (isLoggedIn && !localStorage.getItem("toastShown")) {
      const token = localStorage.getItem("token");
      if (token && !toast.isActive("login-toast")) {
        toast.success(
          <div>
            <h5>Welcome, Nguyen Duc Canh</h5>
            <p>You have successfully logged in as a client user to SocialV. Now you can start to explore. Enjoy!</p>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastId: "login-toast",
            onClose: () => {
              localStorage.setItem("toastShown", true);
            },
          }
        );
      }
    }
  }, [isLoggedIn]);

  return (
    <>
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Col lg={8} className="row m-0 p-0">
              <Col sm={12}>
                <Card
                  id="post-modal-data"
                  className="card-block card-stretch card-height"
                >
                  <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                      <h4 className="card-title">Create Post</h4>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div className="user-img">
                        <img
                          src={user1}
                          alt="user1"
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
                    <hr></hr>
                    <ul className=" post-opt-block d-flex list-inline m-0 p-0 flex-wrap">
                      <li className="me-3 mb-md-0 mb-2">
                        <Link to="#" className="btn btn-soft-primary">
                          <img
                            src={img1}
                            alt="icon"
                            className="img-fluid me-2"
                          />{" "}
                          Photo/Video
                        </Link>
                      </li>
                      <li className="me-3 mb-md-0 mb-2">
                        <Link to="#" className="btn btn-soft-primary">
                          <img
                            src={img2}
                            alt="icon"
                            className="img-fluid me-2"
                          />{" "}
                          Tag Friend
                        </Link>
                      </li>
                      <li className="me-3">
                        <Link to="#" className="btn btn-soft-primary">
                          <img
                            src={img3}
                            alt="icon"
                            className="img-fluid me-2"
                          />{" "}
                          Feeling/Activity
                        </Link>
                      </li>
                      <li>
                        <button className=" btn btn-soft-primary">
                          <div className="card-header-toolbar d-flex align-items-center">
                            <Dropdown>
                              <Dropdown.Toggle as="div" className="lh-1">
                                <span className="material-symbols-outlined">
                                  more_horiz
                                </span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={handleShow} href="#">
                                  Check in
                                </Dropdown.Item>
                                <Dropdown.Item onClick={handleShow} href="#">
                                  Live Video
                                </Dropdown.Item>
                                <Dropdown.Item onClick={handleShow} href="#">
                                  Gif
                                </Dropdown.Item>
                                <Dropdown.Item onClick={handleShow} href="#">
                                  Watch Party
                                </Dropdown.Item>
                                <Dropdown.Item onClick={handleShow} href="#">
                                  Play with Friend
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </Card.Body>
                  <Modal
                    size="lg"
                    className="fade"
                    id="post-modal"
                    onHide={handleClose}
                    show={show}
                  >
                    <Modal.Header className="d-flex justify-content-between">
                      <Modal.Title id="post-modalLabel">
                        Create Post
                      </Modal.Title>
                      <Link to="#" className="lh-1" onClick={handleClose}>
                        <span className="material-symbols-outlined">close</span>
                      </Link>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="d-flex align-items-center">
                        <div className="user-img">
                          <img
                            src={user1}
                            alt="user1"
                            className="avatar-60 rounded-circle img-fluid"
                          />
                        </div>
                        <form
                          className="post-text ms-3 w-100 "
                          data-bs-toggle="modal"
                          data-bs-target="#post-modal"
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
                              src={img1}
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
                              src={img2}
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
                              src={img3}
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
                              src={img4}
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
                              src={img5}
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
                              src={img6}
                              alt="icon"
                              className="img-fluid"
                            />{" "}
                            Gif
                          </div>
                        </li>
                        <li className="col-md-6 mb-3">
                          <div className="bg-soft-primary rounded p-2 pointer me-3">
                            <Link to="#"></Link>
                            <img
                              src={img7}
                              alt="icon"
                              className="img-fluid"
                            />{" "}
                            Watch Party
                          </div>
                        </li>
                        <li className="col-md-6 mb-3">
                          <div className="bg-soft-primary rounded p-2 pointer me-3">
                            <Link to="#"></Link>
                            <img
                              src={img8}
                              alt="icon"
                              className="img-fluid"
                            />{" "}
                            Play with Friends
                          </div>
                        </li>
                      </ul>
                      <hr />
                      <div className="other-option">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div className="user-img me-3">
                              <img
                                src={user1}
                                alt="user1"
                                className="avatar-60 rounded-circle img-fluid"
                              />
                            </div>
                            <h6>Your Story</h6>
                          </div>
                          <div className="card-post-toolbar">
                            <Dropdown>
                              <Dropdown.Toggle as={CustomToggle} role="button">
                                <span className="btn btn-primary">Friend</span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className=" m-0 p-0">
                                <Dropdown.Item className=" p-3" to="#">
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
                                <Dropdown.Item className="p-3" to="#">
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
                                <Dropdown.Item className=" p-3" to="#">
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
                                <Dropdown.Item className=" p-3" to="#">
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
                      <button
                        type="submit"
                        className="btn btn-primary d-block w-100 mt-3"
                      >
                        Post
                      </button>
                    </Modal.Body>
                  </Modal>
                </Card>
              </Col>
              {isLoading ? (
                <div className="col-sm-12 text-center">
                  <img src={loader} alt="loader" style={{ height: "100px" }} />
                        </div>
              ) : (
                <>
                  {displayPosts.map((post, index) => (
                    <PostHome 
                      key={`${post?.documentId}-${index}`}
                      post={post} 
                      pageInfo={pageInfoMap[post.page?.documentId]}
                    />
                  ))}

                  {loadingMore && (
                    <div className="col-sm-12 text-center">
                      <img src={loader} alt="loader" style={{ height: "100px" }} />
                    </div>
                  )}

                  {!hasMore && displayPosts.length > 0 && (
                    <div className="col-sm-12 text-center mt-3">
                      <p>No more posts to load</p>
                    </div>
                  )}
                </>
              )}
            </Col>
            <Col lg={4}>
              <Card>
                <div className="card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">Stories</h4>
                  </div>
                </div>
                <Card.Body>
                  <ul className="media-story list-inline m-0 p-0">
                    <li className="d-flex mb-3 align-items-center">
                      <i className="ri-add-line"></i>
                      <div className="stories-data ms-3">
                        <h5>Creat Your Story</h5>
                        <p className="mb-0">time to story</p>
                      </div>
                    </li>
                    <li className="d-flex mb-3 align-items-center active">
                      <img
                        src={s2}
                        alt="story-img"
                        className="rounded-circle img-fluid"
                      />
                      <div className="stories-data ms-3">
                        <h5>Anna Mull</h5>
                        <p className="mb-0">1 hour ago</p>
                      </div>
                    </li>
                    <li className="d-flex mb-3 align-items-center">
                      <img
                        src={s3}
                        alt="story-img"
                        className="rounded-circle img-fluid"
                      />
                      <div className="stories-data ms-3">
                        <h5>Ira Membrit</h5>
                        <p className="mb-0">4 hour ago</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-center">
                      <img
                        src={s1}
                        alt="story-img"
                        className="rounded-circle img-fluid"
                      />
                      <div className="stories-data ms-3">
                        <h5>Bob Frapples</h5>
                        <p className="mb-0">9 hour ago</p>
                      </div>
                    </li>
                  </ul>
                  <Link to="#" className="btn btn-primary d-block mt-3">
                    See All
                  </Link>
                </Card.Body>
              </Card>
              <Card>
                <div className="card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">Events</h4>
                  </div>
                  <div className="card-header-toolbar d-flex align-items-center">
                    <Dropdown>
                      <Dropdown.Toggle
                        as={CustomToggle}
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        role="button"
                      >
                        <i className="ri-more-fill h4"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className=" dropdown-menu-right"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <Dropdown.Item href="#">
                          <i className="ri-eye-fill me-2"></i>View
                        </Dropdown.Item>
                        <Dropdown.Item href="#">
                          <i className="ri-delete-bin-6-fill me-2"></i>Delete
                        </Dropdown.Item>
                        <Dropdown.Item href="#">
                          <i className="ri-pencil-fill me-2"></i>Edit
                        </Dropdown.Item>
                        <Dropdown.Item href="#">
                          <i className="ri-printer-fill me-2"></i>Print
                        </Dropdown.Item>
                        <Dropdown.Item href="#">
                          <i className="ri-file-download-fill me-2"></i>Download
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <Card.Body>
                  <ul className="media-story list-inline m-0 p-0">
                    <li className="d-flex mb-4 align-items-center ">
                      <img
                        src={s4}
                        alt="story1"
                        className="rounded-circle img-fluid"
                      />
                      <div className="stories-data ms-3">
                        <h5>Web Workshop</h5>
                        <p className="mb-0">1 hour ago</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-center">
                      <img
                        src={s5}
                        alt="story2"
                        className="rounded-circle img-fluid"
                      />
                      <div className="stories-data ms-3">
                        <h5>Fun Events and Festivals</h5>
                        <p className="mb-0">1 hour ago</p>
                      </div>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
              <Card>
                <div className="card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">Upcoming Birthday</h4>
                  </div>
                </div>
                <Card.Body>
                  <ul className="media-story list-inline m-0 p-0">
                    <li className="d-flex mb-4 align-items-center">
                      <img
                        src={user01}
                        alt="story3"
                        className="rounded-circle img-fluid"
                      />
                      <div className="stories-data ms-3">
                        <h5>Anna Sthesia</h5>
                        <p className="mb-0">Today</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-center">
                      <img
                        src={user2}
                        alt="story-img"
                        className="rounded-circle img-fluid"
                      />
                      <div className="stories-data ms-3">
                        <h5>Paul Molive</h5>
                        <p className="mb-0">Tomorrow</p>
                      </div>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
              <SuggestedPage />
              <SuggestedGroup />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Index;
