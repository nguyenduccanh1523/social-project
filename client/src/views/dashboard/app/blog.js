import React, { useEffect, useState } from "react";
import { Row, Col, Image, Container } from "react-bootstrap";
import { Input, Select, Space, Pagination, Tag, notification } from "antd";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import BlogDetail from "../component/Blog/BlogDetail";

// img
import blog6 from "../../../assets/images/blog/01.jpg";
import img7 from "../../../assets/images/page-img/profile-bg5.jpg";
import { apiGetBlogList } from "../../../services/blog";
import { apiGetDocumentTag } from "../../../services/tag";
import { convertToVietnamDate } from "../others/format";
import { colorsTag } from "../others/format";
import { fetchTag } from "../../../actions/actions/tag";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../icons/uiverse/Loading";
import { apiCreateMarkPost, apiDeleteMarkPost, apiGetCheckMarkDocument, apiGetMarkBlog } from "../../../services/markpost";

const { Search } = Input;
const { Option } = Select;

const BlogList = () => {
  const dispatch = useDispatch();
  const { tags } = useSelector((state) => state.root.tag || {});
  const { user } = useSelector((state) => state.root.auth || {});
  const { token } = useSelector((state) => state.root.auth || {});
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [pageParam, setPageParam] = useState(1);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [blogTags, setBlogTags] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);

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
            token
          });
          allData = [...allData, ...res.data];
          if (currentPage >= res.hasNextPage) {
            hasMore = false;
          }
          currentPage++;
        }

        setAllBlogs(allData);


        // Fetch tags cho mỗi blog
        const tagsPromises = allData.map(async (blog) => {
          try {
            const tagResponse = await apiGetDocumentTag({
              documentId: blog?.documentId,
              token
            });
            return { blogId: blog?.documentId, tags: tagResponse.data };

          } catch (err) {
            console.error(`Error fetching tags for blog ${blog?.documentId}:`, err);
            return { blogId: blog?.documentId, tags: [] };
          }
        });

        const tagsResults = await Promise.all(tagsPromises);
        const tagsMap = {};
        tagsResults.forEach(result => {
          tagsMap[result.blogId] = result.tags;
        });
        setBlogTags(tagsMap);


        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching blogs:", err);
      }
    };

    fetchAllBlogs();
  }, [filterType, searchText]);

  useEffect(() => {
    dispatch(fetchTag());
  }, [dispatch]);

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        const response = await apiGetMarkBlog({ userId: user?.documentId, token });
        const savedBlogIds = response.data.data.map(item => item.documentShare.documentId);
        setSavedBlogs(savedBlogIds);
      } catch (error) {
        console.error("Error fetching saved blogs:", error);
      }
    };

    if (user?.documentId) {
      fetchSavedBlogs();
    }
  }, [user?.documentId]);

  const handleSaveBlog = async (blogId) => {
    console.log('handleSaveBlog called with blogId:', blogId); // Debug log
    if (savedBlogs.includes(blogId)) {
      console.log('Removing blogId:', blogId); // Debug log
      try {
        const response = await apiGetCheckMarkDocument({ documentId: blogId, userId: user?.documentId, token });
        const markDocumentId = response?.data?.data[0]?.documentId;
        if (markDocumentId) {
          await apiDeleteMarkPost({ documentId: markDocumentId, token });
          setSavedBlogs(savedBlogs.filter((id) => id !== blogId));
          notification.success({
            message: 'Success',
            description: 'Blog post removed from saved list.',
          });
        }
      } catch (error) {
        console.error("Error deleting marked blog:", error);
        notification.error({
          message: 'Error',
          description: 'Failed to remove blog post from saved list.',
        });
      }
    } else {
      console.log('Saving blogId:', blogId); // Debug log
      try {
        const payload = {
          user_id: user?.documentId,
          document_share_id: blogId,
        }
        await apiCreateMarkPost(payload);
        setSavedBlogs([...savedBlogs, blogId]);
        notification.success({
          message: 'Success',
          description: 'Blog post saved successfully.',
        });
      } catch (error) {
        console.error("Error marking blog:", error);
        notification.error({
          message: 'Error',
          description: 'Failed to save blog post.',
        });
      }
    }
  };

  const filteredBlogs = allBlogs?.filter((blog) => {
    // Filter by search text
    const matchesSearch = !searchText ||
      blog?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      blog?.description?.toLowerCase().includes(searchText.toLowerCase());

    // Filter by selected tags
    const matchesTags = selectedTags.length === 0 ||
      blogTags[blog?.documentId]?.data?.some(tagItem =>
        selectedTags.includes(tagItem?.tag?.documentId)
      );

    return matchesSearch && matchesTags;
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
                    <Space>
                      <Select
                        mode="multiple"
                        placeholder="Select tags"
                        value={selectedTags}
                        onChange={setSelectedTags}
                        style={{ width: '350px' }}
                        size="large"
                        optionLabelProp="label"
                      >
                        {tags?.data?.map((tag) => (
                          <Option
                            key={tag.documentId}
                            value={tag.documentId}
                            label={tag.name}
                          >
                            <Tag color={colorsTag[tag.documentId % colorsTag.length]}>
                              {tag.name}
                            </Tag>
                          </Option>
                        ))}
                      </Select>
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
                  </Space>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {isLoading ? (
            <div className="col-sm-12 text-center">
              <Loader />
            </div>
          ) : (
            <>
              <Row>
                {currentPageData.map((blog, blogIndex) => (
                  <Col lg="12" key={blog.documentId}>
                    <Card
                      className={`card-block card-stretch card-height blog-list ${blogIndex % 2 !== 0 ? "list-even" : ""
                        }`}
                    >
                      <Card.Body>
                        <Row className="align-items-center">
                          {blogIndex % 2 === 0 ? (
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
                                    <div className="date d-flex gap-2">
                                      <Link to="#" tabIndex="-1">
                                        {convertToVietnamDate(blog?.createdAt)}
                                      </Link>
                                      <span className="d-inline-block">
                                        <p disabled style={{ pointerEvents: 'none' }}>
                                          {blog?.documentType?.name === 'public' ? <span className="material-symbols-outlined">
                                            public
                                          </span> : <span className="material-symbols-outlined">
                                            lock
                                          </span>}
                                        </p>
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                      <div
                                        className="bookmark-icon"
                                        onClick={() => handleSaveBlog(blog.documentId)}
                                        style={{
                                          cursor: "pointer",
                                          fontSize: "20px",
                                          color: "#1890ff",
                                        }}
                                      >
                                        {savedBlogs.includes(blog.documentId) ? (
                                          <StarFilled />
                                        ) : (
                                          <StarOutlined />
                                        )}
                                      </div>
                                      <div className="mt-2">
                                        <span className="material-symbols-outlined">
                                          report
                                        </span>
                                      </div>
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
                                  <div className="blog-tags mb-2">
                                    {blog?.tags?.map((tagItem) => (
                                      <Tag
                                        key={tagItem?.tag?.documentId}
                                        color={colorsTag[blogIndex % colorsTag.length]}
                                        style={{ marginBottom: '5px' }}
                                      >
                                        {tagItem?.tag?.name}
                                      </Tag>
                                    ))}
                                  </div>
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
                                            blog?.creator?.avatarMedia?.file_path || blog6
                                          }
                                          alt="avatar"
                                        />
                                      </Link>
                                      <span className="ms-2">
                                        {blog?.creator?.username || "Anonymous"}
                                      </span>
                                    </div>
                                    <div className="comment d-flex align-items-center">
                                      <i className="material-symbols-outlined me-2 md-18">
                                        chat_bubble_outline
                                      </i>
                                      {blog?.comments?.length || 0} comments
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
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="mt-2">
                                        <span className="material-symbols-outlined">
                                          report
                                        </span>
                                      </div>
                                      <div
                                        className="bookmark-icon"
                                        onClick={() => handleSaveBlog(blog.documentId)}
                                        style={{
                                          cursor: "pointer",
                                          fontSize: "20px",
                                          color: "#1890ff",
                                        }}
                                      >
                                        {savedBlogs.includes(blog.documentId) ? (
                                          <StarFilled />
                                        ) : (
                                          <StarOutlined />
                                        )}
                                      </div>
                                    </div>
                                    <div className="date d-flex gap-2">
                                      <span className="d-inline-block">
                                        <p disabled style={{ pointerEvents: 'none' }}>
                                          {blog?.documentType?.name === 'public' ? <span className="material-symbols-outlined">
                                            public
                                          </span> : <span className="material-symbols-outlined">
                                            lock
                                          </span>}
                                        </p>
                                      </span>
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
                                  <div className="blog-tags mb-2">
                                    {blog?.tags?.map((tagItem) => (
                                      <Tag
                                        key={tagItem?.tag?.documentId}
                                        color={colorsTag[blogIndex % colorsTag.length]}
                                        style={{ marginBottom: '5px' }}
                                      >
                                        {tagItem?.tag?.name}
                                      </Tag>
                                    ))}
                                  </div>
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
                                            blog?.creator?.avatarMedia?.file_path || blog6
                                          }
                                          alt="avatar"
                                        />
                                      </Link>
                                      <span className="ms-2">
                                        {blog?.creator?.username || "Anonymous"}
                                      </span>
                                    </div>
                                    <div className="comment d-flex align-items-center">
                                      <i className="material-symbols-outlined me-2 md-18">
                                        chat_bubble_outline
                                      </i>
                                      {blog?.comments.length || 0} comments
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
            </>
          )}
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
