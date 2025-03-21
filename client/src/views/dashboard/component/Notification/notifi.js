import React, { useState } from 'react'
import { Row, Col, Container, Dropdown, Button } from 'react-bootstrap'
import { Tag } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getTagColorAndIcon } from '../../../../views/dashboard/others/format';

import { apiGetFindNotification, apiGetNotificationCreated, apiGetUserNoti, apiUpdateUserNoti } from '../../../../services/notification';
import { apiGetPageDetail } from '../../../../services/page'
import { apiFindOneGroup } from '../../../../services/groupServices/group'
import { apiGetEventDetail } from '../../../../services/event'
import { formatDistanceToNow } from 'date-fns'
import IsRead from './isRead'
import NotiModal from './NotiModal';

const Noti = ({ notification }) => {
    const { profile } = useSelector((state) => state.root.user || {});
    const queryClient = useQueryClient();
    const { data: Notifi } = useQuery({
        queryKey: ['notifi', notification?.notification?.documentId],
        queryFn: () => apiGetFindNotification({ notiId: notification?.notification?.documentId }),
        enabled: !!notification?.notification?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });
    const Noti = Notifi?.data?.data || {};
    const { color, icon } = getTagColorAndIcon(Noti?.notice_type?.name);
    //console.log('Noti:', Noti);

    const { data: Notifi_created } = useQuery({
        queryKey: ['notifi_cre', Noti?.notification_createds?.[0]?.documentId],
        queryFn: () => apiGetNotificationCreated({ documentId: Noti?.notification_createds?.[0]?.documentId }),
        enabled: !!Noti?.notification_createds?.[0]?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const Noti_cre = Notifi_created?.data?.data || {};

    const { data: pageData } = useQuery({
        queryKey: ['pagedt', Noti_cre?.page?.documentId],
        queryFn: () => Noti_cre?.page?.documentId ? apiGetPageDetail({ pageId: Noti_cre.page.documentId }) : Promise.resolve({ data: { data: {} } }),
        enabled: !!Noti_cre?.page?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const page = pageData?.data?.data || {};

    const { data: groupData } = useQuery({
        queryKey: ['groupdt', Noti_cre?.group?.documentId],
        queryFn: () => Noti_cre?.group?.documentId ? apiFindOneGroup({ groupId: Noti_cre.group.documentId }) : Promise.resolve({ data: { data: {} } }),
        enabled: !!Noti_cre?.group?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const group = groupData?.data?.data || {};

    const { data: eventData } = useQuery({
        queryKey: ['eventdt', Noti_cre?.event?.documentId],
        queryFn: () => Noti_cre?.event?.documentId ? apiGetEventDetail({ eventId: Noti_cre.event.documentId }) : Promise.resolve({ data: { data: {} } }),
        enabled: !!Noti_cre?.event?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const event = eventData?.data?.data || {};

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = async () => {
        setShowModal(true);
        const respone1 = await apiGetUserNoti({ notiId: Noti?.documentId, userId: profile?.documentId });
        const dataNotiUser1 = respone1?.data?.data?.[0] || {};
        if (dataNotiUser1?.is_read === false) {
            const payload = {
                data: {
                    is_read: true
                }
            }
            await apiUpdateUserNoti({ documentId: dataNotiUser1?.documentId, payload });
            queryClient.invalidateQueries('notifi');
        };
    };

    const handleCloseModal = () => setShowModal(false);

    const handleMarkAsRead = async () => {
        const respone = await apiGetUserNoti({ notiId: Noti?.documentId, userId: profile?.documentId });
        const dataNotiUser = respone?.data?.data?.[0] || {};
        if (dataNotiUser?.is_read === false) {
            const payload = {
                data: {
                    is_read: true
                }
            }
            await apiUpdateUserNoti({ documentId: dataNotiUser?.documentId, payload });
            queryClient.invalidateQueries('notifi');
            // Optionally, refetch or update the notification state here
        }
    };

    //console.log('notification:', Noti);
    return (
        <>
            <div className="user-img img-fluid">
                <img src={Noti_cre?.users_id?.profile_picture || page?.profile_picture?.file_path || group?.media?.file_path || event?.banner_id?.file_path} alt="story-img" className="rounded-circle avatar-40" />
            </div>
            <div className="w-100">
                <div className="d-flex justify-content-between">
                    <div className="ms-3">
                        <h6>{Noti?.title || 'New Notification'}</h6>
                        {Noti && (<p className="mb-0">{Noti?.createdAt ? formatDistanceToNow(new Date(Noti.createdAt), { addSuffix: true }) : ''}</p>)}
                    </div>
                    <div className="d-flex align-items-center">
                        <Tag color={color} className="me-3 d-flex align-items-center gap-2">
                            <i className="material-symbols-outlined md-18">
                                {icon}
                            </i>
                            {Noti?.notice_type?.name}
                        </Tag>
                        <IsRead noti={Noti} />
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
            <NotiModal show={showModal} handleClose={handleCloseModal} notification={Noti} user={Noti_cre?.users_id} page={page} group={group} event={event} />
        </>
    )

}

export default Noti;