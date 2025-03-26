import axiosConfig from "../axiosConfig";


export const apiGetStatus = (payload) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axiosConfig({
          method: "get",
          url: "/status-activities?populate=*&filters[$and][0][type][name][$eq]=public",
          data: payload,
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });

export const apiUpadateStatusByUser = ({ userId, payload }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: "put",
                url: `/users/${userId}`,
                data: payload,
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });




