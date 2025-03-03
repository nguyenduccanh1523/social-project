import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "react-bootstrap";
import { Input, Pagination, Image } from "antd";
import Card from '../../../../components/Card'
import { Link } from 'react-router-dom'
import "../../../dashboard/component/Blog/BlogDetail.css";

//profile-header
import ProfileHeader from '../../../../components/profile-header'

// images
import img6 from '../../../../assets/images/page-img/profile-bg6.jpg'
import { apiGetEventUser, apiGetEventDetail } from '../../../../services/event';
import { getMonthAndDay } from '../../others/format';
import { useSelector } from 'react-redux';


const { Search } = Input;

const ProfileEvents = () => {
    const { profile } = useSelector((state) => state.root.user || {});
    const [events, setEvents] = useState([]);
    const [eventDetail, setEventDetail] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    const document = profile?.documentId;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiGetEventUser({ userId: document });
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, [document]);

    //console.log("events", events);
    useEffect(() => {
        const fetchEventDetail = async () => {
            if (events && events.data && Array.isArray(events.data)) {
                //console.log("events", events);
                const eventDetails = await Promise.all(events.data.map(event =>
                    apiGetEventDetail({ eventId: event?.event_id?.documentId })
                ));
                //console.log("eventDetails", eventDetails);
                setEventDetail(eventDetails);
            } else {
                console.error("Invalid events structure", events);
            }
        };
        fetchEventDetail();
    }, [events]);


    // Lọc tags theo searchText
    const filteredEvents = eventDetail?.filter(event => {
        const searchLower = searchText.toLowerCase().trim();
        return !searchText || event?.data?.data?.name?.toLowerCase().includes(searchLower);
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

    return (
        <>
            <ProfileHeader title="All Events" img={img6} />
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
                    <div className="d-grid gap-3 d-grid-template-1fr-19">
                        {getCurrentPageEvents().map((event) => (
                            <div key={event?.data?.data?.id}>
                                <Card className="rounded mb-0">
                                    <div className="image-container" style={{ height: '200px', overflow: 'hidden' }}>
                                        <div className="event-image-wrapper">
                                            <Image
                                                src={event?.data?.data?.banner_id?.file_path}
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
                                                <span>{getMonthAndDay(event?.data?.data?.start_time)?.month}</span>
                                                <h5>{getMonthAndDay(event?.data?.data?.start_time)?.day}</h5>
                                            </div>
                                            <div className="events-detail ms-3">
                                                <h5><Link to={`/event-detail/${event?.data?.data?.documentId}`} state={{ eventDetail: event?.data?.data }}>
                                                    {event?.data?.data?.name}
                                                </Link></h5>
                                                <p>{event?.data?.data?.description}</p>
                                                <span className="text-dark">+{event?.data?.data?.event_members?.length || 0} members</span>
                                                <div className="event-member">
                                                    <div className="d-flex align-items-center justify-content-between mt-2 gap-2">
                                                        <div className="d-flex gap-2">
                                                            <button className="btn btn-soft-primary btn-sm d-flex align-items-center gap-2">
                                                                <span className="material-symbols-outlined">
                                                                    done
                                                                </span>
                                                                Interested
                                                            </button>
                                                            <button className="btn btn-primary btn-sm d-flex align-items-center gap-2">
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
                </Container>
            </div>
        </>
    )

}

export default ProfileEvents;