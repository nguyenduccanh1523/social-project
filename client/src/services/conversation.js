import axiosConfig from "../axiosConfig";

export const apiGetConversation = ({ userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      
      const response = await axiosConfig({
        method: "get",
        url: `/conversations?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}&groupId=false`,
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

  export const apiGetConver = ({ documentId }) =>
    new Promise(async (resolve, reject) => {
      try {
        
        const response = await axiosConfig({
          method: "get",
          url: `/conversations/${documentId}?populate=*`,
        });
        //console.log("Response:", response); // Log ra chi tiết phản hồi
        resolve(response);
      } catch (error) {
        console.error("Error fetching group members:", error.response || error);
        reject(error);
      }
    });
