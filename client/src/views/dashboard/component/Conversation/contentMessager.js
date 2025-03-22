import React, {
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { Image } from "antd";
import { apiGetMessage } from "../../../../services/message";
import loader from "../../../../assets/images/page-img/page-load-loader.gif";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  convertToVietnamDate,
  convertToVietnamHour,
} from "../../others/format";

const ContentMessager = ({ item, profile, username }) => {
  const chatBodyRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const queryClient = useQueryClient();
  const isInitialLoad = useRef(true);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["messages", item],
      queryFn: ({ pageParam = 1 }) =>
        apiGetMessage({ conversationId: item, pageParam }),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextPage : false,
    });

  const messages =
    data?.pages?.flatMap((page) =>
      Array.isArray(page?.data?.data) ? page.data.data : []
    ) || [];

  // Scroll về đáy khi load lần đầu
  useLayoutEffect(() => {
    if (!isLoading && isInitialLoad.current && chatBodyRef.current) {
      const scrollHeight = chatBodyRef.current.scrollHeight;
      chatBodyRef.current.scrollTop = scrollHeight;
      isInitialLoad.current = false;
    }
  }, [isLoading, data]);

  const handleScroll = useCallback(() => {
    const el = chatBodyRef.current;
    if (!el) return;

    const scrollThreshold = 500;
    setShowScrollToBottom(
      el.scrollTop + el.clientHeight < el.scrollHeight - scrollThreshold
    );

    // Nếu đã hết trang, không fetch nữa
    if (el.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const prevScrollHeight = el.scrollHeight;
      fetchNextPage().then((res) => {
        const newMessages = res?.data?.data?.data || [];
        // Nếu có thêm tin nhắn -> giữ vị trí scroll
        if (newMessages.length > 0 && chatBodyRef.current) {
          const newScrollHeight = chatBodyRef.current.scrollHeight;
          chatBodyRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }
      });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Mỗi khi chuyển sang cuộc trò chuyện khác -> scroll xuống cuối
    if (chatBodyRef.current) {
      setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 100); // delay nhẹ để React render xong DOM
    }
    isInitialLoad.current = true; // Reset lại flag initial load
  }, [item]);

  return (
    <>
      <div
        className="chat-content scroller"
        ref={chatBodyRef}
        onScroll={handleScroll}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Loader khi đang fetch trang tiếp theo */}
        {isFetchingNextPage && hasNextPage && (
          <div className="col-sm-12 text-center">
            <img src={loader} alt="loading..." style={{ height: "60px" }} />
          </div>
        )}
        {/* Khi không còn tin nhắn để load nữa */}
        {!hasNextPage && !isLoading && (
          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#aaa",
              marginBottom: "10px",
            }}
          >
            Đã hết tin nhắn cũ
          </div>
        )}

        {/* Hiển thị tin nhắn (đảo ngược để tin mới ở dưới) */}
        {[...messages].reverse().map((message, index) => {
          const isSentByUser =
            message?.sender_id?.documentId === profile?.documentId;
          const messageDate = message?.createdAt;
          const formattedDate = convertToVietnamDate(messageDate);
          const formattedTime = convertToVietnamHour(messageDate);
          return (
            <div key={message?.documentId || index}>
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
                          alt="media"
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
      </div>
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          style={{
            position: "absolute",
            bottom: "90px",
            right: "380px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            cursor: "pointer",
            zIndex: 1000,
          }}
          title="Cuộn xuống dưới cùng"
        >
          ⬇
        </button>
      )}
    </>
  );
};

export default ContentMessager;
