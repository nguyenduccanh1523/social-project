import React from "react";

import { Dropdown } from "react-bootstrap";
import { IoMdNotifications, IoMdNotificationsOff, IoMdLogOut, IoIosBug } from "react-icons/io";
import { apiGetGroupNotification, apiEditGroupNotification } from "../../../../services/notification";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notification, Modal } from 'antd';
import { useSelector } from "react-redux";

const ActionGroup = ({ oldData, profile }) => {
    const { token } = useSelector((state) => state.root.auth || {});
    // console.log("oldData", oldData);
    // console.log("profile", profile);
    const { data: groupNotifications } = useQuery({
        queryKey: ['groupNotifications', profile?.documentId, oldData?.documentId],
        queryFn: () => apiGetGroupNotification({ groupId: oldData?.documentId, userId: profile?.documentId, token: token }),
        enabled: !!profile?.documentId && !!oldData?.documentId && !!token,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const groupNotificationsData = groupNotifications?.data?.data[0] || [];
    //console.log("groupNotificationsData", groupNotificationsData);

    const queryClient = useQueryClient();

    const handleToggleNotification = async () => {
        try {
            const newStatus = !groupNotificationsData?.is_enabled;
            const payload = {
                is_enabled: newStatus,
            };
            const response = await apiEditGroupNotification({ documentId: groupNotificationsData?.documentId, payload });
            console.log("response", response);
            if (response.statusText === 'OK') {
                notification.success({
                    message: 'Success',
                    description: `Notifications ${newStatus ? 'enabled' : 'disabled'} successfully.`,
                });
                setTimeout(() => {
                    queryClient.invalidateQueries('groupNotifications');
                }, 1000);
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to toggle notifications.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while toggling notifications.',
            });
        }
    };

    const handleLeaveGroup = () => {
        Modal.confirm({
            title: 'Leave Group',
            content: 'Are you sure you want to leave the group?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    // Call API to leave group
                    //const response = await apiLeaveGroup({ groupId: oldData?.documentId, userId: profile?.documentId });
                    // if (response.success) {
                    //     notification.success({
                    //         message: 'Success',
                    //         description: 'You have left the group successfully.',
                    //     });
                    //     // Optionally refetch the group data or redirect the user
                    // } else {
                    //     notification.error({
                    //         message: 'Error',
                    //         description: 'Failed to leave the group.',
                    //     });
                    // }
                } catch (error) {
                    notification.error({
                        message: 'Error',
                        description: 'An error occurred while leaving the group.',
                    });
                }
            },
        });
    };

    return (
        <>
            <Dropdown.Item className="d-flex align-items-center gap-1" onClick={(e) => { e.stopPropagation(); handleToggleNotification(); }} href="#">
                {groupNotificationsData?.is_enabled ? <IoMdNotifications style={{ fontSize: '22px' }} /> : <IoMdNotificationsOff style={{ fontSize: '22px' }} />} Management Notifications
            </Dropdown.Item>
            <Dropdown.Item className="d-flex align-items-center gap-1" onClick={(e) => { e.stopPropagation(); handleLeaveGroup(); }} href="#">
                <IoMdLogOut style={{ fontSize: '22px' }} /> Leave group
            </Dropdown.Item>
            <Dropdown.Item className="d-flex align-items-center gap-1" onClick={(e) => e.stopPropagation()} href="#"><IoIosBug style={{ fontSize: '22px' }} />Report group</Dropdown.Item>
        </>
    );
}

export default ActionGroup;
