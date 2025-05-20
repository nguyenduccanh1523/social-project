/* eslint-disable no-undef */
// PostItem.js
import React from "react";

import { useQuery } from '@tanstack/react-query'

import Card from "../../../../components/Card";
import Loader from "../../icons/uiverse/Loading";
 
import { apiGetPostByUserId } from "../../../../services/user";
import CardPost from "../Share/cardPost";
import { useSelector } from "react-redux";


const PostProfile = ({ userId }) => {
    const { token } = useSelector((state) => state.root.auth || {});
    const { data: post, error, isLoading } = useQuery({
        queryKey: ['post', userId],
        queryFn: () => apiGetPostByUserId({ userId: userId?.documentId, token }),
        enabled: !!userId,
    });
    const postData = post?.data?.data || [];

    if (isLoading) return <Loader />;
    if (error) return <p>Error fetching post: {error.message}</p>;
    if (!postData.length) return <h2 style={{textAlign: 'center'}}>There are no posts yet.</h2>;
    

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

