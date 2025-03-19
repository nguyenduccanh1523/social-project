import axiosConfig from "../axiosConfig";


export const apiGetDocumentComment = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/cmt-documents?populate=*&sort=createdAt:DESC&filters[$and][0][document_share][documentId][$eq]=${documentId}&filters[$and][1][parent_id][documentId][$null]=true`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetDocumentCommentParent = ({ documentId, parentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/cmt-documents?populate=*&sort=createdAt:ASC&filters[$and][0][document_share][documentId][$eq]=${documentId}&filters[$and][1][parent_id][documentId][$eq]=${parentId}`,
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

export const apiUpdateDocumentComment = ({ documentId, payload }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/cmt-documents/${documentId}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      //console.log("Update Comment response:", response);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const apiDeleteDocumentComment = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/cmt-documents/${documentId}`,
      });
      //console.log("Delete Comment response:", response);
      resolve(response);
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });