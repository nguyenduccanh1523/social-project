// StoryViewerRight.jsx
import React, { useState, useEffect } from 'react';
import { Col, Image } from 'react-bootstrap';
import { Progress as AntdProgress, Dropdown, Menu, Modal, notification } from 'antd'; // Import Modal from antd
import { timeAgo } from '../../others/format';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { apiDeleteStory } from '../../../../services/stories';

const StoryViewerRight = ({ story, onPrev, onNext, handleReportStory }) => { // Remove handleDeleteStory from props
    const { profile } = useSelector((state) => state.root.user || {});
    const [percent, setPercent] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete confirmation modal
    const [isDeleting, setIsDeleting] = useState(false); // State for loading during delete
    const queryClient = useQueryClient();

    useEffect(() => {
        if (story) {
            setPercent(0);            // ✅ reset về 0 trước
            setIsPaused(false);       // reset trạng thái pause nếu đang pause
            startProgress(0);         // ✅ chạy lại từ đầu
        }
        return () => clearInterval(intervalId);
    }, [story]);

    const startProgress = (startValue = 0) => {
        clearInterval(intervalId); // quan trọng: clear trước để không bị conflict
        setPercent(startValue);
        const id = setInterval(() => {
            setPercent((prev) => {
                if (prev >= 100) {
                    clearInterval(id);
                    setTimeout(() => onNext(), 500);
                    return 100;
                }
                return prev + 100 / 30;
            });
        }, 1000);
        setIntervalId(id);
    };

    const pauseResume = () => {
        if (isPaused) {
            setIsPaused(false);
            startProgress(percent); // tiếp tục từ giá trị hiện tại
        } else {
            clearInterval(intervalId);
            setIsPaused(true);
        }
    };

    const showDeleteModal = () => {
        setIsDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await apiDeleteStory({ documentId: story?.documentId }); // Use apiDeleteStory to delete the story
            notification.success({ message: 'Story deleted successfully' }); // Show success notification
            queryClient.invalidateQueries('stories');
        } catch (error) {
            console.error('Failed to delete story:', error);
        } finally {
            setIsDeleting(false);
            setIsDeleteModalVisible(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    console.log('story', story);

    const menu = (
        <Menu>
            <Menu.Item
                key="1"
                style={{ display: story?.user_id?.documentId === profile?.documentId ? 'block' : 'none' }}
                onClick={showDeleteModal} // Show confirmation modal
            >
                <div className="d-flex align-items-top">
                    <i className="material-symbols-outlined">delete</i>
                    <div className="data ms-2">
                        <h6>Delete</h6>
                        <p className="mb-0">Remove this story</p>
                    </div>
                </div>
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handleReportStory(story.documentId)}>
                <div className="d-flex align-items-top">
                    <i className="material-symbols-outlined">report_problem</i>
                    <div className="data ms-2">
                        <h6>Report</h6>
                        <p className="mb-0">Report this story</p>
                    </div>
                </div>
            </Menu.Item>
        </Menu>
    );

    if (!story) {
        return (
            <Col lg={8} className="chat-data p-0 chat-data-right d-flex align-items-center justify-content-center" style={{ height: '730px' }}>
                <div className="text-center text-muted">
                    <i className="material-symbols-outlined" style={{ fontSize: '48px' }}>visibility</i>
                    <p className="fs-5 mt-2">Select a story to view</p>
                </div>
            </Col>
        );
    }

    return (
        <Col lg={8} className="chat-data p-0 chat-data-right">
            <div className="chat-content" style={{ height: '730px' }}>
                <AntdProgress percent={percent} showInfo={false} style={{ marginTop: '15px' }} />
                <div className="chat d-flex other-user" style={{ marginTop: '10px' }}>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: '1',
                                    label: (
                                        story?.user_id?.documentId === profile?.documentId && (
                                            <div className="d-flex align-items-top" onClick={showDeleteModal}>
                                                <i className="material-symbols-outlined">delete</i>
                                                <div className="data ms-2">
                                                    <h6>Delete</h6>
                                                    <p className="mb-0">Remove this story</p>
                                                </div>
                                            </div>
                                        )
                                    ),
                                },
                                {
                                    key: '2',
                                    label: (
                                        <div className="d-flex align-items-top" onClick={() => handleReportStory(story.documentId)}>
                                            <i className="material-symbols-outlined">report_problem</i>
                                            <div className="data ms-2">
                                                <h6>Report</h6>
                                                <p className="mb-0">Report this story</p>
                                            </div>
                                        </div>
                                    ),
                                }
                            ]
                        }}
                        trigger={['click']}
                    >
                        <span className="material-symbols-outlined" style={{ cursor: 'pointer', fontSize: '30px' }}>
                            more_horiz
                        </span>
                    </Dropdown>
                    <div onClick={pauseResume} style={{ cursor: 'pointer' }}>
                        <i className="material-symbols-outlined" style={{ fontSize: '30px' }}>{isPaused ? 'play_arrow' : 'pause'}</i>
                    </div>
                </div>
                <div className="chat chat-left" style={{ marginTop: '-40px' }}>
                    <img src={story?.user_id?.profile_picture} alt="story-img" className="rounded-circle img-fluid avatar-40" />
                    <div className="stories-data ms-3 d-flex gap-2">
                        <h5>{story?.user_id?.username}</h5>
                        <p className="mb-0">{timeAgo(story?.createdAt)}</p>
                        {story?.type?.name === 'public' ? <i className="material-symbols-outlined">public</i> : <i className="material-symbols-outlined">lock</i>}
                    </div>
                </div>
                <div className="d-flex mt-3 h-90">
                    <Col lg={2} className="d-flex align-items-center justify-content-center">
                        <i className="material-symbols-outlined" style={{ fontSize: '30px', cursor: 'pointer' }} onClick={onPrev}>arrow_back_ios</i>
                    </Col>
                    <Col lg={8} className="d-flex justify-content-center position-relative">
                        {story?.story_type === 'image' ? (
                            <div style={{ position: 'relative', width: '400px', height: '550px' }}>
                                <Image
                                    src={story?.media?.file_path}
                                    alt="post"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                    }}
                                />
                                {Array.isArray(story?.text) && story.text.length > 0 &&
                                    story.text.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                position: 'absolute',
                                                top: `${item.position?.y || 0}px`,
                                                left: `${item.position?.x || 0}px`,
                                                color: item?.color || 'white',
                                                fontWeight: 'bold',
                                                textShadow: '1px 1px 2px black',
                                                maxWidth: '300px',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {item.content}
                                        </div>
                                    ))}
                            </div>
                        ) : story?.story_type === 'color' ? (
                            <div
                                style={{
                                    position: 'relative',
                                    width: '400px',
                                    height: '550px',
                                    borderRadius: '8px',
                                    backgroundColor: story?.background || '#cccccc',
                                }}
                            >
                                {Array.isArray(story?.text) && story.text.length > 0 &&
                                    story.text.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                position: 'absolute',
                                                top: `${item.position?.y || 0}px`,
                                                left: `${item.position?.x || 0}px`,
                                                color: item?.color || 'white',
                                                fontWeight: 'bold',
                                                textShadow: '1px 1px 2px black',
                                                maxWidth: '300px',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {item.content}
                                        </div>
                                    ))}
                            </div>
                        ) : null}
                    </Col>

                    <Col lg={2} className="d-flex align-items-center justify-content-center">
                        <i className="material-symbols-outlined" style={{ fontSize: '30px', cursor: 'pointer' }} onClick={onNext}>arrow_forward_ios</i>
                    </Col>
                </div>
            </div>
            <Modal
                title="Confirm Delete"
                open={isDeleteModalVisible} // Use open instead of visible
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okText="Delete"
                cancelText="Cancel"
                confirmLoading={isDeleting} // Add loading state
            >
                <p>Are you sure you want to delete this story?</p>
            </Modal>
        </Col>
    );
};

export default StoryViewerRight;
