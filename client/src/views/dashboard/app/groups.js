import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Card from "../../../components/Card";
import { Link } from "react-router-dom";
import ProfileHeader from "../../../components/profile-header";
import { notification } from "antd";

// images
import user05 from "../../../assets/images/user/05.jpg";
import img7 from "../../../assets/images/page-img/profile-bg7.jpg";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiGetGroupRequest } from "../../../services/groupServices/groupRequest";
import { apiGetGroupMembers } from "../../../services/groupServices/groupMembers";
import { apiGetGroup } from "../../../services/groupServices/group";
import { apiGetGroupRequestUser, apiCreateGroupRequest, apiCheckGroupRequestUser, apiUpdateGroupRequest } from "../../../services/groupServices/groupRequest";


const Groups = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.root.auth || {});
  const { token } = useSelector((state) => state.root.auth || {});

  const document = user?.documentId;
  const [groupRequests, setGroupRequests] = useState({});

  // Fetch all groups
  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups', token],
    queryFn: () => apiGetGroup({ token }),
    enabled: !!token,
    onSuccess: (data) => {
      console.log("Groups data fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching groups data:", error);
    }
  });

  const groups = groupsData?.data?.data || [];

  // Fetch group members for each group using useQuery
  const { data: groupMembersMap = {}, isLoading: membersLoading } = useQuery({
    queryKey: ['groupMembers', groups, token],
    queryFn: async () => {
      const membersMap = {};
      if (groups.length > 0) {
        for (const group of groups) {
          const groupId = group.documentId;
          try {
            const response = await apiGetGroupMembers({ groupId, token });
            membersMap[groupId] = response.data?.data || [];
          } catch (error) {
            console.error(`Error fetching members for group ${groupId}:`, error);
            membersMap[groupId] = [];
          }
        }
      }
      return membersMap;
    },
    enabled: groups.length > 0 && !!token,
  });

  useEffect(() => {
    const fetchGroupRequests = async () => {
      const requests = {};
      for (const group of groups || []) {
        const groupId = group?.documentId;
        const response = await apiGetGroupRequest({ groupId: groupId, token: token });
        requests[groupId] = response.data?.data.length;
      }
      setGroupRequests(requests);
    };

    if (groups?.length > 0) {
      fetchGroupRequests();
    }
  }, [groups]);

  const fetchMembershipStatus = async () => {
    const status = {};
    for (const group of groups || []) {
      const groupId = group.documentId;
      const isMember = await checkGroupMembership(groupId, token);
      const requestSent = await checkGroupRequestSent(groupId, token);
      status[groupId] = { isMember, requestSent };
    }
    return status;
  };

  const { data: membershipStatus = {}, refetch: refetchMembershipStatus } = useQuery({
    queryKey: ["membershipStatus", groups, token],
    queryFn: fetchMembershipStatus,
    enabled: !!groups?.length && !!token,
  });

  const checkGroupMembership = async (groupId, token) => {
    try {
      const response = await apiGetGroupMembers({ groupId, token });
      const members = response.data?.data || [];
      return members.some(member => member.user_id === user?.documentId);
    } catch (error) {
      console.error("Error checking group membership:", error);
      return false;
    }
  };

  const checkGroupRequestSent = async (groupId) => {
    try {
      const response = await apiGetGroupRequestUser({ groupId, userId: user?.documentId });
      return response.data?.data.length > 0;
    } catch (error) {
      console.error("Error checking group request:", error);
      return false;
    }
  };

  const handleSendRequest = async (groupId) => {
    try {
      const response = await apiCheckGroupRequestUser({ groupId, userId: user?.documentId, token: token });
      if (response.data?.data.length > 0) {
        const requestId = response.data.data[0].documentId;
        const payload = {
          statusActionId: "w1t6ex59sh5auezhau5e2ovu",
        };
        await apiUpdateGroupRequest({ documentId: requestId, payload, token });
      } else {
        const payload = {
          groupId: groupId,
          requestBy: user?.documentId,
          statusActionId: "w1t6ex59sh5auezhau5e2ovu",
        };
        await apiCreateGroupRequest(payload, token);
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
      const response = await apiCheckGroupRequestUser({ groupId, userId: user?.documentId, token: token });
      if (response.data?.data.length > 0) {
        const requestId = response.data.data[0].documentId;
        const payload = {
          statusActionId: "aei7fjtmxrzz3hkmorgwy0gm",
        };
        await apiUpdateGroupRequest({ documentId: requestId, payload, token });
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
            {groups?.length > 0 ? (
              groups.map((group, index) => {
                // Lấy thành viên của nhóm hiện tại từ useQuery
                const groupMembers = groupMembersMap[group.documentId] || [];
                const validGroupMembers = Array.isArray(groupMembers) ? groupMembers : [];
                const isJoined = validGroupMembers.some(
                  (member) => member?.user_id === document
                );
                const groupId = group.documentId;
                const groupDetailsAvailable = group;
                const { isMember, requestSent } = membershipStatus[groupId] || {};

                return (
                  <Card className="mb-0" key={group.id || index}>
                    <div className="top-bg-image">
                      <img
                        src={group?.image?.file_path}
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
                            <h6>{validGroupMembers.length || 0}</h6>
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
                                  src={member?.user?.avatarMedia?.file_path || user05}
                                  alt="user-img"
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
                            {/* <Link className="flex-fill">
                              <button
                                type="submit"
                                className="btn btn-success d-block w-100"
                              >
                                Sent
                              </button>
                            </Link> */}
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
