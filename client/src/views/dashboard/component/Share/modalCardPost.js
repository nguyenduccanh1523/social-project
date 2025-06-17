import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { Image, Tag } from "antd";
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from "react-redux";
import { fetchPostMedia, fetchPostTag } from "../../../../actions/actions";
import { apiGetPostFriend } from "../../../../services/post";
import { FaRegComment, FaShare } from "react-icons/fa6";
import EmojiPicker from 'emoji-picker-react';
// Images import (you can import them or pass them as props)

import { Col } from "react-bootstrap";
import Card from "../../../../components/Card";
import CustomToggle from "../../../../components/dropdowns";
import ShareOffcanvas from "../../../../components/share-offcanvas";
import { colorsTag, convertToDateTime } from "../../others/format";
import "./post.scss";

//image

import icon1 from "../../../../assets/images/icon/01.png"; // Example icon for like
import ActionComment from "./actionComment";
import Send from "../ShareActionComment/Send";
import ActionLike from "./actionLike";
import { ListComment, ListLike } from "./listLikeComment";

const ModalCardPost = ({ show, handleClose, post, page }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.root.auth || {});
    const createdAt = new Date(post?.createdAt);

    const [comment, setComment] = useState((''));
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef(null);


    const onEmojiClick = (emoji) => {
        setComment(prevComment => prevComment + emoji.emoji);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setComment(prevComment => prevComment + '\n');
        }
    };

    const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
            setShowPicker(false);
        }
    };

    const handleSendClick = async () => {
        // Logic for sending the comment
        // You can call the Send component's handleSendClick function here if needed
        setComment(''); // Reset the comment after sending
    };

    const handleSendSuccess = () => {
        setComment(''); // Reset the comment after successful send
    };

    const handleSubmit = async (e) => {
        console.log('Form data:', comment);
        e.preventDefault();
        // Add your submit logic here
        await handleSendClick(); // Call the send function
        setShowPicker(false); // Close the emoji picker
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [imageController, setImageController] = useState({
        toggler: false, // Kiểm soát hiển thị gallery
        slide: 0, // Vị trí ảnh hiện tại
    });

    const [showCommentModal, setShowCommentModal] = useState(false);

    const handleOpenCommentModal = () => setShowCommentModal(true);
    const handleCloseCommentModal = () => setShowCommentModal(false);

    //console.log("post", post);
    // Hàm xử lý `onClick` khi click vào ảnh
    const handleImageClick = (index) => {
        setImageController({
            toggler: true, // Hiển thị gallery
            slide: index, // Đặt vị trí ảnh hiện tại (tính từ 1, không phải 0)
        });
    };


    const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

    const validSources = Array.isArray(post?.medias)
        ? post?.medias
            .map((item) => item?.file_path)
            .filter((path) => typeof path === "string" && path.trim() !== "")
        : [];



    const colors = colorsTag;


    const { data: friendsData } = useQuery({
        queryKey: ['postFriends', post?.post_friends?.map(friend => friend.documentId)],
        queryFn: () => Promise.all(post?.post_friends?.map(friend => apiGetPostFriend({ documentId: friend.documentId }))),
        enabled: !!post?.post_friends,
    });

    const friends = friendsData?.map(friend => friend?.data?.data) || [];


    const friendNames = friends?.map(friend => friend?.users_permissions_user?.username) || [];

    const [reactionCount, setReactionCount] = useState(post?.reactions?.length || 0);

    const handleReactionSelect = (reaction, change) => {
        if (change === 1) {
            setReactionCount(reactionCount + 1);
        } else if (change === -1) {
            setReactionCount(reactionCount - 1);
        }
    };

    return (
        <>
            <Modal size='lg' className="custom-modal-width" scrollable={true} show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title > <b>{post?.user?.fullname || page?.page_name}'s Post</b> </Modal.Title>
                    <button
                        type="button"
                        className="btn btn-secondary lh-1"
                        onClick={handleClose}
                    >
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="user-post-data">
                        <div className="d-flex justify-content-between">
                            <div className="me-3">
                                <div className="user-img">
                                    <img
                                        src={post?.user?.avatarMedia?.file_path || post?.page?.profileImage?.file_path}
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
                                                        : `/page/${page?.page_name}`
                                            }
                                                state={
                                                    post?.user?.documentId === user?.documentId
                                                        ? {}
                                                        : post?.user_id
                                                            ? { friendId: post?.user_id }
                                                            : {
                                                                pageId: page?.documentId,
                                                                pageDetail: page
                                                            }
                                                }
                                                style={{ textDecoration: "none" }}>
                                                <h5 style={{fontWeight: 'bold'}}>{post?.user_id
                                                    ? post?.user?.fullname
                                                    : post?.page?.page_name || 'Unknown Page'
                                                }</h5>
                                            </Link>
                                        </h5>
                                        <div className="d-flex gap-2">
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">{convertToDateTime(post?.createdAt)}</Tooltip>}>
                                                <span className="d-inline-block">
                                                    <p className="mb-0 text-primary">{timeAgo}</p>
                                                </span>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">{post?.type === 'public' ? 'Public' : 'Private'}</Tooltip>}>
                                                <span className="d-inline-block">
                                                    <p disabled style={{ pointerEvents: 'none' }}>
                                                        {post?.type === 'public' ? <span className="material-symbols-outlined">
                                                            public
                                                        </span> : <span className="material-symbols-outlined">
                                                            lock
                                                        </span>}
                                                    </p>
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div >
                    <div className="mt-3">
                        {friendNames.length > 0 && (
                            <div className="d-flex flex-wrap">
                                {friends.map((friend, index) => (
                                    <Tag
                                        key={index}
                                        color="blue"
                                        className="me-1 mb-1"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Link to={`/friend-profile/${friend?.users_permissions_user?.documentId}`}
                                            state={{ friendId: friend?.users_permissions_user }}
                                            style={{ color: 'inherit', textDecoration: 'none' }}
                                        >
                                            @{friend?.users_permissions_user?.username}
                                        </Link>
                                    </Tag>
                                ))}
                            </div>
                        )}
                        <p>
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
                        <Image.PreviewGroup preview={false}>
                            {Array.isArray(validSources) && validSources.length === 1 && (
                                // 1 ảnh full chiều rộng
                                <Image
                                    src={validSources[0]}
                                    alt="post1"
                                    preview={false} // Disable preview
                                    style={{
                                        width: "600px",
                                        height: "400px",
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
                                            preview={false} // Disable preview
                                            style={{
                                                width: "100%",
                                                height: "200px", // Đặt chiều cao cố định
                                                objectFit: "cover", // Đảm bảo giữ tỷ lệ ảnh
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
                                            preview={false} // Disable preview
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
                                                preview={false} // Disable preview
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

                                    {/* <Image.PreviewGroup
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
                                    </Image.PreviewGroup> */}
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
                        <ActionComment post={post} />
                    </div>
                </Modal.Body>
                <div className="d-flex justify-content-center align-items-center">
                    <div className="user-img">
                        <img
                            src={user.avatarMedia.file_path}
                            alt="user1"
                            className="avatar-45 rounded-circle img-fluid"
                        />
                    </div>
                    <form className="comment-text d-flex align-items-center m-2" onSubmit={handleSubmit}>
                        <textarea
                            className="form-control rounded replyText"
                            placeholder="Enter Your Comment"
                            value={comment}
                            onChange={handleCommentChange}
                            onKeyDown={handleKeyDown}
                            rows="3"
                            style={{ width: "450px", height: "30px", boxShadow: "none", resize: "none" }}
                        />
                        <div className="d-flex align-items-center m-1 replyEmoSend gap-2">
                            <span
                                className="material-symbols-outlined ms-2"
                                onClick={() => setShowPicker(!showPicker)}
                                style={{ cursor: "pointer" }}
                            >
                                emoji_emotions
                            </span>
                            <Send formData={{
                                inputText: comment,
                            }} post={post} profile={user} onSend={handleSendSuccess} />
                        </div>
                    </form>

                </div>
                {showPicker && (
                    <div ref={pickerRef} className="replyPicker">
                        <EmojiPicker onEmojiClick={onEmojiClick} style={{ height: '400px' }} />
                    </div>
                )}
            </Modal>

        </>
    );
};

export default ModalCardPost;
