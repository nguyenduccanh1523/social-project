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


export const apiCreatePostReaction = (payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/reactions",
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Post Reaction response:", response);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const apiUpdatePostReaction = ({documentId, payload}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/reactions/${documentId}`,
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Update Reaction response:", response);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const apiDeletePostReaction = ({ documentId }) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: "delete",
          url: `/reactions/${documentId}`,
        });
        console.log("Delete Reaction response:", response);
        resolve(response);
      } catch (error) {
        console.error("Error fetching group members:", error.response || error);
        reject(error);
      }
    });
  

