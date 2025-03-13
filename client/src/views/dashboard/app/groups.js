import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import ProfileHeader from "../../../components/profile-header";
import { notification } from "antd";

// images
import user05 from "../../../assets/images/user/05.jpg";
import img1 from "../../../assets/images/page-img/profile-bg1.jpg";
import img2 from "../../../assets/images/page-img/profile-bg2.jpg";
import img3 from "../../../assets/images/page-img/profile-bg3.jpg";
import img4 from "../../../assets/images/page-img/profile-bg4.jpg";
import img5 from "../../../assets/images/page-img/profile-bg5.jpg";
import img6 from "../../../assets/images/page-img/profile-bg6.jpg";
import img7 from "../../../assets/images/page-img/profile-bg7.jpg";
import img9 from "../../../assets/images/page-img/profile-bg9.jpg";
import { useDispatch, useSelector } from "react-redux";

import { fetchGroup, fetchGroupMembers } from "../../../actions/actions";
import { apiGetGroupRequest } from "../../../services/groupServices/groupRequest";
import { apiGetGroupMembersUser } from "../../../services/groupServices/groupMembers";
import { useQuery } from "@tanstack/react-query";
import { apiGetGroupRequestUser, apiCreateGroupRequest, apiCheckGroupRequestUser, apiUpdateGroupRequest } from "../../../services/groupServices/groupRequest";
import { useQueryClient } from "@tanstack/react-query";

