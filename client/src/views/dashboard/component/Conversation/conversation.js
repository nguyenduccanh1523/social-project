/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Col, Form, Tab, Nav, Button } from "react-bootstrap";
import { MessageOutlined, SearchOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import { Input } from "antd"; // Import Search từ Ant Design

import ProfileMessager from "./profileMessager";
import HeaderMessager from "./headerMessager";
import SendMessager from "./sendMessager";
import ContentMessager from "./contentMessager";

import { useDispatch, useSelector } from "react-redux";
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { apiGetConversation } from "../../../../services/conversation";
import { apiGetParticipantByUser } from "../../../../services/participant";

const Conversation = ({ profile }) => {
  const { token } = useSelector((state) => state.root.auth || {});
  const dispatch = useDispatch();
  const [showConversations, setShowConversations] = useState(true); // Trạng thái để mở/đóng Conversation
  const [showGroups, setShowGroups] = useState(true); // Trạng thái để mở/đóng Group Conversation
  const [show, setShow] = useState("");
  const [show1, setShow1] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm

  const { data: conversationsData } = useQuery({
    queryKey: ['conversations', profile?.documentId, token],
    queryFn: () => apiGetConversation({userId: profile?.documentId, token}),
    enabled: !!profile?.documentId && !!token
  });

  const { data: participantsData } = useQuery({
    queryKey: ['participants', profile?.documentId, token],
    queryFn: () => apiGetParticipantByUser({userId: profile?.documentId, token}),
    enabled: !!profile?.documentId && !!token
  });

  const conversations = conversationsData?.data?.data || [];
  const participants = participantsData?.data?.data || [];

  const ChatSidebar = () => {
    document.getElementsByClassName("scroller")[0].classList.add("show");
  };

  const handleSearch = (value) => {
    setSearchQuery(value); // Cập nhật giá trị tìm kiếm khi người dùng nhập
  };

  console.log('conver', conversations)
  console.log('parti', participants)

  // Lọc các cuộc trò chuyện theo query tìm kiếm
  const filteredConversations = conversations.filter((item) => {
    // Kiểm tra nếu conversation_created_by là profile hiện tại
    const username =
      item?.creator?.documentId === profile?.documentId
        ? item?.participant?.username
        : item?.creator?.username;

    // So sánh tên người nhắn với query tìm kiếm (tìm kiếm không phân biệt chữ hoa chữ thường)
    return username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredParticipants = participants.filter((participant) => {
    return participant?.conversation?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Col lg={3} className="chat-data-left scroller">
        <div className="chat-search pt-3 ps-3">
          <div className="d-flex align-items-center">
            <div className="avatar me-2">
              <img
                loading="lazy"
                src={profile?.avatarMedia?.file_path}
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
          {/* Conversation */}
          <h5
            onClick={() => setShowConversations(!showConversations)} // Toggle hiển thị phần Conversation
            style={{ cursor: "pointer" }}
          >
            {showConversations
              ? <>Conversation <DownOutlined /></>
              : <>Conversation <RightOutlined /></>}
          </h5>
          {showConversations && (
            <Nav as="ul" variant="pills" className="iq-chat-ui nav flex-column">
              {filteredConversations?.map((item, index) => {
                const isCreatedByProfile =
                  item?.creator?.documentId ===
                  profile?.documentId;

                const username = isCreatedByProfile
                  ? item?.participant
                  : item?.creator;

                return (
                  <Nav.Item as="li" key={index}>
                    <Nav.Link
                      eventKey={`conversation-${item?.documentId}`}
                      onClick={() =>
                        setShow(`conversation-${item?.documentId}`)
                      }
                      href={`#${item?.documentId}`}
                    >
                      <div className="d-flex align-items-center">
                        <div className="avatar me-2">
                          <img
                            loading="lazy"
                            src={username?.avatarMedia?.file_path}
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
          )}

          {/* Group Conversation */}
          <h5
            onClick={() => setShowGroups(!showGroups)} // Toggle hiển thị phần Group Conversation
            style={{ cursor: "pointer" }}
          >
            {showGroups
              ? <>Groups Conversation <DownOutlined /></>
              : <>Groups Conversation <RightOutlined /></>}
          </h5>
          {showGroups && (
            <Nav variant="pills" className="iq-chat-ui nav flex-column">
              {filteredParticipants?.map((item, index) => (
                <li key={index}>
                  <Nav.Link
                    eventKey={`conversation-${item?.conversation?.documentId}`}
                    onClick={() =>
                      setShow(
                        `conversation-${item?.conversation?.documentId}`
                      )
                    }
                    href={`#${item?.conversation?.documentId}`}
                  >
                    <div className="d-flex align-items-center">
                      <div className="avatar me-2">
                        <img
                          loading="lazy"
                          src={item?.conversation?.groupImage?.file_path}
                          alt="chatuserimage"
                          className="avatar-50 "
                        />
                        <span className="avatar-status">
                          <i className="ri-checkbox-blank-circle-fill text-warning"></i>
                        </span>
                      </div>
                      <div className="chat-sidebar-name">
                        <h6 className="mb-0">{item?.conversation?.name}</h6>
                        <span>There are many </span>
                      </div>
                    </div>
                  </Nav.Link>
                </li>
              ))}
            </Nav>
          )}
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
              item?.creator?.documentId === profile?.documentId;

            const username = isCreatedByProfile
              ? item?.participant
              : item?.creator;

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
                          src={username?.avatarMedia?.file_path}
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

                <SendMessager conversation={item?.documentId} />
              </Tab.Pane>
            );
          })}
          {filteredParticipants?.map((item, index) => {
            return (
              <Tab.Pane
                key={index}
                eventKey={`conversation-${item?.conversation?.documentId}`} // Đặt eventKey giống với Nav.Link
                className={`tab-pane fade ${
                  show === `conversation-${item?.conversation?.documentId}`
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
                          src={item?.conversation?.groupImage?.file_path}
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
                      <h5 className="mb-0">{item?.conversation?.name}</h5>
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
                        <ProfileMessager user={item?.conversation} />
                      </div>
                    </div>
                    <HeaderMessager />
                  </header>
                </div>

                {/* Nội dung chat */}
                <ContentMessager
                  item={item?.conversation?.documentId}
                  profile={profile}
                  //username={item?.conversation_id?.name}
                />

                <SendMessager conversation={item?.conversation?.documentId} />
              </Tab.Pane>
            );
          })}
        </Tab.Content>
      </Col>
    </>
  );
};

export default Conversation;
