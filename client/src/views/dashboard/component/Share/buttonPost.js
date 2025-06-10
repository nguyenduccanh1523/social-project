import React, { useState } from 'react';
import { Button, notification } from 'antd'; // Updated import
import { apiCreatePost } from '../../../../services/post';
import { apiCreatePostTag } from '../../../../services/tag';
import { uploadToMediaLibrary, createMedia, createPostMedia } from '../../../../services/media';
import { apiCreatePostFriend } from '../../../../services/friend';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

const ButtonPost = ({ profile, formData, page, group, handleClose, onPostCreated = () => {} }) => {
    const { token } = useSelector((state) => state.root.auth || {});
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    console.log('formData', formData);

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
                    user_id: profile.documentId,
                    content: formData.inputText,
                    type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
            };
            post = await createPost(payload);
        }
        if (page && !profile && !group) {
            const payload = {

                    page: page.documentId,
                    content: formData.inputText,
                    type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',

            };
            post = await createPost(payload);
        }
        if (profile && group && !page) {
            const payload = {

                    user_id: profile.documentId,
                    group: group.documentId,
                    content: formData.inputText,
                    type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
            };
            post = await createPost(payload);
        }

        if (post) {
            const postId = post?.data?.documentId;
            
            if (formData?.selectedFriends?.length) {
                for (const friend of formData.selectedFriends) {
                    const payload = {
                            post_id: postId,
                            user_id: friend,
                    };
                    try {
                        await apiCreatePostFriend(payload, token);
                    } catch (error) {
                        console.error('Error tagging friend:', error);
                    }
                }
            }
            if (formData?.selectedImages?.length) {
                for (const image of formData.selectedImages) {
                    // Upload image lên Cloudinary
                    const uploadToCloudinary = async (file, folder = "default") => {
                        const cloudName = process.env.REACT_APP_CLOUDINARY_NAME;
                        const uploadPreset = process.env.REACT_APP_REACT_UPLOAD;
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('upload_preset', uploadPreset);
                        formData.append('folder', folder);
                        try {
                            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                                method: 'POST',
                                body: formData
                            });
                            const data = await response.json();
                            if (data.secure_url) {
                                return {
                                    url: data.secure_url,
                                    public_id: data.public_id,
                                    mime: data.resource_type + "/" + data.format,
                                    size: data.bytes
                                };
                            } else {
                                throw new Error(data.error?.message || "Upload failed");
                            }
                        } catch (error) {
                            console.error("Error uploading file to Cloudinary:", error);
                        }
                    };

                    // Chuyển url sang file blob
                    const binaryImage = await fetch(image.url)
                        .then(res => res.blob())
                        .then(blob => {
                            const fileType = blob.type;
                            const fileName = image.name || 'image.jpg';
                            return new File([blob], fileName, { type: fileType });
                        });
                    try {
                        const uploadedFile = await uploadToCloudinary(binaryImage, 'default');
                        console.log('uploadedFile', uploadedFile);
                        const payload = {
                                file_path: uploadedFile.url,
                                file_type: uploadedFile.mime,
                                file_size: uploadedFile.size.toString(),
                                type_id: 'pkw7l5p5gd4e70uy5bvgpnpv',
                        };
                        const response = await createMedia(payload, token);
                        console.log('response', response);
                        const payloadPostMedia = {
                                post_id: postId,
                                media_id: response.data.data.documentId,
                        };
                        await createPostMedia(payloadPostMedia, token);
                    } catch (error) {
                        console.error('Error adding image:', error?.response || error);
                    }
                }
            }
            if (formData?.selectedTags?.length) {
                for (const tag of formData.selectedTags) {
                    const payload = {
                            post_id: postId,
                            tag_id: tag,
                    };
                    try {
                        await apiCreatePostTag(payload, token);
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
