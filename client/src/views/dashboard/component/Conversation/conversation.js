/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Col, Form, Tab, Nav, Button } from "react-bootstrap";
import { MessageOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "antd"; // Import Search từ Ant Design

import ProfileMessager from "./profileMessager";
import HeaderMessager from "./headerMessager";
import SendMessager from "./sendMessager";
import ContentMessager from "./contentMessager";

import user7 from "../../../../assets/images/user/07.jpg";
import user8 from "../../../../assets/images/user/08.jpg";
import user9 from "../../../../assets/images/user/09.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation, fetchParticipantByUser } from "../../../../actions/actions";

const Conversation = ({ profile }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm
  const { conversations } = useSelector(
    (state) => state.root.conversation || {}
  );
  const { participants } = useSelector( (state) => state.root.participant || {}); // Lấy danh sách thành viên từ store
  const [show1, setShow1] = useState("");

  
  useEffect(() => {
    dispatch(fetchConversation(profile?.documentId)); // Truyền đúng giá trị groupId
    dispatch(fetchParticipantByUser(profile?.documentId)); // Truyền đúng giá trị userId
  }, [profile, dispatch]);

  const ChatSidebar = () => {
    document.getElementsByClassName("scroller")[0].classList.add("show");
  };

  const allConver = conversations[profile?.documentId] || [];
  const allParticipant = participants[profile?.documentId] || [];

  const handleSearch = (value) => {
    setSearchQuery(value); // Cập nhật giá trị tìm kiếm khi người dùng nhập
  };

  // Lọc các cuộc trò chuyện theo query tìm kiếm
  const filteredConversations = allConver?.data?.filter((item) => {
    // Kiểm tra nếu conversation_created_by là profile hiện tại
    const username =
      item?.conversation_created_by?.documentId === profile?.documentId
        ? item?.user_chated_with?.username
        : item?.conversation_created_by?.username;

    // So sánh tên người nhắn với query tìm kiếm (tìm kiếm không phân biệt chữ hoa chữ thường)
    return username?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  console.log("filteredConversations: ", allParticipant);

  const filteredParticipants = allParticipant?.data?.filter((participant) => {
    return participant?.conversation_id?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
              <Input.Search
                placeholder="Search..."
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật khi người dùng nhập vào
                value={searchQuery}
              />
            </Form.Group>
          </div>
        </div>
        <div className="chat-sidebar-channel scroller mt-4 ps-3" height="100%">
          <h5>Conversation</h5>
          <Nav as="ul" variant="pills" className="iq-chat-ui nav flex-column">
            {filteredConversations?.map((item, index) => {
              const isCreatedByProfile =
                item?.conversation_created_by?.documentId ===
                profile?.documentId;

              const username = isCreatedByProfile
                ? item?.user_chated_with
                : item?.conversation_created_by;

              return (
                <Nav.Item as="li" key={index}>
                  <Nav.Link
                    eventKey={`conversation-${item?.documentId}`}
                    onClick={() => setShow(`conversation-${item?.documentId}`)}
                    href={`#${item?.documentId}`}
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
                        <h6 className="mb-0">{username?.username}</h6>
                        <span>Lorem Ipsum is</span>
                      </div>
                    </div>
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
          <h5 className="mt-3">Group Conversation</h5>
          <Nav variant="pills" className="iq-chat-ui nav flex-column ">
          {filteredParticipants?.map((item, index) =>(
            <li key={index}>
              <Nav.Link
                eventKey={`conversation-${item?.conversation_id?.documentId}`}
                onClick={() => setShow(`conversation-${item?.conversation_id?.documentId}`)}
                href={`#${item?.conversation_id?.documentId}`}
              >
                <div className="d-flex align-items-center">
                  <div className="avatar me-2">
                    <img
                      loading="lazy"
                      src={item?.conversation_id?.image_group_chat}
                      alt="chatuserimage"
                      className="avatar-50 "
                    />
                    <span className="avatar-status">
                      <i className="ri-checkbox-blank-circle-fill text-warning"></i>
                    </span>
                  </div>
                  <div className="chat-sidebar-name">
                    <h6 className="mb-0">{item?.conversation_id?.name}</h6>
                    <span>There are many </span>
                  </div>
                </div>
              </Nav.Link>
            </li>
          ))}
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
          {filteredConversations?.map((item, index) => {
            const isCreatedByProfile =
              item?.conversation_created_by?.documentId === profile?.documentId;

            const username = isCreatedByProfile
              ? item?.user_chated_with
              : item?.conversation_created_by;

            return (
              <Tab.Pane
                key={index}
                eventKey={`conversation-${item?.documentId}`} // Đặt eventKey giống với Nav.Link
                className={`tab-pane fade ${
                  show === `conversation-${item?.documentId}`
                    ? "show active"
                    : ""
                }`}
                id={`chatbox-${item?.documentId}`} // Định danh duy nhất cho tab
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
                          src={username?.profile_picture}
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
                      <h5 className="mb-0">{username?.username}</h5>
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
                          show1 === "true"
                            ? "translateX(0)"
                            : "translateX(100%)", // Hiển thị/Ẩn với hiệu ứng trượt
                        transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động
                      }}
                    >
                      <div className="user-profile">
                        <Button
                          type="submit"
                          onClick={() => setShow1("false")} // Ẩn popup
                          variant="close-popup p-3"
                        >
                          <i className="material-symbols-outlined md-18">
                            close
                          </i>
                        </Button>
                        <ProfileMessager user={username} />
                      </div>
                    </div>
                    <HeaderMessager />
                  </header>
                </div>

                  {/* Nội dung chat */}
                  <ContentMessager
                    item={item?.documentId}
                    profile={profile}
                    username={username}
                  />

                <SendMessager />
              </Tab.Pane>
            );
          })}
          {filteredParticipants?.map((item, index) => {
            return (
              <Tab.Pane
                key={index}
                eventKey={`conversation-${item?.conversation_id?.documentId}`} // Đặt eventKey giống với Nav.Link
                className={`tab-pane fade ${
                  show === `conversation-${item?.conversation_id?.documentId}`
                    ? "show active"
                    : ""
                }`}
                id={`chatbox-${item?.documentId}`} // Định danh duy nhất cho tab
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
                          src={item?.conversation_id?.image_group_chat}
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
                      <h5 className="mb-0">{item?.conversation_id?.name}</h5>
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
                          show1 === "true"
                            ? "translateX(0)"
                            : "translateX(100%)", // Hiển thị/Ẩn với hiệu ứng trượt
                        transition: "transform 0.3s ease-in-out", // Thêm hiệu ứng chuyển động
                      }}
                    >
                      <div className="user-profile">
                        <Button
                          type="submit"
                          onClick={() => setShow1("false")} // Ẩn popup
                          variant="close-popup p-3"
                        >
                          <i className="material-symbols-outlined md-18">
                            close
                          </i>
                        </Button>
                        <ProfileMessager user={item?.conversation_id} />
                      </div>
                    </div>
                    <HeaderMessager />
                  </header>
                </div>

                  {/* Nội dung chat */}
                  <ContentMessager
                    item={item?.documentId}
                    profile={profile}
                    //username={item?.conversation_id?.name}
                  />

                <SendMessager />
              </Tab.Pane>
            );
          })}
        </Tab.Content>
      </Col>
    </>
  );
};

export default Conversation;
