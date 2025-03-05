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

export const apiGetFriendData = ({ userId }) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/users?filters[$and][0][documentId][$eq]=${userId}&populate=*`,
        });
        //console.log('response', response);
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiGetPostByUserId = ({ userId }) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/posts?filters[$and][0][user_id][documentId][$eq]=${userId}&filters[$and][1][group][id][$null]=true&filters[$and][2][page][page_name][$null]=true&populate=*`,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});