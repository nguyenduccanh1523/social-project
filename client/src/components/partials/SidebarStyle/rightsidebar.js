import React from 'react'
import { Card, Image } from 'react-bootstrap'

//image
import user1 from '../../../assets/images/user/01.jpg'
import user2 from '../../../assets/images/user/02.jpg'
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux'
import { apiGetFriendAccepted } from '../../../services/friend';
import { apiGetUserById } from "../../../services/user";

const RightSidebar = () => {
    const { user } = useSelector((state) => state.root.auth || {});
    const { token } = useSelector((state) => state.root.auth || {});
    const minirightsidebar = () => {
        document.getElementById('rightSidebar').classList.toggle('right-sidebar');
        document.body.classList.toggle('right-sidebar-close');
    }


    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ['user', user?.documentId, token],
        queryFn: () => apiGetUserById({ userId: user?.documentId, token }),
        enabled: !!user?.documentId && !!token,
        onSuccess: (data) => {
            console.log("User data fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching user data:", error);
        }
    });

    const users = userData?.data?.data || {};
     
    const { data: friendData } = useQuery({
        queryKey: ['postMedia', user?.documentId, token],
        queryFn: () => apiGetFriendAccepted({ documentId: user?.documentId, token }),
        enabled: !!user?.documentId && !!token,
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
                                    <div className={`iq-profile-avatar ${status[users?.status?.name || "Offline"]}`}>
                                        <Image className="rounded-circle avatar-50" src={user?.avatarMedia?.file_path} alt="" loading="lazy" />
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{user?.username}</h6>
                                    </div>
                                </div>
                                {friend.map((item, index) => {
                                    const account = item.friend.documentId === user.documentId ? item?.user : item?.friend;
                                    return (
                                        <div className="d-flex align-items-center mb-4" key={index}>
                                            <div className={`iq-profile-avatar ${status[account?.status?.name || "Offline"]}`}>
                                                <Image className="rounded-circle avatar-50" src={account?.avatarMedia?.file_path} alt="" loading="lazy" />
                                            </div>
                                            <div className="ms-3">
                                                <h6 className="mb-0">{account?.fullname}</h6>
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
