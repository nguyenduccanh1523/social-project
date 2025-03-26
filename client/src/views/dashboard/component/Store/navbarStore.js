// StoryContainer.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { apiGetStories } from '../../../../services/stories';
import NavbarLeft from './navbarLeft';
import StoryViewerRight from './storyViewRight';
import CreateStoryModal from './createModal';

const StoryContainer = () => {
    const [stories, setStories] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: storiesData } = useQuery({
        queryKey: ['stories'],
        queryFn: apiGetStories,
        onSuccess: (data) => {
            const storyList = data?.data?.data ?? [];
            setStories(storyList); // chỉ là mảng
        },
    });

    useEffect(() => {
        if (storiesData && Array.isArray(storiesData?.data?.data)) {
            setStories(storiesData);
        }
    }, [storiesData]);
    //console.log('stories', stories);

    const handleSelectStory = (story) => {
        const index = stories?.data?.data?.findIndex(s => s.user_id.documentId === story.user_id.documentId);
        setSelectedIndex(index);
    };

    const handlePrev = () => {
        if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
    };

    const handleNext = () => {
        if (selectedIndex < stories.data.data.length - 1) setSelectedIndex(selectedIndex + 1);
    };

    return (
        <Row>
            <Col lg={4} className="chat-data-left scroller" style={{ height: "700px" }}>
                <NavbarLeft
                    stories={stories}
                    onSelectStory={handleSelectStory}
                    activeStoryId={stories?.data?.data?.[selectedIndex]?.user_id?.documentId}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                />
            </Col>
            <StoryViewerRight
                story={stories?.data?.data?.[selectedIndex]}
                onPrev={handlePrev}
                onNext={handleNext}
            />
            <CreateStoryModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </Row>

    );
};

export default StoryContainer;