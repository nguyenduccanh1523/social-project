import axiosConfig from '../axiosConfig'

export const apiRegister = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/auth/local/register',
            data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})
export const apiLogin = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/auth/local',
            data: payload
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})