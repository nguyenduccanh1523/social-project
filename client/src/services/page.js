import axiosConfig from "../axiosConfig";

export const apiGetPagesTags = ({ tagId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
    
            const response = await axiosConfig({
                method: "get",
                url: `/post-tags/by-tag/${tagId}?fields=page_id&createdAt&pageIdNotNull=true&includePage=true`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            console.error("Error fetching post tags:", error.response || error);
            reject(error);
        }
    });

export const apiGetPageDetail = ({ pageId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/pages/${pageId}?populate=*`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //console.log("Response from apiGetPageDetail:", response); // Log phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching page detail:", error.response || error);
            reject(error);
        }
    });

export const apiGetPageDetailTag = ({ pageId }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra groupId trước khi dùng trong URL
            if (typeof pageId !== "string") {
                //console.error("Invalid groupId:", groupId);
                return reject(new Error("pageId should be a string"));
            }

            //console.log("Fetching group members for groupId:", groupId);

            // Gọi API với URL đã được truyền đúng groupId
            const response = await axiosConfig({
                method: "get",
                url: `/pages?filters[$and][0][documentId][$eq]=${pageId}&populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching page detail:", error.response || error);
            reject(error);
        }
    });


export const apiGetPageHour = ({ pageId }) =>
    new Promise(async (resolve, reject) => {
        try {

            // Gọi API với URL đã được truyền đúng groupId
            const response = await axiosConfig({
                method: "get",
                url: `/page-open-hours/${pageId}?populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching page detail:", error.response || error);
            reject(error);
        }
    });


export const apiEditPageHour = ({ documentId, payload, token }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/page-open-hours/${documentId}`,
                data: payload,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}



export const apiGetPage = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: "/pages?pagination[pageSize]=100&populate=*",
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiGetCheckFollowPage = ({ pageId, userId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/page-members?pagination[pageSize]=10&pagination[page]=1&populate=*&sort=createdAt:DESC&pageId=${pageId}&userId=${userId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching page detail:", error.response || error);
            reject(error);
        }
    });

export const apiGetPageMember = ({ pageId }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra groupId trước khi dùng trong URL
            if (typeof pageId !== "string") {
                //console.error("Invalid groupId:", groupId);
                return reject(new Error("pageId should be a string"));
            }

            //console.log("Fetching group members for groupId:", groupId);

            // Gọi API với URL đã được truyền đúng groupId
            const response = await axiosConfig({
                method: "get",
                url: `/page-members?filters[$and][0][page][documentId][$eq]=${pageId}&populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching page detail:", error.response || error);
            reject(error);
        }
    });

export const apiCreatePageMember = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/page-members",
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

export const apiDeletePageMember = ({ documentId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "delete",
                url: `/page-members/${documentId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });

export const apiGetPostPage = ({ pageId }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra groupId trước khi dùng trong URL
            if (typeof pageId !== "string") {
                //console.error("Invalid groupId:", groupId);
                return reject(new Error("groupId should be a string"));
            }

            //console.log("Fetching group members for groupId:", groupId);

            // Gọi API với URL đã được truyền đúng groupId
            const response = await axiosConfig({
                method: "get",
                url: `/posts?filters[$and][0][page][documentId][$eq]=${pageId}&populate=*`,
            });
            //console.log("Response:", response); // Log ra chi tiết phản hồi
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });


export const apiEditPage = ({ documentId, payload, token }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/pages/${documentId}`,
                data: payload,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const apiGetMyPage = ({ userId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            
            const response = await axiosConfig({
                method: "get",
                url: `/pages?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&author=${userId}`,
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

export const apiCreatePage = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: "/pages",
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