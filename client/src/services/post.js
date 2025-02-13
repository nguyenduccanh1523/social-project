import axiosConfig from "../axiosConfig";

export const apiGetGroupPost = ({ groupId }) =>
    new Promise(async (resolve, reject) => {
      try {
        // Kiểm tra groupId trước khi dùng trong URL
        if (typeof groupId !== "string") {
          //console.error("Invalid groupId:", groupId);
          return reject(new Error("groupId should be a string"));
        }
  
        //console.log("Fetching group members for groupId:", groupId);
  
        // Gọi API với URL đã được truyền đúng groupId
        const response = await axiosConfig({
          method: "get",
          url: `/posts?filters[$and][0][group][documentId][$eq]=${groupId}&populate=*`,
        });
        //console.log("Response:", response); // Log ra chi tiết phản hồi
        resolve(response);
      } catch (error) {
        console.error("Error fetching group members:", error.response || error);
        reject(error);
      }
    });