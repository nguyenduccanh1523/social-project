import axiosConfig from "../axiosConfig";

export const apiGetMessage = async ({ conversationId, pageParam = 1, token }) => {
  try {
    const response = await axiosConfig({
      method: "get",
      url: `/messagers?pagination[pageSize]=10&pagination[page]=${pageParam}&populate=*&sort=createdAt:DESC&conversationId=${conversationId}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      data: response.data,
      nextPage: pageParam + 1,
      hasNextPage:
        pageParam < response.data.meta.pagination.pageCount, // ✅ chuẩn xác
    };
  } catch (error) {
    console.error("Error fetching messages:", error.response || error);
    throw error;
  }
};

export const apiCreateMessager = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/messagers",
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

  export const apiUpdateMessager = ({ documentId, payload, token }) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: "put",
          url: `/messagers/${documentId}`,
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
  
  export const apiDeleteMessager = ({ documentId, token }) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: "delete",
          url: `/messagers/${documentId}`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });

    export const apiMarkAsRead = ({  payload, token }) =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await axiosConfig({
            method: "post",
            url: `/messagers/mark-as-read`,
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


