import React, { useEffect, useState } from 'react'
import { Container, Card, Row, Col, Dropdown, OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import ProfileHeader from '../../../../components/profile-header'
import CustomToggle from '../../../../components/dropdowns'
import ShareOffcanvas from '../../../../components/share-offcanvas'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input, message } from 'antd'; // Import Ant Design Input and message components
import { apiUpdateEventRequest } from '../../../../services/eventServices/eventRequest'; // Import the API function

//image
import user9 from '../../../../assets/images/user/1.jpg'
import user10 from '../../../../assets/images/user/04.jpg'
import user11 from '../../../../assets/images/user/02.jpg'
import user12 from '../../../../assets/images/user/03.jpg'
import user13 from '../../../../assets/images/user/01.jpg'
import user14 from '../../../../assets/images/user/01.jpg'
import small1 from '../../../../assets/images/small/07.png'
import small2 from '../../../../assets/images/small/08.png'
import small3 from '../../../../assets/images/small/09.png'
import small4 from '../../../../assets/images/small/10.png'
import small5 from '../../../../assets/images/small/11.png'
import small6 from '../../../../assets/images/small/12.png'
import small7 from '../../../../assets/images/small/13.png'
import small8 from '../../../../assets/images/small/14.png'
import img2 from '../../../../assets/images/page-img/52.jpg'
import img5 from '../../../../assets/images/user/1.jpg'
import icon1 from '../../../../assets/images/icon/01.png'
import icon2 from '../../../../assets/images/icon/02.png'
import icon3 from '../../../../assets/images/icon/03.png'
import icon4 from '../../../../assets/images/icon/04.png'
import icon5 from '../../../../assets/images/icon/05.png'
import icon6 from '../../../../assets/images/icon/06.png'
import icon7 from '../../../../assets/images/icon/07.png'
import header from '../../../../assets/images/page-img/profile-bg7.jpg'
import { apiGetEventMember, apiGetEventUser } from '../../../../services/eventServices/event';
import { useSelector } from 'react-redux'
import { apiGetEventRequest } from '../../../../services/eventServices/eventRequest'
import { apiCreateMemberEvent } from '../../../../services/eventServices/eventMembers'

