import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getTagColorAndIcon } from '../../others/format';
import { Tag } from 'antd';
import IsRead from './isRead';
import { Link } from 'react-router-dom';

const NotiModal = ({ show, handleClose, notification, page, user, group, event }) => {
    const { color, icon } = getTagColorAndIcon(notification?.notification?.noticeType?.name);

    //console.log('notification:', notification);
    const getProfileData = ({ user, page, group, event }) => {
        if (page?.documentId) return { link: `/page/${page.documentId}`, state: { pageId: page?.documentId }, label: page.page_name, image: page.profileImage?.file_path };
        if (group?.documentId) return { link: `/group-detail/${group.documentId}`, state: { documentId: group?.documentId }, label: group.group_name, image: group.image?.file_path };
        if (event?.documentId) return { link: `/event-detail/${event.documentId}`, state: { eventDetail: event }, label: event.name, image: event.image?.file_path };
        if (user?.documentId) return { link: `/friend-profile/${user.documentId}`, state: { friendId: user }, label: user.username, image: user.avatarMedia?.file_path };
        return { link: '#', state: {}, label: 'Unknown', image: null };
    };

    const { link: profileLink, state: profileState, label: profileLabel, image: profileImage } = getProfileData({ user, page, group, event });

    return (
        <Modal show={show} onHide={handleClose} style={{ marginTop: '10vh' }}>
            <Modal.Header closeButton>
                <Modal.Title>Notification Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex align-items-center text-align-center gap-1 mb-3">
                    <div className="user-img img-fluid">
                        <img src={profileImage} alt="story-img" className="rounded-circle avatar-40" />
                    </div>
                    <div className="ms-3 flex-grow-1">
                        <h6><Link to={profileLink} state={profileState}>{profileLabel}</Link></h6>
                    </div>
                    <Tag color={color} className="me-3 d-flex align-items-center gap-2">
                        <i className="material-symbols-outlined md-18">
                            {icon}
                        </i>
                        {notification?.notification?.noticeType?.name}
                    </Tag>
                    <IsRead noti={notification} />
                </div>
                <h6>{notification?.notification?.title || 'Notification'}</h6>
                <p>{notification?.notification?.content || 'No description available.'}</p>
                <p>{notification?.notification?.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}</p>
                {notification?.notification?.link && <p><a href={notification?.notification.link} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center gap-1"><span className="material-symbols-outlined">
                    link
                </span>Link Notifications</a></p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default NotiModal;
