import axiosConfig from "../axiosConfig";

export const apiGetPostLike = ({ documentId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/reactions/${documentId}?populate=*`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiGetPostComment = ({ documentId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/comments/${documentId}?populate=*`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    }); 