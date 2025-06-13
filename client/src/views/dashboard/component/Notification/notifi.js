import React, { useState } from 'react'
import { Row, Col, Container, Dropdown, Button } from 'react-bootstrap'
import { Tag } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getTagColorAndIcon } from '../../../../views/dashboard/others/format';

import { apiGetUserNoti, apiUpdateUserNoti } from '../../../../services/notification';
import { formatDistanceToNow } from 'date-fns'
import IsRead from './isRead'
import NotiModal from './NotiModal';

const Noti = ({ notification }) => {
    const { user } = useSelector((state) => state.root.auth || {});
    const { token } = useSelector((state) => state.root.auth || {});


    const queryClient = useQueryClient();
    // const { data: Notifi } = useQuery({
    //     queryKey: ['notifi', notification?.notification?.documentId],
    //     queryFn: () => apiGetFindNotification({ notiId: notification?.notification?.documentId }),
    //     enabled: !!notification?.notification?.documentId,
    //     staleTime: 600000, // 10 minutes
    //     refetchOnWindowFocus: false,
    // });
    // const Noti = Notifi?.data?.data || {};
    const { color, icon } = getTagColorAndIcon(notification?.notification?.noticeType?.name);

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = async () => {
        setShowModal(true);
        const respone1 = await apiGetUserNoti({ notiId: notification?.notification_id, userId: user?.documentId, token });
        const dataNotiUser1 = respone1?.data?.data?.[0] || {};
        if (dataNotiUser1?.is_read === false) {
            const payload = {
                    is_read: true
            }
            await apiUpdateUserNoti({ documentId: dataNotiUser1?.documentId, payload, token });
            queryClient.invalidateQueries('notifications');
        };
    };

    const handleCloseModal = () => setShowModal(false);

    const handleMarkAsRead = async () => {
        const respone = await apiGetUserNoti({ notiId: notification?.notification_id, userId: user?.documentId, token });
        const dataNotiUser = respone?.data?.data?.[0] || {};
        if (dataNotiUser?.is_read === false) {
            const payload = {
                    is_read: true
            }
            await apiUpdateUserNoti({ documentId: dataNotiUser?.documentId, payload, token });
            queryClient.invalidateQueries('notifications');
            // Optionally, refetch or update the notification state here
        }
    };

    //console.log('notification:', Noti);
    return (
        <>
            <div className="user-img img-fluid">
                <img src={notification?.notification?.creators?.[0]?.user?.avatarMedia?.file_path || notification?.notification?.creators?.[0]?.page?.profileImage?.file_path || notification?.notification?.creators?.[0]?.group?.image?.file_path || notification?.notification?.creators?.[0]?.event?.image?.file_path} alt="story-img" className="rounded-circle avatar-40" />
            </div>
            <div className="w-100">
                <div className="d-flex justify-content-between">
                    <div className="ms-3">
                        <h6>{notification?.notification?.title || 'New Notification'}</h6>
                        {notification && (<p className="mb-0">{notification ? formatDistanceToNow(new Date(notification?.createdAt), { addSuffix: true }) : ''}</p>)}
                    </div>
                    <div className="d-flex align-items-center">
                        <Tag color={color} className="me-3 d-flex align-items-center gap-2">
                            <i className="material-symbols-outlined md-18">
                                {icon}
                            </i>
                            {notification?.notification?.noticeType?.name}
                        </Tag>
                        <IsRead noti={notification} />
                        <div className="card-header-toolbar d-flex align-items-center">
                            <Dropdown>
                                <Link to="#">
                                    <Dropdown.Toggle as="span" className="material-symbols-outlined">
                                        more_horiz
                                    </Dropdown.Toggle>
                                </Link>
                                <Dropdown.Menu className="dropdown-menu-right">
                                    <Dropdown.Item className="d-flex gap-2" onClick={handleShowModal}>
                                        <span className="material-symbols-outlined">
                                            visibility
                                        </span>View Notification
                                    </Dropdown.Item>
                                    <Dropdown.Item className="d-flex gap-2"><span className="material-symbols-outlined">
                                        delete
                                    </span>Delete Notification</Dropdown.Item>
                                    <Dropdown.Item className="d-flex gap-2" onClick={handleMarkAsRead}>
                                        <span className="material-symbols-outlined">
                                            check
                                        </span>Mark as read
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <NotiModal show={showModal} handleClose={handleCloseModal} notification={notification} user={notification?.notification?.creators?.[0]?.user} page={notification?.notification?.creators?.[0]?.page} group={notification?.notification?.creators?.[0]?.group} event={notification?.notification?.creators?.[0]?.event} />
        </>
    )

}

export default Noti;