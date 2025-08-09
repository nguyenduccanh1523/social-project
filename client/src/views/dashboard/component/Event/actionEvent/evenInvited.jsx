import React, { useEffect, useState } from "react";
import { Modal, Button, Form, ListGroup, Row, Col } from "react-bootstrap";
import { Input, notification } from "antd";
import { apiGetFriendAccepted } from "../../../../../services/friend";
import {
  apiCreateEventInvited,
  apiEditEventInvited,
  apiGetEventFriend,
  apiGetEventInvationFriend,
} from "../../../../../services/eventServices/event";
import { useSelector } from "react-redux";
import { useQuery} from "@tanstack/react-query";

const EventInvited = ({ oldData, profile, show, handleClose }) => {
  const { token } = useSelector((state) => state.root.auth || {});
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [participationStatus, setParticipationStatus] = useState({});

  // eslint-disable-next-line no-unused-vars
  const { data: userAcceptData, isLoading: userAcceptLoading } = useQuery({
    queryKey: ["userAccept", profile?.documentId, token],
    queryFn: () =>
      apiGetFriendAccepted({ documentId: profile?.documentId, token: token }),
    enabled: !!profile?.documentId && !!token,
    onSuccess: (data) => {
      console.log("User data fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const friendList = userAcceptData?.data?.data || [];

  useEffect(() => {
    const checkParticipation = async () => {
      const status = {};
      await Promise.all(
        friendList?.map(async (friend) => {
          const friendData =
            friend?.user?.documentId === profile?.documentId
              ? friend?.friend
              : friend?.user;
          try {
            const response = await apiGetEventFriend({
              eventId: oldData?.documentId,
              friendId: friendData?.documentId,
            });
            if (response.data?.data?.length > 0) {
              status[friendData?.documentId] = true;
            }
          } catch (error) {
            console.error("Error checking participation:", error);
          }
        })
      );
      setParticipationStatus(status);
    };
    if (friendList.length > 0) {
      checkParticipation();
    }
  }, [friendList, oldData?.documentId, profile?.documentId]);

  const filteredFriendList = friendList.filter((friend) => {
    const searchLower = searchText.toLowerCase().trim();
    const isMatchingUserId = friend?.user?.documentId === profile?.documentId;
    const isMatchingFriendId =
      friend?.friend?.documentId === profile?.documentId;

    if (isMatchingUserId) {
      return (
        !searchText ||
        friend?.friend?.fullname?.toLowerCase().includes(searchLower)
      );
    }

    if (isMatchingFriendId) {
      return (
        !searchText ||
        friend?.user?.fullname?.toLowerCase().includes(searchLower)
      );
    }

    return false;
  });

  const handleCheckboxChange = (documentId) => {
    setSelectedFriends((prevSelected) => {
      if (prevSelected.includes(documentId)) {
        return prevSelected.filter(
          (friendDocumentId) => friendDocumentId !== documentId
        );
      }
      return [...prevSelected, documentId];
    });
  };

  const handleSendInvitation = async () => {
    try {
      await Promise.all(
        selectedFriends.map(async (friend) => {
          const response = await apiGetEventInvationFriend({
            eventId: oldData.documentId,
            userId: profile.documentId,
            friendId: friend.documentId,
          });

          if (response.data?.data?.length > 0) {
            const invitationId = response.data.data[0].documentId;
            const payload = {
              statusActionId: "w1t6ex59sh5auezhau5e2ovu",
            };
            await apiEditEventInvited({
              documentId: invitationId,
              payload: payload,
            });
          } else {
            const payload = {
              eventId: oldData.documentId,
              invitedBy: profile.documentId,
              invitedTo: friend.documentId,
              statusActionId: "w1t6ex59sh5auezhau5e2ovu",
            };
            await apiCreateEventInvited({payload, token});
          }
        })
      );

      const invitedFriendNames = selectedFriends
        .map((friend) => friend.fullname)
        .join(", ");
      notification.success({
        message: "Success",
        description: `Friends have been successfully invited: ${invitedFriendNames}`,
      });
      setSelectedFriends([]); // Reset selected friends
      handleClose();
    } catch (error) {
      console.error("Error inviting friends:", error);
      notification.error({
        message: "Error",
        description: "There was an error inviting friends.",
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      style={{ marginTop: "10vh" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Invite friends to join this event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Input.Search
            placeholder="Find friends by name"
            className="mb-3"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Row>
            <Col>
              <ListGroup>
                {filteredFriendList.map((friend) => {
                  const friendData =
                    friend?.user?.documentId === profile?.documentId
                      ? friend?.friend
                      : friend?.user;
                  const isParticipated =
                    participationStatus[friendData?.documentId];

                  return (
                    <ListGroup.Item key={friendData?.documentId}>
                      {friendData && (
                        <>
                          <div className="d-flex justify-content-between align-items-center">
                            <Form.Check
                              type="checkbox"
                              checked={selectedFriends.includes(friendData)}
                              onChange={() => handleCheckboxChange(friendData)}
                              label={friendData.fullname}
                              disabled={isParticipated}
                            />
                            {isParticipated && (
                              <small
                                className="text-success d-flex"
                                variant="primary"
                              >
                                Participated
                                <span className="material-symbols-outlined">
                                  done_outline
                                </span>
                              </small>
                            )}
                          </div>
                        </>
                      )}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Col>
            <Col>
              <h5>Selected Friends</h5>
              <ListGroup>
                {selectedFriends.map((friendData) => (
                  <ListGroup.Item
                    key={friendData?.documentId}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {friendData.fullname}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCheckboxChange(friendData)}
                    >
                      X
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <div className="d-flex justify-content-between mt-3">
            <div>{selectedFriends.length} FRIENDS SELECTED</div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        {selectedFriends.length > 0 && (
          <Button variant="primary" onClick={handleSendInvitation}>
            Send invitation
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EventInvited;
