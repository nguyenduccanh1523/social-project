import axiosConfig from "../axiosConfig";

export const apiGetMessage = ({ conversationId, pageParam = 1 }) =>
  new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra groupId trước khi dùng trong URL
      if (typeof conversationId !== "string") {
        //console.error("Invalid groupId:", groupId);
        return reject(new Error("groupId should be a string"));
      }

      //console.log("Fetching group members for groupId:", groupId);

      // Gọi API với URL đã được truyền đúng groupId
      const response = await axiosConfig({
        method: "get",
        url: `/messages?filters[$and][0][conversation_id][documentId][$eq]=${conversationId}&sort=createdAt%3ADESC&pagination[page]=${pageParam}&pagination[pageSize]=10&populate=*`,
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve({
        data: response?.data?.data,
        hasNextPage: response?.data?.meta?.pagination?.pageCount > pageParam,
        pageParam: pageParam,  // Thêm pageParam vào kết quả trả về
      });
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

  export const apiCreateMessager = (payload) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: "post",
          url: "/messages",
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