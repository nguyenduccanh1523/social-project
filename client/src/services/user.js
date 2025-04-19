import axiosConfig from '../axiosConfig'

export const apiGetUser = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/users/me?populate=*',
            data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetUserSocial = ({ documentId }) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/user-socials?filters[$and][0][account_user][documentId][$eq]=${documentId}&populate=*`,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiGetFriendData = ({ userId, token }) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/users/${userId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        resolve(response)
    } catch (error) {
        reject(error);
    }
});

export const apiGetPostByUserId = ({ userId, token }) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/posts?filters[$and][0][user_id][documentId][$eq]=${userId}&filters[$and][1][group][id][$null]=true&filters[$and][2][page][page_name][$null]=true&sort=createdAt:DESC&populate=*`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiGetUserById = ({ userId, token }) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/users/${userId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});