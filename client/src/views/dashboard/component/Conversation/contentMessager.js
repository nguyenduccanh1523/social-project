import React, {
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { Image, Dropdown, Menu } from "antd";
import { apiGetMessage, apiUpdateMessager, apiDeleteMessager } from "../../../../services/message";
import loader from "../../../../assets/images/page-img/page-load-loader.gif";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  convertToVietnamDate,
  convertToVietnamHour,
} from "../../others/format";
import { EllipsisOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import socket from "../../../../socket";
import LoadMessage from "../../icons/uiverse/LoadMessager";

const ContentMessager = ({ item, profile, username }) => {
  const chatBodyRef = useRef(null);
  const { token } = useSelector((state) => state.root.auth || {});
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const queryClient = useQueryClient();
  const isInitialLoad = useRef(true);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);


  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["messages", item],
      queryFn: ({ pageParam = 1 }) =>
        apiGetMessage({ conversationId: item, pageParam }),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextPage : false,
    });

  const messages =
    data?.pages
      ?.flatMap((page) =>
        Array.isArray(page?.data?.data) ? page.data.data : []
      )
      // Loại bỏ tin nhắn trùng lặp dựa trên documentId
      .filter(
        (msg, idx, arr) =>
          msg?.documentId &&
          arr.findIndex((m) => m.documentId === msg.documentId) === idx
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
    if (!profile?.documentId) return;
    socket.emit("register", profile.documentId);

    socket.on("receive_message", (message) => {
      if (message.conversation_id === item) {
        queryClient.invalidateQueries(["messages", item]);
      }
    });


    socket.on("user_typing", ({ conversationId, fromUserId }) => {
      if (conversationId === item && fromUserId !== profile.documentId) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [item, profile?.documentId]);


  const handleEdit = async (e, messageId) => {
    e.preventDefault();
    try {
      await apiUpdateMessager({
        documentId: messageId,
        payload: { content: editContent },
        token: token
      });
      setEditingId(null);
      setEditContent("");
      queryClient.invalidateQueries(["messages", item]);
    } catch (err) {
      console.error("Error updating message:", err);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await apiDeleteMessager({
        documentId: messageId,
        token: token
      });
      setDeletingId(null);
      queryClient.invalidateQueries(["messages", item]);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

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
        {[...messages].reverse().map((message) => {
          const isSentByUser =
            message?.sender?.documentId === profile?.documentId;
          const messageDate = message?.createdAt;
          const formattedDate = convertToVietnamDate(messageDate);
          const formattedTime = convertToVietnamHour(messageDate);
          return (
            <div key={message?.documentId} style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredId(message.documentId)}
              onMouseLeave={() => setHoveredId(null)}
            >
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
                          ? profile?.avatarMedia?.file_path
                          : message?.sender?.avatarMedia?.file_path
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
                    position: 'relative'
                  }}
                >
                  {editingId === message.documentId ? (
                    <form onSubmit={(e) => handleEdit(e, message.documentId)} style={{ display: "flex", gap: 8 }}>
                      <input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                    </form>
                  ) : message?.content ? (
                    <div className="chat-message" style={{ position: 'relative', paddingRight: isSentByUser ? 32 : 0 }}>
                      <span className="chat-time" style={{ justifyItems: isSentByUser ? "" : "center" }}>{formattedDate}</span>
                      <p style={{ marginRight: '10px' }}>{message.content}</p>
                      {isSentByUser && hoveredId === message.documentId && (
                        <Dropdown
                          menu={{
                            items: [
                              { key: 'edit', label: <span onClick={() => { setEditingId(message.documentId); setEditContent(message.content); }}>Edit</span> },
                              { key: 'delete', label: <span onClick={() => setDeletingId(message.documentId)}>Delete</span> }
                            ]
                          }}
                          trigger={["click"]}
                          placement="topRight"
                        >
                          <span style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
                            <EllipsisOutlined style={{ fontSize: 22, color: '#555', background: '#fff', borderRadius: '50%', padding: 4, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
                          </span>
                        </Dropdown>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: isSentByUser ? "0 20px 20px 0" : "0 0 20px 20px", justifyContent: isSentByUser ? "flex-end" : "flex-start", width: "50%", position: 'relative', paddingRight: isSentByUser ? 32 : 0 }}>
                      <Image.PreviewGroup>
                        <Image
                          src={message?.media?.file_path}
                          alt="media"
                          style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }}
                        />
                      </Image.PreviewGroup>
                      {isSentByUser && hoveredId === message.documentId && (
                        <Dropdown
                          menu={{
                            items: [
                              { key: 'delete', label: <span onClick={() => setDeletingId(message.documentId)}>Xóa</span> }
                            ]
                          }}
                          trigger={["click"]}
                          placement="topRight"
                        >
                          <span style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
                            <EllipsisOutlined style={{ fontSize: 22, color: '#555', background: '#fff', borderRadius: '50%', padding: 4, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
                          </span>
                        </Dropdown>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Form xác nhận xóa */}
              {deletingId === message.documentId && (
                <div style={{ position: 'absolute', top: 30, right: 0, background: '#fff', border: '1px solid #ddd', padding: 16, zIndex: 10 }}>
                  <div>Are you sure you want to delete this message?</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button onClick={() => handleDelete(message.documentId)}>Delete</button>
                    <button onClick={() => setDeletingId(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {isTyping && (
          <div className="chat d-flex chat-left align-items-center p-2" >
            <div className="chat-user" style={{ marginRight: '22px' }}>
              <img
                src={username?.avatarMedia?.file_path || "/default-avatar.png"}
                alt="avatar"
                className="avatar-35"
              />
            </div>
            <div className="chat-detail" >
              <LoadMessage />
            </div>
          </div>
        )}

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
