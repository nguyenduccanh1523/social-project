import axiosConfig from "../../axiosConfig";

export const apiGetGroup = ({ token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/groups?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC",
        headers: {
          Authorization: `Bearer ${token}`
      }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiFindOneGroup = ({ groupId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/groups/${groupId}`, // Sử dụng `friendId` chính xác trong URL
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiMyAdminGroup = ({ userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/groups?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&adminId=${userId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });


export const apiGetMyGroup = ({ userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/group-members?pagination[pageSize]=100&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
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


export const apiGetGroupInvationFriend = ({ groupId, userId, friendId }) =>
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
        url: `/group-invitations?filters[$and][0][group_id][documentId][$eq]=${groupId}&filters[$and][1][invited_by][documentId][$eq]=${userId}&filters[$and][2][invited_to][documentId][$eq]=${friendId}&populate=*`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });




export const apiEditGroupInvited = ({ documentId, payload }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/group-invitations/${documentId}`,
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


export const apiCreateGroup = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/groups",
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





//check friend invited group
export const apiGetGroupFriend = ({ groupId, friendId }) =>
  new Promise(async (resolve, reject) => {
    try {
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