const EventDetail = () => {
    const location = useLocation();
    const {
        eventDetail,
    } = location.state || {};
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [eventMember, setEventMember] = useState([]);
    const [eventUser, setEventUser] = useState([]);
    const { profile } = useSelector((state) => state.root.user || {});
    const queryClient = useQueryClient();

    const document = profile?.documentId;

    const { data: eventRequests, isLoading: isLoadingRequests } = useQuery({
        queryKey: ['eventRequests', eventDetail?.documentId],
        queryFn: () => apiGetEventRequest({ eventId: eventDetail?.documentId }),
        enabled: !!eventDetail?.documentId,
    });

    const userRequest = eventRequests?.data?.data || [];
    
    //console.log('userRequestuserRequest', userRequest);

    // Kiểm tra xem có event_id nào trong eventUser bằng với eventDetail?.documentId hay không
    const isEventUserExists = eventUser?.data?.some(event => event.event_id.documentId === eventDetail?.documentId);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiGetEventUser({ userId: document });
                setEventUser(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, [document]);

    // Sử dụng biến isEventUserExists để thực hiện các hành động cần thiết
    useEffect(() => {
        if (isEventUserExists) {
            console.log("Event user exists for this event.");
            // Perform necessary actions here
        } else {
            console.log("No event user found for this event.");
        }
    }, [isEventUserExists]);

    useEffect(() => {
        apiGetEventMember({ eventId: eventDetail?.documentId }).then((res) => {
            setEventMember(res?.data?.data);
        });
    }, [eventDetail]);

    const [showModal, setShowModal] = useState(false);
    const [visibleRequests, setVisibleRequests] = useState(3);
    const [searchTerm, setSearchTerm] = useState("");

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredRequests = userRequest.filter((request) =>
        request?.user_request?.username?.toLowerCase().includes(searchTerm)
    );

    const handleAccept = async (documentId, userId) => {
        try {
            const payload = { 
                data: {
                    request_status: "vr8ygnd5y17xs4vcq6du3q7c"
                }
             };
            await apiUpdateEventRequest({documentId: documentId, payload: payload});
            message.success('Request accepted successfully!');
            const payloadMember = {
                    event_id: eventDetail?.documentId,
                    user_id: userId,
                    status_type: "going"
            }
            await apiCreateMemberEvent({data: payloadMember});
            queryClient.invalidateQueries('eventRequests');
        } catch (error) {
            console.error("Error accepting request:", error);
            message.error('Failed to accept the request.');
        }
    };

    const handleRefuse = async (documentId) => {
        try {
            const payload = { 
                data: {
                    request_status: "aei7fjtmxrzz3hkmorgwy0gm"
                }
             };
             await apiUpdateEventRequest({documentId: documentId, payload: payload});
            message.success('Request refused successfully!');
            queryClient.invalidateQueries('eventRequests');
        } catch (error) {
            console.error("Error refusing request:", error);
            message.error('Failed to refuse the request.');
        }
    };

    //console.log('eventDetaileventDetail', eventDetail);

    return (
        <>
            <ProfileHeader img={header} title="Events" />
            <div id="content-page" className="content-page">
                <Container>
                    <Row>
                        <Col lg="12">
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                                <div className="group-info d-flex align-items-center">
                                    <div className="me-3">
                                        <img className="rounded-circle img-fluid avatar-100" src={eventDetail?.banner_id?.file_path} alt="" />
                                    </div>
                                    <div className="info">
                                        <h4>{eventDetail?.name}</h4>
                                        <p className="mb-0"><i className="ri-lock-fill pe-2"></i>{eventDetail?.event_members?.length} members</p>
                                    </div>
                                </div>
                                <div className="group-member d-flex align-items-center  mt-md-0 mt-2">
                                    <div className="iq-media-group me-3">
                                        {eventMember?.map((member) => (
                                            <Link to="#" className="iq-media" key={member?.user_id?.documentId}>
                                                <img className="img-fluid avatar-40 rounded-circle" src={member?.user_id?.profile_picture} alt="" />
                                            </Link>
                                        ))}
                                    </div>
                                    {isEventUserExists ? (
                                        <button type="submit" className="btn btn-primary mb-2 d-flex align-items-center gap-2"><i className="material-symbols-outlined ">
                                            done</i> Invited</button>
                                    ) : (
                                        <button type="submit" className="btn btn-primary mb-2 d-flex align-items-center gap-2"><i className="material-symbols-outlined ">
                                            person_add_alt</i> Invite</button>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col lg="4">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">About</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-inline p-0 m-0">
                                        <li className="mb-3">
                                            <p className="mb-0">Event Planning's...</p>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <div className="avatar-40 rounded-circle bg-gray text-center me-3"><i className="material-symbols-outlined mt-2">pin_drop</i></div>
                                            <h6 className="mb-0">Reserving a location for an event</h6>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <div className="avatar-40 rounded-circle bg-gray text-center me-3"><i className="material-symbols-outlined mt-2">local_shipping</i></div>
                                            <h6 className="mb-0">Coordinating Outside vendors</h6>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <div className="avatar-40 rounded-circle bg-gray text-center me-3"><i className="material-symbols-outlined mt-2">restaurant</i></div>
                                            <h6 className="mb-0">Managing Staff</h6>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <div className="avatar-40 rounded-circle bg-gray text-center me-3"><i className="material-symbols-outlined mt-2">home</i></div>
                                            <h6 className="mb-0">Selecting an overall event theme</h6>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <div className="avatar-40 rounded-circle bg-gray text-center me-3"><i className="material-symbols-outlined mt-2">hotel</i></div>
                                            <h6 className="mb-0">Negotating hotel contracts</h6>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <div className="avatar-40 rounded-circle bg-gray text-center me-3"><i className="material-symbols-outlined mt-2">work_outline</i></div>
                                            <h6 className="mb-0">hiring a caterer</h6>
                                        </li>
                                        <li className="mb-3 d-flex align-items-center">
                                            <div className="avatar-40 rounded-circle bg-gray text-center me-3"><i className="material-symbols-outlined mt-2">control_point</i></div>
                                            <h6 className="mb-0">Developing invitations</h6>
                                        </li>
                                    </ul>
                                </Card.Body>
                            </Card>
                            {eventDetail?.host_id?.documentId === profile?.documentId && (
                                <Card>
                                    <Card.Header className="d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">Event Join Requests</h4>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        {isLoadingRequests ? (
                                            <p>Loading requests...</p>
                                        ) : userRequest?.length > 0 ? (
                                            <>
                                                <ul className="list-inline p-0 m-0">
                                                    {userRequest.slice(0, visibleRequests).map((request) => (
                                                        <li key={request?.user_request?.documentId} className="mb-3 d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    className="avatar-40 rounded-circle me-3"
                                                                    src={request?.user_request?.profile_picture}
                                                                    alt={request?.user_request?.username}
                                                                />
                                                                <h6 className="mb-0">{request?.user_request?.username}</h6>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <Button size="sm" variant="success" onClick={() => handleAccept(request?.documentId, request?.user_request?.documentId)}>Accept</Button>
                                                                <Button size="sm" variant="danger" onClick={() => handleRefuse(request?.documentId)}>Refuse</Button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {userRequest.length > visibleRequests && (
                                                    <Button variant="link" onClick={handleShowModal}>Read More</Button>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-muted">No join requests yet.</p>
                                        )}
                                    </Card.Body>

                                    {/* Modal for displaying all requests */}
                                    <Modal show={showModal} onHide={handleCloseModal} style={{marginTop: '70px'}} size="lg">
                                        <Modal.Header closeButton>
                                            <Modal.Title>All Join Requests</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Input 
                                                placeholder="Search users..." 
                                                onChange={handleSearch} 
                                                style={{ marginBottom: '20px' }} 
                                            />
                                            <ul className="list-inline p-0 m-0">
                                                {filteredRequests.map((request) => (
                                                    <li key={request?.user_request?.documentId} className="mb-3 d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                className="avatar-40 rounded-circle me-3"
                                                                src={request?.user_request?.profile_picture}
                                                                alt={request?.user_request?.username}
                                                            />
                                                            <h6 className="mb-0">{request?.user_request?.username}</h6>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <Button size="sm" variant="success" onClick={() => handleAccept(request?.documentId, request?.user_request?.documentId)}>Accept</Button>
                                                            <Button size="sm" variant="danger" onClick={() => handleRefuse(request?.documentId)}>Refuse</Button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </Card>
                            )}

                        </Col>
                        <Col lg="8">
                            <Card id="post-modal-data" className="card">
                                <Card.Header className="d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Create Post</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <div className="user-img">
                                            <img src={user9} alt="userimg" className="avatar-60 rounded-circle" />
                                        </div>
                                        <form className="post-text ms-3 w-100 " onClick={handleShow}>
                                            <input type="text" className="form-control rounded" placeholder="Write something here..." style={{ border: "none" }} />
                                        </form>
                                    </div>
                                    <hr />
                                    <ul className=" post-opt-block d-flex list-inline m-0 p-0 flex-wrap">
                                        <li className="bg-soft-primary rounded p-2 pointer d-flex align-items-center me-3 mb-md-0 mb-2"><img src={small1} alt="icon" className="img-fluid me-2" /> Photo/Video</li>
                                        <li className="bg-soft-primary rounded p-2 pointer d-flex align-items-center me-3 mb-md-0 mb-2"><img src={small2} alt="icon" className="img-fluid me-2" /> Tag Friend</li>
                                        <li className="bg-soft-primary rounded p-2 pointer d-flex align-items-center me-3"><img src={small3} alt="icon" className="img-fluid me-2" /> Feeling/Activity</li>
                                        <li className="bg-soft-primary rounded p-2 pointer text-center">
                                            <div className="card-header-toolbar d-flex align-items-center">
                                                <Dropdown>
                                                    <Dropdown.Toggle as={CustomToggle}>
                                                        <i className="ri-more-fill h4"></i>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="dropdown-menu-right" aria-labelledby="post-option">
                                                        <Dropdown.Item className="dropdown-item" onClick={handleShow} href="#" >Check in</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown-item" onClick={handleShow} href="#" >Live Video</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown-item" onClick={handleShow} href="#" >Gif</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown-item" onClick={handleShow} href="#" >Watch Party</Dropdown.Item>
                                                        <Dropdown.Item className="dropdown-item" onClick={handleShow} href="#" >Play with Friend</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </li>
                                    </ul>
                                </Card.Body>

                                <Modal show={show} onHide={handleClose} size="lg">
                                    <Modal.Header className="d-flex justify-content-between">
                                        <h5 className="modal-title" id="post-modalLabel">Create Post</h5>
                                        <button type="button" className="btn btn-secondary" onClick={handleClose} ><i className="ri-close-fill"></i></button>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="d-flex align-items-center">
                                            <div className="user-img">
                                                <img src={img5} alt="userimg" className="avatar-60 rounded-circle img-fluid" />
                                            </div>
                                            <form className="post-text ms-3 w-100" action="">
                                                <input type="text" className="form-control rounded" placeholder="Write something here..." style={{ border: "none" }} />
                                            </form>
                                        </div>
                                        <hr />
                                        <ul className="d-flex flex-wrap align-items-center list-inline m-0 p-0">
                                            <li className="col-md-6 mb-3">
                                                <div className="bg-soft-primary rounded p-2 pointer me-3"><Link to="#"></Link><img src={small1} alt="icon" className="img-fluid" /> Photo/Video</div>
                                            </li>
                                            <li className="col-md-6 mb-3">
                                                <div className="bg-soft-primary rounded p-2 pointer me-3"><Link to="#"></Link><img src={small2} alt="icon" className="img-fluid" /> Tag Friend</div>
                                            </li>
                                            <li className="col-md-6 mb-3">
                                                <div className="bg-soft-primary rounded p-2 pointer me-3"><Link to="#"></Link><img src={small3} alt="icon" className="img-fluid" /> Feeling/Activity</div>
                                            </li>
                                            <li className="col-md-6 mb-3">
                                                <div className="bg-soft-primary rounded p-2 pointer me-3"><Link to="#"></Link><img src={small4} alt="icon" className="img-fluid" /> Check in</div>
                                            </li>
                                            <li className="col-md-6 mb-3">
                                                <div className="bg-soft-primary rounded p-2 pointer me-3"><Link to="#"></Link><img src={small5} alt="icon" className="img-fluid" /> Live Video</div>
                                            </li>
                                            <li className="col-md-6 mb-3">
                                                <div className="bg-soft-primary rounded p-2 pointer me-3"><Link to="#"></Link><img src={small6} alt="icon" className="img-fluid" /> Gif</div>
                                            </li>
                                            <li className="col-md-6 mb-3">
                                                <div className="bg-soft-primary rounded p-2 pointer me-3"><Link to="#"></Link><img src={small7} alt="icon" className="img-fluid" /> Watch Party</div>
                                            </li>
                                            <li className="col-md-6 mb-3">
                                                <div className="bg-soft-primary rounded p-2 pointer me-3"><Link to="#"></Link><img src={small8} alt="icon" className="img-fluid" /> Play with Friends</div>
                                            </li>
                                        </ul>
                                        <hr />
                                        <div className="other-option">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <div className="user-img me-3">
                                                        <img src={user9} alt="userimg" className="avatar-60 rounded-circle img-fluid" />
                                                    </div>
                                                    <h6>Your Story</h6>
                                                </div>
                                                <div className="card-post-toolbar">
                                                    <Dropdown>
                                                        <Dropdown.Toggle className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                            <span className="btn btn-primary">Friend</span>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu clemassName="dropdown-menu m-0 p-0">
                                                            <Dropdown.Item className="dropdown-item p-3" href="#">
                                                                <div className="d-flex align-items-top">
                                                                    <i className="ri-save-line h4"></i>
                                                                    <div className="data ms-2">
                                                                        <h6>Public</h6>
                                                                        <p className="mb-0">Anyone on or off Facebook</p>
                                                                    </div>
                                                                </div>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className="dropdown-item p-3" href="#">
                                                                <div className="d-flex align-items-top">
                                                                    <i className="ri-close-circle-line h4"></i>
                                                                    <div className="data ms-2">
                                                                        <h6>Friends</h6>
                                                                        <p className="mb-0">Your Friend on facebook</p>
                                                                    </div>
                                                                </div>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className="dropdown-item p-3" href="#">
                                                                <div className="d-flex align-items-top">
                                                                    <i className="ri-user-unfollow-line h4"></i>
                                                                    <div className="data ms-2">
                                                                        <h6>Friends except</h6>
                                                                        <p className="mb-0">Don't show to some friends</p>
                                                                    </div>
                                                                </div>
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className="dropdown-item p-3" href="#">
                                                                <div className="d-flex align-items-top">
                                                                    <i className="ri-notification-line h4"></i>
                                                                    <div className="data ms-2">
                                                                        <h6>Only Me</h6>
                                                                        <p className="mb-0">Only me</p>
                                                                    </div>
                                                                </div>
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="primary" className="d-block w-100 mt-3">Post</Button>
                                    </Modal.Body>
                                </Modal>
                            </Card>
                            <Card>
                                <Card.Body>
                                    <div className="post-item">
                                        <div className="user-post-data pb-3">
                                            <div className="d-flex justify-content-between">
                                                <div className=" me-3">
                                                    <img className="rounded-circle img-fluid" src={user10} alt="" />
                                                </div>
                                                <div className="w-100">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h5 className="mb-0 d-inline-block"><Link to="#">Paige Turner</Link></h5>
                                                            <p className="mb-0">8 hour ago</p>
                                                        </div>
                                                        <div className="card-post-toolbar">
                                                            <Dropdown>
                                                                <Dropdown.Toggle as={CustomToggle}>
                                                                    <i className="ri-more-fill h4"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="dropdown-menu m-0 p-0">
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-save-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Save Post</h6>
                                                                                <p className="mb-0">Add this to your saved items</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-pencil-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Edit Post</h6>
                                                                                <p className="mb-0">Update your post and saved items</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-close-circle-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Hide From Timeline</h6>
                                                                                <p className="mb-0">See fewer posts like this.</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-delete-bin-7-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Delete</h6>
                                                                                <p className="mb-0">Remove thids Post on Timeline</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-notification-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Notifications</h6>
                                                                                <p className="mb-0">Turn on notifications for this post</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="user-post">
                                            <Link to="#"><img src={img2} alt="postimage" className="img-fluid w-100" /></Link>
                                        </div>
                                        <div className="comment-area mt-3">
                                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                <div className="like-block position-relative d-flex align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <div className="like-data">
                                                            <Dropdown>
                                                                <Dropdown.Toggle as={CustomToggle}>
                                                                    <img src={icon1} className="img-fluid" alt="" />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="dropdown-menu py-2">
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Like</Tooltip>} className="ms-2 me-2" ><img src={icon1} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Love</Tooltip>} className="me-2" ><img src={icon2} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Happy</Tooltip>} className="me-2" ><img src={icon3} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>HaHa</Tooltip>} className="me-2" ><img src={icon4} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Think</Tooltip>} className="me-2" ><img src={icon5} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Sade</Tooltip>} className="me-2" ><img src={icon6} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Lovely</Tooltip>} className="me-2" ><img src={icon7} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                        <div className="total-like-block ms-2 me-3">
                                                            <Dropdown>
                                                                <Dropdown.Toggle as={CustomToggle}>
                                                                    140 Likes
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item className="dropdown-item" href="#">Max Emum</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" href="#">Bill Yerds</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" href="#">Hap E. Birthday</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" href="#">Tara Misu</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" href="#">Midge Itz</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" href="#">Sal Vidge</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" href="#">Other</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                    <div className="total-comment-block">
                                                        <Dropdown>
                                                            <Dropdown.Toggle as={CustomToggle}>
                                                                20 Comment
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item className="dropdown-item" to="#">Max Emum</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Bill Yerds</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Hap E. Birthday</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Tara Misu</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Midge Itz</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Sal Vidge</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Other</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <ShareOffcanvas />
                                            </div>
                                            <hr />
                                            <ul className="post-comments p-0 m-0">
                                                <li className="mb-2">
                                                    <div className="d-flex">
                                                        <div className="user-img">
                                                            <img src={user11} alt="userimg" className="avatar-35 rounded-circle img-fluid" />
                                                        </div>
                                                        <div className="comment-data-block ms-3">
                                                            <h6>Monty Carlo</h6>
                                                            <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                                            <div className="d-flex flex-wrap align-items-center comment-activity">
                                                                <Link to="#">like</Link>
                                                                <Link to="#">reply</Link>
                                                                <Link to="#">translate</Link>
                                                                <span> 5 min </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="d-flex">
                                                        <div className="user-img">
                                                            <img src={user12} alt="userimg" className="avatar-35 rounded-circle img-fluid" />
                                                        </div>
                                                        <div className="comment-data-block ms-3">
                                                            <h6>Paul Molive</h6>
                                                            <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                                            <div className="d-flex flex-wrap align-items-center comment-activity">
                                                                <Link to="#">like</Link>
                                                                <Link to="#">reply</Link>
                                                                <Link to="#">translate</Link>
                                                                <span> 5 min </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <form className="comment-text d-flex align-items-center mt-3">
                                                <input type="text" className="form-control rounded" placeholder="Enter Your Comment" />
                                                <div className="comment-attagement d-flex">
                                                    <Link to="#"><i className="ri-link me-3"></i></Link>
                                                    <Link to="#"><i className="ri-user-smile-line me-3"></i></Link>
                                                    <Link to="#"><i className="ri-camera-line me-3"></i></Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="post-item">
                                        <div className="user-post-data py-3">
                                            <div className="d-flex justify-content-between">
                                                <div className="media-support-user-img me-3">
                                                    <img className="rounded-circle img-fluid" src={user13} alt="" />
                                                </div>
                                                <div className="w-100">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h5 className="mb-0 d-inline-block me-1"><Link to="#">Pete Sariya</Link></h5>
                                                            <p className=" mb-0 d-inline-block">Update his Status</p>
                                                            <p className="mb-0">7 hour ago</p>
                                                        </div>
                                                        <div className="card-post-toolbar">
                                                            <Dropdown>
                                                                <Dropdown.Toggle as={CustomToggle}>
                                                                    <i className="ri-more-fill h4"></i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="dropdown-menu m-0 p-0">
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-save-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Save Post</h6>
                                                                                <p className="mb-0">Add this to your saved items</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-pencil-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Edit Post</h6>
                                                                                <p className="mb-0">Update your post and saved items</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-close-circle-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Hide From Timeline</h6>
                                                                                <p className="mb-0">See fewer posts like this.</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-delete-bin-7-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Delete</h6>
                                                                                <p className="mb-0">Remove thids Post on Timeline</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item p-3" to="#">
                                                                        <div className="d-flex align-items-top">
                                                                            <i className="ri-notification-line h4"></i>
                                                                            <div className="data ms-2">
                                                                                <h6>Notifications</h6>
                                                                                <p className="mb-0">Turn on notifications for this post</p>
                                                                            </div>
                                                                        </div>
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="user-post">
                                            <Link to="#"><img src={user14} alt="postimage" className="img-fluid w-100" /></Link>
                                        </div>
                                        <div className="comment-area mt-3">
                                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                <div className="like-block position-relative d-flex align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <div className="like-data">
                                                            <Dropdown>
                                                                <Dropdown.Toggle as={CustomToggle}>
                                                                    <img src={icon1} className="img-fluid" alt="" />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="dropdown-menu py-2">
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Like</Tooltip>} className="ms-2 me-2" ><img src={icon1} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Love</Tooltip>} className="me-2" ><img src={icon2} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Happy</Tooltip>} className="me-2" ><img src={icon3} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>HaHa</Tooltip>} className="me-2" ><img src={icon4} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Think</Tooltip>} className="me-2" ><img src={icon5} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Sade</Tooltip>} className="me-2" ><img src={icon6} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Lovely</Tooltip>} className="me-2" ><img src={icon7} className="img-fluid me-2" alt="" /></OverlayTrigger>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                        <div className="total-like-block ms-2 me-3">
                                                            <Dropdown>
                                                                <Dropdown.Toggle as={CustomToggle}>
                                                                    140 Likes
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="dropdown-menu">
                                                                    <Dropdown.Item className="dropdown-item" to="#">Max Emum</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" to="#">Bill Yerds</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" to="#">Hap E. Birthday</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" to="#">Tara Misu</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" to="#">Midge Itz</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" to="#">Sal Vidge</Dropdown.Item>
                                                                    <Dropdown.Item className="dropdown-item" to="#">Other</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                    <div className="total-comment-block">
                                                        <Dropdown>
                                                            <Dropdown.Toggle as={CustomToggle}>
                                                                20 Comment
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="dropdown-menu">
                                                                <Dropdown.Item className="dropdown-item" to="#">Max Emum</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Bill Yerds</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Hap E. Birthday</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Tara Misu</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Midge Itz</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Sal Vidge</Dropdown.Item>
                                                                <Dropdown.Item className="dropdown-item" to="#">Other</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <ShareOffcanvas />
                                            </div>
                                            <hr />
                                            <ul className="post-comments p-0 m-0">
                                                <li className="mb-2">
                                                    <div className="d-flex ">
                                                        <div className="user-img">
                                                            <img src={user11} alt="userimg" className="avatar-35 rounded-circle img-fluid" />
                                                        </div>
                                                        <div className="comment-data-block ms-3">
                                                            <h6>Monty Carlo</h6>
                                                            <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                                            <div className="d-flex flex-wrap align-items-center comment-activity">
                                                                <Link to="#">like</Link>
                                                                <Link to="#">reply</Link>
                                                                <Link to="#">translate</Link>
                                                                <span> 5 min </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="d-flex ">
                                                        <div className="user-img">
                                                            <img src={user12} alt="userimg" className="avatar-35 rounded-circle img-fluid" />
                                                        </div>
                                                        <div className="comment-data-block ms-3">
                                                            <h6>Paul Molive</h6>
                                                            <p className="mb-0">Lorem ipsum dolor sit amet</p>
                                                            <div className="d-flex flex-wrap align-items-center comment-activity">
                                                                <Link to="#">like</Link>
                                                                <Link to="#">reply</Link>
                                                                <Link to="#">translate</Link>
                                                                <span> 5 min </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <form className="comment-text d-flex align-items-center mt-3">
                                                <input type="text" className="form-control rounded" placeholder="Enter Your Comment" />
                                                <div className="comment-attagement d-flex">
                                                    <Link to="#"><i className="ri-link me-3"></i></Link>
                                                    <Link to="#"><i className="ri-user-smile-line me-3"></i></Link>
                                                    <Link to="#"><i className="ri-camera-line me-3"></i></Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default EventDetail