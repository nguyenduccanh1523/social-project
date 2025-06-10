import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { CiBookmark } from "react-icons/ci";
import { IoIosBookmark } from "react-icons/io";
import { useQueryClient } from '@tanstack/react-query';
import { apiCreateMarkPost, apiDeleteMarkPost, apiGetCheckMarkPost } from "../../../../../services/markpost";
import { message } from "antd";
import { useSelector } from "react-redux";

const Mark = ({ post, profile }) => {
    const { token } = useSelector((state) => state.root.auth || {});
    const [marked, setMarked] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const checkIfMarked = async () => {
            try {
                const response = await apiGetCheckMarkPost({ postId: post.documentId, userId: profile.documentId, token });
                //console.log("Response:", response);
                if (response?.data?.data.length > 0) {
                    setMarked(true);
                }
            } catch (error) {
                console.error('Error checking if post is marked:', error);
            }
        };

        checkIfMarked();
    }, [post.documentId]);

    const handleToggleBookmark = async (e, postId) => {
        e.stopPropagation();
        if (marked) {
            try {
                await apiDeleteMarkPost({ documentId: postId, token });
                setMarked(false);
                message.success('Mark post removed successfully!');
                setTimeout(() => {
                    queryClient.invalidateQueries('post');
                }, 3000);
            } catch (error) {
                console.error('Error deleting mark post:', error);
                message.error('An error occurred while removing the mark post.');
            }
        } else {
            const payload = {
                user_id: profile.documentId,
                post_id: postId
            };
            try {
                await apiCreateMarkPost(payload);
                setMarked(true);
                message.success('Post marked successfully!');
                setTimeout(() => {
                    queryClient.invalidateQueries('post');
                }, 3000);
            } catch (error) {
                console.error('Error marking post:', error);
                message.error('An error occurred while marking the post.');
            }
        }
    };
    //console.log("Marked:", post);

    return (
        <>
            <Dropdown.Item className="dropdown-item p-3" to="#" onClick={(e) => handleToggleBookmark(e, post.documentId)}>
                <div className="d-flex align-items-top">
                    {marked ? <IoIosBookmark style={{ cursor: 'pointer', fontSize: '25px' }} /> : <CiBookmark style={{ cursor: 'pointer', fontSize: '25px' }} />}
                    <div className="data ms-2">
                        <h6>{marked ? "Unmark Post" : "Save Post"}</h6>
                        <p className="mb-0">
                            {marked ? "Remove this from your saved items" : "Add this to your saved items"}
                        </p>
                    </div>
                </div>
            </Dropdown.Item>
        </>
    );
};

export default Mark;