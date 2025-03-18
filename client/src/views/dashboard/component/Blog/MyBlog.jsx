import React, { useEffect, useState } from "react";
import { Row, Col, Image, Container } from "react-bootstrap";
import { Input, Select, Space, Pagination, Tag, Modal, notification } from "antd"; // Import Modal and notification from antd
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import BlogDetail from "./BlogDetail";
import AppDrawer from "./Drawer"; // Ensure the Drawer component is correctly imported
import { Button } from "antd"; // Import Button from antd
import DrawerEdit from "./DrawerEdit"; // Import the new DrawerEdit component

// img
import blog6 from "../../../../assets/images/blog/01.jpg";
import { convertToVietnamDate } from "../../others/format";
import { colorsTag } from "../../others/format";
import { fetchTag } from "../../../../actions/actions/tag";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../icons/uiverse/Loading";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiDeleteBlog, apiGetMyBlog } from "../../../../services/blog";
import { apiGetDocumentTag } from "../../../../services/tag"; // Import the new API
import Create from "../../icons/uiverse/Create";


const { Search } = Input;
const { Option } = Select;

const MyBlog = () => {
    const dispatch = useDispatch();
    const { profile } = useSelector((state) => state.root.user || {});
    const { tags } = useSelector((state) => state.root.tag || {});
    const queryClient = useQueryClient();

    const [searchText, setSearchText] = useState("");
    const [pageParam, setPageParam] = useState(1);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [savedBlogs, setSavedBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [editBlog, setEditBlog] = useState(null);

    const showDrawer = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    const showEditDrawer = (blog) => {
        setEditBlog(blog);
        setIsEditDrawerOpen(true);
    };

    const closeEditDrawer = () => {
        setIsEditDrawerOpen(false);
        setEditBlog(null);
    };

    const { data: myBlogs = [], isLoading: isMyBlogLoading } = useQuery({
        queryKey: ["myBlogs", profile?.documentId],
        queryFn: async () => {
            const response = await apiGetMyBlog({ userId: profile?.documentId });
            return response.data?.data || [];
        },
        enabled: !!profile?.documentId,
    });
    const { data: tag, isLoading: isTagLoading } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const response = await fetchTag();
            return response.data?.data || [];
        },
        enabled: !!profile?.documentId,
    });

    useEffect(() => {
        if (searchText) {
            const filtered = myBlogs.filter(blog =>
                blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
                blog.description.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredBlogs(filtered);
        } else {
            setFilteredBlogs(myBlogs);
        }
    }, [searchText, myBlogs]);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleSaveBlog = (blogId) => {
        // Implement save blog logic here
    };

    const handleBlogClick = (blog) => {
        setSelectedBlog(blog);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedBlog(null);
    };

    const handleDeleteBlog = (documentId) => {
        console.log("Delete blog:", documentId);
        Modal.confirm({
            title: 'Are you sure you want to delete this blog?',
            onOk: async () => {
                try {
                    await apiDeleteBlog({ documentId });
                    notification.success({
                        message: "Delete Blog",
                        description: "Blog deleted successfully",
                    });
                    queryClient.invalidateQueries('myBlogs');
                } catch (error) {
                    console.error('Error deleting blog:', error);
                }
            },
        });
    };

    const { data: blogTags, isLoading: isBlogTagsLoading, error: blogTagsError } = useQuery({
        queryKey: ["blogTags", myBlogs?.map(blog => blog.documentId)],
        queryFn: async () => {
            const tags = await Promise.all(
                myBlogs.map(async (blog) => {
                    const response = await apiGetDocumentTag({ documentId: blog.documentId });
                    //console.log("Response:", response); // Log ra chi tiết phản hồi
                    return { [blog.documentId]: response?.data?.data || [] };
                })
            );
            return tags.reduce((acc, tag) => ({ ...acc, ...tag }), {});
        },
        enabled: !!myBlogs?.length,
    });



    //console.log("myBlogs", myBlogs);
    //console.log("blogTags", blogTags);

    return (
        <>
            <div id="content-page" className="content-page">
                <Container>
                    <Row className="mb-2">
                        <Col lg="12">
                            <Card>
                                <Card.Body>
                                    <Space className="w-100 justify-content-between">
                                        <Search
                                            placeholder="Search Blog..."
                                            allowClear
                                            enterButton="Search"
                                            size="large"
                                            style={{ width: 400 }}
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            onSearch={handleSearch}
                                        />
                                        <div onClick={showDrawer} style={{ cursor: "pointer" }}>
                                            <Create />
                                        </div>
                                    </Space>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                    {isMyBlogLoading ? (
                        <div className="col-sm-12 text-center">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <Row>
                                {(filteredBlogs.length ? filteredBlogs : myBlogs).map((blog, blogIndex) => (
                                    <Col lg="12" key={blog.id}>
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
                                                                        <div className="date">
                                                                            <Link to="#" tabIndex="-1">
                                                                                {convertToVietnamDate(blog?.createdAt)}
                                                                            </Link>
                                                                        </div>
                                                                        <div className="d-flex align-items-center">
                                                                            <div
                                                                                className="bookmark-icon"
                                                                                onClick={() => showEditDrawer(blog)}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    fontSize: "20px",
                                                                                    color: "#1890ff",
                                                                                }}
                                                                            >
                                                                                <span class="material-symbols-outlined">
                                                                                    border_color
                                                                                </span>
                                                                            </div>
                                                                            <div
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteBlog(blog.documentId)}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    fontSize: "20px",
                                                                                    color: "#ff4d4f",
                                                                                    marginLeft: "10px",
                                                                                }}
                                                                            >
                                                                                <span class="material-symbols-outlined">
                                                                                    delete
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
                                                                        {blogTags?.[blog?.documentId]?.map((tagItem) => (
                                                                            <Tag
                                                                                key={tagItem?.tag_id?.id}
                                                                                color={colorsTag[blogIndex % colorsTag.length]}
                                                                                style={{ marginBottom: '5px' }}
                                                                            >
                                                                                {tagItem?.tag_id?.name}
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
                                                                                    src={blog?.author?.profile_picture || blog6}
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
                                                                        <div className="d-flex align-items-center">
                                                                            <div
                                                                                className="bookmark-icon"
                                                                                onClick={() => showEditDrawer(blog)}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    fontSize: "20px",
                                                                                    color: "#1890ff",
                                                                                }}
                                                                            >
                                                                                <span class="material-symbols-outlined">
                                                                                    border_color
                                                                                </span>
                                                                            </div>
                                                                            <div
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteBlog(blog.documentId)}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    fontSize: "20px",
                                                                                    color: "#ff4d4f",
                                                                                    marginLeft: "10px",
                                                                                }}
                                                                            >
                                                                                <span class="material-symbols-outlined">
                                                                                    delete
                                                                                </span>
                                                                            </div>
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
                                                                    <div className="blog-tags mb-2">
                                                                        {blogTags?.[blog?.documentId]?.map((tagItem) => (

                                                                            <Tag
                                                                                key={tagItem?.tag_id?.id}
                                                                                color={colorsTag[blogIndex % colorsTag.length]}
                                                                                style={{ marginBottom: '5px' }}
                                                                            >
                                                                                {tagItem?.tag_id?.name}
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
                                                                                    src={blog?.author?.profile_picture || blog6}
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
                                        total={myBlogs.length}
                                        pageSize={10}
                                        onChange={(page) => setPageParam(page)}
                                        showSizeChanger={false}
                                        disabled={isMyBlogLoading}
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
            <AppDrawer title="Verify article" width={520} closable={false} onClose={closeDrawer} open={isDrawerOpen}>
                {/* Content of the Drawer */}
            </AppDrawer>
            <DrawerEdit blog={editBlog} visible={isEditDrawerOpen} onClose={closeEditDrawer} />
        </>
    );
};

export default MyBlog;
