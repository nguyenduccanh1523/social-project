import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link, useLocation } from "react-router-dom";
import ProfileHeader from "../../../../components/profile-header";
import { Empty, Input, message } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// image

import img8 from "../../../../assets/images/page-img/profile-bg8.jpg";
import img9 from "../../../../assets/images/page-img/profile-bg9.jpg";
import user05 from "../../../../assets/images/user/05.jpg";
import { apiGetPagesTags, apiGetPageDetailTag, apiGetCheckFollowPage, apiDeletePageMember, apiCreatePageMember } from "../../../../services/page";
import loader from "../../../../assets/images/page-img/page-load-loader.gif";
import Loader from "../../icons/uiverse/Loading";
import { useSelector } from "react-redux";

const { Search } = Input;

// Thêm CSS cho card hover
const cardHoverStyle = {
  transition: "transform 0.3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-5px)",
  },
};

const PageLists = () => {
  const location = useLocation();
  const { selectedTag, tagName, tagId } = location.state || {};
  const { profile } = useSelector((state) => state.root.user || {});
  const [pages, setPages] = useState([]);
  const [pageDetails, setPageDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIds, setPageIds] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchPages = async () => {
      if (!tagId) return;

      setIsLoading(true);
      try {
        // Lấy danh sách pages của tag
        const response = await apiGetPagesTags({ tagId });
        setPages(response.data || []);

        // Lấy chi tiết của từng page
        const pageIds =
          response.data?.data?.map((page) => page.page_id?.documentId) || [];
        setPageIds(pageIds);
        const pageDetailsPromises = pageIds.map((pageId) =>
          apiGetPageDetailTag({ pageId })
            .then((res) => ({ [pageId]: res.data?.data?.[0] }))
            .catch((err) => {
              console.error(`Error fetching page detail for ${pageId}:`, err);
              return { [pageId]: null };
            })
        );

        const pageDetailsResults = await Promise.all(pageDetailsPromises);
        const pageDetailsMap = pageDetailsResults.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setPageDetails(pageDetailsMap);
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, [tagId, profile?.documentId]);

  const { data: followStatusMap, isLoading: isFollowStatusLoading } = useQuery({
    queryKey: ["followStatus", pageIds, profile?.documentId],
    queryFn: async () => {
      const followStatusPromises = pageIds.map((pageId) =>
        apiGetCheckFollowPage({ pageId, userId: profile?.documentId })
          .then((res) => ({
            [pageId]: res.data?.data?.length > 0,
          }))
          .catch((err) => {
            console.error(`Error checking follow status for ${pageId}:`, err);
            return { [pageId]: false };
          })
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
      const response = await apiGetCheckFollowPage({ pageId, userId: profile?.documentId });
      const memberId = response.data?.data?.[0]?.documentId;

      if (memberId) {
        await apiDeletePageMember({ documentId: memberId });
        message.success("Unfollowed successfully");
        queryClient.invalidateQueries("followStatus");
      } else {
        message.error("Failed to unfollow");
      }
    } catch (error) {
      console.error("Error unfollowing page:", error);
      message.error("Failed to unfollow");
    }
  };

  const handleFollow = async (pageId) => {
    try {
      const payload = {
        data: {
          page: pageId,
          user_id: profile?.documentId,
        }
      };
      await apiCreatePageMember(payload);
      message.success("Followed successfully");
      queryClient.invalidateQueries("followStatus");
    } catch (error) {
      console.error("Error following page:", error);
      message.error("Failed to follow");
    }
  };

  // Lọc pages theo tên từ pageDetails
  const filteredPages = pages?.data?.filter((page) => {
    if (!searchTerm) return true;
    const pageDetail = pageDetails[page?.page_id?.documentId];
    const pageName = pageDetail?.page_name?.toLowerCase() || "";
    return pageName.includes(searchTerm.toLowerCase());
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
  };


  return (
    <>
      <ProfileHeader title={`PageLists in ${tagName || "Tag"}`} img={img9} />
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Col md="12" className="mb-3">
              <Search
                placeholder="Search pages by name..."
                allowClear
                enterButton
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  maxWidth: "500px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                }}
              />
            </Col>

            {isLoading || isFollowStatusLoading ? (
              <div className="col-sm-12 text-center">
                <Loader />
              </div>
            ) : !filteredPages?.length ? (
              <Col xs={12}>
                <Card>
                  <Card.Body className="text-center">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        searchTerm ? (
                          <span>No pages found for "{searchTerm}"</span>
                        ) : (
                          <span>
                            No pages found in tag <strong>{tagName}</strong>
                          </span>
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
              filteredPages?.map((page) => {
                const pageDetail = pageDetails[page?.page_id?.documentId];
                const isFollowed = followStatusMap?.[page?.page_id?.documentId];
                return (
                  <Col md={6} key={page.id}>
                    <Card
                      className="card-block card-stretch card-height card-hover"
                      style={cardHoverStyle}
                    >
                      <Card.Body className="profile-page p-0">
                        <div className="profile-header-image">
                          <div className="cover-container">
                            <img
                              loading="lazy"
                              src={pageDetail?.media?.url || img8}
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
                                        pageDetail?.profile_picture
                                          ?.file_path || user05
                                      }
                                      alt="page-avatar"
                                      className="avatar-130 img-fluid rounded-circle"
                                    />
                                  </div>
                                  <div className="user-data-block">
                                    <h4 className="d-flex align-items-center">
                                      <Link
                                        to={`/page/${page.page_id?.documentId}`}
                                        state={{
                                          pageId: page.page_id?.documentId,
                                          // pageDetail:
                                          //   pageDetails[
                                          //   page?.page_id?.documentId
                                          //   ],
                                          pageInfo: page,
                                        }}
                                      >
                                        {pageDetail?.page_name}
                                      </Link>
                                      {pageDetail?.is_verified && (
                                        <i className="material-symbols-outlined verified-badge ms-2">
                                          verified
                                        </i>
                                      )}
                                    </h4>
                                    <p className="mb-2">
                                      {pageDetail?.intro ||
                                        "No intro available"}
                                    </p>
                                    <div className="d-flex align-items-center mb-2">
                                      <img
                                        src={
                                          pageDetail?.author?.profile_picture ||
                                          user05
                                        }
                                        alt="author"
                                        className="avatar-30 rounded-circle me-2"
                                      />
                                      <span>
                                        @
                                        {pageDetail?.author?.username ||
                                          "anonymous"}
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <i className="material-symbols-outlined me-2">
                                        group
                                      </i>
                                      <span>
                                        {pageDetail?.page_members?.length || 0}{" "}
                                        followers
                                      </span>
                                      <span className="material-symbols-outlined" style={{ marginLeft: "10px", color: "gold" }}>
                                        star
                                      </span>
                                      {pageDetail?.rate || 0}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              className={`btn rounded-pill px-4 ${isFollowed ? "btn-secondary" : "btn-primary"}`}
                              onClick={(e) => {
                                e.preventDefault();
                                if (isFollowed) {
                                  handleUnfollow(page.page_id?.documentId);
                                } else {
                                  handleFollow(page.page_id?.documentId);
                                }
                              }}
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

// Thêm CSS cho card hover
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

export default PageLists;
