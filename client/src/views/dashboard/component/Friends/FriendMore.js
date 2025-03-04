/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";
// img

import user15 from "../../../../assets/images/user/15.jpg";

//Sweet alert
import Swal from "sweetalert2";
import {
  apiGetFriendRequest,
  apiGetFriendAccepted,
  apiGetFriendMore,
} from "../../../../services/friend";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const FriendMore = () => {
  const { profile } = useSelector((state) => state.root.user || {});
  const documentId = profile?.documentId;

  // Lấy danh sách bạn bè đã chấp nhận
  const { data: friendAccepted, isLoading: loadingAccepted } = useQuery({
    queryKey: ["friendAccepted", documentId],
    queryFn: () => apiGetFriendAccepted({ documentId }),
  });
  const friendAcceptedData = friendAccepted?.data?.data || [];

  // Lấy danh sách yêu cầu kết bạn
  const { data: friendRequest, isLoading: loadingRequest } = useQuery({
    queryKey: ["friendRequest", documentId],
    queryFn: () => apiGetFriendRequest({ documentId }),
  });
  const friendRequestData = friendRequest?.data?.data || [];

  // Lấy danh sách tất cả người dùng
  const { data: allUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => apiGetFriendMore({ documentId }),
  });
  const allUsersData = allUsers?.data?.data || [];

  // Kiểm tra người dùng không có trong friendRequestData và friendAcceptedData
  const availableUsers = Array.isArray(allUsersData)
    ? allUsersData.filter((user) => {
        const isInFriendRequest = friendRequestData.some(
          (request) => request.user_id.documentId === user.user_id.documentId
        );

        const isInFriendAccepted = friendAcceptedData.some((friend) => {
          const isUserIdMatch = friend.user_id.documentId === documentId;
          const isFriendIdMatch = friend.friend_id.documentId === documentId;
          return (
            (isUserIdMatch &&
              friend.friend_id.documentId === user.user_id.documentId) ||
            (isFriendIdMatch &&
              friend.user_id.documentId === user.user_id.documentId)
          );
        });

        return !isInFriendRequest && !isInFriendAccepted;
      })
    : []; // Nếu không phải là mảng, trả về mảng rỗng

  // Tạo state để lưu số lượng bạn bè
  const [userFriendCounts, setUserFriendCounts] = useState([]);

  useEffect(() => {
    const fetchFriendCounts = async () => {
      const counts = await Promise.all(
        availableUsers.map(async (user) => {
          const response = await apiGetFriendAccepted({
            documentId: user.user_id.documentId,
          });
          const friendCount = response?.data?.data?.length || 0; // Đếm số lượng bạn bè
          return {
            ...user,
            friendsCount: friendCount,
          };
        })
      );
      setUserFriendCounts(counts);
    };

    fetchFriendCounts();
  }, [availableUsers]);

  console.log("userFriendCounts", userFriendCounts);

  const questionAlert = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: "btn btn-outline-primary btn-lg ms-2",
        confirmButton: "btn btn-primary btn-lg",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "cancel",
        confirmButtonText: "Yes, delete it!",

        reverseButtons: false,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your Request has been deleted.",
            icon: "success",
            showClass: {
              popup: "animate__animated animate__zoomIn",
            },
            hideClass: {
              popup: "animate__animated animate__zoomOut",
            },
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Your Request is safe!",
            showClass: {
              popup: "animate__animated animate__zoomIn",
            },
            hideClass: {
              popup: "animate__animated animate__zoomOut",
            },
          });
        }
      });
  };

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <div className="header-title">
            <h4 className="card-title">People You May Know</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <ul className="request-list m-0 p-0">
            {userFriendCounts.map((user) => (
              <li
                key={user.documentId}
                className="d-flex align-items-center flex-wrap"
              >
                <div className="user-img img-fluid flex-shrink-0">
                  <img
                    src={user?.user_id?.profile_picture || user15}
                    alt="story-img"
                    className="rounded-circle avatar-40"
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6>{user?.user_id?.username}</h6>
                  <p className="mb-0">{user.friendsCount || 0} friends</p>
                </div>
                <div className="d-flex align-items-center mt-2 mt-md-0">
                  <Link to="#" className="me-3 btn btn-primary rounded">
                    <i className="ri-user-add-line me-1"></i>Add Friend
                  </Link>
                  <Link
                    to="#"
                    onClick={questionAlert}
                    className="btn btn-secondary rounded"
                    data-extra-toggle="delete"
                    data-closest-elem=".item"
                  >
                    Remove
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

export default FriendMore;
