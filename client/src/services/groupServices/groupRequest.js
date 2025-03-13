import axiosConfig from "../../axiosConfig";

export const apiGetGroupRequest = ({ groupId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/group-resquests?filters[$and][0][group_id][documentId][$eq]=${groupId}&populate=*&filters[$and][1][status_action][documentId][$eq]=w1t6ex59sh5auezhau5e2ovu&sort=createdAt:DESC`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });

export const apiGetGroupRequestUser = ({ groupId, userId }) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/group-resquests?filters[$and][0][group_id][documentId][$eq]=${groupId}&filters[$and][1][user_request][documentId][$eq]=${userId}&filters[$and][2][status_action][documentId][$eq]=w1t6ex59sh5auezhau5e2ovu&populate=*&sort=createdAt:DESC`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });
}


export const apiCheckGroupRequestUser = ({ groupId, userId }) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/group-resquests?filters[$and][0][group_id][documentId][$eq]=${groupId}&filters[$and][1][user_request][documentId][$eq]=${userId}&populate=*&sort=createdAt:DESC`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });
}



export const apiCreateGroupRequest = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/group-resquests",
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiUpdateGroupRequest = ({ documentId, payload }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/group-resquests/${documentId}`,
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
