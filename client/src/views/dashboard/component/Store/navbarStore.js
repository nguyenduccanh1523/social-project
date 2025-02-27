import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Form, Tab, Nav, Button, Dropdown, Progress, Image } from 'react-bootstrap'
import Card from '../../../../components/Card'
import CustomToggle from '../../../../components/dropdowns'
import { Progress as AntdProgress } from 'antd'

//img
import user1 from '../../../../assets/images/user/1.jpg'
import user5 from '../../../../assets/images/user/05.jpg'
import user6 from '../../../../assets/images/user/06.jpg'
import contact from '../../../../assets/images/contact.jpg'
// import page100 from '../../../assets/images/page-img/100.jpg'

const NavbarStore = ({ profile }) => {
    const [show, setShow] = useState('')
    const [show1, setShow1] = useState('')
    const [show2, setShow2] = useState('')
    const [loading, setLoading] = useState(false)
    const [percent, setPercent] = useState(0)
    const [intervalId, setIntervalId] = useState(null)
    const [isPaused, setIsPaused] = useState(false)

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
        if (show === 'first') {
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
                    <h5 className="mt-2"><a href="#">Archive</a> | <a href="#">Setting</a></h5>
                    <div className="mt-3">
                        <h5>Your News</h5>
                        <hr />

                        <ul className="media-story list-inline m-0 p-0">
                            <li className="d-flex mb-3 align-items-center">
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
                    <h5 >All news</h5>
                    <Nav as="ul" variant="pills" className="media-story list-inline m-0 p-0">
                        <Nav.Item as="li" style={{ width: "100%" }}>
                            <Nav.Link className="d-flex mb-3 align-items-center" eventKey="first" onClick={() => setShow('first')} href="#chatbox1">
                                <img src={user1} alt="story-img" className="rounded-circle img-fluid avatar-60 " />
                                <div className="stories-data ms-3">
                                    <h5>Anna Mull</h5>
                                    <span>1 new card</span>
                                    <p className="mb-0">1 hour ago</p>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" style={{ width: "100%" }}>
                            <Nav.Link className="d-flex mb-3 align-items-center" eventKey="second" onClick={() => setShow('second')} href="#chatbox2">
                                <img src={user5} alt="story-img" className="rounded-circle img-fluid avatar-60 " />
                                <div className="stories-data ms-3">
                                    <h5>Anna Mull</h5>
                                    <span>1 new card</span>
                                    <p className="mb-0">1 hour ago</p>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
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
                    <Tab.Pane eventKey="first" className={`fade ${show === 'first' ? 'show' : ''}`} id="chatbox1" role="tabpanel">

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
                                <img src={user1} alt="story-img" className="rounded-circle img-fluid avatar-40 " />
                                <div className="stories-data ms-3 d-flex gap-2" >
                                    <h5>Anna Mull</h5>
                                    <p className="mb-0">1 hour ago</p>
                                    <i className="material-symbols-outlined">public</i>
                                </div>
                            </div>
                            <div className='d-flex mt-3 h-90'>
                                <Col lg={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

                                    <ul className="media-story list-inline m-0 p-0">
                                        <li className="d-flex mb-3 justify-content-end">
                                            <i className="material-symbols-outlined" style={{ fontSize: "30px", cursor: "pointer" }}>
                                                arrow_back_ios
                                            </i>
                                        </li>
                                    </ul>
                                </Col>
                                <Col lg={8}>
                                    <div className='d-flex justify-content-center'>
                                        <Image
                                            src={contact}
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
                                    <ul className="media-story list-inline m-0 p-0">
                                        <li className="d-flex mb-3 justify-content-start">
                                            <i className="material-symbols-outlined" style={{ fontSize: "30px", cursor: "pointer" }}>
                                                arrow_forward_ios
                                            </i>
                                        </li>
                                    </ul></Col>
                            </div>
                        </div>
                        <div className="chat-footer p-3 bg-white">

                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second" className={`fade ${show === 'second' ? 'show' : ''}`} id="chatbox2" role="tabpanel">
                        <div className="chat-head">
                            <header className="d-flex justify-content-between align-items-center bg-white pt-3  ps-3 pe-3 pb-3">
                                <div className="d-flex align-items-center">
                                    <div className="sidebar-toggle">
                                        <i className="ri-menu-3-line"></i>
                                    </div>
                                    <div className="avatar chat-user-profile m-0 me-3">
                                        <img loading="lazy" src={user6} alt="avatar" className="avatar-50 " onClick={() => setShow2('true')} />
                                        <span className="avatar-status"><i className="ri-checkbox-blank-circle-fill text-success"></i></span>
                                    </div>
                                    <h5 className="mb-0">Announcement</h5>
                                </div>
                                <div className={`chat-user-detail-popup scroller ${show2 === 'true' ? 'show' : ''}`} >
                                    <div className="user-profile">
                                        <Button type="submit" onClick={ChatSidebarClose} variant=" close-popup p-3"><i className="material-symbols-outlined md-18" onClick={() => setShow2('false')}>close</i></Button>
                                        <div className="user mb-4 text-center">
                                            <Link className="avatar m-0" to="">
                                                <img loading="lazy" src={user6} alt="avatar" />
                                            </Link>
                                            <div className="user-name mt-4">
                                                <h4>Mark Jordan</h4>
                                            </div>
                                            <div className="user-desc">
                                                <p>Atlanta, USA</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="chatuser-detail text-left mt-4">
                                            <Row>
                                                <Col md="6" className="col-6 title">Bni Name:</Col>
                                                <Col md="6" className="col-6  text-right">Mark</Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="6" className="col-6 title">Tel:</Col>
                                                <Col md="6" className="col-6  text-right">072 143 9920</Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="6" className="col-6 title">Date Of Birth:</Col>
                                                <Col md="6" className="col-6  text-right">July 12, 1989</Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="6" className="col-6 title">Gender:</Col>
                                                <Col md="6" className="col-6  text-right">Female</Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="6" className="col-6 title">Language:</Col>
                                                <Col md="6" className="col-6  text-right">Engliah</Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-header-icons d-flex">
                                    <Link to="#" className="chat-icon-phone bg-soft-primary d-flex justify-content-center align-items-center">
                                        <i className="material-symbols-outlined md-18">phone</i>
                                    </Link>
                                    <Link to="#" className="chat-icon-video bg-soft-primary d-flex justify-content-center align-items-center">
                                        <i className="material-symbols-outlined md-18">videocam</i>
                                    </Link>
                                    <Link to="#" className="chat-icon-delete bg-soft-primary d-flex justify-content-center align-items-center">
                                        <i className="material-symbols-outlined md-18">delete</i>
                                    </Link>
                                    <Dropdown className="bg-soft-primary d-flex justify-content-center align-items-center" as="span">
                                        <Dropdown.Toggle as={CustomToggle} variant="material-symbols-outlined cursor-pointer md-18 nav-hide-arrow pe-0 show">
                                            more_vert
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu-right">
                                            <Dropdown.Item className="d-flex align-items-center" href="#"><i className="material-symbols-outlined md-18 me-1">push_pin</i>Pin to top</Dropdown.Item>
                                            <Dropdown.Item className="d-flex align-items-center" href="#"><i className="material-symbols-outlined md-18 me-1">delete_outline</i>Delete chat</Dropdown.Item>
                                            <Dropdown.Item className="d-flex align-items-center" href="#"><i className="material-symbols-outlined md-18 me-1">watch_later</i>Block</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </header>
                        </div>
                        <div className="chat-content scroller">
                            <div className="chat d-flex other-user">
                                <div className="chat-user">
                                    <Link className="avatar m-0" to="">
                                        <img loading="lazy" src={user1} alt="avatar" className="avatar-35 " />
                                    </Link>
                                    <span className="chat-time mt-1">6:45</span>
                                </div>
                                <div className="chat-detail">
                                    <div className="chat-message">
                                        <p>How can we help? We're here for you! 😄</p>
                                    </div>
                                </div>
                            </div>
                            <div className="chat chat-left">
                                <div className="chat-user">
                                    <Link className="avatar m-0" to="">
                                        <img loading="lazy" src={user6} alt="avatar" className="avatar-35 " />
                                    </Link>
                                    <span className="chat-time mt-1">6:48</span>
                                </div>
                                <div className="chat-detail">
                                    <div className="chat-message">
                                        <p>Hey John, I am looking for the best admin template.</p>
                                        <p>Could you please help me to find it out? 🤔</p>
                                    </div>
                                </div>
                            </div>
                            <div className="chat d-flex other-user">
                                <div className="chat-user">
                                    <Link className="avatar m-0" to="">
                                        <img loading="lazy" src={user1} alt="avatar" className="avatar-35 " />
                                    </Link>
                                    <span className="chat-time mt-1">6:49</span>
                                </div>
                                <div className="chat-detail">
                                    <div className="chat-message">
                                        <p>Absolutely!</p>
                                        <p>SocialV Dashboard is the responsive bootstrap 5 admin template.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="chat chat-left">
                                <div className="chat-user">
                                    <Link className="avatar m-0" to="">
                                        <img loading="lazy" src={user6} alt="avatar" className="avatar-35 " />
                                    </Link>
                                    <span className="chat-time mt-1">6:52</span>
                                </div>
                                <div className="chat-detail">
                                    <div className="chat-message">
                                        <p>Looks clean and fresh UI.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="chat d-flex other-user">
                                <div className="chat-user">
                                    <Link className="avatar m-0" to="">
                                        <img loading="lazy" src={user1} alt="avatar" className="avatar-35 " />
                                    </Link>
                                    <span className="chat-time mt-1">6:53</span>
                                </div>
                                <div className="chat-detail">
                                    <div className="chat-message">
                                        <p>Thanks, from ThemeForest.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="chat chat-left">
                                <div className="chat-user">
                                    <Link className="avatar m-0" to="">
                                        <img loading="lazy" src={user6} alt="avatar" className="avatar-35 " />
                                    </Link>
                                    <span className="chat-time mt-1">6:54</span>
                                </div>
                                <div className="chat-detail">
                                    <div className="chat-message">
                                        <p>I will purchase it for sure. 👍</p>
                                    </div>
                                </div>
                            </div>
                            <div className="chat d-flex other-user">
                                <div className="chat-user">
                                    <Link className="avatar m-0" to="">
                                        <img loading="lazy" src={user1} alt="avatar" className="avatar-35 " />
                                    </Link>
                                    <span className="chat-time mt-1">6:56</span>
                                </div>
                                <div className="chat-detail">
                                    <div className="chat-message">
                                        <p>Okay Thanks..</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chat-footer p-3 bg-white">
                            <Form className="d-flex align-items-center" action="#">
                                <div className="chat-attagement d-flex">
                                    <Link to="#"><i className="far fa-smile pe-3" aria-hidden="true"></i></Link>
                                    <Link to="#"><i className="fa fa-paperclip pe-3" aria-hidden="true"></i></Link>
                                </div>
                                <Form.Control type="text" className="form-control me-3" placeholder="Type your message" />
                                <Button type="submit" className=" primary d-flex align-items-center"><i className="far fa-paper-plane" aria-hidden="true"></i><span className="d-none d-lg-block ms-1">Send</span></Button>
                            </Form>
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            </Col>
        </>
    )
}
export default NavbarStore;    