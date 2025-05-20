import React from 'react';
import styled from 'styled-components';
import { apiUpdatePostComment } from '../../../../services/comment'; // Import the API function
import { notification } from 'antd'; // Import notification from antd
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient from react-query
import { useSelector } from 'react-redux';

const Edit = ({ formData, handleClose, commentId  }) => {
  const { token } = useSelector((state) => state.root.auth || {});
  const queryClient = useQueryClient(); // Initialize queryClient

//   console.log('Form data:', formData);
//   console.log('Comemnt:', commentId);

  const handleSendClick = async () => {

    if (commentId) {
      // Logic for when only post and commentId are present
      // console.log('Case 2: Only post and commentId present');
    //   console.log('Form data:', formData);
    //   console.log('Comemnt:', commentId);
      const payload = {
          content: formData.inputText,
      };
      try {
        const response = await apiUpdatePostComment({documentId: commentId, payload, token});
        //console.log('Comment created:', response);

        // Show success notification
        notification.success({
          message: 'Comment Edited',
          description: 'Your comment has been edited successfully.',
        });

        formData.inputText = ''; // Clear the input text after successful update

        // Close the modal or form if handleClose is a function
        if (typeof handleClose === 'function') {
          handleClose();
        }

        // Invalidate the post query to refresh the data
        queryClient.invalidateQueries('parentComments');
      } catch (error) {
        console.error('Error creating comment:', error);
      }
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

export default Edit;
