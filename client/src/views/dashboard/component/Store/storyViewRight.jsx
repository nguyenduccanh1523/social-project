// StoryViewerRight.jsx
import React, { useState, useEffect } from 'react';
import { Col, Image } from 'react-bootstrap';
import { Progress as AntdProgress } from 'antd';
import { timeAgo } from '../../others/format';

const StoryViewerRight = ({ story, onPrev, onNext }) => {
    console.log('story', story)
    const [percent, setPercent] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

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
                    <i className="material-symbols-outlined" style={{ cursor: 'pointer', fontSize: '30px' }}>more_horiz</i>
                    <div onClick={pauseResume} style={{ cursor: 'pointer' }}>
                        <i className="material-symbols-outlined" style={{ fontSize: '30px' }}>{isPaused ? 'play_arrow' : 'pause'}</i>
                    </div>
                </div>
                <div className="chat chat-left" style={{ marginTop: '-40px' }}>
                    <img src={story?.user_id?.profile_picture} alt="story-img" className="rounded-circle img-fluid avatar-40" />
                    <div className="stories-data ms-3 d-flex gap-2">
                        <h5>{story?.user_id?.username}</h5>
                        <p className="mb-0">{timeAgo(story?.createdAt)}</p>
                        <i className="material-symbols-outlined">public</i>
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
        </Col>
    );
};

export default StoryViewerRight;
