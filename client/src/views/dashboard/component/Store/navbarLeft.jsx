// NavbarLeft.jsx
import React from 'react';
import { Nav, Image } from 'react-bootstrap';
import './style.scss';
import { timeAgo } from '../../others/format';

const NavbarLeft = ({ stories, onSelectStory, setIsCreateModalOpen, activeStoryId }) => {
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
                    <li className="d-flex mb-3 align-items-center" style={{cursor: 'pointer'}} onClick={() => setIsCreateModalOpen(true)}>
                        <i className="material-symbols-outlined">add</i>
                        <div className="stories-data ms-3">
                            <h5>Create news </h5>
                            <p style={{ fontSize: "12px" }}>You can share photos or write something</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="chat-searchbar mt-4">
                <div className="form-group chat-search-data m-0">
                    <input type="text" className="form-control round" placeholder="Search" />
                    <i className="material-symbols-outlined">search</i>
                </div>
            </div>
            <div className="scroller mt-4 ps-1">
                <h5>All News</h5>
                <Nav as="ul" variant="pills" className="media-story list-inline m-0 p-0">
                    {stories?.data?.map((story, index) => (
                        <Nav.Item as="li" key={index} style={{ width: "100%" }}>
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
                        </Nav.Item>
                    ))}
                </Nav>
            </div>
        </div>
    );
};

export default NavbarLeft;