const Groups = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { profile } = useSelector((state) => state.root.user || {});
  const { groups } = useSelector((state) => state.root.group || {});
  const { members } = useSelector((state) => state.root.group || {});
  const images = [img1, img2, img3, img4, img5, img6, img7, img9];
  //console.log("mem: ", members);

  const document = profile?.documentId;
  const [groupRequests, setGroupRequests] = useState({});

  useEffect(() => {
    dispatch(fetchGroup());
  }, [dispatch]);

  useEffect(() => {
    groups?.data?.forEach((group) => {
      dispatch(fetchGroupMembers(group.documentId)); // Truyền đúng giá trị groupId
    });
  }, [groups, dispatch]);
  //console.log("groups: ", groups);

  useEffect(() => {
    const fetchGroupRequests = async () => {
      const requests = {};
      for (const group of groups?.data || []) {
        const groupId = group?.documentId;
        //console.log("groupId", groupId);
        const response = await apiGetGroupRequest({ groupId: groupId });
        //console.log("response", response);
        requests[groupId] = response.data?.data.length;
      }
      setGroupRequests(requests);
    };

    if (groups?.data?.length > 0) {
      fetchGroupRequests();
    }
  }, [groups]);

  const fetchMembershipStatus = async () => {
    const status = {};
    for (const group of groups?.data || []) {
      const groupId = group.documentId;
      const isMember = await checkGroupMembership(groupId);
      const requestSent = await checkGroupRequestSent(groupId);
      status[groupId] = { isMember, requestSent };
    }
    return status;
  };

  const { data: membershipStatus = {}, refetch: refetchMembershipStatus } = useQuery({
    queryKey: ["membershipStatus", groups],
    queryFn: fetchMembershipStatus,
    enabled: !!groups?.data?.length,
  });

  const checkGroupMembership = async (groupId) => {
    try {
      const response = await apiGetGroupMembersUser({ groupId, userId: profile?.documentId });
      return response.data?.data.length > 0;
    } catch (error) {
      console.error("Error checking group membership:", error);
      return false;
    }
  };

  const checkGroupRequestSent = async (groupId) => {
    try {
      const response = await apiGetGroupRequestUser({ groupId, userId: profile?.documentId });
      return response.data?.data.length > 0;
    } catch (error) {
      console.error("Error checking group request:", error);
      return false;
    }
  };

  const handleSendRequest = async (groupId) => {
    try {
      const response = await apiCheckGroupRequestUser({ groupId, userId: profile?.documentId });
      if (response.data?.data.length > 0) {
        const requestId = response.data.data[0].documentId;
        const payload = {
          data: {
            status_action: "w1t6ex59sh5auezhau5e2ovu",
          },
        };
        await apiUpdateGroupRequest({ documentId: requestId, payload });
      } else {
        const payload = {
          data: {
            group_id: groupId,
            user_request: profile?.documentId,
            status_action: "w1t6ex59sh5auezhau5e2ovu",
          },
        };
        await apiCreateGroupRequest(payload);
      }
      queryClient.invalidateQueries('membershipStatus'); // Refetch membership status to update the UI
      notification.success({
        message: "Success",
        description: "Request sent successfully",
      });
    } catch (error) {
      console.error("Error sending group request:", error);
      notification.error({
        message: "Error",
        description: "Failed to send request",
      });
    }
  };

  const handleCancelRequest = async (groupId) => {
    try {
      const response = await apiCheckGroupRequestUser({ groupId, userId: profile?.documentId });
      if (response.data?.data.length > 0) {
        const requestId = response.data.data[0].documentId;
        const payload = {
          data: {
            status_action: "aei7fjtmxrzz3hkmorgwy0gm",
          },
        };
        await apiUpdateGroupRequest({ documentId: requestId, payload });
        queryClient.invalidateQueries('membershipStatus'); // Refetch membership status to update the UI
        notification.success({
          message: "Success",
          description: "Request cancelled successfully",
        });
      }
    } catch (error) {
      console.error("Error cancelling group request:", error);
      notification.error({
        message: "Error",
        description: "Failed to cancel request",
      });
    }
  };

  return (
    <>
      <ProfileHeader img={img7} title="Groups" />
      <div id="content-page" className="content-page mb-3">
        <Container>
          <div className="d-grid gap-3 d-grid-template-1fr-19">
            {groups?.data?.length > 0 ? (
              groups.data.map((group, index) => {
                // Lấy thành viên của nhóm hiện tại từ Redux
                const groupMembers = members[group.documentId]?.data || [];
                // Đảm bảo groupMembers là mảng trước khi gọi .slice()
                const validGroupMembers = Array.isArray(groupMembers)
                  ? groupMembers
                  : [];

                const isJoined = validGroupMembers.some(
                  (member) => member?.users_id?.documentId === document
                );
                const groupId = group.documentId;
                const groupDetailsAvailable = group;
                const { isMember, requestSent } = membershipStatus[groupId] || {};

                return (
                  <Card className="mb-0" key={group.id}>
                    <div className="top-bg-image">
                      <img
                        src={group?.media?.file_path}
                        className="img-fluid w-100"
                        alt="group-bg"
                        style={{ height: "300px" }}
                      />
                    </div>
                    <Card.Body className="text-center">
                      <div className="group-info pt-3 pb-3">
                        <h4>{group.group_name}</h4>
                        <p>{group.description}</p>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <span className="material-symbols-outlined">
                            {group?.type?.name === "private" ? "lock" : "public"}
                          </span>
                          {group?.type?.name === "private" ? " Private Group" : " Public Group"}
                        </div>
                      </div>
                      <div className="group-details d-inline-block pb-3">
                        <ul className="d-flex align-items-center justify-content-between list-inline m-0 p-0">
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Post</p>
                            <h6>{group.posts?.length || 0}</h6>
                          </li>
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Member</p>
                            <h6>{validGroupMembers.length || 0}</h6>{" "}
                            {/* Hiển thị số lượng thành viên */}
                          </li>
                          <li className="pe-3 ps-3">
                            <p className="mb-0">Request</p>
                            <h6>{groupRequests[group.documentId] || 0}</h6>
                          </li>
                        </ul>
                      </div>
                      <div className="group-member mb-3">
                        <div className="iq-media-group">
                          {validGroupMembers
                            .slice(0, 6)
                            .map((member, index) => (
                              <Link to="#" className="iq-media" key={index}>
                                <img
                                  className="img-fluid avatar-40 rounded-circle"
                                  src={member?.users_id?.profile_picture || user05}
                                  alt="profile-img"
                                />
                              </Link>
                            ))}
                        </div>
                      </div>

                      {isMember !== undefined && (
                        isMember ? (
                          <Link
                            to={`/group-detail/${groupId}`}
                            state={{ documentId: groupDetailsAvailable?.documentId }}
                          >
                            <button
                              type="submit"
                              className="btn btn-secondary d-block w-100"
                            >
                              Access
                            </button>
                          </Link>
                        ) : requestSent ? (
                          <div className="d-flex gap-2 align-items-center">
                            <Link className="flex-fill">
                              <button
                                type="submit"
                                className="btn btn-success d-block w-100"
                              >
                                Sent
                              </button>
                            </Link>
                            <button
                              type="submit"
                              className="btn btn-danger d-block flex-fill"
                              onClick={() => handleCancelRequest(groupId)}
                            >
                              Cancel
                            </button>
                            {group?.type?.name === "public" && (
                              <Link
                                to={`/group-detail/${groupId}`}
                                state={{ documentId: groupDetailsAvailable?.documentId }}
                              >
                                <button
                                  type="submit"
                                  className="btn btn-secondary d-block w-100"
                                >
                                  Access
                                </button>
                              </Link>
                            )}
                          </div>
                        ) : (
                          group?.type?.name === "private" ? (
                            <button
                              type="submit"
                              className="btn btn-primary d-block w-100"
                              onClick={() => handleSendRequest(groupId)}
                            >
                              Send request
                            </button>
                          ) : (
                            <div className="d-flex gap-2 align-items-center">
                              <button
                                type="submit"
                                className="btn btn-primary d-block w-100 flex-fill"
                                onClick={() => handleSendRequest(groupId)}
                              >
                                Send request
                              </button>
                              <Link
                                to={`/group-detail/${groupId}`}
                                state={{ documentId: groupDetailsAvailable?.documentId }}
                                className="flex-fill"
                              >
                                <button
                                  type="submit"
                                  className="btn btn-secondary d-block w-100"
                                >
                                  Access
                                </button>
                              </Link>
                            </div>
                          )
                        )
                      )}
                    </Card.Body>
                  </Card>
                );
              })
            ) : (
              <p className="text-center">No groups available</p>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Groups;
