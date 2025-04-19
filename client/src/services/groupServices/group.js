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



export const apiCreateGroupInvited = ({ payload, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/group-invitations",
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


export const apiGetGroupInvationFriend = ({ groupId, userId, friendId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/group-invitations?populate=*&sort=createdAt:DESC&invitedBy=${userId}&group_id=${groupId}&invitedTo=${friendId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });




export const apiEditGroupInvited = ({ documentId, payload, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/group-invitations/${documentId}/respond`,
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


export const apiCreateGroup = ({ payload, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/groups",
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





//check friend invited group
export const apiGetGroupFriend = ({ groupId, friendId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/group-members?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${friendId}&groupId=${groupId}`,
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






