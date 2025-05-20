import axiosConfig from '../axiosConfig'

export const apiRegister = (payload) => new Promise(async (resolve, reject) => {
    try {
        // console.log('Đang gửi request đăng ký:', payload);
        const response = await axiosConfig({
            method: 'post',
            url: 'auth/register',
            data: payload
        })
        // console.log('Kết quả đăng ký:', response.data);
        resolve(response)
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        reject(error)
    }
})

export const apiLogin = (payload) => new Promise(async (resolve, reject) => {
    try {
        // console.log('Đang gửi request đăng nhập:', payload);
        const response = await axiosConfig({
            method: 'post',
            url: 'auth/login',
            data: payload
        })
        // console.log('Kết quả đăng nhập:', response.data);
        resolve(response)
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        reject(error)
    }
})

export const apiRefreshToken = (refreshToken) => new Promise(async (resolve, reject) => {
    try {
        console.log('Đang gửi refresh token');
        const response = await axiosConfig({
            method: 'post',
            url: 'auth/refresh',
            data: { refreshToken },
            _retry: true
        })
        console.log('Kết quả refresh token:', response.data);
        resolve(response)
    } catch (error) {
        console.error('Lỗi refresh token:', error);
        reject(error)
    }
})

export const apiLogout = () => new Promise(async (resolve, reject) => {
    try {
        // console.log('Đang đăng xuất');
        const response = await axiosConfig({
            method: 'post',
            url: 'auth/logout'
        })
        // console.log('Kết quả đăng xuất:', response.data);
        resolve(response)
    } catch (error) {
        console.error('Lỗi đăng xuất:', error);
        reject(error)
    }
})