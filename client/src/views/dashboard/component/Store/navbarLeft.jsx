// NavbarLeft.jsx
import React, { useEffect, useState } from 'react';
import { Nav, Image } from 'react-bootstrap';
import './style.scss';
import { timeAgo } from '../../others/format';
import { notification } from 'antd';
import { useSelector } from 'react-redux';
import { apiGetStoryByUser } from '../../../../services/stories';

const NavbarLeft = ({ stories, onSelectStory, setIsCreateModalOpen, activeStoryId }) => {
    const { profile } = useSelector((state) => state.root.user || {});
    const [hasActiveStory, setHasActiveStory] = useState(false);

    useEffect(() => {
        const checkActiveStory = async () => {
            try {
                const response = await apiGetStoryByUser({ userId: profile?.documentId });
                //console.log('response', response);
                if (response.data.data && response.data.data.length > 0) {
                    setHasActiveStory(true);
                } else {
                    setHasActiveStory(false);
                }
            } catch (error) {
                console.error("Error fetching user story:", error);
            }
        };

        if (profile?.documentId) {
            checkActiveStory();
        }
    }, [profile?.documentId]);

    const handleCreateStoryClick = () => {
        if (hasActiveStory) {
            notification.warning({
                message: 'Active Story',
                description: 'You already have an active story. Please wait 24 hours or delete the current story before creating a new one.',
            });
        } else {
            setIsCreateModalOpen(true);
        }
    };

    return (
        <div className="chat-search pt-3 ps-3">
            <h3 style={{ fontWeight: "bold" }}>
                <i className="material-symbols-outlined">auto_stories</i> Story
            </h3>
            <h5 className="mt-2">
                <a href="#">Archive</a> | <a href="/privacy-setting">Setting</a>
            </h5>
            <div className="mt-3">
                <h5>Your News</h5>
                <hr />
                <ul className="media-story list-inline m-0 p-0">
                    <li className="d-flex mb-3 align-items-center" style={{cursor: 'pointer'}} onClick={handleCreateStoryClick}>
                        <i className="material-symbols-outlined">add</i>
                        <div className="stories-data ms-3">
                            <h5>Create news </h5>
                            <p style={{ fontSize: "12px" }}>You can share photos or write something</p>
                        </div>
                    </li>
                </ul>
            </div>
            <h5 className="mt-4 ps-1">All News</h5>
            <div className="scroller">
                <Nav as="ul" variant="pills" className="media-story list-inline m-0 p-0">
                    {stories?.data?.data?.map((story, index) => (
                        <Nav.Item as="li" key={index} style={{ width: "100%" }}>
                            <div> {/* Wrap Nav.Link inside a div */}
                                <Nav.Link
                                    className={`d-flex mb-3 align-items-center ${activeStoryId === story.user_id?.documentId ? 'active' : ''}`}
                                    onClick={() => onSelectStory(story)}
                                >
                                    <img
                                        src={story?.user_id?.profile_picture}
                                        alt="story-img"
                                        className="rounded-circle img-fluid avatar-60"
                                    />
                                    <div className="stories-data ms-3">
                                        <h5>{story.user_id?.username}</h5>
                                        <span>1 new card</span>
                                        <p className="mb-0">{timeAgo(story?.createdAt)}</p>
                                    </div>
                                </Nav.Link>
                            </div>
                        </Nav.Item>
                    ))}
                </Nav>
            </div>
        </div>
    );
};

export default NavbarLeft;