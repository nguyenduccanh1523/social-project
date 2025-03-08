import React from "react";
import { Dropdown } from "react-bootstrap";
import { useQuery } from '@tanstack/react-query';
import { apiGetPostComment, apiGetPostLike } from "../../../../services/comment";

const ListLike = ({ listLike }) => {
    const { data: likesData, isLoading: isLikesLoading } = useQuery({
        queryKey: ['likesData', listLike],
        queryFn: async () => {
            const data = await Promise.all(
                listLike.map((like) => apiGetPostLike({ documentId: like.documentId }))
            );
            return data.map(response => response.data);
        },
        enabled: !!listLike.length,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    return (
        <Dropdown.Menu>
            {isLikesLoading ? (
                <Dropdown.Item href="#">
                    Loading...
                </Dropdown.Item>
            ) : likesData && likesData.length > 0 ? (
                likesData.map((like, index) => (
                    <Dropdown.Item key={index} href="#">
                        {like?.data?.user_id?.username}
                    </Dropdown.Item>
                ))
            ) : (
                <Dropdown.Item href="#">
                    No reactions
                </Dropdown.Item>
            )}
        </Dropdown.Menu>
    );
};

const ListComment = ({ listComment }) => {
    const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
        queryKey: ['commentsData', listComment],
        queryFn: async () => {
            const data = await Promise.all(
                listComment.map((comment) => apiGetPostComment({ documentId: comment.documentId }))
            );
            return data.map(response => response.data);
        },
        enabled: !!listComment.length,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    return (
        <Dropdown.Menu>
            {isCommentsLoading ? (
                <Dropdown.Item href="#">
                    Loading...
                </Dropdown.Item>
            ) : commentsData && commentsData.length > 0 ? (
                commentsData.map((comment, index) => (
                    <Dropdown.Item key={index} href="#">
                        {comment?.data?.user_id?.username}
                    </Dropdown.Item>
                ))
            ) : (
                <Dropdown.Item href="#">
                    No comments
                </Dropdown.Item>
            )}
        </Dropdown.Menu>
    );
};

export { ListLike, ListComment };