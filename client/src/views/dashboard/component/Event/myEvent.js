import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Input, Pagination, Image, Drawer } from "antd";
import { Link } from "react-router-dom";
import Card from "../../../../components/Card";
import ProfileHeader from "../../../../components/profile-header";
import Loader from "../../icons/uiverse/Loading";
import EventInvited from "./actionEvent/evenInvited";
import img6 from "../../../../assets/images/page-img/profile-bg6.jpg";
import {
  apiGetEventUser,
  apiGetEventDetail,
  apiGetEventUserCreate,
} from "../../../../services/eventServices/event";
import { getMonthAndDay } from "../../others/format";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Create from "../../icons/uiverse/Create";
import CreateEvent from "./CreateEvent"; // Import the CreateEvent component
import "./MyEvent.css"; // Import the CSS file

const { Search } = Input;

const ProfileEvents = () => {
  const { token, user } = useSelector((state) => state.root.auth || {});
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pageSize = 9;

  const fetchEvents = async () => {
    if (!user?.documentId) return [];
    const [userEvents, createdEvents] = await Promise.all([
      apiGetEventUser({ userId: user?.documentId, token }),
      apiGetEventUserCreate({ userId: user?.documentId, token }),
    ]);

    const userEventData = userEvents?.data?.data.map((e) => ({
      ...e,
      _type: "joined",
    }));
    const createdEventData = createdEvents?.data?.data.map((e) => ({
      ...e,
      _type: "created",
    }));

    // console.log('userEventData:', userEventData);
    // console.log('createdEventData:', createdEventData);

    // Filter out duplicates
    const filteredUserEvents = userEventData.filter(
      (userEvent) =>
        !createdEventData.some(
          (createdEvent) =>
            userEvent.event?.documentId === createdEvent.documentId
        )
    );

    return [...filteredUserEvents, ...createdEventData];
  };

  const fetchEventDetail = async (events, token) => {
    if (!events.length) return [];
    const details = await Promise.all(
      events.map(async (event) => {
        const eventId = event?.event?.documentId || event?.documentId;
        const res = await apiGetEventDetail({ eventId, token });
        return { ...res?.data?.data, _type: event._type };
      })
    );
    return details;
  };

  const { data: rawEvents = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ["events", user?.documentId, token],
    queryFn: fetchEvents,
    enabled: !!user?.documentId || !!token,
  });

  console.log("rawEvents:", rawEvents);

  const { data: eventDetails = [], isLoading: isLoadingDetails } = useQuery({
    queryKey: ["eventDetails", rawEvents, token],
    queryFn: () => fetchEventDetail(rawEvents, token),
    enabled: !!rawEvents.length || !!token,
  });

  const isLoading = isLoadingEvents || isLoadingDetails;
  if (!document || isLoading) return <Loader />;

  const filteredEvents = eventDetails?.filter((event) => {
    const keyword = searchText.toLowerCase().trim();
    return !searchText || event?.name?.toLowerCase().includes(keyword);
  });

  const currentEvents = filteredEvents?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleInviteClick = (event) => {
    setSelectedEvent(event);
    setShowInviteModal(true);
  };

  // const handleCreateClick = () => {
  //     setIsDrawerVisible(true); // Open the Drawer
  // };

  // const handleDrawerClose = () => {
  //     setIsDrawerVisible(false); // Close the Drawer
  // };

  console.log("currentEventcurrentEvents:", currentEvents);

  return (
    <>
      <ProfileHeader title="All Events" img={img6} />
      <div id="content-page" className="content-page">
        <Container>
          <Row className="mb-3">
            <Col lg="12">
              <Card>
                <Card.Body className="d-flex justify-content-between align-items-center">
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
                  <div onClick={() => setDrawerOpen(true)}>
                    <Create />
                  </div>
                  <CreateEvent
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="d-grid gap-3 d-grid-template-1fr-19">
            {currentEvents?.map((event) => (
              <div key={event?.documentId}>
                <Card className="rounded mb-0">
                  <div
                    className="image-container"
                    style={{ height: "200px", overflow: "hidden" }}
                  >
                    <div className="event-image-wrapper">
                      <Image
                        src={event?.image?.file_path}
                        className="w-100 h-100"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "fill",
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
                        <h5>
                          <Link
                            to={`/event-detail/${event?.documentId}`}
                            state={{ eventDetail: event }}
                          >
                            {event?.name}{" "}
                            {event?._type === "created" ? "(My Event)" : ""}
                          </Link>
                        </h5>
                        <p>{event?.description}</p>
                        <span className="text-dark">
                          +{event?.members?.length || 0} members
                        </span>
                        <div className="event-member mt-2 d-flex gap-2">
                          <button className="btn btn-soft-primary btn-sm d-flex align-items-center gap-2">
                            <span className="material-symbols-outlined">
                              done
                            </span>{" "}
                            Interested
                          </button>
                          <button
                            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                            onClick={() => handleInviteClick(event)}
                          >
                            <span className="material-symbols-outlined">
                              person_add_alt
                            </span>{" "}
                            Invite
                          </button>
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

      {selectedEvent && (
        <EventInvited
          oldData={selectedEvent}
          profile={user}
          show={showInviteModal}
          handleClose={() => setShowInviteModal(false)}
        />
      )}
    </>
  );
};

export default ProfileEvents;
