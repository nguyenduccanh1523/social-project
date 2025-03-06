import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Modal, Button, Dropdown } from "react-bootstrap";
import Card from "../../../../components/Card";
import CustomToggle from "../../../../components/dropdowns";
import ReactFsLightbox from "fslightbox-react";
import { apiGetPageDetail, apiGetPageHour } from "../../../../services/page";
import loader from "../../../../assets/images/page-img/page-load-loader.gif";
import BioDetailModal from "./bio-detail-modal";

import imgp2 from "../../../../assets/images/user/05.jpg";
import imgp3 from "../../../../assets/images/user/06.jpg";
import imgp4 from "../../../../assets/images/user/07.jpg";
import imgp5 from "../../../../assets/images/user/08.jpg";
import imgp26 from "../../../../assets/images/user/02.jpg";
import imgp27 from "../../../../assets/images/user/05.jpg";
import imgp28 from "../../../../assets/images/user/06.jpg";
import imgp29 from "../../../../assets/images/user/07.jpg";
import imgp30 from "../../../../assets/images/user/08.jpg";
import ProfileHeader from "../../../../components/profile-header";
import bg3 from "../../../../assets/images/page-img/profile-bg3.jpg";
import g1 from "../../../../assets/images/page-img/g1.jpg";
import g2 from "../../../../assets/images/page-img/g2.jpg";
import g3 from "../../../../assets/images/page-img/g3.jpg";
import g4 from "../../../../assets/images/page-img/g4.jpg";
import g5 from "../../../../assets/images/page-img/g5.jpg";
import g6 from "../../../../assets/images/page-img/g6.jpg";
import g7 from "../../../../assets/images/page-img/g7.jpg";
import g8 from "../../../../assets/images/page-img/g8.jpg";
import g9 from "../../../../assets/images/page-img/g9.jpg";
import small07 from "../../../../assets/images/small/07.png";
import small08 from "../../../../assets/images/small/08.png";
import small09 from "../../../../assets/images/small/09.png";
import CreatePost from "../Share/createPost";

// Fslightbox plugin
const FsLightbox = ReactFsLightbox.default
  ? ReactFsLightbox.default
  : ReactFsLightbox;

const PageDetail = () => {
  const location = useLocation();
  const {
    pageId,
    pageDetail: initialPageDetail,
    pageInfo,
  } = location.state || {};
  const [pageData, setPageData] = useState(initialPageDetail || null);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [imageController, setImageController] = useState({
    toggler: false,
    slide: 1,
  });

  const [showBioModal, setShowBioModal] = useState(false);

  const [pageHour, setPageHour] = useState(null);

  function imageOnSlide(number) {
    setImageController({
      toggler: !imageController.toggler,
      slide: number,
    });
  }


  useEffect(() => {
    const fetchPageDetail = async () => {
      if (!pageId || typeof pageId !== "string") {
        console.error("Invalid pageId:", pageId);
        return; // Ngừng thực hiện nếu pageId không hợp lệ
      }

      setLoading(true);
      try {
        // Fetch lại data mới nhất nếu cần
        const response = await apiGetPageDetail(pageId);
        setPageData(response.data?.data?.[0] || initialPageDetail);
      } catch (error) {
        console.error("Error fetching page detail:", error);
        // Giữ lại data cũ nếu fetch thất bại
        setPageData(initialPageDetail);
      } finally {
        setLoading(false);
      }
    };

    fetchPageDetail();
  }, [pageId, initialPageDetail]);

  // Lấy thông tin giờ mở cửa
  useEffect(() => {
    if (pageData?.page_open_hour?.documentId) {
      apiGetPageHour({ pageId: pageData.page_open_hour.documentId }).then(
        (res) => {
          setPageHour(res.data);
        }
      );
    }
  }, [pageData?.page_open_hour?.documentId]);

  // Tạo chuỗi hiển thị giờ mở cửa
  const getOpenHourString = () => {
    if (!pageHour) return "Updating...";

    const isOpen = pageHour?.data?.status_open;

    return (
      <div>
        <div className="d-flex align-items-center">
          <span className={`me-2 ${isOpen ? "text-success" : "text-danger"}`}>
            {isOpen ? "● Opened" : "● Closed"}
          </span>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="col-sm-12 text-center">
        <img src={loader} alt="loader" style={{ height: "100px" }} />
      </div>
    );

  if (!pageData) return <div>No page data found</div>;
  return (
    <>
      <FsLightbox
        toggler={imageController.toggler}
        sources={[g1, g2, g3, g4, g5, g6, g7, g8, g9]}
        slide={imageController.slide}
      />
      <ProfileHeader title={pageData?.page_name} img={bg3} />
      <div className="profile-2">
        <div id="content-page" className="content-page">
          <Container>
            <Row>
              <Col lg="12">
                <Card>
                  <Card.Body>
                    <Row>
                      <Col lg="2">
                        <div className="item1 ms-1">
                          <img
                            loading="lazy"
                            src={pageData?.profile_picture?.file_path}
                            className="img-fluid rounded profile-image"
                            alt="profile-img"
                          />
                        </div>
                      </Col>
                      <Col lg="10">
                        <div className="d-flex justify-content-between">
                          <div className="item2">
                            <h4 className="d-flex align-items-center">
                              {pageData?.page_name}
                              {pageData?.is_verified && (
                                <i
                                  className="material-symbols-outlined verified-badge ms-2"
                                  style={{
                                    fontSize: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  verified
                                </i>
                              )}
                            </h4>
                            <span>
                              {pageData?.followers_count || 0} followers
                            </span>
                          </div>
                          <div className="item4 ms-1">
                            <div className="d-flex justify-content-between align-items-center ms-1 flex-wrap">
                              <div className="d-flex align-items-center">
                                <span className="material-symbols-outlined writ-icon md-18">
                                  send
                                </span>
                                <h6 className="ms-1">Write a message</h6>
                              </div>
                              <button
                                type="button"
                                className="btn btn-primary ms-2 btn-sm d-flex align-items-center"
                              >
                                <span className="material-symbols-outlined md-16">
                                  add
                                </span>
                                Follow
                              </button>
                            </div>
                          </div>
                        </div>
                        <Row>
                          <Col lg="5">
                            <div className="item5 mt-3">
                              <div className="d-flex align-items-center mb-1">
                                <span className="material-symbols-outlined md-18">
                                  business_center
                                </span>
                                <Link to="#" className="link-primary h6 ms-2">
                                  {pageData?.business_info ||
                                    "Model at next model management"}
                                </Link>
                              </div>
                              <div className="d-flex align-items-center mb-1">
                                <span className="material-symbols-outlined md-18">
                                  business
                                </span>
                                <span className="ms-2">Company Name</span>
                              </div>
                              <div className="d-flex align-items-center mb-1">
                                <span className="material-symbols-outlined md-18">
                                  schedule
                                </span>
                                <span className="ms-2 text-success">
                                  {getOpenHourString()}
                                </span>
                              </div>
                            </div>
                          </Col>
                          <Col lg="5">
                            <div className="item6 border-light border-start mt-4">
                              <div className="ms-2">
                                <h6 className="mb-2">
                                  People {pageData?.page_name} follows
                                </h6>
                              </div>
                              <div className="iq-media-group ms-2">
                                {[imgp2, imgp3, imgp4, imgp5].map(
                                  (img, index) => (
                                    <Link
                                      to="#"
                                      className="iq-media"
                                      key={index}
                                    >
                                      <img
                                        loading="lazy"
                                        className="img-fluid avatar-40 rounded-circle"
                                        src={img}
                                        alt=""
                                      />
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="4">
                <Card>
                  <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                      <h4 className="card-title">Bio</h4>
                    </div>
                    <div className="d-flex align-items-center">
                      <p className="m-0">
                        <Link to="#" onClick={() => setShowBioModal(true)}>
                          {" "}
                          Know More{" "}
                        </Link>
                      </p>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="d-flex flex-column">
                      <div className="mb-2">
                        <span>{pageData?.intro}</span>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <span className="material-symbols-outlined md-18">
                          business_center
                        </span>
                        <Link to="#" className="link-primary h6 ms-2">
                          {pageData?.business_info ||
                            "Model at next model management"}
                        </Link>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <span className="material-symbols-outlined md-18">
                          location_on
                        </span>
                        <span className="ms-2">
                          {pageData?.lives_in ||
                            "Tầng 4, Tòa Luxury Park Views, Lô 32, Cầu Giấy, Hanoi, Vietnam"}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <span className="material-symbols-outlined md-18">
                          call
                        </span>
                        <span className="ms-2">
                          {pageData?.phone || "098 366 30 92"}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <span className="material-symbols-outlined md-18">
                          mail
                        </span>
                        <span className="ms-2">
                          {pageData?.email || "Sales@kenh28.vn"}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <span className="material-symbols-outlined md-18">
                          language
                        </span>
                        <Link to="#" className="link-primary ms-2">
                          {pageData?.website || "theanh28.vn"}
                        </Link>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="material-symbols-outlined ">star</span>
                        <Link to="#" className="link-primary ms-2 mt-1">
                          {pageData?.star || "5"}
                        </Link>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header className="d-flex align-items-center justify-content-between">
                    <div className="header-title">
                      <h4 className="card-title">Photos</h4>
                    </div>
                    <Link to="#">See all photos</Link>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2 grid-cols-3">
                      <Link onClick={() => imageOnSlide(1)} to="#">
                        <img
                          loading="lazy"
                          src={g1}
                          alt="gallary"
                          className="img-fluid"
                        />
                      </Link>
                      <Link onClick={() => imageOnSlide(2)} to="#">
                        <img
                          loading="lazy"
                          src={g2}
                          alt="gallary"
                          className="img-fluid"
                        />
                      </Link>
                      <Link onClick={() => imageOnSlide(3)} to="#">
                        <img
                          loading="lazy"
                          src={g3}
                          alt="gallary"
                          className="img-fluid"
                        />
                      </Link>
                      <Link onClick={() => imageOnSlide(4)} to="#">
                        <img
                          loading="lazy"
                          src={g4}
                          alt="gallary"
                          className="img-fluid"
                        />
                      </Link>
                      <Link onClick={() => imageOnSlide(5)} to="#">
                        <img
                          loading="lazy"
                          src={g5}
                          alt="gallary"
                          className="img-fluid"
                        />
                      </Link>
                      <Link onClick={() => imageOnSlide(6)} to="#">
                        <img
                          loading="lazy"
                          src={g6}
                          alt="gallary"
                          className="img-fluid"
                        />
                      </Link>
                      <Link onClick={() => imageOnSlide(7)} to="#">
                        <img
                          loading="lazy"
                          src={g7}
                          alt="gallary"
                          className="img-fluid"
                        />
                      </Link>
                      <Link onClick={() => imageOnSlide(8)} to="#">
                        <img
                          loading="lazy"
                          src={g8}
                          alt="gallary"
                          className="img-fluid"
                        />
                      </Link>
                      <Link onClick={() => imageOnSlide(9)} to="#">
                        <img
                          loading="lazy"
                          src={g9}
                          alt="gallary"
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg="8">
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
                          src={pageData?.profile_picture?.file_path}
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
                            <Dropdown.Toggle as={CustomToggle} id="post-option">
                              <span className="material-symbols-outlined">
                                more_horiz
                              </span>
                            </Dropdown.Toggle>
                          </Dropdown>
                        </div>
                      </li>
                    </ul>
                  </Card.Body>
                  <CreatePost show={show} handleClose={handleClose} page={pageData}/>
                </Card>
                <Card>
                  <Card.Body>
                    <ul className="post-comments p-0 m-0">
                      <li className="mb-2">
                        <div className="d-flex justify-content-between">
                          <div className="user-img">
                            <img
                              loading="lazy"
                              src={imgp26}
                              alt="userimg"
                              className="avatar-60 me-3 rounded-circle img-fluid"
                            />
                          </div>
                          <div className="w-100 text-margin">
                            <h5>Mathilda Gvarliana</h5>
                            <small className=" d-flex align-items-center ">
                              {" "}
                              <i className="material-symbols-outlined md-14 me-1">
                                schedule
                              </i>{" "}
                              March 14, 23:00
                            </small>
                            <p>
                              Hi, I am flying to Los Angeles to attend #VSFS2020
                              castings. I hope it will happen and my dream comes
                              true. Wish me luck.{" "}
                            </p>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center me-3">
                                  <span className="material-symbols-outlined md-18">
                                    favorite_border
                                  </span>
                                  <span className="card-text-1 ms-1">
                                    Love it
                                  </span>
                                </div>
                                <div className="d-flex align-items-center me-3">
                                  <span className="material-symbols-outlined md-18">
                                    comment
                                  </span>
                                  <span className="card-text-1 ms-1">
                                    Comment
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="material-symbols-outlined md-18">
                                    share
                                  </span>
                                  <span className="card-text-1 ms-1">
                                    Share
                                  </span>
                                </div>
                              </div>
                              <span className="card-text-2">
                                5.2k people love it
                              </span>

                              <div className="d-flex justify-content-between align-items-center">
                                <span className="card-text-1 me-1">
                                  5.2k people love it
                                </span>
                                <div className="iq-media-group ms-2">
                                  <Link to="#" className="iq-media ">
                                    <img
                                      loading="lazy"
                                      className="img-fluid avatar-30 rounded-circle"
                                      src={imgp27}
                                      alt=""
                                    />
                                  </Link>
                                  <Link to="#" className="iq-media ">
                                    <img
                                      loading="lazy"
                                      className="img-fluid avatar-30 rounded-circle"
                                      src={imgp28}
                                      alt=""
                                    />
                                  </Link>
                                  <Link to="#" className="iq-media ">
                                    <img
                                      loading="lazy"
                                      className="img-fluid avatar-30 rounded-circle"
                                      src={imgp29}
                                      alt=""
                                    />
                                  </Link>
                                  <Link to="#" className="iq-media ">
                                    <img
                                      loading="lazy"
                                      className="img-fluid avatar-30 rounded-circle"
                                      src={imgp30}
                                      alt=""
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <form
                              className="d-flex align-items-center mt-3"
                              action="#"
                            >
                              <input
                                type="text"
                                className="form-control rounded"
                                placeholder="Write your comment"
                              />
                              <div className="comment-attagement d-flex align-items-center me-4">
                                <span className="material-symbols-outlined md-18 me-1">
                                  comment
                                </span>
                                <h6 className="card-text-1">Comment</h6>
                              </div>
                            </form>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <BioDetailModal
        show={showBioModal}
        onHide={() => setShowBioModal(false)}
        pageData={pageData}
      />
    </>
  );
};

export default PageDetail;
