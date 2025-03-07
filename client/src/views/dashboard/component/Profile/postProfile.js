/* eslint-disable no-undef */
// PostItem.js
import React from "react";

import { useQuery } from '@tanstack/react-query'

import Card from "../../../../components/Card";
 
import { apiGetPostByUserId } from "../../../../services/user";
import CardPost from "../Share/cardPost";


const PostProfile = ({ userId }) => {
    const { data: post, error, isLoading } = useQuery({
        queryKey: ['post', userId],
        queryFn: () => apiGetPostByUserId({ userId: userId?.documentId }),
        enabled: !!userId,
    });
    const postData = post?.data?.data || [];

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching post: {error.message}</p>;
    

    return (
        <>
            {postData.map((post, index) => (
            <Card className="card-block card-stretch card-height" key={index}>
                <CardPost post={post} />
            </Card>
            ))}
        </>
    )
}




export default PostProfile;

