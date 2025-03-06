import React from 'react';
import { Button } from 'react-bootstrap';

const ButtonPost = ({ profile, formData, page, group }) => {
    const handleClick = (e) => {
        e.preventDefault();
        if (profile && !page && !group) {
            console.log('Case 1: Profile:', profile);
        }
        if (page && !profile && !group) {
            console.log('Case 2: Page:', page);
        }
        if (profile && group && !page) {
            console.log('Case 3: Profile and Group:', profile, group);
        }
        if (formData?.selectedFriends?.length) {
            console.log('Case 4: Selected Friends:', formData.selectedFriends);
        }
        if (formData?.selectedImages?.length) {
            console.log('Case 5: Selected Images:', formData.selectedImages);
        }
        if (formData?.selectedTags?.length) {
            console.log('Case 6: Selected Tags:', formData.selectedTags);
        }
        console.log('Form Data:', formData);
    };

    return (
        <Button
            variant="primary"
            className="d-block w-100 mt-3"
            type="submit"
            onClick={handleClick}
            disabled={!formData.inputText.length}
            style={{ backgroundColor: !formData.inputText.length ? 'gray' : '' }}
        >
            Post
        </Button>
    );
};

export default ButtonPost;
