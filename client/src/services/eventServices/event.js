import axiosConfig from "../../axiosConfig";

export const apiGetEvent = ({payload, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: "/events?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC",
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

export const apiGetEventUser = ({ userId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-members?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            console.error("Error fetching event user:", error.response || error);
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


export const apiGetEventFriend = ({ eventId, friendId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-members?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${friendId}&eventId=${eventId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });

export const apiCreateEventInvited = ({ payload, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/event-invitations",
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`,
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


export const apiGetEventInvationFriend = ({ eventId, userId, friendId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/event-invitations?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&eventId=${eventId}&invitedBy=${userId}&invitedTo=${friendId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            console.error("Error fetching event invitations:", error.response || error);
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

