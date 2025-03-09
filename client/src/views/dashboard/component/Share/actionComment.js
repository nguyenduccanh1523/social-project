import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  apiGetPostComment,
  apiGetPostCommentParent,
} from "../../../../services/comment";

import "./post.scss";

//image
import user2 from "../../../../assets/images/user/02.jpg";
import user3 from "../../../../assets/images/user/03.jpg";
import Reply from "./Reply";

const ActionComment = ({ post, onSelect }) => {
  const [showNestedComments, setShowNestedComments] = useState({});
  const [showReplyForm, setShowReplyForm] = useState(false);

  const { data: parentComments = [] } = useQuery({
    queryKey: ["parentComments", post.id],
    queryFn: () => apiGetPostComment({ postId: post.documentId }),
    enabled: !!post.documentId,
  });

  const toggleNestedComments = async (parentId) => {
    setShowNestedComments((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));

    if (!showNestedComments[parentId]) {
        console.log("Fetching nested comments for parent:", parentId);
      try {
        const response = await apiGetPostCommentParent({
          postId: post.documentId,
          parentId: parentId,
        });
        //console.log("Nested comments response:", response);
        setShowNestedComments((prev) => ({
          ...prev,
          [parentId]: response,
        }));
      } catch (error) {
        console.error("Error fetching nested comments:", error);
      }
    }
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  //console.log("parentComments", parentComments);
  //console.log("showNestedComments", showNestedComments);
  return (
    <>
      <ul className="post-comments list-inline p-0 m-0">
        {parentComments?.data?.data.map((comment) => (
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
                <p className="mb-0">{comment.content}</p>
                <div className="d-flex flex-wrap align-items-center comment-activity">
                  <Link to="#" onClick={() => toggleNestedComments(comment.documentId)}>
                    {showNestedComments[comment.documentId] ? (
                      <>
                        hide replies <CaretUpOutlined />
                      </>
                    ) : (
                      <>
                        show replies <CaretDownOutlined />
                      </>
                    )}
                  </Link>
                  <Link to="#" onClick={toggleReplyForm}>
                    reply
                  </Link>
                  <span> {comment.createdAt} </span>
                </div>
                {showReplyForm && <Reply />}
                {showNestedComments[comment.documentId] && (
                  <ul className="post-comments list-inline p-0 m-0 mt-2">
                    {showNestedComments[comment.documentId]?.data?.data?.map((nestedComment) => (
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
                            <p className="mb-0">{nestedComment.content}</p>
                            <div className="d-flex flex-wrap align-items-center comment-activity">
                              <Link to="#" onClick={toggleReplyForm}>
                                reply
                              </Link>
                              <span> {nestedComment.createdAt} </span>
                            </div>
                            {showReplyForm && <Reply />}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ActionComment;
