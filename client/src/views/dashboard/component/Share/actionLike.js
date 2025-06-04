/* eslint-disable no-undef */
import React, { useState, useEffect, use } from "react";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./post.scss";
import CustomToggle from "../../../../components/dropdowns";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  apiCreatePostReaction,
  apiUpdatePostReaction,
  apiDeletePostReaction,
  apiGetPostUser,
} from "../../../../services/comment";

// Image imports
import icon4 from "../../../../assets/images/icon/04.png";
import icon6 from "../../../../assets/images/icon/06.png";
import icon1 from "../../../../assets/images/icon/01.png"; // Like
import icon2 from "../../../../assets/images/icon/02.png"; // Love

const ActionLike = ({ post, onSelect }) => {
  const { user } = useSelector((state) => state.root.auth || {});
  const { token } = useSelector((state) => state.root.auth || {});
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reactionId, setReactionId] = useState(null);

  const { data: userReactionData, isLoading } = useQuery({
    queryKey: ["userReaction", user.documentId, post.documentId],
    queryFn: () =>
      apiGetPostUser({ postId: post.documentId, userId: user.documentId, token }),
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Reset state khi post thay đổi
  useEffect(() => {
    setSelectedReaction(null);
    setReactionId(null);
  }, [post.documentId]);

  useEffect(() => {
    if (userReactionData?.data?.data?.length > 0) {
      const userReaction = userReactionData?.data?.data[0];
      if (userReaction.post.documentId === post.documentId) {
        setReactionId(userReaction.documentId);
        switch (userReaction.reaction_type) {
          case "Like":
            setSelectedReaction(icon1);
            break;
          case "Love":
            setSelectedReaction(icon2);
            break;
          case "HaHa":
            setSelectedReaction(icon4);
            break;
          case "Sade":
            setSelectedReaction(icon6);
            break;
          default:
            setSelectedReaction(null);
        }
      }
    }
  }, [userReactionData, post.documentId]);

  const handleReactionClick = async (icon, name) => {
    const payload = {
        user_id: user.documentId,
        post_id: post.documentId,
        reaction_type: name,
    };

    if (selectedReaction === icon) {
      console.log("Unchecked action:", name);
      setSelectedReaction(null);
      onSelect(null, -1); // Giảm số lượng reaction đi 1
      try {
        await apiDeletePostReaction({ documentId: reactionId, token });
      } catch (error) {
        console.error("Error deleting reaction:", error);
      }
    } else {
      // console.log("Checked action:", name);
      setSelectedReaction(icon);
      if (selectedReaction) {
        onSelect(icon, 0); // Giữ nguyên số lượng nếu đã có reaction trước đó
        try {
          console.log("Updating reaction:", payload, reactionId);
          await apiUpdatePostReaction({ documentId: reactionId, payload, token });
        } catch (error) {
          console.error("Error updating reaction:", error);
        }
      } else {
        onSelect(icon, 1); // Tăng số lượng reaction lên 1 nếu trước đó chưa có reaction
        try {
          const response = await apiCreatePostReaction(payload);
          // console.log("Created reaction:", response);
          setReactionId(response?.data?.data?.documentId);
        } catch (error) {
          console.error("Error creating reaction:", error);
        }
      }
    }
  };

  return (
    <div className="d-flex align-items-center">
      <div className="like-data">
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <button className="btn btn-white d-flex align-items-center post-button">
              {selectedReaction ? (
                <img
                  src={selectedReaction}
                  className="img-fluid me-2"
                  alt="reaction"
                />
              ) : (
                <span className="material-symbols-outlined">thumb_up</span>
              )}
              <h6>Reaction</h6>
            </button>
          </Dropdown.Toggle>
          <Dropdown.Menu className="py-2 w-100" style={{ textAlign: "center" }}>
            <OverlayTrigger placement="top" overlay={<Tooltip>Like</Tooltip>}>
              <img
                src={icon1}
                className="img-fluid me-2"
                alt=""
                onClick={() => handleReactionClick(icon1, "Like")}
                style={{ cursor: "pointer" }}
              />
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Love</Tooltip>}>
              <img
                src={icon2}
                className="img-fluid me-2"
                alt=""
                onClick={() => handleReactionClick(icon2, "Love")}
                style={{ cursor: "pointer" }}
              />
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>HaHa</Tooltip>}>
              <img
                src={icon4}
                className="img-fluid me-2"
                alt=""
                onClick={() => handleReactionClick(icon4, "HaHa")}
                style={{ cursor: "pointer" }}
              />
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Sade</Tooltip>}>
              <img
                src={icon6}
                className="img-fluid me-2"
                alt=""
                onClick={() => handleReactionClick(icon6, "Sade")}
                style={{ cursor: "pointer" }}
              />
            </OverlayTrigger>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default ActionLike;
