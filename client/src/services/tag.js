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
      // Kiểm tra documentId trước khi dùng trong URL
      if (typeof documentId !== "string") {
        return reject(new Error("documentId should be a string"));
      }

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

export const apiGetTag = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/tags?populate=*",
        data: payload,
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
          'Content-Type': 'application/json'
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

