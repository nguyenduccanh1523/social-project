/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";
import user15 from "../../../../assets/images/user/15.jpg";
import Swal from "sweetalert2";
import {
  apiGetFriendRequest,
  apiGetFriendAccepted,
  apiGetFriendMore,
} from "../../../../services/friend";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loader from "../../icons/uiverse/Loading";

const FriendMore = () => {
  const { token, user } = useSelector((state) => state.root.auth || {});

  const { data: userMoreData, isLoading: userMoreLoading } = useQuery({
    queryKey: ['userMore', user?.documentId, token],
    queryFn: () => apiGetFriendMore({ documentId: user?.documentId, token }),
    enabled: !!user?.documentId && !!token,
  });
  const friendMoreData = userMoreData?.data?.data || [];


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
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your request has been deleted.",
            icon: "success",
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Your request is safe!",
          });
        }
      });
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <div className="header-title">
          <h4 className="card-title">People You May Know</h4>
        </div>
      </Card.Header>
      <Card.Body>
        {userMoreLoading ? (
          <Loader />
        ) : friendMoreData.length === 0 ? (
          <p>No matching users</p>
        ) : (
          <ul className="request-list m-0 p-0">
            {friendMoreData.map((user, index) => (
              <li key={`${user.user?.documentId || index}`} className="d-flex align-items-center flex-wrap">
                <div className="user-img img-fluid flex-shrink-0">
                  <img
                    src={user?.avatarMedia?.file_path || user15}
                    alt="story-img"
                    className="rounded-circle avatar-40"
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <Link
                    to={`/friend-profile/${user?.documentId}`}
                    state={{
                      friendId: user?.documentId
                    }}
                    className="text-decoration-none"
                  >
                    <h6>{user?.fullname}</h6>
                  </Link>
                  <p className="mb-0">{user?.user_id?.friendCount || 0} friends</p>
                </div>
                <div className="d-flex align-items-center mt-2 mt-md-0">
                  <Link to="#" className="me-3 btn btn-primary rounded">
                    <i className="ri-user-add-line me-1"></i>Add Friend
                  </Link>
                  <Link
                    to="#"
                    onClick={questionAlert}
                    className="btn btn-secondary rounded"
                  >
                    Remove
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
};

export default FriendMore;
