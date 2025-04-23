import axiosConfig from "../../axiosConfig";

export const apiGetEventRequest = ({ eventId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-requests?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&statusId=w1t6ex59sh5auezhau5e2ovu&eventId=${eventId}`,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });

export const apiGetEventRequestUser = ({ eventId, userId, token }) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-requests?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}&eventId=${eventId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
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



export const apiCreateEventRequest = ({payload, token}) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/event-requests",
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiUpdateEventRequest = ({ documentId, payload, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/event-requests/${documentId}/respond`,
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiCancelEventRequest = ({ documentId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "delete",
                url: `/event-requests/${documentId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    }); 
