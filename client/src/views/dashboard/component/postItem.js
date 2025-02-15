/* eslint-disable no-undef */
// PostItem.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { Image, Tag } from "antd";

// Images import (you can import them or pass them as props)

import { Col } from "react-bootstrap";
import Card from "../../../components/Card";
import CustomToggle from "../../../components/dropdowns";
import ShareOffcanvas from "../../../components/share-offcanvas";
import { colorsTag } from "../others/format";

//image
import user2 from "../../../assets/images/user/02.jpg";
import user3 from "../../../assets/images/user/03.jpg";
import icon3 from "../../../assets/images/icon/03.png";
import icon4 from "../../../assets/images/icon/04.png";
import icon5 from "../../../assets/images/icon/05.png";
import icon6 from "../../../assets/images/icon/06.png";
import icon7 from "../../../assets/images/icon/07.png";
import icon1 from "../../../assets/images/icon/01.png"; // Example icon for like
import icon2 from "../../../assets/images/icon/02.png"; // Example icon for love
import { useDispatch, useSelector } from "react-redux";
import { fetchPostMedia, fetchPostTag } from "../../../actions/actions";

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  const { medias } = useSelector((state) => state.root.media || {});
  const { tags } = useSelector((state) => state.root.tag || {});
  const createdAt = new Date(post?.user_id?.createdAt);

  const [imageController, setImageController] = useState({
    toggler: false, // Kiểm soát hiển thị gallery
    slide: 0, // Vị trí ảnh hiện tại
  });

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

  return (
    <>
      <Col sm={12}>
        <Card className=" card-block card-stretch card-height">
          <Card.Body>
            <div className="user-post-data">
              <div className="d-flex justify-content-between">
                <div className="me-3">
                  <div className="user-img">
                    <img
                      src={post?.user_id?.profile_picture}
                      alt="userimg"
                      className="avatar-60 rounded-circle"
                    />
                  </div>
                </div>
                <div className="w-100">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="mb-0 d-inline-block">
                        {post?.user_id?.username}
                      </h5>
                      <p className="mb-0 text-primary">{timeAgo}</p>
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
                                cancel
                              </i>
                              <div className="data ms-2">
                                <h6>Hide From Timeline</h6>
                                <p className="mb-0">
                                  See fewer posts like this.
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
                                notifications
                              </i>
                              <div className="data ms-2">
                                <h6>Notifications</h6>
                                <p className="mb-0">
                                  Turn on notifications for this post
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
            </div>
            <div className="mt-3">
              <p>{post?.content}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
              {validTags.map((tag, index) => (
                <Tag
                  key={tag}
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
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "8px",
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
                    {/* Hiển thị 3 ảnh đầu tiên */}
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

                    {/* PreviewGroup chứa tất cả ảnh */}
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
                          140 Likes
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
                        20 Comment
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
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default PostItem;
