import React, { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import user1 from "../../../../../assets/images/user/05.jpg";
import ViewMore from "../../../icons/uiverse/ViewMore";
import SeeMoreRequest from "./seeMoreRequest";
import { apiUpdateGroupRequest } from "../../../../../services/groupServices/groupRequest";
import { apiCreateMemberGroup } from "../../../../../services/groupServices/groupMembers";
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const MemberRequest = ({ requests }) => {
    const [showModal, setShowModal] = useState(false);
    const queryClient = useQueryClient();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleConfirm = async (request) => {
        console.log("Request:", request);
        try {
            const payload = { data: { status_action: "vr8ygnd5y17xs4vcq6du3q7c" } };
            await apiUpdateGroupRequest({ documentId: request.documentId, payload });
            const payload1 = {
                data: {
                    group_id: request.group_id.documentId,
                    users_id: request.user_request.documentId,
                }
            };
            await apiCreateMemberGroup(payload1);
            queryClient.invalidateQueries('groupMembers');
            queryClient.invalidateQueries('groupRequests');
            toast.success("Request confirmed successfully!");
            // Optionally, update the UI or state here
        } catch (error) {
            console.error("Error confirming request:", error);
            toast.error("Failed to confirm request.");
        }
    };

    const handleDelete = async (request) => {
        try {
            const payload = { data: { status_action: "aei7fjtmxrzz3hkmorgwy0gm" } };
            await apiUpdateGroupRequest({ documentId: request.documentId, payload });
            queryClient.invalidateQueries('groupMembers');
            queryClient.invalidateQueries('groupRequests');
            toast.success("Request deleted successfully!");
        } catch (error) {
            console.error("Error deleting request:", error);
            toast.error("Failed to delete request.");
        }
    };

    return (
        <>
            <Card>
                <Card.Header className="d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Members Request</h4>
                    </div>
                    <div onClick={handleShowModal}>
                        <ViewMore />
                    </div>
                </Card.Header>
                <Card.Body>
                    <ul className="request-list list-inline m-0 p-0">
                        {requests?.slice(0, 3).map((request, index) => (
                            <li key={index} className="d-flex align-items-center justify-content-between flex-wrap">
                                <div className="user-img img-fluid flex-shrink-0">
                                    <img src={request?.user_request.profile_picture || user1} alt="story-img" className="rounded-circle avatar-40" />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h6>{request?.user_request.username}</h6>
                                </div>
                                <div className="d-flex align-items-center mt-2 mt-md-0">
                                    <div className="confirm-click-btn">
                                        <Button className="me-3 btn btn-primary rounded confirm-btn" onClick={() => handleConfirm(request)}>Confirm</Button>
                                    </div>
                                    <Button className="btn rounded me-3" variant="danger" onClick={() => handleDelete(request)}>Delete Request</Button>
                                    <Link to={`/friend-profile/${request?.user_request?.documentId}`} state={{ friendId: request?.user_request }}>
                                        <Button className="btn rounded" variant="secondary">View Profile</Button>
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>See More Requests</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <SeeMoreRequest requests={requests} onCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default MemberRequest;