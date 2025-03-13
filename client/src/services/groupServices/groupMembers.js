import axiosConfig from "../../axiosConfig";

export const apiGetGroupMembers = ({ groupId }) =>
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
                url: `/group-members?filters[$and][0][group_id][documentId][$eq]=${groupId}&populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });


export const apiGetGroupMembersUser = ({ groupId, userId }) =>
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
                url: `/group-members?filters[$and][0][group_id][documentId][$eq]=${groupId}&filters[$and][1][users_id][documentId][$eq]=${userId}&populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });





export const apiCreateMemberGroup = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/group-members",
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            resolve(response);
        } catch (error) {
            console.error("Error creating member group:", error);
            reject(error);
        }
    });