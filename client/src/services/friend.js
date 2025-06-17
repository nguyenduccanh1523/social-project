import axiosConfig from "../axiosConfig";

export const apiGetFriendAccepted = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/friends?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${documentId}&statusId=vr8ygnd5y17xs4vcq6du3q7c`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetUserById = ({ userId, token }) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'get',
      url: `/users/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
});

export const apiCreateFriendStatus = (payload, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: `/friends`, // Sử dụng `friendId` chính xác trong URL
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUpdateFriendStatus = ({ friendId, status_action_id, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/friends/${friendId}?populate=*`, // Sử dụng `friendId` chính xác trong URL
        data: {
          status_action_id,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetFriendsByDate = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/friends?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${documentId}&statusId=vr8ygnd5y17xs4vcq6du3q7c&lastSevenDays=true`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetFriendRequest = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/friends?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${documentId}&statusId=w1t6ex59sh5auezhau5e2ovu`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetCheckFriendRequest = ({ documentId, userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/friends?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}&friendId=${documentId}&statusId=w1t6ex59sh5auezhau5e2ovu`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetFriendSent = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/friends?filters[$or][0][user_id][documentId][$eq]=${documentId}&filters[$and][0][status_type][$eq]=pending&populate=*&pagination[pageSize]=100&pagination[page]=1`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetFriendMore = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url:
          `/friends/non-friends?populate=*&sort=createdAt:DESC&userId=${documentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiCreatePostFriend = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/post-friends",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetPostFriend = ({ postId, token }) =>
  new Promise(async (resolve, reject) => {
    try {

      const response = await axiosConfig({
        method: "get",
        url: `/post-friends?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&postId=${postId}`,
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


export const apiDeletePostFriend = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/post-friends/${documentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      console.error("Error deleting post friend:", error.response || error);
      reject(error);
    }
  });
