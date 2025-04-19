/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";
// img

import user5 from "../../../../assets/images/user/05.jpg";

//Sweet alert
import Swal from "sweetalert2";
import {
  apiGetFriendRequest,
  apiGetFriendAccepted,
} from "../../../../services/friend";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FriendMore from "./FriendMore";
import Loader from "../../icons/uiverse/Loading";
import { useSelector } from "react-redux";

const FriendRequest = () => {
  const { token, user } = useSelector((state) => state.root.auth || {});


  // Lấy danh sách yêu cầu kết bạn
  const { data: friendRequest, isLoading, error } = useQuery({
    queryKey: ['friendRequest', user?.documentId, token],
    queryFn: () => apiGetFriendRequest({ documentId: user?.documentId, token }),
    enabled: !!user?.documentId && !!token,
  });

  const friendRequests = friendRequest?.data?.data || [];

  const friendRequestData = friendRequests?.filter(request => request.user.documentId !== user?.documentId);

  // Kiểm tra trạng thái loading và error
  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching friend requests</div>;


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
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
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
      <div id="content-page" className="content-page">
        <Container>
          <Row>
            <Col sm="12">
              <Card>
                <Card.Header className="d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">Friend Request</h4>
                  </div>
                </Card.Header>
                <Card.Body>
                  <ul className="request-list list-inline m-0 p-0">
                    {friendRequestData.map((user) => (
                      <li
                        key={user.documentId}
                        className="d-flex align-items-center justify-content-between flex-wrap"
                      >
                        <div className="user-img img-fluid flex-shrink-0">
                          <img
                            src={user?.user?.avatarMedia?.file_path || user5}
                            alt="story-img"
                            className="rounded-circle avatar-40"
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <Link
                            to={`/friend-profile/${user?.user?.documentId}`}
                            className="text-decoration-none"
                          >
                            <h6>{user?.user?.fullname}</h6>
                          </Link>
                          <p className="mb-0">
                            {user?.user?.friendCount || 0} friends
                          </p>
                        </div>
                        <div className="d-flex align-items-center mt-2 mt-md-0">
                          <div className="confirm-click-btn">
                            <Link
                              to="#"
                              className="me-3 btn btn-primary rounded confirm-btn"
                            >
                              Confirm
                            </Link>
                            <Link
                              to="#"
                              className="me-3 btn btn-primary rounded request-btn"
                              style={{ display: "none" }}
                            >
                              View All
                            </Link>
                          </div>
                          <Link
                            to="#"
                            onClick={questionAlert}
                            className="btn btn-secondary rounded"
                            data-extra-toggle="delete"
                            data-closest-elem=".item"
                          >
                            Delete Request
                          </Link>
                        </div>
                      </li>
                    ))}
                    <li className="d-block text-center mb-0 pb-0">
                      <Link to="#" className="me-3 btn btn-primary">
                        View More Request
                      </Link>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
              <FriendMore />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FriendRequest;
