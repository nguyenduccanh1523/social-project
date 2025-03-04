import axiosConfig from "../axiosConfig";

export const apiGetGroupPost = ({ groupId }) =>
  new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra groupId trước khi dùng trong URL
      if (typeof groupId !== "string") {
        //console.error("Invalid groupId:", groupId);
        return reject(new Error("groupId should be a string"));
      }

      //console.log("Fetching group members for groupId:", groupId);

      // Gọi API với URL đã được truyền đúng groupId
      const response = await axiosConfig({
        method: "get",
        url: `/posts?filters[$and][0][group][documentId][$eq]=${groupId}&populate=*`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const apiGetPostByUserId = ({ userId }) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        return reject(new Error("userId is required"));
      }

      const response = await axiosConfig({
        method: "get",
        url: `/posts?filters[$and][0][user_id][documentId][$eq]=${userId}&populate=*`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

// export const apiGetPostByFriendId = ({ friendId }) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await axiosConfig({
//         method: "get",
//         url: `/posts?filters[$and][0][user_id][documentId][$eq]=${friendId}&populate=*`,
//       });
//       resolve(response);
//     } catch (error) {
//       reject(error);
//     }
//   }); 

// export const apiGetPostByPage = (payload) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await axiosConfig({
//         method: "get",
//         url: `/posts?&pagination[pageSize]=100&sort=createdAt:DESC&filters[$and][0][page][documentId][$notNull]=true&populate=*`,
//         data: payload,
//       });
//       resolve(response);
//     } catch (error) {
//       reject(error);
//     }
//   });

// export const getAllPostsRemaining = (payload) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await axiosConfig({
//         method: "get",
//         url: `/posts?pagination[pageSize]=100&sort=createdAt:DESC&filters[$and][0][page][documentId][$null]=true&filters[$and][1][group][documentId][$null]=true&populate=*`,
//         data: payload,
//       });
//       resolve(response)
//     } catch (error) {
//       reject(error);
//     }
//   });

export const getAllPosts = ({ page }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/posts?pagination[pageSize]=10&pagination[page]=${page}&populate=*`,
      }); 
      resolve(response)
    } catch (error) {
      reject(error);
    }
  });

  export const apiGetPostDetail = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/posts/${documentId}?populate=*`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  }); 








