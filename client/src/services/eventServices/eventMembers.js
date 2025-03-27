import axiosConfig from "../../axiosConfig";



export const apiGetEventMembersUser = ({ eventId, userId }) =>
    new Promise(async (resolve, reject) => {
        try {
            
            const response = await axiosConfig({
                method: "get",
                url: `/event-members?filters[$and][0][event_id][documentId][$eq]=${eventId}&filters[$and][1][user_id][documentId][$eq]=${userId}&populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });


export const apiCreateMemberEvent = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/event-members",
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