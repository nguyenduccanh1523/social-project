import axiosConfig from "../axiosConfig";


export const apiGetReport = (payload) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: "get",
          url: "/reports?populate=*",
          data: payload,
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });