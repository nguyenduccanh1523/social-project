import React, { useEffect, useState } from "react";
import { Row, Col, Image, Container } from "react-bootstrap";
import { Input, Select, Space, Pagination } from "antd";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import BlogDetail from "../component/Blog/BlogDetail";

// img
import blog6 from "../../../assets/images/blog/01.jpg";
import img7 from "../../../assets/images/page-img/profile-bg5.jpg";
import { apiGetBlogList } from "../../../services/blog";
import { convertToVietnamDate } from "../others/format";

const { Search } = Input;
const { Option } = Select;

const BlogList = () => {
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [pageParam, setPageParam] = useState(1);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      setIsLoading(true);
      try {
        let allData = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
          const res = await apiGetBlogList({
            pageParam: currentPage,
            searchText,
            filterType,
          });
          allData = [...allData, ...res.data];
          if (currentPage >= res.hasNextPage) {
            hasMore = false;
          }
          currentPage++;
        }

        setAllBlogs(allData);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchAllBlogs();
  }, [filterType, searchText]);

  const handleSaveBlog = (blogId) => {
    if (savedBlogs.includes(blogId)) {
      setSavedBlogs(savedBlogs.filter((id) => id !== blogId));
    } else {
      setSavedBlogs([...savedBlogs, blogId]);
    }
  };

  const filteredBlogs = allBlogs?.filter((blog) => {
    if (!searchText) return true;
    return (
      blog?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      blog?.description?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const currentPageData = filteredBlogs.slice(
    (pageParam - 1) * 10,
    pageParam * 10
  );

  const handleSearch = (value) => {
    setSearchText(value);
    setPageParam(1);
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedBlog(null);
  };

  return (
    <>
      <div className="header-for-bg">
        <div className="background-header position-relative">
          <img src={img7} className="img-fluid w-100" alt="header-bg" />
          <div className="title-on-header">
            <div className="data-block">
              <h2>BlogList</h2>
            </div>
          </div>
        </div>
      </div>
      <div id="content-page" className="content-page">
        <Container>
          <Row className="mb-2">
            <Col lg="12">
              <Card>
                <Card.Body>
                  <Space className="w-100 justify-content-between">
                    <Search
                      placeholder="Tìm kiếm bài viết..."
                      allowClear
                      enterButton="Search"
                      size="large"
                      style={{ width: 400 }}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onSearch={handleSearch}
                    />
                    <Select
                      defaultValue="all"
                      style={{ width: 200 }}
                      size="large"
                      onChange={(value) => {
                        setFilterType(value);
                        setPageParam(1);
                      }}
                    >
                      <Option value="all">All BlogList</Option>
                      <Option value="newest">Lastest</Option>
                      <Option value="oldest">Oldest</Option>
                      <Option value="most_commented">Most Commented</Option>
                    </Select>
                  </Space>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            {currentPageData.map((blog, index) => (
              <Col lg="12" key={blog.id}>
                <Card
                  className={`card-block card-stretch card-height blog-list ${
                    index % 2 !== 0 ? "list-even" : ""
                  }`}
                >
                  <Card.Body>
                    <Row className="align-items-center">
                      {index % 2 === 0 ? (
                        <>
                          <Col md="6">
                            <div className="image-block">
                              <Image
                                src={blog?.media?.file_path || blog6}
                                className="img-fluid rounded w-100"
                                alt="blog-img"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="blog-description rounded p-2">
                              <div className="blog-meta d-flex align-items-center justify-content-between mb-2">
                                <div className="date">
                                  <Link to="#" tabIndex="-1">
                                    {convertToVietnamDate(blog?.createdAt)}
                                  </Link>
                                </div>
                                <div
                                  className="bookmark-icon"
                                  onClick={() => handleSaveBlog(blog.id)}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "20px",
                                    color: "#1890ff",
                                  }}
                                >
                                  {savedBlogs.includes(blog.id) ? (
                                    <StarFilled />
                                  ) : (
                                    <StarOutlined />
                                  )}
                                </div>
                              </div>
                              <h5
                                className="mb-2"
                                onClick={() => handleBlogClick(blog)}
                                style={{ cursor: "pointer" }}
                              >
                                {blog?.title}
                              </h5>
                              <p>{blog?.description}</p>
                              <Link
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleBlogClick(blog);
                                }}
                                to="#"
                                tabIndex="-1"
                                className="d-flex align-items-center"
                              >
                                Read More{" "}
                                <i className="material-symbols-outlined md-14 filled">
                                  arrow_forward_ios
                                </i>
                              </Link>
                              <div className="group-smile mt-4 d-flex flex-wrap align-items-center justify-content-between position-right-side">
                                <div className="iq-media-group d-flex align-items-center">
                                  <Link to="#" className="iq-media">
                                    <Image
                                      className="img-fluid rounded-circle avatar-50"
                                      src={
                                        blog?.author?.profile_picture || blog6
                                      }
                                      alt="avatar"
                                    />
                                  </Link>
                                  <span className="ms-2">
                                    {blog?.author?.username || "Anonymous"}
                                  </span>
                                </div>
                                <div className="comment d-flex align-items-center">
                                  <i className="material-symbols-outlined me-2 md-18">
                                    chat_bubble_outline
                                  </i>
                                  {blog?.commentCount || 0} comments
                                </div>
                              </div>
                            </div>
                          </Col>
                        </>
                      ) : (
                        <>
                          <Col md="6">
                            <div className="blog-description rounded p-2">
                              <div className="blog-meta d-flex align-items-center justify-content-between mb-2">
                                <div
                                  className="bookmark-icon"
                                  onClick={() => handleSaveBlog(blog.id)}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "20px",
                                    color: "#1890ff",
                                  }}
                                >
                                  {savedBlogs.includes(blog.id) ? (
                                    <StarFilled />
                                  ) : (
                                    <StarOutlined />
                                  )}
                                </div>
                                <div className="date">
                                  <Link to="#" tabIndex="-1">
                                    {convertToVietnamDate(blog?.createdAt)}
                                  </Link>
                                </div>
                              </div>
                              <h5
                                className="mb-2"
                                onClick={() => handleBlogClick(blog)}
                                style={{ cursor: "pointer" }}
                              >
                                {blog?.title}
                              </h5>
                              <p>{blog?.description}</p>
                              <Link
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleBlogClick(blog);
                                }}
                                to="#"
                                tabIndex="-1"
                              >
                                Read More{" "}
                                <i className="material-symbols-outlined md-14 filled">
                                  arrow_forward_ios
                                </i>
                              </Link>
                              <div className="group-smile mt-4 d-flex flex-wrap align-items-center justify-content-between position-right-side">
                                <div className="iq-media-group d-flex align-items-center">
                                  <Link to="#" className="iq-media">
                                    <Image
                                      className="img-fluid rounded-circle avatar-50"
                                      src={
                                        blog?.author?.profile_picture || blog6
                                      }
                                      alt="avatar"
                                    />
                                  </Link>
                                  <span className="ms-2">
                                    {blog?.author?.username || "Anonymous"}
                                  </span>
                                </div>
                                <div className="comment d-flex align-items-center">
                                  <i className="material-symbols-outlined me-2 md-18">
                                    chat_bubble_outline
                                  </i>
                                  {blog?.commentCount || 0} comments
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="image-block">
                              <Image
                                src={blog?.media?.file_path || blog6}
                                className="img-fluid rounded w-100"
                                alt="blog-img"
                              />
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="mt-4 mb-4">
            <Col lg="12" className="d-flex justify-content-end">
              <Pagination
                current={pageParam}
                total={filteredBlogs.length}
                pageSize={10}
                onChange={(page) => setPageParam(page)}
                showSizeChanger={false}
                disabled={isLoading}
                style={{ marginBottom: "20px" }}
              />
            </Col>
          </Row>
        </Container>
      </div>
      <BlogDetail
        blog={selectedBlog}
        visible={isModalVisible}
        onClose={handleModalClose}
        onSave={() => handleSaveBlog(selectedBlog?.id)}
        isSaved={savedBlogs.includes(selectedBlog?.id)}
      />
    </>
  );
};

export default BlogList;
