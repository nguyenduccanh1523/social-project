import React, { useEffect, useState } from 'react'
import { CiBookmark } from "react-icons/ci";
import { IoIosBookmark } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import Card from '../../../../components/Card'
import { apiGetBlogDetail } from '../../../../services/blog'
import { apiGetPostMedia } from '../../../../services/media'
import { useSelector } from 'react-redux'
import { apiGetMarkBlog, apiDeleteMarkPost } from '../../../../services/markpost'
import { message } from 'antd'

//img 
import store1 from '../../../../assets/images/store/01.jpg'
import { convertToVietnamDate } from '../../others/format';

const MarkBlog = () => {
    const navigate = useNavigate();
    const [markPost, setMarkPost] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState({});
    const { user } = useSelector((state) => state.root.auth || {});
    const { token } = useSelector((state) => state.root.auth || {});
    const document = user?.documentId;


    const fetchMarkBlog = async () => {
        try {
            const response = await apiGetMarkBlog({ userId: document, token });
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
        fetchMarkBlog();
    }, [document]);


    const handleToggleBookmark = async (e, postId) => {
        e.stopPropagation();
        if (bookmarkedPosts[postId]) {
            // Nếu đang bookmark, gọi API để xóa
            try {
                await apiDeleteMarkPost({ documentId: postId, token });
                setBookmarkedPosts((prev) => ({
                    ...prev,
                    [postId]: false, // Đặt lại trạng thái bookmark
                }));
                message.success('Mark blog removed successfully!'); // Hiển thị thông báo thành công

                // Đợi 3 giây trước khi tải lại item
                setTimeout(() => {
                    fetchMarkBlog(); // Gọi lại hàm fetchMarkBlog để tải lại dữ liệu
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


    return (
        <>

            {markPost.slice(0, 3).map((post, index) => (
                <Col sm="6" md="6" lg="4" key={post?.documentId}>
                    <Card className="card-block card-stretch card-height product">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between pb-3">
                                <div className="d-flex align-items-center">
                                    <img className="img-fluid rounded-circle avatar-30" src={post?.documentShare?.creator?.avatarMedia?.file_path} alt="" />
                                    <div className="ms-2">
                                        <p className="mb-0 line-height">{post?.documentShare?.creator?.username || 'Unknown'}</p>
                                        <h6><div to="#">{convertToVietnamDate(post?.documentShare?.createdAt)}</div></h6>
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
                                {post?.documentShare?.media ? (
                                    <img
                                        src={post?.documentShare?.media?.file_path || store1}
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
                                <h4 className="mb-1 text-truncate fw-bold">{post?.documentShare?.title || 'Post Title'}</h4>
                            </div>
                            <div className="product-description mt-3">
                                <h6 className="mb-1">{post?.documentShare?.content || 'Post Title'}</h6>
                            </div>
                            <div className="d-flex gap-2 mt-3">
                                <span className="material-symbols-outlined">link</span>
                                <Link to={post?.documentShare?.link_document} className='text-truncate'>{post?.documentShare?.link_document}</Link>
                            </div>
                            <div className="d-flex gap-2 mt-3">
                                {post?.documentShare?.comments?.length || 0} <span className="material-symbols-outlined">comment</span>
                                {post?.documentShare?.shares?.length || 0} <span className="material-symbols-outlined">share</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </>
    )
}

export default MarkBlog;
