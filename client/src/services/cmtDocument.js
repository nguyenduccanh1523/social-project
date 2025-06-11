import axiosConfig from "../axiosConfig";


export const apiGetDocumentComment = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/cmt-documents?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&document_share_id=${documentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetDocumentCommentParent = ({ documentId, parentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/cmt-documents?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&document_share_id=${documentId}&parentId=${parentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiCreateDocumentComment = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/cmt-documents",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      //console.log("Post Comment response:", response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const apiUpdateDocumentComment = ({ documentId, payload, token }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/cmt-documents/${documentId}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      //console.log("Update Comment response:", response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const apiDeleteDocumentComment = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/cmt-documents/${documentId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //console.log("Delete Comment response:", response);
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });