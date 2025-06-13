import axiosConfig from "../axiosConfig";

export const apiGetParticipantByUser = ({ userId, token }) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: "get",
          url: `/participants?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}`,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        //console.log("Response:", response); // Log ra chi tiết phản hồi
        resolve(response);
      } catch (error) {
        console.error("Error fetching group members:", error.response || error);
        reject(error);
      }
    });
  