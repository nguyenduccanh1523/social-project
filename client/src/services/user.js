import axiosConfig from '../axiosConfig'

export const apiGetUser = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/users/me?populate=*',
            //data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})