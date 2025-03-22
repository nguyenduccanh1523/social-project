import axiosConfig from "../axiosConfig";

export const apiGetMessage = async ({ conversationId, pageParam = 1 }) => {
  try {
    const response = await axiosConfig({
      method: "get",
      url: `/messages?filters[$and][0][conversation_id][documentId][$eq]=${conversationId}&sort=createdAt%3ADESC&pagination[page]=${pageParam}&pagination[pageSize]=10&populate=*`,
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
        url: "/messages",
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
