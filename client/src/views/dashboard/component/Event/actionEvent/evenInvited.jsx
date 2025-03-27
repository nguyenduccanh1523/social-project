import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, ListGroup, Row, Col } from 'react-bootstrap';
import { Input, notification } from 'antd';
import { apiGetFriendAccepted } from '../../../../../services/friend';
import { apiCreateEventInvited, apiEditEventInvited, apiGetEventFriend, apiGetEventInvationFriend } from '../../../../../services/eventServices/event';

const EventInvited = ({ oldData, profile, show, handleClose }) => {
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [participationStatus, setParticipationStatus] = useState({});

    useEffect(() => {
        const fetchFriendList = async () => {
            const response = await apiGetFriendAccepted({ documentId: profile?.documentId });
            setFriendList(response.data?.data || []);
            setIsLoading(false);
        };
        fetchFriendList();
    }, [profile?.documentId]);

    useEffect(() => {
        const checkParticipation = async () => {
            const status = {};
            await Promise.all(friendList.map(async (friend) => {
                const friendData = friend?.user_id?.documentId === profile?.documentId ? friend?.friend_id : friend?.user_id;
                try {
                    const response = await apiGetEventFriend({ eventId: oldData?.documentId, friendId: friendData?.documentId });
                    if (response.data?.data?.length > 0) {
                        status[friendData?.documentId] = true;
                    }
                } catch (error) {
                    console.error('Error checking participation:', error);
                }
            }));
            setParticipationStatus(status);
        };
        if (friendList.length > 0) {
            checkParticipation();
        }
    }, [friendList, oldData?.documentId, profile?.documentId]);

    const filteredFriendList = friendList.filter(friend => {
        const searchLower = searchText.toLowerCase().trim();
        const isMatchingUserId = friend?.user_id?.documentId === profile?.documentId;
        const isMatchingFriendId = friend?.friend_id?.documentId === profile?.documentId;

        if (isMatchingUserId) {
            return !searchText || friend?.friend_id?.username?.toLowerCase().includes(searchLower);
        }

        if (isMatchingFriendId) {
            return !searchText || friend?.user_id?.username?.toLowerCase().includes(searchLower);
        }

        return false;
    });

    const handleCheckboxChange = (documentId) => {
        setSelectedFriends(prevSelected => {
            if (prevSelected.includes(documentId)) {
                return prevSelected.filter(friendDocumentId => friendDocumentId !== documentId);
            }
            return [...prevSelected, documentId];
        });
    };

    const handleSendInvitation = async () => {
        try {
            await Promise.all(selectedFriends.map(async (friend) => {
                const response = await apiGetEventInvationFriend({
                    eventId: oldData.documentId,
                    userId: profile.documentId,
                    friendId: friend.documentId
                });

                if (response.data?.data?.length > 0) {
                    const invitationId = response.data.data[0].documentId;
                    const payload = {
                        data: {
                            invitation_status: 'w1t6ex59sh5auezhau5e2ovu'
                        }
                    };
                    await apiEditEventInvited({
                        documentId: invitationId,
                        payload: payload
                    });
                } else {
                    await apiCreateEventInvited({
                        data: {
                            event_id: oldData.documentId,
                            invited_by: profile.documentId,
                            invited_to: friend.documentId,
                            invitation_status: 'w1t6ex59sh5auezhau5e2ovu',
                        }
                    });
                }
            }));

            const invitedFriendNames = selectedFriends.map(friend => friend.username).join(', ');
            notification.success({
                message: 'Success',
                description: `Friends have been successfully invited: ${invitedFriendNames}`
            });
            setSelectedFriends([]); // Reset selected friends
            handleClose();
        } catch (error) {
            console.error('Error inviting friends:', error);
            notification.error({
                message: 'Error',
                description: 'There was an error inviting friends.'
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" style={{ marginTop: '10vh' }}>
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
                                    const friendData = friend?.user_id?.documentId === profile?.documentId ? friend?.friend_id : friend?.user_id;
                                    const isParticipated = participationStatus[friendData?.documentId];

                                    return (
                                        <ListGroup.Item key={friendData?.documentId}>
                                            {friendData && (
                                                <>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedFriends.includes(friendData)}
                                                            onChange={() => handleCheckboxChange(friendData)}
                                                            label={friendData.username}
                                                            disabled={isParticipated}
                                                        />
                                                        {isParticipated && <small className="text-success d-flex" variant="primary">Participated<span className="material-symbols-outlined">
                                                            done_outline
                                                        </span></small>}
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
                                    <ListGroup.Item key={friendData?.documentId} className="d-flex justify-content-between align-items-center">
                                        {friendData.username}
                                        <Button variant="danger" size="sm" onClick={() => handleCheckboxChange(friendData)}>
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