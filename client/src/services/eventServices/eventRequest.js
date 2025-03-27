import axiosConfig from "../../axiosConfig";

export const apiGetEventRequest = ({ eventId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-requests?filters[$and][0][event_id][documentId][$eq]=${eventId}&populate=*&filters[$and][1][request_status][documentId][$eq]=w1t6ex59sh5auezhau5e2ovu&sort=createdAt:DESC`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });

export const apiGetEventRequestUser = ({ eventId, userId }) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-requests?filters[$and][0][event_id][documentId][$eq]=${eventId}&filters[$and][1][user_request][documentId][$eq]=${userId}&filters[$and][2][request_status][documentId][$eq]=w1t6ex59sh5auezhau5e2ovu&populate=*&sort=createdAt:DESC`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });
}


export const apiCheckEventRequestUser = ({ eventId, userId }) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-requests?filters[$and][0][event_id][documentId][$eq]=${eventId}&filters[$and][1][user_request][documentId][$eq]=${userId}&populate=*&sort=createdAt:DESC`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });
}



export const apiCreateEventRequest = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/event-requests",
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiUpdateEventRequest = ({ documentId, payload }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/event-requests/${documentId}`,
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
