import React from "react";

import { Dropdown } from "react-bootstrap";
import {
  IoMdNotifications,
  IoMdNotificationsOff,
  IoMdLogOut,
  IoIosBug,
} from "react-icons/io";
import {
  apiGetGroupNotification,
  apiEditGroupNotification,
  apiCreateGroupNotification,
} from "../../../../services/notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notification, Modal } from "antd";
import { useSelector } from "react-redux";
import {
  apiDeleteMemberGroup,
  apiGetGroupMembersUser,
} from "../../../../services/groupServices/groupMembers";
import { useNavigate } from "react-router-dom";

const ActionGroup = ({ oldData, profile }) => {
  const { token } = useSelector((state) => state.root.auth || {});
  const navigate = useNavigate();
  //console.log("oldData", oldData);
  // console.log("profile", profile);
  const { data: groupNotifications } = useQuery({
    queryKey: ["groupNotifications", profile?.documentId, oldData?.documentId],
    queryFn: () =>
      apiGetGroupNotification({
        groupId: oldData?.documentId,
        userId: profile?.documentId,
        token: token,
      }),
    enabled: !!profile?.documentId && !!oldData?.documentId && !!token,
    staleTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
  });
  const { data: groupMemberUser } = useQuery({
    queryKey: ["groupMemberUser", profile?.documentId, oldData?.documentId],
    queryFn: () =>
      apiGetGroupMembersUser({
        groupId: oldData?.documentId,
        userId: profile?.documentId,
        token: token,
      }),
    enabled: !!profile?.documentId && !!oldData?.documentId && !!token,
    staleTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const groupNotificationsData = groupNotifications?.data?.data[0] || [];
  const groupMemberUserData = groupMemberUser?.data?.data[0] || [];
  //console.log("groupMemberUserData", groupMemberUserData);
  console.log("groupNotificationsData", groupNotificationsData);

  const queryClient = useQueryClient();

  const handleToggleNotification = async () => {
    try {
      // Check if groupNotificationsData is available and has the necessary properties
      if (groupNotificationsData && groupNotificationsData.documentId) {
        // Handle editing case: update notification status
        const newStatus = !groupNotificationsData.is_enabled;
        const payload = {
          is_enabled: newStatus,
        };
  
        const response = await apiEditGroupNotification({
          documentId: groupNotificationsData.documentId,
          payload,
        });
  
        if (response.statusText === "OK") {
          notification.success({
            message: "Success",
            description: `Notifications ${newStatus ? "enabled" : "disabled"} successfully.`,
          });
          setTimeout(() => {
            queryClient.invalidateQueries("groupNotifications");
          }, 1000);
        } else {
          notification.error({
            message: "Error",
            description: "Failed to toggle notifications.",
          });
        }
      } else {
        // Handle create case: no data available, create new notification
        const payload = {
          group_id: oldData?.documentId,
          user_id: profile?.documentId,
          notice_type_id: "idhlny4zwohdjk6iuowt2kwk",
          is_enabled: true,
        };
  
        const response = await apiCreateGroupNotification({
          payload,
          token,
        });
        console.log("response", response); 
  
        if (response.data.err === 0) {
          notification.success({
            message: "Success",
            description: "Notifications enabled successfully.",
          });
          setTimeout(() => {
            queryClient.invalidateQueries("groupNotifications");
          }, 1000);
        } else {
          notification.error({
            message: "Error",
            description: "Failed to enable notifications.",
          });
        }
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "An error occurred while toggling notifications.",
      });
    }
  };
  

  const handleLeaveGroup = () => {
    Modal.confirm({
      title: "Leave Group",
      content: "Are you sure you want to leave the group?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await apiDeleteMemberGroup({
            id: groupMemberUserData?.documentId,
            token,
          });
          if (response.data.err === 0) {
            navigate("/groups");
            notification.success({
              message: "Success",
              description: "You have left the group successfully.",
            });
            queryClient.invalidateQueries("groupMembership");
            // Optionally refetch the group data or redirect the user
          } else {
            notification.error({
              message: "Error",
              description: "Failed to leave the group.",
            });
          }
        } catch (error) {
          notification.error({
            message: "Error",
            description: "An error occurred while leaving the group.",
          });
        }
      },
    });
  };

  return (
    <>
      <Dropdown.Item
        className="d-flex align-items-center gap-1"
        onClick={(e) => {
          e.stopPropagation();
          handleToggleNotification();
        }}
        href="#"
      >
        {groupNotificationsData?.is_enabled ? (
          <IoMdNotifications style={{ fontSize: "22px" }} />
        ) : (
          <IoMdNotificationsOff style={{ fontSize: "22px" }} />
        )}{" "}
        Management Notifications
      </Dropdown.Item>
      <Dropdown.Item
        className="d-flex align-items-center gap-1"
        onClick={(e) => {
          e.stopPropagation();
          handleLeaveGroup();
        }}
        href="#"
      >
        <IoMdLogOut style={{ fontSize: "22px" }} /> Leave group
      </Dropdown.Item>
      <Dropdown.Item
        className="d-flex align-items-center gap-1"
        onClick={(e) => e.stopPropagation()}
        href="#"
      >
        <IoIosBug style={{ fontSize: "22px" }} />
        Report group
      </Dropdown.Item>
    </>
  );
};

export default ActionGroup;
