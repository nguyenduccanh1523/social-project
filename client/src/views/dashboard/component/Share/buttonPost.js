import React from 'react';
import { Button } from 'react-bootstrap';
import { apiCreatePost } from '../../../../services/post'; // Import the apiCreatePost function
import { apiCreatePostTag } from '../../../../services/tag'; // Import the apiCreatePostTag function
import { uploadToMediaLibrary } from '../../../../services/media'; // Import the uploadToMediaLibrary function



const ButtonPost = ({ profile, formData, page, group }) => {
    const handleClick = async (e) => {
        e.preventDefault();

        console.log('Profile:', formData);

        // const createPost = async (payload) => {
        //     try {
        //         const response = await apiCreatePost(payload);
        //         console.log('Post created successfully:', response);
        //         return response?.data?.data?.documentId;
        //     } catch (error) {
        //         console.error('Error creating post:', error);
        //         return null;
        //     }
        // };

        // let postId = null;

        // if (profile && !page && !group) {
        //     console.log('Case 1: Profile:', profile);
        //     const payload = {
        //         data: {
        //             user_id: profile.documentId,
        //             content: formData.inputText,
        //             type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
        //         }
        //     };
        //     postId = await createPost(payload);
        // }
        // if (page && !profile && !group) {
        //     console.log('Case 2: Page:', page);
        //     const payload = {
        //         data: {
        //             page: page.documentId,
        //             content: formData.inputText,
        //             type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
        //         }
        //     };
        //     postId = await createPost(payload);
        // }
        // if (profile && group && !page) {
        //     console.log('Case 3: Profile and Group:', profile, group);
        //     const payload = {
        //         data: {
        //             user_id: profile.documentId,
        //             group: group.documentId,
        //             content: formData.inputText,
        //             type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
        //         }
        //     };
        //     postId = await createPost(payload);
        // }

        // if (postId) {
        //     if (formData?.selectedFriends?.length) {
        //         console.log('Case 4: Selected Friends:', formData.selectedFriends);
        //         for (const friend of formData.selectedFriends) {
        //             const payload = {
        //                 data: {
        //                     post_id: postId,
        //                     friend_id: friend.documentId,
        //                 }
        //             };
        //             try {
        //                 const response = await apiCreatePostTag(payload);
        //                 console.log('Friend tagged successfully:', response);
        //             } catch (error) {
        //                 console.error('Error tagging friend:', error);
        //             }
        //         }
        //     }
        if (formData?.selectedImages?.length) {
            console.log('Case 5: Selected Images:', formData.selectedImages);
            for (const image of formData.selectedImages) {
                const binaryImage = await fetch(image.url)
                    .then(res => res.blob())
                    .then(blob => {
                        const fileType = blob.type;
                        const fileName = image.name || 'image.jpg'; // Default to 'image.jpg' if name is not provided
                        return new File([blob], fileName, { type: fileType });
                    });
                const payload = {
                    data: {
                        //post_id: postId,
                        image: binaryImage,
                    }
                };
                console.log('Payload:', payload);
                try {
                    // 1. Upload file to Strapi Media Library
                    const uploadedFile = await uploadToMediaLibrary({ file: binaryImage });
                    console.log('Uploaded File:', uploadedFile);

                    // 2. Create media file record with file information
                    const mediaFileData = {
                        file_path: uploadedFile.data[0].url,
                        file_type: uploadedFile.data[0].mime,
                        file_size: uploadedFile.data[0].size,
                    };

                    console.log('Media File Data:', mediaFileData);
                    // const response = await apiCreatePostTag(mediaFileData);
                    // console.log('Image added successfully:', response);
                } catch (error) {
                    console.error('Error adding image:', error.response || error);
                }
            }
        }
        //     if (formData?.selectedTags?.length) {
        //         console.log('Case 6: Selected Tags:', formData.selectedTags);
        //         for (const tag of formData.selectedTags) {
        //             const payload = {
        //                 data: {
        //                     post_id: postId,
        //                     tag_id: tag,
        //                 }
        //             };
        //             try {
        //                 const response = await apiCreatePostTag(payload);
        //                 console.log('Tag added successfully:', response);
        //             } catch (error) {
        //                 console.error('Error adding tag:', error);
        //             }
        //         }
        //     }
        // }
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
