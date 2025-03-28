import axiosConfig from "../axiosConfig";

export const apiGetPostMedia = ({ postId }) =>
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
        url: `/post-medias?filters[$and][0][post_id][documentId][$eq]=${postId}&populate=*`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const uploadToMediaLibrary = ({ file }) =>
  new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append("files", file); // Ensure the key is "files"
      //console.log("FormData content:", formData.get("files"));

      const response = await axiosConfig({
        method: "post",
        url: "/upload",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //console.log("Upload response:", response);
      resolve(response);
    } catch (error) {
      console.error("Error uploading file:", error.response || error);
      reject(error);
    }
  });

export const createMedia = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/medias",
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      //console.log("Create Media response:", response);
      resolve(response);
    } catch (error) {
      console.error("Error creating media:", error.response || error);
      reject(error);
    }
  });

export const createPostMedia = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/post-medias",
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      //console.log("Create Media response:", response);
      resolve(response);
    } catch (error) {
      console.error("Error creating media:", error.response || error);
      reject(error);
    }
  });

  export const apiDeletePostMeida = ({ documentId }) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: "delete",
          url: `/post-medias/${documentId}`,
        });
        resolve(response);
      } catch (error) {
        console.error("Error deleting post tag:", error.response || error);
        reject(error);
      }
    });

    

export const apiPublicMedia = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/medias?populate=*&filters[$and][0][type][documentId][$eq]=elx6zlfz9ywp6esoyfi6a1yl`,
      });
      resolve(response);
    } catch (error) {
      console.error("Error deleting post tag:", error.response || error);
      reject(error);
    }
  });