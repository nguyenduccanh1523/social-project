import axiosConfig from "../axiosConfig";

export const apiGetGroupNotification = ({ groupId, userId }) =>
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
                url: `/notification-settings?filters[$and][0][users_permissions_user][documentId][$eq]=${userId}&filters[$and][1][group][documentId][$eq]=${groupId}&populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });

export const apiEditGroupNotification = ({ documentId, payload }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/notification-settings/${documentId}`,
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
