import React from "react";
import { Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { apiCreateFriendStatus } from "../../../../services/friend";
import socket from "../../../../socket";
import { apiCreateNotification, apiCreateNotificationUser } from "../../../../services/notification";

const AddFriend = ({ friend, onSentChange }) => {
    const { token, user } = useSelector((state) => state.root.auth || {});

    const handleAddFriend = async () => {
        try {
            const payload = {
                user_id: user?.documentId,
                friend_id: friend?.documentId,
                status_action_id: 'w1t6ex59sh5auezhau5e2ovu'
            }
            await apiCreateFriendStatus(payload, token);
            onSentChange(true);
            const payload1 = {
                title: "Add new friend",
                content: user?.username + " want add friend",
                link: "/friend-request",
                is_global: "false",
                notice_type_id: "o6vhpavmbbypqijy93nrazjs",
                user_id: user?.documentId
            }
            const noti = await apiCreateNotification({ payload: payload1, token: token })
            const payload2 = {
                notification_id: noti?.data?.data?.documentId,
                user_id: friend?.documentId
            }
            await apiCreateNotificationUser({ payload: payload2, token: token })

            // ✅ 3. Emit socket để người kia nhận real-time
            socket.emit('send_notification', {
                toUserId: friend?.documentId,
                notification: {
                    type: 'friend_request',
                    title: "🔔 Friend Request",
                    content: `${user?.username} sent you a friend request.`,
                    link: "/friends/request",
                    fromUser: user,
                    createdAt: new Date().toISOString()
                }
            });
            console.log('socket gui di')
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    return (
        <>
            <Button
                variant="primary"
                className="me-2"
                onClick={handleAddFriend}
            >
                <i className="material-symbols-outlined me-1">person_add</i>
                Add Friend
            </Button>
        </>
    );
};

export default AddFriend;

