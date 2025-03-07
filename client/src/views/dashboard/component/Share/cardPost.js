/* eslint-disable no-undef */
// PostItem.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { Image, Tag } from "antd";
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from "react-redux";
import { fetchPostMedia, fetchPostTag } from "../../../../actions/actions";
import { apiGetPostFriend } from "../../../../services/post";
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
import user2 from "../../../../assets/images/user/02.jpg";
import user3 from "../../../../assets/images/user/03.jpg";
import icon3 from "../../../../assets/images/icon/03.png";
import icon4 from "../../../../assets/images/icon/04.png";
import icon5 from "../../../../assets/images/icon/05.png";
import icon6 from "../../../../assets/images/icon/06.png";
import icon7 from "../../../../assets/images/icon/07.png";
import icon1 from "../../../../assets/images/icon/01.png"; // Example icon for like
import icon2 from "../../../../assets/images/icon/02.png"; // Example icon for love
const CardPost = ({ post, pageInfo }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile } = useSelector((state) => state.root.user || {});
    const { medias } = useSelector((state) => state.root.media || {});
    const { tags } = useSelector((state) => state.root.tag || {});
    const createdAt = new Date(post?.createdAt);

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

    useEffect(() => {
        dispatch(fetchPostMedia(post?.documentId)); // Truyền đúng giá trị groupId
        dispatch(fetchPostTag(post?.documentId)); // Truyền đúng giá trị groupId
    }, [post, dispatch]);

    const postMedia = medias[post?.documentId] || [];
    const postTag = tags[post?.documentId] || [];

    const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

    const validSources = Array.isArray(postMedia?.data)
        ? postMedia.data
            .map((item) => item?.media?.file_path)
            .filter((path) => typeof path === "string" && path.trim() !== "")
        : [];

    const validTags = Array.isArray(postTag?.data)
        ? postTag.data.map((item) => item?.tag_id?.name)
        : [];

    const colors = colorsTag;


    const { data: friendsData } = useQuery({
        queryKey: ['postFriends', post?.post_friends?.map(friend => friend.documentId)],
        queryFn: () => Promise.all(post?.post_friends?.map(friend => apiGetPostFriend({ documentId: friend.documentId }))),
        enabled: !!post?.post_friends,
    });

    const friends = friendsData?.map(friend => friend?.data?.data) || [];


    const friendNames = friends?.map(friend => friend?.users_permissions_user?.username) || [];

    //console.log("post", post);

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
                                            ? post?.user_id?.profile_picture
                                            : pageInfo?.data?.profile_picture?.file_path
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
                                            post?.user_id?.documentId === profile?.documentId
                                                ? `/user-profile`
                                                : post?.user_id
                                                    ? `/friend-profile/${post?.user_id?.documentId}`
                                                    : `/page/${pageInfo?.data?.page_name}`
                                        }
                                            state={
                                                post?.user_id?.documentId === profile?.documentId
                                                    ? {}
                                                    : post?.user_id
                                                        ? { friendId: post?.user_id }
                                                        : {
                                                            pageId: pageInfo?.data?.documentId,
                                                            pageDetail: pageInfo?.data
                                                        }
                                            }
                                            style={{ textDecoration: "none", color: "black" }}>
                                            {post?.user_id
                                                ? post?.user_id?.username
                                                : pageInfo?.data?.page_name || 'Unknown Page'
                                            }
                                        </Link>
                                        {pageInfo?.data?.is_verified && (
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
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">{post?.type_id?.name === 'public' ? 'Public' : 'Private'}</Tooltip>}>
                                            <span className="d-inline-block">
                                                <p disabled style={{ pointerEvents: 'none' }}>
                                                    {post?.type_id?.name === 'public' ? <span className="material-symbols-outlined">
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
                                            <Dropdown.Item className="dropdown-item p-3" to="#">
                                                <div className="d-flex align-items-top">
                                                    <i className="material-symbols-outlined">save</i>
                                                    <div className="data ms-2">
                                                        <h6>Save Post</h6>
                                                        <p className="mb-0">
                                                            Add this to your saved items
                                                        </p>
                                                    </div>
                                                </div>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="dropdown-item p-3" to="#">
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
                                            <Dropdown.Item className="dropdown-item p-3" to="#">
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
                    {validTags.map((tag, index) => (
                        <Tag
                            key={index}
                            color={colors[index % colors.length]} // Áp dụng màu theo danh sách
                        >
                            {tag}
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
                                        <Dropdown.Menu className=" py-2">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Like</Tooltip>}
                                                className="ms-2 me-2"
                                            >
                                                <img
                                                    src={icon1}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Love</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon2}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Happy</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon3}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>HaHa</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon4}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Think</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon5}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Sade</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon6}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Lovely</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon7}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="total-like-block ms-2 me-3">
                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle} id="post-option">
                                            140
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#">Max Emum</Dropdown.Item>
                                            <Dropdown.Item href="#">Bill Yerds</Dropdown.Item>
                                            <Dropdown.Item href="#">
                                                Hap E. Birthday
                                            </Dropdown.Item>
                                            <Dropdown.Item href="#">Tara Misu</Dropdown.Item>
                                            <Dropdown.Item href="#">Midge Itz</Dropdown.Item>
                                            <Dropdown.Item href="#">Sal Vidge</Dropdown.Item>
                                            <Dropdown.Item href="#">Other</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="total-comment-block">
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle} id="post-option">
                                        20 <FaRegComment />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#">Max Emum</Dropdown.Item>
                                        <Dropdown.Item href="#">Bill Yerds</Dropdown.Item>
                                        <Dropdown.Item href="#">Hap E. Birthday</Dropdown.Item>
                                        <Dropdown.Item href="#">Tara Misu</Dropdown.Item>
                                        <Dropdown.Item href="#">Midge Itz</Dropdown.Item>
                                        <Dropdown.Item href="#">Sal Vidge</Dropdown.Item>
                                        <Dropdown.Item href="#">Other</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <ShareOffcanvas share={post?.shares} />
                    </div>
                    <hr />

                    <div className="d-flex justify-content-between align-items-center flex-wrap action">
                        <div className="like-block position-relative d-flex align-items-center">
                            <div className="d-flex align-items-center ">
                                <div className="like-data">
                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle}>
                                            <button className="btn btn-white d-flex align-items-center post-button">
                                                <span className="material-symbols-outlined">thumb_up</span> <h6>Like</h6>
                                            </button>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className=" py-2">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Like</Tooltip>}
                                                className="ms-2 me-2"
                                            >
                                                <img
                                                    src={icon1}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Love</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon2}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Happy</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon3}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>HaHa</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon4}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Think</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon5}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Sade</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon6}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Lovely</Tooltip>}
                                                className="me-2"
                                            >
                                                <img
                                                    src={icon7}
                                                    className="img-fluid me-2"
                                                    alt=""
                                                />
                                            </OverlayTrigger>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
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
                        <li className="mb-2">
                            <div className="d-flex">
                                <div className="user-img">
                                    <img
                                        src={user2}
                                        alt="user1"
                                        className="avatar-35 rounded-circle img-fluid"
                                    />
                                </div>
                                <div className="comment-data-block ms-3">
                                    <h6>Monty Carlo</h6>
                                    <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                    <div className="d-flex flex-wrap align-items-center comment-activity">
                                        <Link to="#">like</Link>
                                        <Link to="#">reply</Link>
                                        <Link to="#">translate</Link>
                                        <span> 5 min </span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="d-flex">
                                <div className="user-img">
                                    <img
                                        src={user3}
                                        alt="user1"
                                        className="avatar-35 rounded-circle img-fluid"
                                    />
                                </div>
                                <div className="comment-data-block ms-3">
                                    <h6>Paul Molive</h6>
                                    <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                    <div className="d-flex flex-wrap align-items-center comment-activity">
                                        <Link to="#">like</Link>
                                        <Link to="#">reply</Link>
                                        <Link to="#">translate</Link>
                                        <span> 5 min </span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <form className="comment-text d-flex align-items-center mt-3">
                        <input
                            type="text"
                            className="form-control rounded"
                            placeholder="Enter Your Comment"
                        />
                        <div className="comment-attagement d-flex">
                            <Link to="#">
                                <i className="ri-link me-3"></i>
                            </Link>
                            <Link to="#">
                                <i className="ri-user-smile-line me-3"></i>
                            </Link>
                            <Link to="#">
                                <i className="ri-camera-line me-3"></i>
                            </Link>
                        </div>
                    </form>
                </div>
            </Card.Body >
            <ModalCardPost show={showCommentModal} handleClose={handleCloseCommentModal} post={post} page={pageInfo}/>
        </>
    );
};

export default CardPost;
