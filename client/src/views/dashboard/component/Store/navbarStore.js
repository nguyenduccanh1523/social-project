import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Tab, Nav, Button, Dropdown, Progress, Image } from 'react-bootstrap'
import './style.scss'
import { Progress as AntdProgress } from 'antd'
import CreateStoryModal from './createModal'
import { apiGetStories } from '../../../../services/stories'
//img

import { convertToVietnamHour, timeAgo } from '../../others/format'

const NavbarStore = ({ profile }) => {
    const [show, setShow] = useState('')
    const [showId, setShowId] = useState('')


    const [percent, setPercent] = useState(0)
    const [intervalId, setIntervalId] = useState(null)
    const [isPaused, setIsPaused] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [stories, setStories] = useState([]);
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        apiGetStories().then((res) => {
            setStories(res.data);
        });
    }, []);

    // console.log("showId",showId);
    //console.log(stories);

    const ChatSidebar = () => {
        document.getElementsByClassName('scroller')[0].classList.add('show')
    }
    const ChatSidebarClose = () => {
        document.getElementsByClassName('scroller')[0].classList.remove('show')
    }

    const startProgress = () => {
        setPercent(0)
        const id = setInterval(() => {
            setPercent((prev) => {
                if (prev >= 100) {
                    clearInterval(id)
                    return 100
                }
                return prev + (100 / 30)
            })
        }, 1000)
        setIntervalId(id)
    }

    const pauseProgress = () => {
        clearInterval(intervalId)
        setIsPaused(true)
    }

    const resumeProgress = () => {
        setIsPaused(false)
        startProgress()
    }

    useEffect(() => {
        if (show) {
            startProgress()
        }
        return () => {
            clearInterval(intervalId)
        }
    }, [show])

    return (
        <>
            <Col lg={4} className="chat-data-left scroller" style={{ height: "700px" }}>
                <div className="chat-search pt-3 ps-3">
                    <h3 style={{ fontWeight: "bold" }}>
                        <i
                            className="material-symbols-outlined"
                        >
                            auto_stories
                        </i> Story</h3 >
                    <h5 className="mt-2"><a href="#">Archive</a> | <a href="/privacy-setting">Setting</a></h5>
                    <div className="mt-3">
                        <h5>Your News</h5>
                        <hr />

                        <ul className="media-story list-inline m-0 p-0">
                            <li className="d-flex mb-3 align-items-center" onClick={() => setIsCreateModalOpen(true)}                     >
                                <i className="material-symbols-outlined">
                                    add
                                </i>
                                <div className="stories-data ms-3">
                                    <h5>Create news </h5>
                                    <p style={{ fontSize: "12px" }}>You can share photos or write something</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="chat-searchbar mt-4">
                        <Form.Group className="form-group chat-search-data m-0">
                            <input type="text" className="form-control round" id="chat-search" placeholder="Search" />
                            <i className="material-symbols-outlined">
                                search
                            </i>
                        </Form.Group>
                    </div>
                </div>
                <div className="scroller mt-4 ps-3">
                    <h5 >All News</h5>
                    <Nav as="ul" variant="pills" className="media-story list-inline m-0 p-0">
                        {stories?.data?.map((story, index) => (
                            <Nav.Item as="li" style={{ width: "100%" }}>
                                <Nav.Link 
                                    className="d-flex mb-3 align-items-center" 
                                    eventKey={story.user_id?.documentId} 
                                    onClick={() => {
                                        setShowId(story.user_id?.documentId);
                                    }}
                                    href="#chatbox1"
                                >
                           {console.log("showId nav link",showId)}

                                    <img src={story?.user_id?.profile_picture} alt="story-img" className="rounded-circle img-fluid avatar-60" />
                                    <div className="stories-data ms-3">
                                        <h5> {story.user_id?.username}</h5>
                                        <span>1 new card</span>
                                        <p className="mb-0">{timeAgo(story?.createdAt)}</p>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>
            </Col>
            <Col lg={8} className=" chat-data p-0 chat-data-right">
                <Tab.Content>
                    <Tab.Pane eventKey="start" className="tab-pane fade show" id="default-block" role="tabpanel">
                        <div className="chat-start">
                            <span className="iq-start-icon text-primary" ><i className="material-symbols-outlined" style={{ fontSize: "60px", fontWeight: "bold", paddingTop: "20px" }}>add_a_photo</i></span>
                            <Button id="chat-start" onClick={ChatSidebar} bsPrefix="btn bg-white mt-3">Select a message to open.</Button>
                        </div>
                    </Tab.Pane>
                    {stories?.data?.map((story, index) => (
                        <Tab.Pane eventKey={story.user_id?.documentId} className={`fade ${showId === story.user_id?.documentId ? 'show' : ''}`} id="chatbox1" role="tabpanel">
                           {console.log("showId tabpane",showId)}
                            <div className="chat-content" style={{ height: "730px" }}>
                                <AntdProgress percent={percent} showInfo={false} style={{ marginTop: "15px" }} />
                                <div className="chat d-flex other-user" style={{ marginTop: "10px" }}>
                                    <i className="material-symbols-outlined" style={{ cursor: "pointer", fontSize: "30px" }}>
                                        more_horiz
                                    </i>
                                    <div onClick={isPaused ? resumeProgress : pauseProgress} style={{ cursor: "pointer" }}>
                                        <i className="material-symbols-outlined" style={{ cursor: "pointer", fontSize: "30px" }}>
                                            {isPaused ? 'play_arrow' : 'pause'}
                                        </i>
                                    </div>
                                </div>
                                <div className="chat chat-left" style={{ marginTop: "-40px" }}>
                                    <img src={story?.user_id?.profile_picture} alt="story-img" className="rounded-circle img-fluid avatar-40 " />
                                    <div className="stories-data ms-3 d-flex gap-2" >
                                        <h5>{story?.user_id?.username}</h5>
                                        <p className="mb-0">{timeAgo(story?.createdAt)}</p>
                                        <i className="material-symbols-outlined">public</i>
                                    </div>
                                </div>
                                <div className='d-flex mt-3 h-90'>
                                    <Col lg={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <ul className="media-story list-inline m-0 p-0">
                                            <li className="d-flex mb-3 justify-content-end">
                                                {index > 0 && (
                                                    <i className="material-symbols-outlined" style={{ fontSize: "30px", cursor: "pointer" }}>
                                                        arrow_back_ios
                                                    </i>
                                                )}
                                            </li>
                                        </ul>
                                    </Col>
                                    <Col lg={8}>
                                        <div className='d-flex justify-content-center'>
                                            <Image
                                                src={story?.media_url}
                                                alt="post1"
                                                style={{
                                                    width: "400px",
                                                    height: "550px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <ul className="media-story list-inline m-0 p-0" onClick={() => {
                                            if (index < stories.data.length - 1) {
                                                setShowId(stories.data[index + 1].user_id?.documentId);
                                            }
                                        }}>
                                            <li className="d-flex mb-3 justify-content-start">
                                                {index < stories.data.length - 1 && (
                                                    <i className="material-symbols-outlined" style={{ fontSize: "30px", cursor: "pointer" }}>
                                                        arrow_forward_ios
                                                    </i>
                                                )}
                                            </li>
                                        </ul>
                                    </Col>
                                </div>
                            </div>
                            <div className="chat-footer p-3 bg-white">

                            </div>
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Col>
            <CreateStoryModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </>
    )
}
export default NavbarStore;    