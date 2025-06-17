/* eslint-disable no-undef */
// PostItem.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { Image, Tag, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostMedia, fetchPostTag } from "../../../../actions/actions";
import { apiDeletePost, apiGetPostFriend } from "../../../../services/post";
import { FaRegComment, FaShare } from "react-icons/fa6";
import ModalCardPost from "./modalCardPost";
import "./post.scss";

// Images import (you can import them or pass them as props)

import { Col } from "react-bootstrap";
import Card from "../../../../components/Card";
import CustomToggle from "../../../../components/dropdowns";
import ShareOffcanvas from "../../../../components/share-offcanvas";
import { colorsTag, convertToDateTime } from "../../others/format";

//image
import icon1 from "../../../../assets/images/icon/01.png"; // Example icon for like
import { ListLike, ListComment } from "./listLikeComment";
import ActionLike from "./actionLike";
import { apiGetPostMedia } from "../../../../services/media";
import Mark from "./ComponentCardPost/mark";
import EditPostModal from "./ComponentCardPost/editPost";
import { apiGetPostComment } from "../../../../services/comment";
import { Modal as AntdModal } from 'antd';
import { useQueryClient, useQuery } from '@tanstack/react-query';

const CardPost = ({ post, pageInfo }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.root.auth || {});
    const { token } = useSelector((state) => state.root.auth || {});
    const createdAt = new Date(post?.createdAt);


    const [imageController, setImageController] = useState({
        toggler: false, // Kiểm soát hiển thị gallery
        slide: 0, // Vị trí ảnh hiện tại
    });

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleOpenCommentModal = () => setShowCommentModal(true);
    const handleCloseCommentModal = () => setShowCommentModal(false);
    const handleOpenEditModal = () => setShowEditModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);
    const queryClient = useQueryClient();


    // Hàm xử lý `onClick` khi click vào ảnh
    const handleImageClick = (index) => {
        setImageController({
            toggler: true, // Hiển thị gallery
            slide: index, // Đặt vị trí ảnh hiện tại (tính từ 1, không phải 0)
        });
    };


    const { data: parentComments = { data: { data: [] } } } = useQuery({
        queryKey: ["parentComments", post.documentId],
        queryFn: () => apiGetPostComment({ postId: post.documentId, token }),
        enabled: !!post.documentId,
    });


    const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

    const validSources = Array.isArray(post?.medias)
        ? post.medias
            .map((item) => item?.file_path)
            .filter((path) => typeof path === "string" && path.trim() !== "")
        : [];

    const validTags = Array.isArray(post?.tags)
        ? post?.tags.map((item) => item?.name)
        : [];

    const colors = colorsTag;

    const [reactionCount, setReactionCount] = useState(post?.reactions?.length || 0);

    // Luôn đồng bộ reactionCount với post.reactions
    useEffect(() => {
        setReactionCount(post?.reactions?.length || 0);
    }, [post?.reactions]);

    const handleReactionSelect = (reaction, change) => {
        if (change === 1) {
            setReactionCount(reactionCount + 1);
        } else if (change === -1) {
            setReactionCount(reactionCount - 1);
        }
    };

    const handleDeletePost = async () => {
        AntdModal.confirm({
            title: 'Are you sure you want to delete this post?',
            onOk: async () => {
                try {
                    await apiDeletePost({ documentId: post?.documentId, token });
                    notification.success({
                        message: "Delete Post",
                        description: "Post deleted successfully",
                    });
                    queryClient.invalidateQueries('post');

                } catch (error) {
                    console.error('Error deleting friend:', error);
                }
            },
        });
    }

    return (
        <>
            <Card.Body>
                <div className="user-post-data">
                    <div className="d-flex justify-content-between">
                        <div className="me-3">
                            <div className="user-img">
                                <img
                                    src={
                                        post?.user_id
                                            ? post?.user?.avatarMedia?.file_path
                                            : pageInfo?.profileImage?.file_path
                                    }
                                    alt="userimg"
                                    className="avatar-60 rounded-circle"
                                />
                            </div>
                        </div>
                        <div className="w-100">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5 className="d-flex align-items-center">
                                        <Link to={
                                            post?.user?.documentId === user?.documentId
                                                ? `/user-profile`
                                                : post?.user_id
                                                    ? `/friend-profile/${post?.user?.documentId}`
                                                    : `/page/${pageInfo?.page_name}`
                                        }
                                            state={
                                                post?.user?.documentId === user?.documentId
                                                    ? {}
                                                    : post?.user_id
                                                        ? { friendId: post?.user_id }
                                                        : {
                                                            pageId: pageInfo?.documentId,
                                                            pageDetail: pageInfo
                                                        }
                                            }
                                            style={{ textDecoration: "none" }}>
                                            <h4 style={{ fontWeight: 'bold' }}>{post?.user_id
                                                ? post?.user?.fullname
                                                : pageInfo?.page_name || 'Unknown Page'
                                            }</h4>
                                        </Link>
                                        {pageInfo?.is_verified && (
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
                                    </h5>
                                    <div className="d-flex gap-2">
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">{convertToDateTime(post?.createdAt)}</Tooltip>}>
                                            <span className="d-inline-block">
                                                <p className="mb-0 text-primary">{timeAgo}</p>
                                            </span>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">{post?.type === 'public' || post?.postType?.name === 'public' ? 'Public' : 'Private'}</Tooltip>}>
                                            <span className="d-inline-block">
                                                <p disabled style={{ pointerEvents: 'none' }}>
                                                    {post?.type === 'public' || post?.postType?.name === 'public' ? <span className="material-symbols-outlined">
                                                        public
                                                    </span> : <span className="material-symbols-outlined">
                                                        lock
                                                    </span>}
                                                </p>
                                            </span>
                                        </OverlayTrigger>

                                    </div>
                                </div>

                                <div className="card-post-toolbar">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="bg-transparent">
                                            <span className="material-symbols-outlined">
                                                more_horiz
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu m-0 p-0">
                                            <Mark post={post} profile={user} />
                                            {post?.user?.documentId === user?.documentId && (
                                                <>
                                                    < Dropdown.Item className="dropdown-item p-3" to="#" onClick={handleOpenEditModal}>
                                                        <div className="d-flex align-items-top">
                                                            <i className="material-symbols-outlined">edit</i>
                                                            <div className="data ms-2">
                                                                <h6>Edit Post</h6>
                                                                <p className="mb-0">
                                                                    Update your post and saved items
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className="dropdown-item p-3" to="#" onClick={handleDeletePost}>
                                                        <div className="d-flex align-items-top">
                                                            <i className="material-symbols-outlined">
                                                                delete
                                                            </i>
                                                            <div className="data ms-2">
                                                                <h6>Delete</h6>
                                                                <p className="mb-0">
                                                                    Remove thids Post on Timeline
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Dropdown.Item>
                                                </>)}
                                                {pageInfo?.creator?.documentId === user?.documentId && (
                                                <>
                                                    < Dropdown.Item className="dropdown-item p-3" to="#" onClick={handleOpenEditModal}>
                                                        <div className="d-flex align-items-top">
                                                            <i className="material-symbols-outlined">edit</i>
                                                            <div className="data ms-2">
                                                                <h6>Edit Post</h6>
                                                                <p className="mb-0">
                                                                    Update your post and saved items
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className="dropdown-item p-3" to="#" onClick={handleDeletePost}>
                                                        <div className="d-flex align-items-top">
                                                            <i className="material-symbols-outlined">
                                                                delete
                                                            </i>
                                                            <div className="data ms-2">
                                                                <h6>Delete</h6>
                                                                <p className="mb-0">
                                                                    Remove thids Post on Timeline
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Dropdown.Item>
                                                </>)}
                                            <Dropdown.Item className="dropdown-item p-3" to="#">
                                                <div className="d-flex align-items-top">
                                                    <i className="material-symbols-outlined">
                                                        report_problem
                                                    </i>
                                                    <div className="data ms-2">
                                                        <h6>Report</h6>
                                                        <p className="mb-0">
                                                            Report this post
                                                        </p>
                                                    </div>
                                                </div>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="mt-2">
                    {post?.friends?.length > 0 && (
                        <div className="d-flex flex-wrap">
                            {post?.friends?.map((friend, index) => (
                                <Tag
                                    key={index}
                                    color="blue"
                                    className="me-1 mb-1"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Link to={`/friend-profile/${friend?.user?.documentId}`}
                                        state={{ friendId: friend?.user?.documentId }}
                                        style={{ color: 'inherit', textDecoration: 'none' }}
                                    >
                                        @{friend?.user?.username}
                                    </Link>
                                </Tag>
                            ))}
                        </div>
                    )}
                    <p className="mt-2">
                        {post?.content?.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                    {post?.tags?.map((tag, index) => (
                        <Tag
                            key={index}
                            color={colors[index % colors.length]} // Áp dụng màu theo danh sách
                        >
                            {tag?.name}
                        </Tag>
                    ))}
                </div>

                <div className="user-post mt-3">
                    <Image.PreviewGroup>
                        {Array.isArray(validSources) && validSources.length === 1 && (
                            // 1 ảnh full chiều rộng
                            <Image
                                src={validSources[0]}
                                alt="post1"
                                style={{
                                    width: "600px",
                                    height: "auto",
                                    objectFit: "fill",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                }}
                            />
                        )}

                        {Array.isArray(validSources) && validSources.length === 2 && (
                            // 2 ảnh chia đều 50%
                            <div
                                className="d-grid"
                                style={{ gridTemplateColumns: "1fr 1fr", gap: "8px" }}
                            >
                                {validSources.map((src, index) => (
                                    <Image
                                        key={index}
                                        src={src}
                                        alt={`post${index + 1}`}
                                        style={{
                                            width: "100%",
                                            height: "300px", // Đặt chiều cao cố định
                                            objectFit: "fill", // Đảm bảo giữ tỷ lệ ảnh
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {Array.isArray(validSources) && validSources.length === 3 && (
                            // 3 ảnh: 1 lớn bên trái, 2 nhỏ bên phải
                            <div
                                className="d-grid"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr", // Cột trái chiếm 2 phần, cột phải chiếm 1 phần
                                    gridTemplateRows: "1fr 1fr", // 2 hàng đều nhau
                                    gap: "8px", // Khoảng cách giữa các ảnh
                                }}
                            >
                                {validSources.map((src, index) => (
                                    <Image
                                        key={index}
                                        src={src}
                                        alt={`post${index + 1}`}
                                        style={{
                                            width: "100%",
                                            height: "100%", // Đảm bảo chiều cao được tự động giãn
                                            gridColumn: index === 0 ? "1 / 2" : "2 / 3", // Ảnh lớn ở cột đầu tiên
                                            gridRow:
                                                index === 0
                                                    ? "1 / 3"
                                                    : index === 1
                                                        ? "1 / 2"
                                                        : "2 / 3", // Ảnh lớn chiếm 2 hàng
                                            objectFit: "cover", // Cắt ảnh để phù hợp container
                                            borderRadius: "8px", // Làm tròn góc
                                            cursor: "pointer", // Hiển thị con trỏ khi hover
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {Array.isArray(validSources) && validSources.length > 3 && (
                            <div
                                className="d-grid"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr",
                                    gridTemplateRows: "1fr 1fr",
                                    gap: "8px",
                                }}
                            >
                                {validSources.slice(0, 3).map((src, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            position: "relative",
                                            gridColumn: index === 0 ? "1 / 2" : "2 / 3",
                                            gridRow:
                                                index === 0
                                                    ? "1 / 3"
                                                    : index === 1
                                                        ? "1 / 2"
                                                        : "2 / 3",
                                        }}
                                    >
                                        <Image
                                            preview={false} // Tắt preview mặc định
                                            src={src}
                                            alt={`post${index + 1}`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleImageClick(index)} // Đặt slide index
                                        />
                                        {index === 2 && validSources.length > 3 && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "0",
                                                    left: "0",
                                                    width: "100%",
                                                    height: "100%",
                                                    background: "rgba(0, 0, 0, 0.5)",
                                                    color: "#fff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "20px",
                                                    fontWeight: "bold",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleImageClick(2)} // Đặt từ ảnh thứ 3
                                            >
                                                +{validSources.length - 3}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <Image.PreviewGroup
                                    preview={{
                                        visible: imageController.toggler,
                                        current: imageController.slide, // Đặt ảnh hiện tại
                                        onVisibleChange: (vis) =>
                                            setImageController((prev) => ({
                                                ...prev,
                                                toggler: vis,
                                            })),
                                        onChange: (current) =>
                                            setImageController((prev) => ({
                                                ...prev,
                                                slide: current,
                                            })), // Cập nhật trạng thái khi chuyển mũi tên
                                    }}
                                >
                                    {validSources.map((src, index) => (
                                        <Image
                                            key={`gallery-${index}`}
                                            src={src}
                                            alt={`hidden-gallery-${index}`}
                                            style={{ display: "none" }} // Ẩn khỏi giao diện chính
                                        />
                                    ))}
                                </Image.PreviewGroup>
                            </div>
                        )}
                    </Image.PreviewGroup>
                </div>

                <div className="comment-area mt-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div className="like-block position-relative d-flex align-items-center">
                            <div className="d-flex align-items-center">
                                <div className="like-data">
                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle}>
                                            <img src={icon1} className="img-fluid" alt="" />
                                        </Dropdown.Toggle>
                                    </Dropdown>
                                </div>
                                <div className="total-like-block ms-2 me-3">
                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle} id="post-option">
                                            {reactionCount}
                                        </Dropdown.Toggle>
                                        <ListLike listLike={post?.reactions} />
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="total-comment-block">
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle} id="post-option">
                                        {post?.comments?.length} <FaRegComment />
                                    </Dropdown.Toggle>
                                    <ListComment listComment={post} />
                                </Dropdown>
                            </div>
                        </div>
                        <ShareOffcanvas share={post?.shares} />
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center flex-wrap action">
                        <div className="like-block position-relative d-flex align-items-center">
                            <ActionLike post={post} onSelect={handleReactionSelect} />
                            <div className="total-comment-block">
                                <button className="btn btn-white d-flex align-items-center post-button" onClick={handleOpenCommentModal}>
                                    <FaRegComment /> <h6>Comment</h6>
                                </button>
                            </div>
                            <button className="btn btn-white d-flex align-items-center post-button">
                                <FaShare /> <h6>Share</h6>
                            </button>
                        </div>
                    </div>

                    <hr />

                    <ul className="post-comments list-inline p-0 m-0">
                        {parentComments.data.data.length === 0 ? (
                            <li className="mb-2 text-center">
                                <p>No comments available.</p>
                            </li>
                        ) : (
                            parentComments.data.data.slice(0, 2).map((comment) => (
                                <li className="mb-2" key={comment.documentId}>
                                    <div className="d-flex">
                                        <div className="user-img">
                                            <img
                                                src={comment.user?.avatarMedia?.file_path}
                                                alt="user1"
                                                className="avatar-35 rounded-circle img-fluid"
                                            />
                                        </div>
                                        <div className="comment-data-block ms-3">
                                            <h5 style={{ fontWeight: 'bold' }}>{comment.user.username}</h5>
                                            <div className="d-flex flex-wrap align-items-center">
                                                <p className="mb-0">
                                                    {comment.content.split("\n").map((line, index) => (
                                                        <React.Fragment key={index}>
                                                            {line}
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                                </p>
                                            </div>

                                            <div className="d-flex flex-wrap align-items-center comment-activity">

                                                <Link to="#" onClick={handleOpenCommentModal}>
                                                    Reply
                                                </Link>
                                                <span>
                                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>


                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                    <form className="comment-text d-flex align-items-center mt-3" onClick={handleOpenCommentModal}>
                        <input
                            type="text"
                            className="form-control rounded"
                            placeholder="Enter Your Comment"
                        />
                    </form>
                </div>
            </Card.Body >
            <ModalCardPost show={showCommentModal} handleClose={handleCloseCommentModal} post={post} page={pageInfo} />
            <EditPostModal
                show={showEditModal}
                handleClose={handleCloseEditModal}
                post={post}
                page={pageInfo}
                friends={post?.friends}
                validTags={validTags}
                validSources={validSources}
            />
        </>
    );
};

export default CardPost;

