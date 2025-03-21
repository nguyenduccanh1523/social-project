import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Image } from "antd";
import { apiGetMessage } from "../../../../services/message";
import {
  convertToVietnamDate,
  convertToVietnamHour,
} from "../../others/format";
import loader from "../../../../assets/images/page-img/page-load-loader.gif";
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

const ContentMessager = ({ item, profile, username }) => {
  const [messages, setMessages] = useState([]); // Lưu trữ tin nhắn trong state
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [hasNextPage, setHasNextPage] = useState(false); // Kiểm tra có trang tiếp theo không
  const [pageParam, setPageParam] = useState(1); // Trạng thái phân trang
  const [showScrollButton, setShowScrollButton] = useState(false); // Hiển thị nút cuộn xuống
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true); // Điều khiển cuộn xuống dưới cùng
  const messagesEndRef = useRef(null); // Dùng để cuộn xuống cuối khi có tin nhắn mới
  const chatBodyRef = useRef(null); // Tham chiếu đến vùng chat body để theo dõi sự kiện cuộn

  const { data, isLoading, isError, fetchNextPage, hasNextPage: queryHasNextPage } = useInfiniteQuery({
    queryKey: ['messages', item],
    queryFn: ({ pageParam = 1 }) => apiGetMessage({ conversationId: item, pageParam }),
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? pageParam + 1 : undefined,
    enabled: !!item,
  });

  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToBottom(false); // Tắt sau khi cuộn 1 lần
    }
  }, [messages]);

  useEffect(() => {
    setShouldScrollToBottom(true); // Chỉ set true khi đổi conversation
  }, [item]);

  useEffect(() => {
    if (data) {
      const newMessages = data.pages.flatMap(page => page.data);
      setMessages((prevMessages) => {
        const uniqueMessages = newMessages.filter(
          (msg) => !prevMessages.some((prevMsg) => prevMsg.id === msg.id)
        );
        return [...uniqueMessages.reverse(), ...prevMessages];
      });
      setHasNextPage(queryHasNextPage);
      setShouldScrollToBottom(true); // Ensure scroll to bottom when new messages are loaded
    }
    // Scroll to bottom when new messages are loaded
    const chatContent = document.querySelector('.chat-content');
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [data]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Tải thêm tin nhắn khi người dùng cuộn lên
  const loadMoreMessages = (e) => {
    if (hasNextPage && !loading && e.target.scrollTop === 0) {
      setShouldScrollToBottom(false); // Prevent auto-scroll to bottom when loading more messages
      fetchNextPage();
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
      //console.log(scrollHeight - scrollTop - clientHeight);

      // Kiểm tra nếu đang ở gần top để load thêm tin nhắn
      if (scrollTop < 100 && hasNextPage && !loading) {
        setShouldScrollToBottom(false);
        fetchNextPage();
      }
    },
    [hasNextPage, loading, fetchNextPage]
  );

  // Gắn event listener cuộn
  useEffect(() => {
    const container = chatBodyRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // Tự động cuộn xuống dưới khi mở cuộc trò chuyện hoặc tin nhắn mới
  useEffect(() => {
    if (shouldScrollToBottom) {
      setTimeout(() => {
        handleScrollToBottom();
      }, 300); // Cuộn xuống sau khi tải tin nhắn mới
    }
  }, [shouldScrollToBottom, item]); // Add `item` to dependencies to trigger scroll on conversation change

  return (
    <>
      <div
        className="chat-content scroller"
        onScroll={loadMoreMessages}
        ref={chatBodyRef}
        onWheel={(e) => e.stopPropagation()} // Prevent outer scroll
      >
        {/* Hiển thị khi không còn dữ liệu để tải thêm */}
        {!hasNextPage && <p>No more messages</p>}
        {/* Hiển thị loading nếu dữ liệu đang được tải */}
        {loading && (
          <div className="col-sm-12 text-center">
            <img src={loader} alt="loader" style={{ height: "100px" }} />
          </div>
        )}
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
                          : message?.sender_id?.profile_picture
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
                      <span
                        className="chat-time"
                        style={{
                          justifyItems: isSentByUser ? "" : "center",
                        }}
                      >
                        {formattedDate}
                      </span>
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
