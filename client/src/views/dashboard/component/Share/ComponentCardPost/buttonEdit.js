import React, { useState } from 'react';
import { Button, notification } from 'antd'; // Updated import
import { apiUpdatePost } from '../../../../../services/post';
import { apiCreatePostTag, apiDeletePostTag, apiGetPostTag } from '../../../../../services/tag';
import { uploadToMediaLibrary, createMedia, createPostMedia, apiGetPostMedia, apiDeletePostMeida } from '../../../../../services/media';
import { apiCreatePostFriend, apiDeletePostFriend, apiGetPostFriend } from '../../../../../services/friend';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';


const ButtonEdit = ({ post, profile, formData, page, group, handleClose, onPostCreated = () => { } }) => {
    const { token } = useSelector((state) => state.root.auth || {});
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const { data: postTags } = useQuery({
        queryKey: ['postTags', post?.documentId || token],
        queryFn: () => apiGetPostTag({ postId: post?.documentId || token }),
        enabled: !!post?.documentId || !!token,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const { data: postFriends } = useQuery({
        queryKey: ['postFriends', post?.documentId || token],
        queryFn: () => apiGetPostFriend({ postId: post?.documentId || token }),
        enabled: !!post?.documentId || !!token,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const { data: postMedias } = useQuery({
        queryKey: ['postMedias', post?.documentId || token],
        queryFn: () => apiGetPostMedia({ postId: post?.documentId || token }),
        enabled: !!post?.documentId || !!token,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);

        let postEdit = null;

        if (profile && !page && !group) {
            const payload = {
                data: {
                    content: formData.inputText,
                    type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
                }
            };
            postEdit = await apiUpdatePost({ documentId: post.documentId, payload });
        }
        if (page && !profile && !group) {
            console.log('Case 2 ')
            // const payload = {
            //     data: {
            //         page: page.documentId,
            //         content: formData.inputText,
            //         type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
            //     }
            // };
            // post = await createPost(payload);
        }
        if (profile && group && !page) {
            console.log('Case 3')
            // const payload = {
            //     data: {
            //         user_id: profile.documentId,
            //         group: group.documentId,
            //         content: formData.inputText,
            //         type_id: formData?.visibility === 'public' ? 'elx6zlfz9ywp6esoyfi6a1yl' : 'pkw7l5p5gd4e70uy5bvgpnpv',
            //     }
            // };
            // post = await createPost(payload);
        }

        if (postEdit) {
            const postId = post.documentId;

            // Xử lý upload media mới
            if (formData?.selectedImages?.length) {
                const existingMedias = postMedias?.data?.data || [];
                const selectedMedias = formData?.selectedImages || [];

                for (const image of selectedMedias) {
                    if (!existingMedias.some(item => item?.media?.file_path === image.url)) {
                        // Upload image lên Cloudinary
                        const uploadToCloudinary = async (file, folder = "default") => {
                            const cloudName = 'dkjfmxxom';
                            const uploadPreset = 'react_upload';
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
                            const payload = {
                                file_path: uploadedFile.url,
                                file_type: uploadedFile.mime,
                                file_size: uploadedFile.size.toString(),
                                type_id: 'pkw7l5p5gd4e70uy5bvgpnpv',
                            };
                            const response = await createMedia(payload, token);
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
                // Xóa media cũ không còn trong selectedImages
                for (const item of existingMedias) {
                    if (!selectedMedias.some(img => img.url === item?.media?.file_path)) {
                        try {
                            await apiDeletePostMeida({ documentId: item?.documentId, token });
                        } catch (error) {
                            console.error('Error deleting media:', error);
                        }
                    }
                }
            }

            // Xử lý tag bạn bè
            if (formData?.selectedFriends?.length) {
                const existingFriends = postFriends?.data?.data || [];
                const selectedFriendIds = formData?.selectedFriends || [];
                // Thêm bạn bè mới
                for (const friendId of selectedFriendIds) {
                    if (!existingFriends.some(item => item?.user?.documentId === friendId)) {
                        const payload = {
                            post_id: postId,
                            user_id: friendId,
                        };
                        try {
                            await apiCreatePostFriend(payload, token);
                        } catch (error) {
                            console.error('Error adding friend:', error);
                        }
                    }
                }
                // Xóa bạn bè cũ không còn trong selectedFriends
                for (const item of existingFriends) {
                    if (!selectedFriendIds.includes(item?.user?.documentId)) {
                        try {
                            await apiDeletePostFriend({ documentId: item?.documentId, token });
                        } catch (error) {
                            console.error('Error deleting friend:', error);
                        }
                    }
                }
            }

            // Xử lý tag category
            if (formData?.selectedTags?.length) {
                const existingTags = postTags?.data?.data || [];
                const selectedTagIds = formData?.selectedTags || [];
                // Thêm tag mới
                for (const tagId of selectedTagIds) {
                    if (!existingTags.some(item => item?.tag?.documentId === tagId)) {
                        const payload = {
                            post_id: postId,
                            tag_id: tagId,
                        };
                        try {
                            await apiCreatePostTag(payload, token);
                        } catch (error) {
                            console.error('Error adding tag:', error);
                        }
                    }
                }
                // Xóa tag cũ không còn trong selectedTags
                for (const item of existingTags) {
                    if (!selectedTagIds.includes(item?.tag?.documentId)) {
                        try {
                            await apiDeletePostTag({ documentId: item?.documentId, token });
                        } catch (error) {
                            console.error('Error deleting tag:', error);
                        }
                    }
                }
            }

            notification.success({
                message: 'Post Updated',
                description: 'Your post has been updated successfully.',
            });
            handleClose();
            queryClient.invalidateQueries('post');
            onPostCreated(postEdit); // Callback to update the post list
            setLoading(false);
        }
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

export default ButtonEdit;
