import React, { useState } from 'react';
import { Button, notification } from 'antd'; // Updated import
import { apiCreatePost } from '../../../../services/post';
import { apiCreatePostTag } from '../../../../services/tag';
import { uploadToMediaLibrary, createMedia, createPostMedia } from '../../../../services/media';
import { apiCreatePostFriend } from '../../../../services/friend';
import { useQueryClient } from '@tanstack/react-query';

const ButtonPost = ({ profile, formData, page, group, handleClose, onPostCreated = () => {} }) => {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);

        const createPost = async (payload) => {
            try {
                const response = await apiCreatePost(payload);
                return response?.data?.data;
            } catch (error) {
                console.error('Error creating post:', error);
                return null;
            }
        };

        let post = null;

        if (profile && !page && !group) {
            const payload = {
                data: {
                    user_id: profile.documentId,
                    content: formData.inputText,
                    type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
                }
            };
            post = await createPost(payload);
        }
        if (page && !profile && !group) {
            const payload = {
                data: {
                    page: page.documentId,
                    content: formData.inputText,
                    type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
                }
            };
            post = await createPost(payload);
        }
        if (profile && group && !page) {
            const payload = {
                data: {
                    user_id: profile.documentId,
                    group: group.documentId,
                    content: formData.inputText,
                    type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
                }
            };
            post = await createPost(payload);
        }

        if (post) {
            const postId = post.documentId;
            if (formData?.selectedFriends?.length) {
                for (const friend of formData.selectedFriends) {
                    const payload = {
                        data: {
                            post: postId,
                            users_permissions_user: friend,
                        }
                    };
                    try {
                        await apiCreatePostFriend(payload);
                    } catch (error) {
                        console.error('Error tagging friend:', error);
                    }
                }
            }
            if (formData?.selectedImages?.length) {
                for (const image of formData.selectedImages) {
                    console.log('Uploading image:', image);
                    const binaryImage = await fetch(image.url)
                        .then(res => res.blob())
                        .then(blob => {
                            const fileType = blob.type;
                            const fileName = image.name || 'image.jpg';
                            return new File([blob], fileName, { type: fileType });
                        });
                    try {
                        const uploadedFile = await uploadToMediaLibrary({ file: binaryImage });
                        const payload = {
                            data: {
                                file_path: `http://localhost:1337${uploadedFile.data[0].url}`,
                                file_type: uploadedFile.data[0].mime,
                                file_size: uploadedFile.data[0].size.toString(),
                            }
                        };
                        const response = await createMedia(payload);
                        const payloadPostMedia = {
                            data: {
                                post_id: postId,
                                media: response.data.data.documentId,
                            }
                        };
                        await createPostMedia(payloadPostMedia);
                    } catch (error) {
                        console.error('Error adding image:', error.response || error);
                    }
                }
            }
            if (formData?.selectedTags?.length) {
                for (const tag of formData.selectedTags) {
                    const payload = {
                        data: {
                            post_id: postId,
                            tag_id: tag,
                        }
                    };
                    try {
                        await apiCreatePostTag(payload);
                    } catch (error) {
                        console.error('Error adding tag:', error);
                    }
                }
            }

            notification.success({
                message: 'Post Created',
                description: 'Your post has been created successfully.',
            });
            handleClose();
            queryClient.invalidateQueries('post');
            onPostCreated(post); // Callback to update the post list
        }

        setLoading(false);
    };

    return (
        <Button
            type="primary"
            className="d-block w-100 mt-3"
            onClick={handleClick}
            disabled={!formData.inputText.length || loading}
            style={{ backgroundColor: !formData.inputText.length ? 'gray' : '' }}
        >
            {loading ? 'Loading...' : 'Post'}
        </Button>
    );
};

export default ButtonPost;
