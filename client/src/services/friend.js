import axiosConfig from "../axiosConfig";

export const apiGetFriendAccepted = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/friends?filters[$or][0][user_id][documentId][$eq]=${documentId}&filters[$or][1][friend_id][documentId][$eq]=${documentId}&filters[$and][0][status_type][$eq]=accepted&populate=*`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
});

export const apiUpdateFriendStatus = (friendId, statusType) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Thực hiện PUT request với axios
        const response = await axiosConfig({
          method: "PUT",
          url: `/friends/${friendId}?populate=*`,
          data: {
            data: {
              status_type: statusType, // Truyền status_type mà bạn muốn cập nhật
            },
          },
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
};


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
          url: `/friends?filters[$or][1][friend_id][documentId][$eq]=${documentId}&filters[$and][0][status_type][$eq]=pending&populate=*`,
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
          url: `/friends?filters[$or][0][user_id][documentId][$eq]=${documentId}&filters[$and][0][status_type][$eq]=pending&populate=*`,
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
});

