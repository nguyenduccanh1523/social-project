import React, { useState } from 'react'
import { Row, Col, Container, Dropdown, Button } from 'react-bootstrap'
import { Tag } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getTagColorAndIcon } from '../../../../views/dashboard/others/format';

import { apiGetFindNotification, apiGetNotificationCreated } from '../../../../services/notification';
import { apiGetPageDetail } from '../../../../services/page'
import { apiFindOneGroup } from '../../../../services/groupServices/group'
import { apiGetEventDetail } from '../../../../services/event'
import { formatDistanceToNow } from 'date-fns'
import IsRead from './isRead'
const Noti = ({ notification }) => {
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
                                    <Dropdown.Item className="d-flex gap-2">
                                        <span class="material-symbols-outlined">
                                            visibility
                                        </span>View Notification</Dropdown.Item>
                                    <Dropdown.Item className="d-flex gap-2"><span class="material-symbols-outlined">
                                        delete
                                    </span>Delete Notification</Dropdown.Item>
                                    <Dropdown.Item className="d-flex gap-2"><span class="material-symbols-outlined">
                                        check
                                    </span>Mark as read</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Noti;