import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStatus } from "../../../actions/actions/statusActivity";
import { Radio, notification } from 'antd'; // Import notification from antd
import './status.scss';
import { apiUpadateStatusByUser } from "../../../services/statusActivity";

const Status = ({ userId }) => {
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.root.status || {});
    const { token } = useSelector((state) => state.root.auth || {});
    // console.log('status', status);
    const [selectedStatus, setSelectedStatus] = useState(null);
    // console.log('userId', userId);  

    useEffect(() => {
        dispatch(fetchStatus());
        if (userId?.status) {
            const initialStatus = userId.status?.name;
            setSelectedStatus(initialStatus);
        }
    }, [dispatch, userId]);
    //console.log('status', status);

    //console.log('userId', userId);

    const statusColors = {
        "Active": "text-success",
        "Idle / Away": "text-warning",
        "Do Not Disturb (DND)": "text-danger",
        "Offline": "text-gray"
    };

    const handleClick = async (documentId, statusName) => {
        console.log('Document ID:', documentId);
        const payload = {
                status_id: documentId // Add documentId to payload
        };
        setSelectedStatus(statusName);
        try {
            await apiUpadateStatusByUser({ userId: userId?.documentId, payload, token: token }); // Call the API to update status with payload
            notification.success({
                message: 'Success',
                description: 'Status updated successfully'
            }); // Notify success
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to update status'
            }); // Notify failure
        }
    };

    return (
        <>
            {status?.data?.map((item, index) => (
                <div
                    key={index}
                    className="d-flex align-items-center iq-sub-card border-0"
                    onClick={() => handleClick(item?.documentId, item?.name)}
                >
                    <Radio
                        checked={selectedStatus === item?.name}
                        className={`status-radio ${statusColors[item?.name]}`}
                    />
                    <div className="ms-3">{item?.name}</div>
                </div>
            ))}
        </>
    )
}

export default Status;