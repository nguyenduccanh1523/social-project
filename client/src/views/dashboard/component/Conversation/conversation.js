import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Tab, Nav, Button } from "react-bootstrap";
import { MessageOutlined } from "@ant-design/icons";
import ProfileMessager from "./profileMessager";
import HeaderMessager from "./headerMessager";
import SendMessager from "./sendMessager";
import ContentMessager from "./contentMessager";

import user5 from "../../../../assets/images/user/05.jpg";
import user6 from "../../../../assets/images/user/06.jpg";
import user7 from "../../../../assets/images/user/07.jpg";
import user8 from "../../../../assets/images/user/08.jpg";
import user9 from "../../../../assets/images/user/09.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation } from "../../../../actions/actions";

const Conversation = ({ profile }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const { conversations } = useSelector(
    (state) => state.root.conversation || {}
  );
  const [show1, setShow1] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchConversation(profile?.documentId)); // Truyền đúng giá trị groupId
  }, [profile, dispatch]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [show]);

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;

      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      // Cập nhật trạng thái dựa trên khoảng cách từ cuối
      if (distanceFromBottom > 200) {
        setShowScrollToBottom(true);
      } else {
        setShowScrollToBottom(false);
      }
    }
  };

  // Gắn sự kiện cuộn
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Cuộn xuống cuối
  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  };

  const ChatSidebar = () => {
    document.getElementsByClassName("scroller")[0].classList.add("show");
  };

  const allConver = conversations[profile?.documentId] || [];
  console.log("conversations: ", allConver);

  return (
    <>
      <Col lg={3} className="chat-data-left scroller">
        <div className="chat-search pt-3 ps-3">
          <div className="d-flex align-items-center">
            <div className="avatar me-2">
              <img
                loading="lazy"
                src={profile?.profile_picture}
                alt="chatuserimage"
                className="avatar-60"
              />
              <span className="avatar-status">
                <i className="material-symbols-outlined text-success  md-14 filled">
                  circle
                </i>
              </span>
            </div>
            <div className="chat-caption">
              <h5 className="mb-0">{profile?.username}</h5>
              <p className="m-0">Online</p>
            </div>
          </div>
          <div className="chat-searchbar mt-4">
            <Form.Group className="form-group chat-search-data m-0">
              <input
                type="text"
                className="form-control round"
                id="chat-search"
                placeholder="Search"
              />
              <i className="material-symbols-outlined">search</i>
            </Form.Group>
          </div>
        </div>
        <div className="chat-sidebar-channel scroller mt-4 ps-3">
          <h5>Conversation</h5>
          <Nav as="ul" variant="pills" className="iq-chat-ui nav flex-column">
            {allConver?.data?.map((item, index) => {
              // Kiểm tra điều kiện
              const isCreatedByProfile =
                item?.conversation_created_by?.documentId ===
                profile?.documentId;

              // Lấy dữ liệu `username`
              const username = isCreatedByProfile
                ? item?.user_chated_with
                : item?.conversation_created_by;

              return (
                <Nav.Item as="li" key={index}>
                  <Nav.Link
                    eventKey="first"
                    onClick={() => setShow("first")}
                    // eventKey={`conversation-${index}`}
                    // onClick={() => setShow(`conversation-${index}`)}
                  >
                    <div className="d-flex align-items-center">
                      <div className="avatar me-2">
                        <img
                          loading="lazy"
                          src={username?.profile_picture}
                          alt="chatuserimage"
                          className="avatar-50"
                        />
                        <span className="avatar-status">
                          <i className="material-symbols-outlined text-success md-14 filled">
                            circle
                          </i>
                        </span>
                      </div>
                      <div className="chat-sidebar-name">
                        <h6 className="mb-0">{username?.username}</h6>{" "}
                        {/* Hiển thị username */}
                        <span>Lorem Ipsum is</span>
                      </div>
                      <div className="chat-meta float-right text-center mt-2 me-1">
                        <div className="chat-msg-counter bg-primary"></div>
                      </div>
                    </div>
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
          <h5 className="mt-3">Group Conversation</h5>
          <Nav variant="pills" className="iq-chat-ui nav flex-column ">
            <li>
              <Nav.Link
                eventKey="third"
                onClick={() => setShow("third")}
                href="#chatbox3"
              >
                <div className="d-flex align-items-center">
                  <div className="avatar me-2">
                    <img
                      loading="lazy"
                      src={user7}
                      alt="chatuserimage"
                      className="avatar-50 "
                    />
                    <span className="avatar-status">
                      <i className="ri-checkbox-blank-circle-fill text-warning"></i>
                    </span>
                  </div>
                  <div className="chat-sidebar-name">
                    <h6 className="mb-0">Designer</h6>
                    <span>There are many </span>
                  </div>
                </div>
              </Nav.Link>
            </li>
            <li>
              <Nav.Link
                eventKey="forth"
                onClick={() => setShow("forth")}
                href="#chatbox4"
              >
                <div className="d-flex align-items-center">
                  <div className="avatar me-2">
                    <img
                      loading="lazy"
                      src={user8}
                      alt="chatuserimage"
                      className="avatar-50 "
                    />
                    <span className="avatar-status">
                      <i className="ri-checkbox-blank-circle-fill text-success"></i>
                    </span>
                  </div>
                  <div className="chat-sidebar-name">
                    <h6 className="mb-0">Developer</h6>
                    <span>passages of Lorem</span>
                  </div>
                </div>
              </Nav.Link>
            </li>
            <li>
              <Nav.Link
                eventKey="five"
                onClick={() => setShow("five")}
                href="#chatbox5"
              >
                <div className="d-flex align-items-center">
                  <div className="avatar me-2">
                    <img
                      loading="lazy"
                      src={user9}
                      alt="chatuserimage"
                      className="avatar-50 "
                    />
                    <span className="avatar-status">
                      <i className="ri-checkbox-blank-circle-fill text-info"></i>
                    </span>
                  </div>
                  <div className="chat-sidebar-name">
                    <h6 className="mb-0">Testing Team</h6>
                    <span>Lorem Ipsum used</span>
                  </div>
                </div>
              </Nav.Link>
            </li>
          </Nav>
        </div>
      </Col>
      <Col lg={9} className=" chat-data p-0 chat-data-right">
        <Tab.Content>
          <Tab.Pane
            eventKey="start"
            className={`tab-pane fade show ${!show ? "active" : ""}`}
            id="default-block"
            role="tabpanel"
          >
            <div className="chat-start">
              <MessageOutlined
                style={{
                  backgroundColor: "white",
                  fontSize: "60px",
                  padding: "10px",
                }}
              />
              <Button
                id="chat-start"
                onClick={ChatSidebar}
                bsPrefix="btn bg-white mt-3"
              >
                Start Conversation!
              </Button>
            </div>
          </Tab.Pane>
          <Tab.Pane
            eventKey="first"
            className={`tab-pane fade ${show === "first" ? "show active" : ""}`}
            id="chatbox1"
            role="tabpanel"
          >
            <div className="chat-head">
              <header className="d-flex justify-content-between align-items-center bg-white pt-3  ps-3 pe-3 pb-3">
                <div className="d-flex align-items-center">
                  <div className="sidebar-toggle">
                    <i className="ri-menu-3-line"></i>
                  </div>
                  <div className="avatar chat-user-profile m-0 me-3 ">
                    <img
                      loading="lazy"
                      src={user5}
                      alt="avatar"
                      className="avatar-50 "
                      onClick={() => setShow1("true")}
                      style={{ cursor: "pointer" }}
                    />
                    <span className="avatar-status">
                      <i className="material-symbols-outlined text-success  md-14 filled">
                        circle
                      </i>
                    </span>
                  </div>
                  <h5 className="mb-0">Team Discussions</h5>
                </div>
                <div
                  className={`scroller ${show1 === "true" ? "show" : ""}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0, // Popup hiển thị bên phải
                    width: "300px",
                    height: "100%",
                    background: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    zIndex: 1000,
                    display: show1 === "true" ? "block" : "none", // Ẩn/Hiển thị dựa trên trạng thái
                    transform:
                      show1 === "true" ? "translateX(0)" : "translateX(100%)", // Hiển thị/Ẩn với hiệu ứng trượt
                    transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động
                  }}
                >
                  <div className="user-profile">
                    <Button
                      type="submit"
                      onClick={() => setShow1("false")} // Ẩn popup
                      variant="close-popup p-3"
                    >
                      <i className="material-symbols-outlined md-18">close</i>
                    </Button>
                    <ProfileMessager />
                  </div>
                </div>
                <HeaderMessager />
              </header>
            </div>
            <div ref={chatContainerRef} className="chat-content scroller">
              {/* Nội dung chat */}
              <ContentMessager />
              {showScrollToBottom && (
                <Button
                  onClick={scrollToBottom}
                  style={{
                    position: "fixed",
                    bottom: "145px",
                    right: "600px",
                    background: "#1890ff",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                    zIndex: 100,
                  }}
                >
                  ↓
                </Button>
              )}
            </div>
            <SendMessager />
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </>
  );
};

export default Conversation;
