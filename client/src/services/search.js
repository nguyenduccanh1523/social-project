import axiosConfig from "../axiosConfig";


export const apiSearch = (query, token, type = null) =>
    new Promise(async (resolve, reject) => {
        try {
            let url = `/search?query=${query}`;
            if (type) {
                url += `&type=${type}`;
            }
            const response = await axiosConfig({
                method: "get",
                url: url,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });


export const apiStatisticsYearly = ({ token }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: `/statistics/yearly`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });