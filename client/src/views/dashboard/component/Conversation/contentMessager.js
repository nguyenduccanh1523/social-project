/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect} from "react";
import { Link } from "react-router-dom";
import { Image } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { fetchMessage } from "../../../../actions/actions";
import {
  convertToVietnamDate,
  convertToVietnamHour,
} from "../../others/format";
const ContentMessager = ({ item, profile, username }) => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.root.message || {});

  useEffect(() => {
    dispatch(fetchMessage(item)); // Truyền đúng giá trị groupId
  }, [item, dispatch]);

  const allMessages = messages[item] || [];


  return (
    <>
      {allMessages?.data?.map((message, index) => {
        const isSentByUser =
          message?.sender_id?.documentId === profile?.documentId;
        const messageDate = message?.createdAt; // Lấy ngày của tin nhắn
        const formattedDate = convertToVietnamDate(messageDate); // Chuyển đổi ngày thành định dạng Việt Nam
        const formattedTime = convertToVietnamHour(messageDate); // Chuyển đổi giờ thành định dạng Việt Nam

        // Kiểm tra nếu ngày của tin nhắn khác với ngày trước đó
        return (
          <div key={index}>
            <div
              className={
                isSentByUser ? "chat d-flex other-user" : "chat chat-left"
              }
            >
              <div className="chat-user">
                <Link className="avatar m-0" to="">
                  <img
                    loading="lazy"
                    src={
                      isSentByUser
                        ? profile?.profile_picture
                        : username?.profile_picture
                    }
                    alt="avatar"
                    className="avatar-35"
                  />
                </Link>
                <span className="chat-time mt-1">{formattedTime}</span>
                <span className="chat-time mb-4">{formattedDate}</span>
              </div>
              <div
                className="chat-detail"
                style={{
                  justifyContent: isSentByUser ? "flex-end" : "flex-start",
                }}
              >
                {message?.content ? (
                  <div className="chat-message">
                    <p>{message.content}</p>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: isSentByUser ? "0 20px 20px 0" : "0 0 20px 20px",
                      justifyContent: isSentByUser ? "flex-end" : "flex-start",
                      width: "50%",
                    }}
                  >
                    <Image.PreviewGroup>
                      <Image
                        src={message?.media_id?.file_path}
                        alt="post1"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      />
                    </Image.PreviewGroup>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ContentMessager;
