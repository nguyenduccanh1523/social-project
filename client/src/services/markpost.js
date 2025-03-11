import axiosConfig from "../axiosConfig";

export const apiGetMarkPost = ({ userId }) =>
  new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra groupId trước khi dùng trong URL
      if (typeof userId !== "string") {
        //console.error("Invalid groupId:", groupId);
        return reject(new Error("groupId should be a string"));
      }

      //console.log("Fetching group members for groupId:", groupId);

      // Gọi API với URL đã được truyền đúng groupId
      const response = await axiosConfig({
        method: "get",
        url: `/mark-posts?populate=*&filters[$and][0][user_id][documentId][$eq]=${userId}&filters[$and][1][post_id][id][$notNull]=true&pagination[pageSize]=100&pagination[page]=1&sort=id%3ADESC`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }   
  });

export const apiGetMarkBlog = ({ userId }) =>
  new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra groupId trước khi dùng trong URL
      if (typeof userId !== "string") {
        //console.error("Invalid groupId:", groupId);
        return reject(new Error("groupId should be a string"));
      }

      //console.log("Fetching group members for groupId:", groupId);

      // Gọi API với URL đã được truyền đúng groupId    
      const response = await axiosConfig({
        method: "get",
        url: `/mark-posts?populate=*&filters[$and][0][user_id][documentId][$eq]=${userId}&filters[$and][1][document_share][id][$notNull]=true&pagination[pageSize]=100&pagination[page]=1&sort=id%3ADESC`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
});

export const apiDeleteMarkPost = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/mark-posts/${documentId}`,
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


export const apiGetCheckMarkPost = ({ postId, userId }) =>
  new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra groupId trước khi dùng trong URL
      if (typeof postId !== "string") {
        //console.error("Invalid groupId:", groupId);
        return reject(new Error("groupId should be a string"));
      }

      // Gọi API với URL đã được truyền đúng groupId
      const response = await axiosConfig({
        method: "get",
        url: `/mark-posts?populate=*&filters[$and][0][post_id][documentId][$eq]=${postId}&filters[$and][1][user_id][documentId][$eq]=${userId}&sort=id%3ADESC`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }   
  });