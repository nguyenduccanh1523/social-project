import axiosConfig from "../../axiosConfig";

export const apiGetEvent = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: "/events?populate=*&pagination[pageSize]=100&pagination[page]=1",
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiGetEventUser = ({ userId }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra documentId trước khi dùng trong URL
            if (typeof userId !== "string") {
                return reject(new Error("userId should be a string"));
            }

            const response = await axiosConfig({
                method: "get",
                url: `/event-members?populate=*&pagination[pageSize]=100&pagination[page]=1&filters[$and][0][user_id][documentId][$eq]=${userId}`,
            });
            resolve(response);
        } catch (error) {
            console.error("Error fetching document tags:", error.response || error);
            reject(error);
        }
    });

export const apiGetEventUserCreate = ({ userId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/events?populate=*&pagination[pageSize]=100&pagination[page]=1&filters[$and][0][host_id][documentId][$eq]=${userId}`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiGetEventDetail = ({ eventId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/events/${eventId}?populate=*`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiGetEventMember = ({ eventId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-members?populate=*&pagination[pageSize]=100&pagination[page]=1&filters[$and][0][event_id][documentId][$eq]=${eventId}`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });


export const apiGetEventFriend = ({ eventId, friendId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-members?filters[$and][0][event_id][documentId][$eq]=${eventId}&filters[$and][1][user_id][documentId][$eq]=${friendId}&populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });

export const apiCreateEventInvited = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/event-invitations",
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });


export const apiEditEventInvited = ({ documentId, payload }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/event-invitations/${documentId}`,
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });


export const apiGetEventInvationFriend = ({ eventId, userId, friendId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-invitations?filters[$and][0][event_id][documentId][$eq]=${eventId}&filters[$and][1][invited_by][documentId][$eq]=${userId}&filters[$and][2][invited_to][documentId][$eq]=${friendId}&populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });

export const apiCreateEvent = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/events",
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });


export const apiEditEvent = ({ documentId, payload }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/events/${documentId}`,
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiDeleteEvent = ({ documentId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "delete",
                url: `/events/${documentId}`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

