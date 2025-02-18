import axiosConfig from "../axiosConfig";

export const apiGetParticipantByUser = ({ userId }) =>
    new Promise(async (resolve, reject) => {
      try {
        // Kiểm tra groupId trước khi dùng trong URL
        if (typeof userId !== "string") {
          //console.error("Invalid groupId:", groupId);
          return reject(new Error("groupId should be a string"));
        }
  
        //console.log("Fetching group members for groupId:", groupId);
  
        // Gọi API với URL đã được truyền đúng groupId
        const response = await axiosConfig({
          method: "get",
          url: `/conversation-participants?filters[$and][0][user_id][documentId][$eq]=${userId}&populate=*`,
        });
        //console.log("Response:", response); // Log ra chi tiết phản hồi
        resolve(response);
      } catch (error) {
        console.error("Error fetching group members:", error.response || error);
        reject(error);
      }
    });
  