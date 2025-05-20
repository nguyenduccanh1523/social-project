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

export const apiGetUserSocial = ({ documentId, token }) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/user-socials?userId=${documentId}&populate=*`,
            headers: {
                Authorization: `Bearer ${token}`
            }
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
            url: `/posts?pagination[pageSize]=10&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}`,
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