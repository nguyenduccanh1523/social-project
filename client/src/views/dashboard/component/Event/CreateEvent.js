import React, { useState } from 'react';
import { Drawer, Form, Input, Button, Space, TimePicker } from 'antd';
import moment from 'moment';

const CreateEvent = ({ open, onClose }) => {
    const [form] = Form.useForm();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const handleSubmit = (values) => {
        console.log('Event Data:', { ...values, startTime, endTime });
        // Add logic to handle event creation
        form.resetFields();
        setStartTime(null);
        setEndTime(null);
        onClose();
    };

    const handleStartTimeChange = (time) => {
        setStartTime(time ? time.format('HH:mm') : null);
    };

    const handleEndTimeChange = (time) => {
        setEndTime(time ? time.format('HH:mm') : null);
    };

    const handleOk = () => {
        form.submit();
    };

    return (
        <Drawer
            title="Create Event"
            placement="right"
            width={500}
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={handleOk}>
                        OK
                    </Button>
                </Space>
            }
            style={{ marginTop: "74px" }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="Event Name"
                    rules={[{ required: true, message: 'Please enter the event name' }]}
                >
                    <Input placeholder="Enter event name" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter the event description' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter event description" />
                </Form.Item>
                <Form.Item
                    name="location"
                    label="Location"
                    rules={[{ required: true, message: 'Please enter the event location' }]}
                >
                    <Input placeholder="Enter event location" />
                </Form.Item>
                <div className="d-flex justify-content-between">
                    <div>
                        <p>Start Time</p>
                        <TimePicker
                            value={startTime ? moment(startTime, 'HH:mm') : null}
                            onChange={handleStartTimeChange}
                            format="HH:mm"
                            className="mb-3"
                        />
                    </div>
                    <div>
                        <p>End Time</p>
                        <TimePicker
                            value={endTime ? moment(endTime, 'HH:mm') : null}
                            onChange={handleEndTimeChange}
                            format="HH:mm"
                            className="mb-3"
                        />
                    </div>
                </div>
            </Form>
        </Drawer>
    );
};

export default CreateEvent;
