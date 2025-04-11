import axiosConfig from "../axiosConfig";


export const apiGetStatus = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: "/status-activities?pagination[pageSize]=20&pagination[page]=1&populate=*&sort=createdAt:DESC&typeId=elx6zlfz9ywp6esoyfi6a1yl",
        data: payload,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUpadateStatusByUser = ({ userId, payload, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/users/${userId}`,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });




