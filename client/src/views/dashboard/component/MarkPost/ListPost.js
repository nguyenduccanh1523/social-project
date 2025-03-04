import React, { useEffect, useState } from 'react'
import { CiBookmark } from "react-icons/ci";
import { IoIosBookmark } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import Card from '../../../../components/Card'
import { apiGetPostDetail } from '../../../../services/post'
import { apiGetPostMedia } from '../../../../services/media'
import { useSelector } from 'react-redux'
import { apiGetMarkPost, apiDeleteMarkPost } from '../../../../services/markpost'
import { formatDistanceToNow } from 'date-fns'
import { message,  Pagination  } from 'antd'

//img 
import user1 from '../../../../assets/images/user/01.jpg'
import store1 from '../../../../assets/images/store/01.jpg'

const MarkPost = () => {
    const navigate = useNavigate();
    const [markPost, setMarkPost] = useState([]);
    const [postDetails, setPostDetails] = useState([]);
    const [postMedia, setPostMedia] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState({});
    const { profile } = useSelector((state) => state.root.user || {});
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const document = profile?.documentId;

    const fetchMarkPost = async () => {
        try {
            const response = await apiGetMarkPost({ userId: document });
            if (Array.isArray(response.data.data)) {
                setMarkPost(response.data.data);
                const initialBookmarks = response.data.data.reduce((acc, post) => {
                    acc[post.documentId] = true; // Đặt mặc định là true để hiển thị bookmark
                    return acc;
                }, {});
                setBookmarkedPosts(initialBookmarks);
            }
        } catch (error) {
            console.error("Error fetching mark posts:", error);
        }
    };

    useEffect(() => {
        fetchMarkPost();
    }, [document]);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const details = await Promise.all(
                    markPost.map(async (post) => {
                        const response = await apiGetPostDetail({ documentId: post?.post_id?.documentId });
                        return response.data;
                    })
                );
                setPostDetails(details);
            } catch (error) {
                console.error("Error fetching post details:", error);
            }
        };

        if (markPost.length > 0) {
            fetchPostDetails();
        }
    }, [markPost]);

    useEffect(() => {
        const fetchPostMedia = async () => {
            try {
                const media = await Promise.all(
                    postDetails.map(async (post) => {
                        const response = await apiGetPostMedia({ postId: post?.data?.documentId });
                        return response.data;
                    })
                );
                setPostMedia(media);
            } catch (error) {
                console.error("Error fetching post media:", error);
            }
        };

        if (postDetails.length > 0) {
            fetchPostMedia();
        }
    }, [postDetails]);

    const handleToggleBookmark = async (e, postId) => {
        e.stopPropagation();
        if (bookmarkedPosts[postId]) {
            // Nếu đang bookmark, gọi API để xóa
            try {
                await apiDeleteMarkPost({ documentId: postId });
                setBookmarkedPosts((prev) => ({
                    ...prev,
                    [postId]: false, // Đặt lại trạng thái bookmark
                }));
                message.success('Mark post removed successfully!'); // Hiển thị thông báo thành công

                // Đợi 3 giây trước khi tải lại item
                setTimeout(() => {
                    fetchMarkPost(); // Gọi lại hàm fetchMarkPost để tải lại dữ liệu
                }, 3000);
            } catch (error) {
                console.error('Error deleting mark post:', error);
                message.error('An error occurred while removing the mark post.'); // Hiển thị thông báo lỗi
            }
        } else {
            // Nếu không bookmark, chỉ cần cập nhật trạng thái
            setBookmarkedPosts((prev) => ({
                ...prev,
                [postId]: true, // Đặt lại trạng thái bookmark
            }));
        }
    }
    console.log('markPost', markPost);

    // Tính toán tags cho trang hiện tại từ danh sách đã lọc
    const getCurrentPagePostMark = () => {
        if (!markPost) return [];
        const startIndex = (currentPage - 1) * pageSize;
        return markPost.slice(startIndex, startIndex + pageSize);
    };

    return (
        <>
            <div id="content-page" className="content-page">
                <Container>
                    <Row>
                        <Col lg="12">
                            <Card className=" shadow-none p-0">
                                <Card.Header className=" d-flex justify-content-between rounded border-bottom-0">
                                    <div className="header-title">
                                        <h4>Mark Post</h4>
                                    </div>

                                </Card.Header>
                            </Card>
                            <Row>
                                {getCurrentPagePostMark().map((post, index) => (
                                    <Col sm="6" md="6" lg="4" key={post?.documentId}>
                                        <Card className="card-block card-stretch card-height product">
                                            <Card.Body>
                                                <div className="d-flex align-items-center justify-content-between pb-3">
                                                    <div className="d-flex align-items-center">
                                                        <img className="img-fluid rounded-circle avatar-30" src={postDetails[index]?.data?.user_id?.profile_picture} alt="" />
                                                        <div className="ms-2">
                                                            <p className="mb-0 line-height">{postDetails[index]?.data?.user_id?.username || 'Unknown'}</p>
                                                            {/* <h6><Link to="#">{formatDistanceToNow(new Date(postDetails[index]?.data?.createdAt), { addSuffix: true }) || 'Unknown'}</Link></h6> */}
                                                        </div>
                                                    </div>
                                                    <div className="d-block line-height" onClick={(e) => handleToggleBookmark(e, post?.documentId)}>
                                                        {bookmarkedPosts[post?.documentId] ? (
                                                            <IoIosBookmark style={{ cursor: 'pointer', fontSize: '30px' }} />
                                                        ) : (
                                                            <CiBookmark style={{ cursor: 'pointer', fontSize: '30px' }} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="image-block position-relative">
                                                    {postMedia[index]?.data?.[0]?.media?.file_path ? (
                                                        <img
                                                            src={postMedia[index]?.data?.[0]?.media?.file_path || store1}
                                                            className="img-fluid w-100 h-100 rounded"
                                                            alt="product-img"
                                                        />
                                                    ) : (
                                                        <div className="no-image-placeholder">
                                                            <p>No image available</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="product-description mt-3">
                                                    <h6 className="mb-1">{postDetails[index]?.data?.content || 'Post Title'}</h6>
                                                </div>
                                                <div className="d-flex gap-2 mt-3">
                                                    {postDetails[index]?.data?.reaction?.length || 0} <span className="material-symbols-outlined">thumb_up</span>
                                                    {postDetails[index]?.data?.comments?.length || 0} <span className="material-symbols-outlined">comment</span>
                                                    {postDetails[index]?.data?.shares?.length || 0} <span className="material-symbols-outlined">share</span>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-3 mb-3">
                        <Col lg="12" className="d-flex justify-content-end">
                            <Pagination
                                current={currentPage}
                                total={markPost?.length || 0}
                                pageSize={pageSize}
                                onChange={setCurrentPage}
                                showSizeChanger={false}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default MarkPost