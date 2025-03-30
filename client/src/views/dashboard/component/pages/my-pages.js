import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link, useLocation } from "react-router-dom";
import ProfileHeader from "../../../../components/profile-header";
import { Empty, Input, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import img8 from "../../../../assets/images/page-img/profile-bg8.jpg";
import img9 from "../../../../assets/images/page-img/profile-bg9.jpg";
import user05 from "../../../../assets/images/user/05.jpg";
import {
  apiGetMyPage,
  apiGetPageDetailTag,
  apiGetCheckFollowPage,
  apiDeletePageMember,
  apiCreatePageMember,
} from "../../../../services/page";
import Loader from "../../icons/uiverse/Loading";
import { useSelector } from "react-redux";
import Create from "../../icons/uiverse/Create";
import CreatePage from "./createPage";

const { Search } = Input;

const MyPage = () => {
  const location = useLocation();
  const { tagName } = location.state || {};
  const { profile } = useSelector((state) => state.root.user || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: myPagesData, isLoading: isPagesLoading } = useQuery({
    queryKey: ["myPages", profile?.documentId],
    queryFn: () => apiGetMyPage({ userId: profile?.documentId }),
    enabled: !!profile?.documentId,
  });

  const pages = myPagesData?.data?.data || [];
  const pageIds = pages.map((page) => page?.documentId);

  const { data: pageDetailsMap, isLoading: isPageDetailsLoading } = useQuery({
    queryKey: ["pageDetailsMap", pageIds],
    queryFn: async () => {
      const promises = pageIds.map((pageId) =>
        apiGetPageDetailTag({ pageId })
          .then((res) => ({ [pageId]: res.data?.data?.[0] }))
          .catch(() => ({ [pageId]: null }))
      );
      const results = await Promise.all(promises);
      return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    },
    enabled: !!pageIds.length,
  });

  const { data: followStatusMap, isLoading: isFollowStatusLoading } = useQuery({
    queryKey: ["followStatus", pageIds, profile?.documentId],
    queryFn: async () => {
      const followStatusPromises = pageIds.map((pageId) =>
        apiGetCheckFollowPage({ pageId, userId: profile?.documentId })
          .then((res) => ({ [pageId]: res.data?.data?.length > 0 }))
          .catch(() => ({ [pageId]: false }))
      );
      const followStatusResults = await Promise.all(followStatusPromises);
      return followStatusResults.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
    },
    enabled: !!pageIds.length && !!profile?.documentId,
  });

  const handleUnfollow = async (pageId) => {
    try {
      const response = await apiGetCheckFollowPage({
        pageId,
        userId: profile?.documentId,
      });
      const memberId = response.data?.data?.[0]?.documentId;
      if (memberId) {
        await apiDeletePageMember({ documentId: memberId });
        message.success("Unfollowed successfully");
        queryClient.invalidateQueries(["followStatus"]);
      } else {
        message.error("Failed to unfollow");
      }
    } catch (error) {
      message.error("Failed to unfollow");
    }
  };

  const handleFollow = async (pageId) => {
    try {
      const payload = {
        data: {
          page: pageId,
          user_id: profile?.documentId,
        },
      };
      await apiCreatePageMember(payload);
      message.success("Followed successfully");
      queryClient.invalidateQueries(["followStatus"]);
    } catch (error) {
      message.error("Failed to follow");
    }
  };

  const handleSearch = (value) => setSearchTerm(value);

  const filteredPages = pages.filter((page) => {
    const detail = pageDetailsMap?.[page.documentId];
    const name = detail?.page_name?.toLowerCase() || "";
    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <ProfileHeader
        title={`My Pages ${tagName ? `in ${tagName}` : ""}`}
        img={img9}
      />
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Col md="12" className="mb-3 d-flex justify-content-between">
              <Search
                placeholder="Search pages by name..."
                allowClear
                enterButton
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  maxWidth: "500px",
                  margin: "0 auto",
                  display: "block",
                }}
              />
              <div onClick={() => setDrawerOpen(true)}>
                <Create />
              </div>
              <CreatePage
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              />
            </Col>

            {isPagesLoading || isPageDetailsLoading || isFollowStatusLoading ? (
              <div className="col-sm-12 text-center">
                <Loader />
              </div>
            ) : !filteredPages.length ? (
              <Col xs={12}>
                <Card>
                  <Card.Body className="text-center">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        searchTerm ? (
                          <span>No pages found for "{searchTerm}"</span>
                        ) : (
                          <span>No pages found in your account.</span>
                        )
                      }
                    >
                      <Link to="/pages" className="btn btn-primary mt-3">
                        Back to Tags
                      </Link>
                    </Empty>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              filteredPages.map((page) => {
                const pageId = page.documentId;
                const detail = pageDetailsMap?.[pageId];
                const isFollowed = followStatusMap?.[pageId];

                return (
                  <Col md={6} key={page.id}>
                    <Card className="card-hover card-stretch card-height">
                      <Card.Body className="profile-page p-0">
                        <div className="profile-header-image">
                          <div className="cover-container">
                            <img
                              src={detail?.media?.url || img8}
                              alt="cover"
                              className="rounded img-fluid w-100"
                            />
                          </div>
                          <div className="profile-info p-4">
                            <div className="user-detail d-flex">
                              <div className="profile-img pe-4">
                                <img
                                  src={
                                    detail?.profile_picture?.file_path || user05
                                  }
                                  alt="avatar"
                                  className="avatar-130 img-fluid rounded-circle"
                                />
                              </div>
                              <div className="user-data-block">
                                <h4>
                                  <Link
                                    to={`/page/${pageId}`}
                                    state={{ pageId, pageInfo: page }}
                                  >
                                    {detail?.page_name}
                                  </Link>
                                  {detail?.is_verified && (
                                    <i className="material-symbols-outlined verified-badge ms-2">
                                      verified
                                    </i>
                                  )}
                                </h4>
                                <p>{detail?.intro || "No intro available"}</p>
                                <div className="d-flex align-items-center mb-2">
                                  <img
                                    src={
                                      detail?.author?.profile_picture || user05
                                    }
                                    alt="author"
                                    className="avatar-30 rounded-circle me-2"
                                  />
                                  <span>
                                    @{detail?.author?.username || "anonymous"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <i className="material-symbols-outlined me-2">
                                    group
                                  </i>
                                  <span>
                                    {detail?.page_members?.length || 0}{" "}
                                    followers
                                  </span>
                                  <span
                                    className="material-symbols-outlined"
                                    style={{
                                      marginLeft: "10px",
                                      color: "gold",
                                    }}
                                  >
                                    star
                                  </span>
                                  {detail?.rate || 0}
                                </div>
                              </div>
                            </div>
                            <button
                              className={`btn rounded-pill px-4 ${
                                isFollowed ? "btn-secondary" : "btn-primary"
                              }`}
                              onClick={() =>
                                isFollowed
                                  ? handleUnfollow(pageId)
                                  : handleFollow(pageId)
                              }
                            >
                              {isFollowed ? "Unfollow" : "Follow"}
                            </button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

const style = document.createElement("style");
style.textContent = `
  .card-hover {
    transition: transform 0.3s ease-in-out !important;
  }
  .card-hover:hover {
    transform: translateY(-5px);
  }
  .verified-badge {
    color: #1d9bf0;
    font-size: 20px !important;
    font-variation-settings: 'FILL' 1;
  }
  .user-data-block h4 {
    margin-bottom: 8px;
    font-weight: 600;
  }
  .user-data-block h4 a {
    color: inherit;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.25rem;
  }
  .user-data-block h4 a:hover {
    color: var(--bs-primary);
  }
  .user-data-block p {
    font-weight: 500;
    color: #64748b;
  }
  .user-data-block span {
    font-weight: 500;
  }
  .btn-primary {
    font-weight: 600;
  }
`;
document.head.appendChild(style);

export default MyPage;
