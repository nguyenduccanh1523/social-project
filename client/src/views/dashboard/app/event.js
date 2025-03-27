import React, { useState } from 'react'
import { Container, Row, Col } from "react-bootstrap";
import { Input, Pagination, Image, notification } from "antd";
import Card from '../../../components/Card'
import { Link } from 'react-router-dom'
import "../../dashboard/component/Blog/BlogDetail.css";

//profile-header
import ProfileHeader from '../../../components/profile-header'

// images
import img6 from '../../../assets/images/page-img/profile-bg6.jpg'
import { apiGetEvent, apiGetEventUser } from '../../../services/eventServices/event';
import { getMonthAndDay } from '../others/format';
import { useSelector } from 'react-redux';
import Loader from "../icons/uiverse/Loading";
import EventInvited from '../../dashboard/component/Event/actionEvent/evenInvited';
import { apiUpdateEventRequest, apiCheckEventRequestUser, apiCreateEventRequest, apiGetEventRequestUser } from '../../../services/eventServices/eventRequest';
import { useQuery, useQueryClient } from "@tanstack/react-query";

const { Search } = Input;

const Events = () => {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const queryClient = useQueryClient();
    const pageSize = 9;

    const { profile } = useSelector((state) => state.root.user || {});
    const document = profile?.documentId;

    const { data: eventUser, isLoading: isEventUserLoading } = useQuery({
        queryKey: ['eventUser', document],
        queryFn: () => apiGetEventUser({ userId: document }).then(res => res.data),
        enabled: !!document,
    });

    const { data: events, isLoading: isEventsLoading } = useQuery({
        queryKey: ['events'],
        queryFn: () => apiGetEvent().then(res => res.data),
    });

    const { data: eventRequests, isLoading: isEventRequestsLoading } = useQuery({
        queryKey: ['eventRequests', events, profile?.documentId],
        queryFn: async () => {
            const eventIds = events?.data?.map(event => event.documentId) || [];
            const response = await Promise.all(
                eventIds.map(eventId =>
                    apiGetEventRequestUser({ eventId, userId: profile?.documentId })
                )
            );
            return response.flatMap(res => res.data?.data || []);
        },
        enabled: !!profile?.documentId && !!events?.data?.length,
    });

    const isLoading = isEventUserLoading || isEventsLoading || isEventRequestsLoading;

    // Lấy tất cả documentId từ eventUser
    const eventUserDocumentIds = eventUser?.data?.map(event => event.event_id.documentId) || [];

    // Kiểm tra sự trùng lặp và lọc ra các sự kiện không trùng
    const uniqueEvents = events?.data?.filter(event => 
        !eventUserDocumentIds.includes(event.documentId)
    ) || [];

    // Lọc tags theo searchText
    const filteredEvents = uniqueEvents?.filter(event => {
        const searchLower = searchText.toLowerCase().trim();
        return !searchText || event?.name?.toLowerCase().includes(searchLower);
    });

    // Tính toán tags cho trang hiện tại từ danh sách đã lọc
    const getCurrentPageEvents = () => {
        if (!filteredEvents) return [];
        const startIndex = (currentPage - 1) * pageSize;
        return filteredEvents.slice(startIndex, startIndex + pageSize);
    };

    // Xử lý khi search thay đổi
    const handleSearch = (value) => {
        setSearchText(value);
        setCurrentPage(1); // Reset về trang 1 khi search
    };

    const handleInviteClick = (event) => {
        setSelectedEvent(event);
        setShowInviteModal(true);
    };

    const handleCloseInviteModal = () => {
        setShowInviteModal(false);
        setSelectedEvent(null);
    };

    const handleSendRequest = async (eventId) => {
        try {
            const response = await apiCheckEventRequestUser({ eventId: eventId, userId: profile?.documentId });
            if (response.data?.data.length > 0) {
                const requestId = response.data.data[0].documentId;
                const payload = {
                    data: {
                        request_status: "w1t6ex59sh5auezhau5e2ovu",
                    },
                };
                await apiUpdateEventRequest({ documentId: requestId, payload });
            } else {
                const payload = {
                    data: {
                        event_id: eventId,
                        user_request: profile?.documentId,
                        request_status: "w1t6ex59sh5auezhau5e2ovu",
                    },
                };
                await apiCreateEventRequest(payload);
            }
            notification.success({
                message: "Success",
                description: "Request sent successfully",
            });
            queryClient.invalidateQueries('eventRequests');
        } catch (error) {
            console.error("Error sending event request:", error);
            notification.error({
                message: "Error",
                description: "Failed to send request",
            });
        }
    };

    const isEventRequested = (eventId) => {
        return eventRequests.some(request => request?.event_id?.documentId === eventId);
    };
    

    const handleCancelRequest = async (eventId) => {
        try {
            const request = eventRequests.find(request => request?.event_id?.documentId === eventId);
            if (request) {
                const requestId = request.documentId;
                const payload = {
                    data: {
                        request_status: "aei7fjtmxrzz3hkmorgwy0gm", // Update status to cancelled
                    },
                };
                await apiUpdateEventRequest({ documentId: requestId, payload });
                notification.success({
                    message: "Success",
                    description: "Request cancelled successfully",
                });
                // Refresh event requests
                queryClient.invalidateQueries('eventRequests');
            }
        } catch (error) {
            console.error("Error cancelling event request:", error);
            notification.error({
                message: "Error",
                description: "Failed to cancel request",
            });
        }
    };

    return (
        <>
            <ProfileHeader title="Your Events" img={img6} />
            <div id="content-page" className="content-page">
                <Container>
                    <Row className="mb-3">
                        <Col lg="12">
                            <Card>
                                <Card.Body>
                                    <Search
                                        placeholder="Search event..."
                                        allowClear
                                        enterButton="Search"
                                        size="large"
                                        value={searchText}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onSearch={handleSearch}
                                        style={{ width: 400 }}
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {isLoading ? (
                        <div className="col-sm-12 text-center">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="d-grid gap-3 d-grid-template-1fr-19">
                                {getCurrentPageEvents().map((event) => (
                                    <div key={event.id}>
                                        <Card className="rounded mb-0">
                                            <div className="image-container" style={{ height: '200px', overflow: 'hidden' }}>
                                                <div className="event-image-wrapper">
                                                    <Image
                                                        src={event?.banner_id?.file_path}
                                                        className="w-100 h-100"
                                                        style={{
                                                            height: '100%',
                                                            width: '100%',
                                                            objectFit: 'fill'
                                                        }}
                                                        preview={false}
                                                        alt="Event banner"
                                                    />
                                                </div>
                                            </div>
                                            <Card.Body>
                                                <div className="d-flex">
                                                    <div className="date-of-event">
                                                        <span>{getMonthAndDay(event?.start_time)?.month}</span>
                                                        <h5>{getMonthAndDay(event?.start_time)?.day}</h5>
                                                    </div>
                                                    <div className="events-detail ms-3">
                                                        <h5><Link to={`/event-detail/${event?.documentId}`} state={{ eventDetail: event }}>{event?.name}</Link></h5>
                                                        <p>{event?.description}</p>
                                                        <span className="text-dark">+{event?.event_members?.length || 0} members</span>
                                                        <div className="event-member">
                                                            <div className="d-flex align-items-center justify-content-between mt-2 gap-2">
                                                                <div className="d-flex gap-2">
                                                                    {isEventRequested(event?.documentId) ? (
                                                                        <button
                                                                            className="btn btn-danger btn-sm d-flex align-items-center gap-2"
                                                                            onClick={() => handleCancelRequest(event?.documentId)}
                                                                        >
                                                                            <span className="material-symbols-outlined">
                                                                                cancel
                                                                            </span>
                                                                            Cancel
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-soft-primary btn-sm d-flex align-items-center gap-2"
                                                                            onClick={() => handleSendRequest(event?.documentId)}
                                                                        >
                                                                            <span className="material-symbols-outlined">
                                                                                star_outline
                                                                            </span>
                                                                            Interested
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                                                        onClick={() => handleInviteClick(event)}
                                                                    >
                                                                        <span className="material-symbols-outlined">
                                                                            person_add_alt
                                                                        </span>
                                                                        Invite
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))}
                            </div>

                            <Row className="mt-3 mb-3">
                                <Col lg="12" className="d-flex justify-content-end">
                                    <Pagination
                                        current={currentPage}
                                        total={filteredEvents?.length || 0}
                                        pageSize={pageSize}
                                        onChange={setCurrentPage}
                                        showSizeChanger={false}
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                </Container>
            </div>
            {selectedEvent && (
                <EventInvited
                    oldData={selectedEvent}
                    profile={profile}
                    show={showInviteModal}
                    handleClose={handleCloseInviteModal}
                />
            )}
        </>
    )

}

export default Events;