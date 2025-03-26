import axiosConfig from "../axiosConfig";

export const apiGetStories = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: "/stories?populate=*&sort=createdAt:DESC&filters[$and][0][status_story][$eq]=active",
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiGetStoryByUser = ({ userId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/stories?populate=*&filters[$and][0][user_id][documentId][$eq]=${userId}&filters[$and][1][status_story][$eq]=active`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });


export const apiCreateStory = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/stories",
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiUpdateStory = ({ documentId, payload }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/stories/${documentId}`,
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiDeleteStory = ({ documentId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "delete",
                url: `/stories/${documentId}`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    }); 

    
