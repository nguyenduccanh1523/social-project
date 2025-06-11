import axiosConfig from "../axiosConfig";

export const apiGetPostTag = ({ postId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra groupId trước khi dùng trong URL
      if (typeof postId !== "string") {
        //console.error("Invalid groupId:", groupId);
        return reject(new Error("groupId should be a string"));
      }

      //console.log("Fetching group members for groupId:", groupId);

      // Gọi API với URL đã được truyền đúng groupId
      const response = await axiosConfig({
        method: "get",
        url: `/post-tags?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&postId=${postId}`,
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

export const apiGetDocumentTag = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/post-tags?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&document_share_id=${documentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      console.error("Error fetching document tags:", error.response || error);
      reject(error);
    }
  });

export const apiGetTagPage = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/post-tags?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&pageId=${documentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      console.error("Error fetching document tags:", error.response || error);
      reject(error);
    }
  });

export const apiGetTag = ({ token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/tags?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiCreatePostTag = (payload, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/post-tags",
        data: payload,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const apiEditPostTag = ({ documentId, payload, token }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/post-tags/${documentId}`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

export const apiDeletePostTag = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/post-tags/${documentId}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      console.error("Error deleting post tag:", error.response || error);
      reject(error);
    }
  });

export const apiGetPageTag = ({ tagId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/post-tags/by-tag/${tagId}?fields=page_id,createdAt&pageIdNotNull=true&includePage=true`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
});