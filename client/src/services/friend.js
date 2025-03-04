import axiosConfig from "../axiosConfig";

export const apiGetFriendAccepted = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/friends?filters[$or][0][user_id][documentId][$eq]=${documentId}&filters[$or][1][friend_id][documentId][$eq]=${documentId}&filters[$and][0][status_type][$eq]=accepted&populate=*&pagination[pageSize]=100&pagination[page]=1`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUpdateFriendStatus = ({ friendId, status_type }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/friends/${friendId}?populate=*`, // Sử dụng `friendId` chính xác trong URL
        data: {
          data: {
            status_type,
          },
        },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetFriendsByDate = (documentId, daysAgo = 7) =>
  new Promise(async (resolve, reject) => {
    try {
      const today = new Date();
      const pastDate = new Date(
        today.setDate(today.getDate() - daysAgo)
      ).toISOString(); // Tính ngày cách đây `daysAgo`

      const response = await axiosConfig.get(
        `/friends?filters[$or][0][user_id][documentId][$eq]=${documentId}&filters[$or][1][friend_id][documentId][$eq]=${documentId}&filters[$and][0][status_type][$eq]=accepted&filters[updatedAt][$gte]=${pastDate}&populate=*`
      );

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetFriendRequest = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/friends?filters[$or][1][friend_id][documentId][$eq]=${documentId}&filters[$and][0][status_type][$eq]=pending&populate=*&pagination[pageSize]=100&pagination[page]=1`,
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

export const apiGetFriendMore = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url:
          `/friends?populate=*` +
          `&filters[$and][0][friend_id][documentId][$ne]=${documentId}` +
          `&filters[$and][1][user_id][documentId][$ne]=${documentId}` +
          `&pagination[pageSize]=100&pagination[page]=1`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
