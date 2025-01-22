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