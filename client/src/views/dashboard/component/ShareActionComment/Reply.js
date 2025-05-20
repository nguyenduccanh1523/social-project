import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EmojiPicker from 'emoji-picker-react';
import Send from "./Send";

const Reply = ({ post, parent, nested, handleReplyFormClose }) => {
  const { user } = useSelector((state) => state.root.auth || {});
  const [comment, setComment] = useState((nested ? `@${nested?.user?.username} ` : ''));
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  //console.log("Reply component props:", post, parent, nested);

  const onEmojiClick = (emoji) => {
    setComment(prevComment => prevComment + emoji.emoji);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setComment(prevComment => prevComment + '\n');
    }
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowPicker(false);
    }
  };

  const handleSendClick = async () => {
    // Logic for sending the comment
    // You can call the Send component's handleSendClick function here if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your submit logic here
    setComment(nested ? `@${nested?.user?.username} ` : ''); // Reset the comment
    setShowPicker(false); // Close the emoji picker
    await handleSendClick(); // Call the send function
    handleReplyFormClose(); // Close the reply form
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <>
      <style>
        {`
          .replyPicker {
            position: absolute;
            bottom: 150px; /* Adjusted to move below the emoji button */
            right: 10px; /* Adjusted to align with the emoji button */
            z-index: 1000;
          }
          .replyText {
            border: none;
            box-shadow: none;
            margin: 4px;
            width: 100%;
            resize: none;
            height: 30px;
          }
          .replyForm {
            width: 400px;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            padding-right: 10px;
          }
          .replyEmoSend {
            display: flex;
            justify-content: space-between;
            position: relative; /* Added to position the picker relative to this div */
          }
        `}
      </style>
      <div className="d-flex align-items-center">
        <div className="user-img">
          <img
            src={user?.avatarMedia?.file_path}
            alt="user1"
            className="avatar-25 rounded-circle img-fluid"
          />
        </div>
        <form className="align-items-center m-2 replyForm" onSubmit={handleSubmit}>
          <textarea
            className="form-control rounded replyText"
            placeholder="Enter Your Comment"
            value={comment}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            rows="3"
          />

          <div className="d-flex align-items-center m-1 replyEmoSend">
            <span
              className="material-symbols-outlined ms-2"
              onClick={() => setShowPicker(!showPicker)}
              style={{ cursor: "pointer" }}
            >
              emoji_emotions
            </span>
            {showPicker && (
              <div ref={pickerRef} className="replyPicker">
                <EmojiPicker onEmojiClick={onEmojiClick} style={{ height: '400px'}} />
              </div>
            )}
            <Send formData={{
              inputText: comment,
            }} post={post} parent={parent} nested={nested} profile={user} handleClose={handleReplyFormClose} />
          </div>

        </form>

      </div>

    </>
  );
};

export default Reply;
