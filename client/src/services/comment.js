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

export const apiCreatePostReaction = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/reactions",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Post Reaction response:", response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const apiUpdatePostReaction = ({ documentId, payload }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/reactions/${documentId}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Update Reaction response:", response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

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

export const apiGetPostUser = ({ postId, userId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/reactions?populate=*&filters[$and][0][user_id][documentId][$eq]=${userId}&filters[$and][1][post_id][documentId][$eq]=${postId}`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPostComment = ({ postId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/comments?populate=*&sort=createdAt:DESC&filters[$and][0][post_id][documentId][$eq]=${postId}&filters[$and][1][parent_id][documentId][$null]=true`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPostCommentParent = ({ postId, parentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/comments?populate=*&sort=createdAt:ASC&filters[$and][0][post_id][documentId][$eq]=${postId}&filters[$and][1][parent_id][documentId][$eq]=${parentId}`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiCreatePostComment = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/comments",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      //console.log("Post Comment response:", response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const apiUpdatePostComment = ({ documentId, payload }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/comments/${documentId}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      //console.log("Update Comment response:", response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const apiDeletePostComment = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/comments/${documentId}`,
      });
      //console.log("Delete Comment response:", response);
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });
