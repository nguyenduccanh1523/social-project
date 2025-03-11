import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Dropdown } from "react-bootstrap";
import {
  apiDeletePostComment,
  apiGetPostComment,
  apiGetPostCommentParent,
} from "../../../../services/comment";

import "./post.scss";
import Reply from "../ShareActionComment/Reply";
import { useSelector } from "react-redux";
import ReplyEdit from "../ShareActionComment/ReplyEdit";
import { formatDistanceToNow } from "date-fns";
import { notification, Modal } from 'antd'; // Import notification and Modal from antd
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient from react-query

const ActionComment = ({ post }) => {
  const { profile } = useSelector((state) => state.root.user || {});
  const [showNestedComments, setShowNestedComments] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showReplyEdit, setShowReplyEdit] = useState({});
  const [currentParentId, setCurrentParentId] = useState(null); // Quản lý parentId hiện tại
  const [inputText, setInputText] = useState(""); // Add this state to manage input text
  const queryClient = useQueryClient(); // Initialize queryClient


  // Fetch parent comments (Cấp 1)
  const { data: parentComments = { data: { data: [] } } } = useQuery({
    queryKey: ["parentComments", post.documentId],
    queryFn: () => apiGetPostComment({ postId: post.documentId }),
    enabled: !!post.documentId,
  });

  // Fetch nested comments (Cấp 2) chỉ khi có `currentParentId`
  const {
    data: nestedComments = { data: { data: [] } },
    isLoading,
  } = useQuery({
    queryKey: ["nestedComments", post.documentId, currentParentId],
    queryFn: () =>
      apiGetPostCommentParent({ postId: post.documentId, parentId: currentParentId }),
    enabled: !!currentParentId,
    staleTime: 5 * 60 * 1000, // Cache trong 5 phút
  });

  const toggleNestedComments = (parentId) => {
    setShowNestedComments((prev) => {
      const isCurrentlyVisible = !!prev[parentId];
      if (isCurrentlyVisible) {
        return { ...prev, [parentId]: false };
      } else {
        setCurrentParentId(parentId); // Cập nhật parentId để trigger fetch dữ liệu
        return { ...prev, [parentId]: true };
      }
    });
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      newState[commentId] = !prev[commentId];
      if (newState[commentId]) {
        setShowReplyEdit({});
      }
      return newState;
    });
  };

  const handleReplyFormClose = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: false,
    }));
  };

  const toggleReplyEdit = (commentId) => {
    setShowReplyEdit((prev) => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      newState[commentId] = !prev[commentId];
      if (newState[commentId]) {
        setShowReplyForm({});
      }
      return newState;
    });
  };

  const handleReplyEditClose = (commentId) => {
    setShowReplyEdit((prev) => ({
      ...prev,
      [commentId]: false,
    }));
  };

  //console.log('ShowReplyFormShowReplyForm:', profile);

  const handleDeleteComment = async (commentId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this comment?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await apiDeletePostComment({ documentId: commentId });
          // Show success notification
          notification.success({
            message: 'Deleted Created',
            description: 'Your comment has been Deleted successfully.',
          });

          // Invalidate the post query to refresh the data
          queryClient.invalidateQueries('parentComments');
        } catch (error) {
          console.error("Error deleting reaction:", error);
        }
      },
    });
  };

  return (
    <ul className="post-comments list-inline p-0 m-0">
      {parentComments.data.data.map((comment) => (
        <li className="mb-2" key={comment.documentId}>
          <div className="d-flex">
            <div className="user-img">
              <img
                src={comment.user_id.profile_picture}
                alt="user1"
                className="avatar-35 rounded-circle img-fluid"
              />
            </div>
            <div className="comment-data-block ms-3">
              <h6>{comment.user_id.username}</h6>
              <div className="d-flex flex-wrap align-items-center">
                <p className="mb-0">
                  {comment.content.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <div className="card-post-toolbar ms-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="bg-transparent">
                      <span className="material-symbols-outlined">
                        more_horiz
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu m-0 p-0">
                      <Dropdown.Item
                        className="dropdown-item p-3"
                        to="#"
                        style={{ display: comment?.user_id?.documentId === profile?.documentId ? 'block' : 'none' }}
                        onClick={() => {
                          setInputText(comment.content); // Set the input text to the comment content
                          toggleReplyEdit(comment.documentId);
                        }}
                      >
                        <div className="d-flex align-items-top">
                          <i className="material-symbols-outlined">edit</i>
                          <div className="data ms-2">
                            <h6>Edit Comment</h6>
                            <p className="mb-0">
                              Update your comment and saved items
                            </p>
                          </div>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item p-3" to="#" style={{ display: (comment?.user_id?.documentId === profile?.documentId || post?.user_id?.documentId === profile?.documentId) ? 'block' : 'none' }}
                        onClick={() => handleDeleteComment(comment.documentId)}
                      >
                        <div className="d-flex align-items-top">
                          <i className="material-symbols-outlined">delete</i>
                          <div className="data ms-2">
                            <h6>Delete</h6>
                            <p className="mb-0">
                              Remove this Comment on Timeline
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
                              Report this comment
                            </p>
                          </div>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="d-flex flex-wrap align-items-center comment-activity">
                <Link to="#" onClick={() => toggleNestedComments(comment.documentId)}>
                  {showNestedComments[comment.documentId] ? (
                    <>
                      Hide replies <CaretUpOutlined />
                    </>
                  ) : (
                    <>
                      Show replies <CaretDownOutlined />
                    </>
                  )}
                </Link>
                <Link to="#" onClick={() => toggleReplyForm(comment.documentId)}>
                  Reply
                </Link>
                <span>
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>

              {showReplyForm[comment.documentId] && (
                <Reply
                  post={post}
                  parent={comment} // Pass empty object if inputText is set
                  nested={comment} // Pass empty object if inputText is set
                  profile={profile}
                  handleReplyFormClose={() => handleReplyFormClose(comment.documentId)}
                />
              )}
              {showReplyEdit[comment.documentId] && (
                <ReplyEdit
                  inputText={inputText} // Pass inputText to Reply component
                  commentId={comment.documentId} // Pass commentId to Reply component
                  handleReplyEditClose={() => handleReplyEditClose(comment.documentId)}
                />
              )}


              {/* Hiển thị comment cấp 2 nếu đã mở */}
              {showNestedComments[comment.documentId] && comment.documentId === currentParentId && (
                <ul className="post-comments list-inline p-0 m-0 mt-2">
                  {isLoading ? (
                    <p>Loading replies...</p>
                  ) : (
                    nestedComments.data.data.map((nestedComment) => (
                      <li className="mb-2" key={nestedComment.documentId}>
                        <div className="d-flex">
                          <div className="user-img">
                            <img
                              src={nestedComment.user_id.profile_picture}
                              alt="user1"
                              className="avatar-25 rounded-circle img-fluid"
                            />
                          </div>
                          <div className="comment-data-block ms-3">
                            <h6>{nestedComment.user_id.username}</h6>
                            <div className="d-flex flex-wrap align-items-center">
                              <p className="mb-0">
                                {nestedComment.content.split("\n").map((line, index) => (
                                  <React.Fragment key={index}>
                                    {line}
                                    <br />
                                  </React.Fragment>
                                ))}
                              </p>
                              <div className="card-post-toolbar ms-2">
                                <Dropdown>
                                  <Dropdown.Toggle variant="bg-transparent">
                                    <span className="material-symbols-outlined">
                                      more_horiz
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="dropdown-menu m-0 p-0">
                                    <Dropdown.Item className="dropdown-item p-3" to="#" style={{ display: nestedComment?.user_id?.documentId === profile?.documentId ? 'block' : 'none' }} onClick={() => {
                                      setInputText(nestedComment.content); // Set the input text to the comment content
                                      toggleReplyEdit(nestedComment.documentId);
                                    }}>
                                      <div className="d-flex align-items-top">
                                        <i className="material-symbols-outlined">edit</i>
                                        <div className="data ms-2">
                                          <h6>Edit Comment</h6>
                                          <p className="mb-0">
                                            Update your comment and saved items
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="dropdown-item p-3" to="#" style={{ display: (nestedComment?.user_id?.documentId === profile?.documentId || post?.user_id?.documentId === profile?.documentId) ? 'block' : 'none' }}
                                      onClick={() => handleDeleteComment(nestedComment.documentId)}
                                    >
                                      <div className="d-flex align-items-top">
                                        <i className="material-symbols-outlined">delete</i>
                                        <div className="data ms-2">
                                          <h6>Delete</h6>
                                          <p className="mb-0">
                                            Remove this Comment on Timeline
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
                                            Report this comment
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="d-flex flex-wrap align-items-center comment-activity">
                              <Link to="#" onClick={() => toggleReplyForm(nestedComment.documentId)}>
                                Reply
                              </Link>
                              <span> {formatDistanceToNow(new Date(nestedComment.createdAt), { addSuffix: true })} </span>
                            </div>
                            {showReplyForm[nestedComment.documentId] && (
                              <Reply
                                post={post}
                                parent={comment}
                                nested={nestedComment}
                                profile={profile}
                                handleReplyFormClose={() => handleReplyFormClose(nestedComment.documentId)}
                              />
                            )}
                            {showReplyEdit[nestedComment.documentId] && (
                              <ReplyEdit
                                inputText={inputText} // Pass inputText to Reply component
                                commentId={nestedComment.documentId} // Pass commentId to Reply component
                                handleReplyEditClose={() => handleReplyEditClose(nestedComment.documentId)}
                              />
                            )}
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActionComment;
