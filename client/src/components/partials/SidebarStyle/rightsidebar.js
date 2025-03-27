import React from 'react'
import { Card, Image } from 'react-bootstrap'

//image
import user1 from '../../../assets/images/user/01.jpg'
import user2 from '../../../assets/images/user/02.jpg'
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux'
import { apiGetFriendAccepted } from '../../../services/friend';

const RightSidebar = () => {
    const { profile } = useSelector((state) => state.root.user || {});
    const minirightsidebar = () => {
        document.getElementById('rightSidebar').classList.toggle('right-sidebar');
        document.body.classList.toggle('right-sidebar-close');
    }

    const { data: friendData } = useQuery({
        queryKey: ['postMedia', profile?.documentId],
        queryFn: () => apiGetFriendAccepted({ documentId: profile?.documentId }),
        enabled: !!profile?.documentId,
        cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const friend = friendData?.data?.data || [];

    const status = {
        "Active": "status-online",
        "Idle / Away": "status-away",
        "Do Not Disturb (DND)": "status-disturb",
        "Offline": "status-offline"
    };

    return (
        <>
            <div className="right-sidebar-mini" id="rightSidebar">
                <div className="right-sidebar-panel p-0">
                    <Card className="shadow-none">
                        <Card.Body className="p-0">
                            <div className="media-height p-3" data-scrollbar="init">
                                <div className="d-flex align-items-center mb-4">
                                    <div className={`iq-profile-avatar ${status[profile?.status_activities?.[0]?.status_name || "Offline"]}`}>
                                        <Image className="rounded-circle avatar-50" src={profile?.profile_picture} alt="" loading="lazy" />
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{profile?.username}</h6>
                                    </div>
                                </div>
                                {friend.map((item, index) => {
                                    const user = item.friend_id.documentId === profile.documentId ? item?.user_id : item?.friend_id;
                                    return (
                                        <div className="d-flex align-items-center mb-4" key={index}>
                                            <div className={`iq-profile-avatar ${status[user?.status_activities?.[0]?.status_name || "Offline"]}`}>
                                                <Image className="rounded-circle avatar-50" src={user?.profile_picture} alt="" loading="lazy" />
                                            </div>
                                            <div className="ms-3">
                                                <h6 className="mb-0">{user?.username}</h6>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="right-sidebar-toggle bg-primary text-white mt-3 d-flex" onClick={minirightsidebar}>
                                <span className="material-symbols-outlined">chat</span>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

        </>
    )
}

export default RightSidebar
