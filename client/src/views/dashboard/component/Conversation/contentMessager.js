import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Image } from "antd";
import { apiGetMessage } from "../../../../services/message";
import {
  convertToVietnamDate,
  convertToVietnamHour,
} from "../../others/format";

const ContentMessager = ({ item, profile, username }) => {
  const [messages, setMessages] = useState([]); // Lưu trữ tin nhắn trong state
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [hasNextPage, setHasNextPage] = useState(false); // Kiểm tra có trang tiếp theo không
  const [pageParam, setPageParam] = useState(1); // Trạng thái phân trang
  const [showScrollButton, setShowScrollButton] = useState(false); // Hiển thị nút cuộn xuống
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true); // Điều khiển cuộn xuống dưới cùng
  const messagesEndRef = useRef(null); // Dùng để cuộn xuống cuối khi có tin nhắn mới
  const chatBodyRef = useRef(null); // Tham chiếu đến vùng chat body để theo dõi sự kiện cuộn

  // Lấy dữ liệu tin nhắn khi component được render lần đầu
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // Bắt đầu tải dữ liệu
      try {
        const response = await apiGetMessage({
          conversationId: item,
          pageParam,
        });

        // Thêm tin nhắn mới vào đầu (sắp xếp theo thứ tự cũ nhất -> mới nhất)
        setMessages((prevMessages) => {
          const newMessages = response.data.filter(
            (msg) => !prevMessages.some((prevMsg) => prevMsg.id === msg.id)
          );
          // Đảm bảo các tin nhắn cũ sẽ nằm trên cùng
          return [...newMessages.reverse(), ...prevMessages]; // Thêm tin nhắn mới vào đầu sau khi đảo ngược
        });

        setHasNextPage(response.hasNextPage); // Cập nhật trạng thái trang tiếp theo
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false); // Kết thúc quá trình tải
      }
    };

    if (item) {
      fetchMessages(); // Gọi hàm khi item có giá trị
    }
  }, [item, pageParam]); // Lấy dữ liệu lại khi `item` hoặc `pageParam` thay đổi

  // Tải thêm tin nhắn khi người dùng cuộn lên
  const loadMoreMessages = (e) => {
    if (hasNextPage && !loading && e.target.scrollTop === 0) {
      setPageParam((prevPageParam) => prevPageParam + 1); // Tăng pageParam để lấy tin nhắn tiếp theo
    }
  };

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current && shouldScrollToBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScrollToBottom]); // Mỗi khi tin nhắn thay đổi, cuộn xuống cuối

  // Hàm cuộn xuống cuối khi người dùng nhấn nút
  const handleScrollToBottom = () => {
    setShouldScrollToBottom(true);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Lắng nghe sự kiện cuộn
  const handleScroll = useCallback(
    (e) => {
      const element = e.target;
      const scrollHeight = element.scrollHeight;
      const scrollTop = element.scrollTop;
      const clientHeight = element.clientHeight;

      // Hiển thị nút khi cuộn lên trên 500px
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 500);
      console.log(scrollHeight - scrollTop - clientHeight);

      // Kiểm tra nếu đang ở gần top để load thêm tin nhắn
      if (scrollTop < 100 && hasNextPage && !loading) {
        setShouldScrollToBottom(false);
        setPageParam((prevPageParam) => prevPageParam + 1); // Tăng pageParam để lấy tin nhắn tiếp theo
      }
    },
    [hasNextPage, loading]
  );

  // Gắn event listener cuộn
  useEffect(() => {
    const container = chatBodyRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Tự động cuộn xuống dưới khi mở cuộc trò chuyện hoặc tin nhắn mới
  useEffect(() => {
    if (shouldScrollToBottom) {
      setTimeout(() => {
        handleScrollToBottom();
      }, 300); // Cuộn xuống sau khi tải tin nhắn mới
    }
  }, [shouldScrollToBottom]);

  return (
    <>
      <div
        className="chat-content scroller"
        onScroll={loadMoreMessages}
        ref={chatBodyRef}
      >
        {/* Hiển thị khi không còn dữ liệu để tải thêm */}
        {!hasNextPage && <p>No more messages</p>}
        {messages?.map((message, index) => {
          const isSentByUser =
            message?.sender_id?.documentId === profile?.documentId;
          const messageDate = message?.createdAt;
          const formattedDate = convertToVietnamDate(messageDate);
          const formattedTime = convertToVietnamHour(messageDate);

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
                </div>
                <div
                  className="chat-detail"
                  style={{
                    justifyContent: isSentByUser ? "flex-end" : "flex-start",
                  }}
                >
                  {message?.content ? (
                    <div className="chat-message">
                      <span className="chat-time">{formattedDate}</span>
                      <p>{message.content}</p>
                      
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: isSentByUser
                          ? "0 20px 20px 0"
                          : "0 0 20px 20px",
                        justifyContent: isSentByUser
                          ? "flex-end"
                          : "flex-start",
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
        {/* Hiển thị loading nếu dữ liệu đang được tải */}
        {loading && <p>Loading...</p>}
        {/* Nút cuộn xuống dưới cùng */}
        {showScrollButton && (
          <button
            style={{
              position: "fixed",
              bottom: "160px",
              right: "600px",
              padding: "10px",
              backgroundColor: "skyblue",
              color: "white",
              borderRadius: "100%",
              cursor: "pointer",
              zIndex: 1000,
            }}
            onClick={handleScrollToBottom}
          >
            ↓
          </button>
        )}
        <div ref={messagesEndRef} /> {/* Phần tử giúp cuộn xuống cuối */}
      </div>
    </>
  );
};

export default ContentMessager;
