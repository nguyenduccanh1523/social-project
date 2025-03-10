import React from 'react';
import styled from 'styled-components';
import { apiCreatePostComment, apiUpdatePostComment } from '../../../../services/comment'; // Import the API function
import { notification } from 'antd'; // Import notification from antd
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient from react-query

const Send = ({ formData, post, parent, nested, profile, handleClose }) => {
  const queryClient = useQueryClient(); // Initialize queryClient

  // console.log('Form data:', formData);
  // console.log('Post:', post);
  // console.log('Parent:', parent);
  // console.log('Nested:', nested);
  // console.log('Comemnt:', commentId);

  const handleSendClick = async () => {
    if (post && parent && nested ) {
      // Logic for when post, parent, and nested are all present
      console.log('Case 1: All present');
      // console.log('Form data:', formData);
      // console.log('Post:', post);
      // console.log('Parent:', parent);
      // console.log('Nested:', nested);
      const payload = {
        data: {
          post_id: post?.documentId,
          user_id: profile?.documentId,
          parent_id: parent?.documentId,
          content: formData.inputText,
        }
      };
      try {
        const response = await apiCreatePostComment(payload);
        //console.log('Comment created:', response);

        // Show success notification
        notification.success({
          message: 'Comment Created',
          description: 'Your comment has been created successfully.',
        });

        
        // Close the modal or form if handleClose is a function
        if (typeof handleClose === 'function') {
          handleClose();
        }

        // Invalidate the post query to refresh the data
        queryClient.invalidateQueries('parentComments');
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    } else if (post && !parent && !nested ) {
      // Logic for when only post is present
      console.log('Case 3: Only post present');
      console.log('Form data:', formData);
      console.log('Post:', post);
    } else {
      // Handle other cases if necessary
      console.log('Other case');
    }
  };

  return (
    <StyledWrapper>
      <button type='button' onClick={handleSendClick} />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    background: #2389e9;
    padding: 5px; /* Adjusted padding */
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    transition: all .5s ease-in-out;
    width: 30px; /* Adjusted width */
    height: 30px; /* Adjusted height */
  }

  button:hover {
    border-radius: 50%;
    transition: all .5s ease-in-out;
  }

  button:hover:before {
    margin-left: 0%;
    transform: rotate(24deg);
  }

  button::before {
    content: "";
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cGF0aCBkPSJtNTczLjE4IDE5OC42MnYwbC0zOTYuMDkgNjMuNzE5Yy03Ljc1IDAuODU5MzgtOS40NzI3IDExLjE5NS0zLjQ0NTMgMTUuNWw5Ny4zMDEgNjguODgzLTE1LjUgMTEyLjhjLTAuODU5MzggNy43NSA3Ljc1IDEyLjkxNCAxMy43NzcgNy43NWw1NS4xMDktNDQuNzczIDI2LjY5MSAxMjQuODVjMS43MjI3IDcuNzUgMTEuMTk1IDkuNDcyNyAxNS41IDIuNTgybDIxNS4yNy0zMzguMzljMy40NDE0LTYuMDI3My0xLjcyNjYtMTMuNzc3LTguNjEzMy0xMi45MTR6bS0zNzIuODQgNzYuNjMzIDMxMy40Mi00OS45NDEtMjMzLjM0IDEwNy42M3ptNzQuMDUxIDE2NS4zMiAxMi45MTQtOTIuMTMzYzgwLjkzOC0zNy4wMjcgMTM5LjQ5LTY0LjU3OCAyMjkuMDQtMTA1LjkxLTEuNzE4OCAxLjcyMjctMC44NTkzNyAwLjg1OTM4LTI0MS45NSAxOTguMDR6bTg4LjY4OCA4Mi42Ni0yNC4xMDktMTEyLjggMTk5Ljc3LTE2Mi43NHoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+Cg==");
    height: 20px; /* Adjusted height */
    background-repeat: no-repeat;
    position: absolute;
    width: 20px; /* Adjusted width */
    transition: all .9s ease-in-out;
    background-size: 100%;
  }`;

export default Send;
