import axiosConfig from "../axiosConfig";

export const apiGetGroupNotification = ({ groupId, userId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/notification-settings?user_id=${userId}&group_id=${groupId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            console.error("Error fetching group members:", error.response || error);
            reject(error);
        }
    });

export const apiCreateGroupNotification = ({ payload, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: `/notification-settings`,
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    })

export const apiEditGroupNotification = ({ documentId, payload, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/notification-settings/${documentId}`,
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });





export const apiGetNotificationUser = ({ userId, page = 1, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/user-notifications?pagination[pageSize]=20&pagination[page]=${page}&populate=*&sort=createdAt:DESC&userId=${userId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    })


export const apiGetFindNotification = ({ notiId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/notifications/${notiId}?populate=*`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    })

export const apiGetNotificationCreated = ({ documentId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/notification-createds/${documentId}?populate=*`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    })

export const apiGetUserNoti = ({ notiId, userId, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/user-notifications?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}&notificationId=${notiId}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    })


export const apiUpdateUserNoti = ({ documentId, payload, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/user-notifications/${documentId}`,
                data: payload,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    })

export const apiDeleteUserNoti = ({ documentId }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/user-notifications/${documentId}`,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    })

export const apiCreateNotification = ({ payload, token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "post",
                url: `/notifications`,
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    })

    export const apiCreateNotificationUser = ({ payload, token }) =>
        new Promise(async (resolve, reject) => {
            try {
                const response = await axiosConfig({
                    method: "post",
                    url: `/user-notifications`,
                    data: payload,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                resolve(response);
            } catch (error) {
                reject(error);
            }
        })
    
