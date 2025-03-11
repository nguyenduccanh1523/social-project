import React, { useState } from 'react';
import { Button, notification } from 'antd'; // Updated import
import { apiUpdatePost } from '../../../../../services/post';
import { apiCreatePostTag, apiDeletePostTag, apiGetPostTag } from '../../../../../services/tag';
import { uploadToMediaLibrary, createMedia, createPostMedia, apiGetPostMedia, apiDeletePostMeida } from '../../../../../services/media';
import { apiCreatePostFriend, apiDeletePostFriend, apiGetPostFriend } from '../../../../../services/friend';
import { useQueryClient, useQuery } from '@tanstack/react-query';

const ButtonEdit = ({ post, profile, formData, page, group, handleClose, onPostCreated = () => { } }) => {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const { data: postTags } = useQuery({
        queryKey: ['postTags', post?.documentId],
        queryFn: () => apiGetPostTag({ postId: post?.documentId }),
        enabled: !!post?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const { data: postFriends } = useQuery({
        queryKey: ['postFriends', post?.documentId],
        queryFn: () => apiGetPostFriend({ postId: post?.documentId }),
        enabled: !!post?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const { data: postMedias } = useQuery({
        queryKey: ['postMedias', post?.documentId],
        queryFn: () => apiGetPostMedia({ postId: post?.documentId }),
        enabled: !!post?.documentId,
        staleTime: 600000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log('Form data:', formData);
        // console.log('Profile:', profile);
        // console.log('Page:', page);
        // console.log('Group:', group);
        // console.log('Post:', post);

        let postEdit = null;

        if (profile && !page && !group) {
            console.log('Case 1 ')
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
            console.log('Post ID:', postId);
            console.log('Form data:', formData?.selectedImages);
            console.log('Post Media:', postMedias?.data?.data);

            if (formData?.selectedImages?.length) {
                const existingMedias = postMedias?.data?.data || [];
                const selectedMedias = formData?.selectedImages || [];

                for (const mediaId of selectedMedias) {
                    if (!existingMedias.some(item => item?.media?.file_path === mediaId)) {
                        const image = mediaId;
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

                // Delete old media
                for (const item of existingMedias) {
                    if (!selectedMedias.includes(item?.media?.file_path)) {
                        try {
                            await apiDeletePostMeida({ documentId: item?.documentId });
                        } catch (error) {
                            console.error('Error deleting media:', error);
                        }
                    }
                }
            }



            if (formData?.selectedFriends?.length) {
                // Handle post friends
                const existingFriends = postFriends?.data?.data || [];
                const selectedFriendIds = formData?.selectedFriends || [];

                // Create new friends
                for (const friendId of selectedFriendIds) {
                    if (!existingFriends.some(item => item?.users_permissions_user?.documentId === friendId)) {
                        const payload = {
                            data: {
                                post: postId,
                                users_permissions_user: friendId,
                            }
                        };
                        try {
                            await apiCreatePostFriend(payload);
                        } catch (error) {
                            console.error('Error adding friend:', error);
                        }
                    }
                }

                // Delete old friends
                for (const item of existingFriends) {
                    if (!selectedFriendIds.includes(item?.users_permissions_user?.documentId)) {
                        try {
                            await apiDeletePostFriend({ documentId: item?.documentId });
                        } catch (error) {
                            console.error('Error deleting friend:', error);
                        }
                    }
                }
            }
            if (formData?.selectedTags?.length) {
                const existingTags = postTags?.data?.data || [];
                const selectedTagIds = formData?.selectedTags || [];

                console.log('Existing Tags:', existingTags);
                console.log('Selected Tag IDs:', selectedTagIds);

                // Create new tags
                for (const tagId of selectedTagIds) {
                    if (!existingTags.some(item => item?.tag_id?.documentId === tagId)) {
                        const payload = {
                            data: {
                                post_id: postId,
                                tag_id: tagId,
                            }
                        };
                        try {
                            await apiCreatePostTag(payload);
                        } catch (error) {
                            console.error('Error adding tag:', error);
                        }
                    }
                }

                // Delete old tags
                for (const item of existingTags) {
                    if (!selectedTagIds.includes(item?.tag_id?.documentId)) {
                        try {
                            await apiDeletePostTag({ documentId: item?.documentId });
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
            onPostCreated(post); // Callback to update the post list


            setLoading(false);
        };
    }

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
