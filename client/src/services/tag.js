import axiosConfig from "../axiosConfig";

export const apiGetPostTag = ({ postId }) =>
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
        url: `/post-tags?filters[$and][0][post_id][documentId][$eq]=${postId}&populate=*`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const apiGetDocumentTag = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/post-tags?filters[$and][0][document_share_id][documentId][$eq]=${documentId}&populate=*`,
      });
      resolve(response);
    } catch (error) {
      console.error("Error fetching document tags:", error.response || error);
      reject(error);
    }
  });

export const apiGetTagPage = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/post-tags?filters[$and][0][page_id][documentId][$eq]=${documentId}&populate=*`,
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
        url: "/tags??pagination[pageSize]=10&pagination[page]=1&populate=*&sort=createdAt:DESC",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiCreatePostTag = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/post-tags",
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
};

export const apiEditPostTag = ({ documentId, payload }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/post-tags/${documentId}`,
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
}

export const apiDeletePostTag = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/post-tags/${documentId}`,
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