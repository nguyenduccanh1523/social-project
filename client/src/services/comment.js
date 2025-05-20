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

export const apiUpdatePostReaction = ({ documentId, payload, token }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/reactions/${documentId}`,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Update Reaction response:", response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const apiDeletePostReaction = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/reactions/${documentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Delete Reaction response:", response);
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const apiGetPostUser = ({ postId, userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/reactions?pagination[pageSize]=10&pagination[page]=1&populate=*&sort=createdAt:DESC&postId=${postId}&userId=${userId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPostComment = ({ postId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/comments?pagination[pageSize]=20&pagination[page]=1&populate=*&post_id=${postId}&sort=createdAt:DESC`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPostCommentParent = ({ parentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/comments?pagination[pageSize]=20&pagination[page]=1&populate=*&parent_id=${parentId}&sort=createdAt:ASC`,
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
