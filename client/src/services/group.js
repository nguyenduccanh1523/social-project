import axiosConfig from "../axiosConfig";

export const apiGetGroup = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/groups?populate=*",
        data: payload,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiFindOneGroup = ({ groupId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/groups/${groupId}?populate=*`, // Sử dụng `friendId` chính xác trong URL
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetGroupMembers = ({ groupId }) =>
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
        url: `/group-members?filters[$and][0][group_id][documentId][$eq]=${groupId}&populate=*`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const apiGetMyGroup = ({ userId }) =>
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
        url: `/group-members?filters[$and][0][users_id][documentId][$eq]=${userId}&populate=*`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const apiEditGroup = ({ documentId, payload }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/groups/${documentId}`,
        data: payload,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiCreateGroupInvited = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/group-invitations",
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });


export const apiGetGroupFriend = ({ groupId, friendId }) =>
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
        url: `/group-members?filters[$and][0][group_id][documentId][$eq]=${groupId}&filters[$and][1][users_id][documentId][$eq]=${friendId}&populate=*`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });
