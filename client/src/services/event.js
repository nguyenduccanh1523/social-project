import axiosConfig from "../axiosConfig";

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






