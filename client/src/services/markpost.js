import axiosConfig from "../axiosConfig";

export const apiGetMarkPost = ({ userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
    
      const response = await axiosConfig({
        method: "get",
        url: `/mark-posts?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}&postIdFilter=true`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const apiGetMarkBlog = ({ userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {  
      const response = await axiosConfig({
        method: "get",
        url: `/mark-posts?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}&documentShareIdFilter=true`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const apiDeleteMarkPost = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/mark-posts/${documentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      console.error("Error deleting marked post:", error.response || error);
      reject(error);
    }
  });

export const apiCreateMarkPost = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/mark-posts",
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


export const apiGetCheckMarkPost = ({ postId, userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      
      const response = await axiosConfig({
        method: "get",
        url: `/mark-posts?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}&postId=${postId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const apiGetCheckMarkDocument = ({ documentId, userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      // Gọi API với URL đã được truyền đúng groupId
      const response = await axiosConfig({
        method: "get",
        url: `/mark-posts?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}&documentShareId=${documentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });