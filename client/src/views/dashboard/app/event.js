import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "react-bootstrap";
import { Input, Pagination, Image } from "antd";
import Card from '../../../components/Card'
import { Link } from 'react-router-dom'
import "../../dashboard/component/Blog/BlogDetail.css";

//profile-header
import ProfileHeader from '../../../components/profile-header'

// images
import img6 from '../../../assets/images/page-img/profile-bg6.jpg'
import { apiGetEvent, apiGetEventUser } from '../../../services/event';
import { getMonthAndDay } from '../others/format';
import { useSelector } from 'react-redux';
import Loader from "../icons/uiverse/Loading";

const { Search } = Input;

const Events = () => {
    const [events, setEvents] = useState([]);
    const [eventUser, setEventUser] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 9;

    const { profile } = useSelector((state) => state.root.user || {});

    const document = profile?.documentId;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiGetEventUser({ userId: document });
                setEventUser(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
            setIsLoading(false);
        };
        fetchEvents();
    }, [document]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiGetEvent();
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

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
                                                                    <button className="btn btn-soft-primary btn-sm d-flex align-items-center gap-2">
                                                                        <span className="material-symbols-outlined">
                                                                            star_outline
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
                        </>
                    )}
                </Container>
            </div>
        </>
    )

}

export default Events;