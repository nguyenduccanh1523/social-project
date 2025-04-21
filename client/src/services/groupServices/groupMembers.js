import axiosConfig from "../../axiosConfig";

export const apiGetGroupMembers = ({ groupId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/group-members?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&groupId=${groupId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });


export const apiGetGroupMembersUser = ({ groupId, userId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            
            const response = await axiosConfig({
                method: "get",
                url: `/group-members?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&groupId=${groupId}&userId=${userId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });





export const apiCreateMemberGroup = ({payload, token}) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/group-members/",
                data: payload,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            console.error("Error creating member group:", error);
            reject(error);
        }
    });

export const apiDeleteMemberGroup = ({ id, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "delete",
                url: `/group-members/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            console.error("Error deleting member group:", error);
            reject(error);
        }
    });