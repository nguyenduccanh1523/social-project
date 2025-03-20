import { Tag } from 'antd'
import React from 'react'
import { apiGetUserNoti } from '../../../../services/notification';
import { useSelector } from 'react-redux';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

const IsRead = ({noti}) => {
    const { profile } = useSelector((state) => state.root.user || {});


    const { data: Notifi_Read } = useQuery({
        queryKey: ['notifiRead', noti?.documentId, profile?.documentId],
        queryFn: () => apiGetUserNoti({ notiId: noti?.documentId, userId: profile?.documentId }),
        enabled: !!noti?.documentId && !!profile?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const notiRead = Notifi_Read?.data?.data?.[0] || {};
    console.log('noti:', notiRead);
    return (
        <>
            <Tag color={notiRead?.is_read ? 'gray' : 'blue'} className="me-3 d-flex align-items-center gap-2">
                <i className="material-symbols-outlined md-18">
                    {notiRead?.is_read ? 'done' : 'markunread'}
                </i>
                {notiRead?.is_read ? 'Read' : 'Unread'}
            </Tag>
        </>
    )
}

export default IsRead