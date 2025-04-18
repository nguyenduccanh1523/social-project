import axiosConfig from "../../axiosConfig";

export const apiGetGroupRequest = ({ groupId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/group-requests?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&groupId=${groupId}&statusId=w1t6ex59sh5auezhau5e2ovu`,
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

export const apiGetGroupRequestUser = ({ groupId, userId, token }) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/group-requests?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&groupId=${groupId}&userId=${userId}&statusId=w1t6ex59sh5auezhau5e2ovu`,
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
}


export const apiCheckGroupRequestUser = ({ groupId, userId, token }) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/group-requests?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&groupId=${groupId}&userId=${userId}`,
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
}



export const apiCreateGroupRequest = (payload, token) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/group-requests",
                data: payload,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiUpdateGroupRequest = ({ documentId, payload, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/group-requests/${documentId}/respond`,
                data: payload,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
