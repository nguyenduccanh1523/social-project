import axiosConfig from "../axiosConfig";

export const apiGetSupport = (payload) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "get",
                url: "/category-supports?populate=*",
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
