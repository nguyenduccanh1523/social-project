import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import Card from "../../../../components/Card";
import CustomToggle from "../../../../components/dropdowns";
import ReactFsLightbox from "fslightbox-react";
import { apiGetPageDetail, apiGetCheckFollowPage, apiCreatePageMember, apiDeletePageMember } from "../../../../services/page";
import BioDetailModal from "./bio-detail-modal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";


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
import { useSelector } from "react-redux";
import Loader from "../../icons/uiverse/Loading";
import CardPost from "../Share/cardPost";
import IconEdit from "../../icons/uiverse/iconEdit";
import EditPage from "./editPage";


// Fslightbox plugin
const FsLightbox = ReactFsLightbox.default
  ? ReactFsLightbox.default
  : ReactFsLightbox;

const PageDetail = () => {
  const location = useLocation();
  const {
    pageId,
  } = location.state || {};
  const { data: pageDetails, isLoading: isPageDetailLoading } = useQuery({
    queryKey: ["pageDetais", pageId],
    queryFn: async () => {
      const response = await apiGetPageDetail({ pageId, token });
      return response.data?.data || [];
    },
    enabled: !!pageId,
  });

  const [pageData, setPageData] = useState(pageDetails || null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [imageController, setImageController] = useState({
    toggler: false,
    slide: 1,
  });

  const [showBioModal, setShowBioModal] = useState(false);
  const handleCloseBioModal = () => setShowBioModal(false);


  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.root.auth || {});
  const { token } = useSelector((state) => state.root.auth || {});



  const { data: followStatus, isLoading: isFollowStatusLoading } = useQuery({
    queryKey: ["followStatus", pageId, user?.documentId],
    queryFn: async () => {
      const response = await apiGetCheckFollowPage({ pageId, userId: user?.documentId, token });
      return response.data?.data?.length > 0;
    },
    enabled: !!pageId && !!user?.documentId,
  });

  const handleUnfollow = async () => {
    try {
      const response = await apiGetCheckFollowPage({ pageId, userId: user?.documentId, token });
      const memberId = response.data?.data?.[0]?.documentId;

      if (memberId) {
        await apiDeletePageMember({ documentId: memberId, token });
        message.success("Unfollowed successfully");
        queryClient.invalidateQueries(["followStatus", pageId, user?.documentId]);
      } else {
        message.error("Failed to unfollow");
      }
    } catch (error) {
      console.error("Error unfollowing page:", error);
      message.error("Failed to unfollow");
    }
  };

  const handleFollow = async () => {
    try {
      const payload = {
        pageId: pageId,
        userId: user?.documentId,
        role: 'member'
      };
      await apiCreatePageMember(payload);
      message.success("Followed successfully");
      queryClient.invalidateQueries(["followStatus", pageId, user?.documentId]);
    } catch (error) {
      console.error("Error following page:", error);
      message.error("Failed to follow");
    }
  };

  function imageOnSlide(number) {
    setImageController({
      toggler: !imageController.toggler,
      slide: number,
    });
  }

  useEffect(() => {
    setPageData(pageDetails || null);
  }, [pageDetails]);

  console.log("pageDetails", pageData);

  const getOpenHourString = () => {
    if (!pageData?.openHours) return "Updating...";

    const isOpen = pageData?.openHours?.[0]?.status;

    return (
      <div>
        <div className="d-flex align-items-center">
          <span className={`me-2 ${isOpen === 'open' ? "text-success" : "text-danger"}`}>
            {isOpen === 'open' ? "● Opened" : "● Closed"}
          </span>
        </div>
      </div>
    );
  };
  //console.log("pageData", pageData);




  if (loading || isFollowStatusLoading || isPageDetailLoading)
    return (
      <div className="col-sm-12 text-center">
        <Loader />
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
                            src={pageData?.profileImage?.file_path}
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
                              {pageData?.members.length || 0} followers
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
                                className={`btn ms-2 btn-sm d-flex align-items-center ${followStatus ? "btn-secondary" : "btn-primary"}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (followStatus) {
                                    handleUnfollow();
                                  } else {
                                    handleFollow();
                                  }
                                }}
                              >
                                <span className="material-symbols-outlined md-16">
                                  {followStatus ? "done_outline" : "add"}
                                </span>
                                {followStatus ? "Unfollow" : "Follow"}
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
                                {pageData?.members?.map((item, index) => (
                                  <Link
                                    to="#"
                                    className="iq-media"
                                    key={index}
                                  >
                                    <img
                                      loading="lazy"
                                      className="img-fluid avatar-40 rounded-circle"
                                      src={item?.user?.avatarMedia?.file_path}
                                      alt=""
                                    />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </Col>
                          {pageData?.creator?.documentId === user?.documentId && (
                            <Col lg="1" className="d-flex align-items-center">
                              <div onClick={() => setDrawerOpen(true)}>
                                <IconEdit />
                              </div>
                            </Col>
                          )}
                          <EditPage pageData={pageData} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
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
                        <Button onClick={() => setShowBioModal(true)}>
                          {" "}
                          Know More{" "}
                        </Button>
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
                          {pageData?.nation?.name ||
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
                {pageData?.creator?.documentId === user?.documentId && (
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
                            src={pageData?.profileImage?.file_path}
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
                    <CreatePost show={show} handleClose={handleClose} page={pageData} />
                  </Card>
                )}
                {pageData?.posts.length >= 1 ?
                  pageData?.posts?.map((post, index) => (
                    <Card key={index}>
                      <CardPost post={post} pageInfo={pageData} />
                    </Card>
                  ))
                  : <>
                    <Card>
                      <h3 style={{textAlign: 'center'}}>No post</h3>
                    </Card>
                  </>
                }
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <BioDetailModal
        show={showBioModal}
        onHide={handleCloseBioModal}
        pageData={pageData}
      />
    </>
  );
};

export default PageDetail;
