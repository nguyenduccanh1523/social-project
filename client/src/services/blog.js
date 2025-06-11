import axiosConfig from "../axiosConfig";

export const apiGetBlogList = ({
  pageParam = 1,
  searchText = "",
  filterType = "all",
  token
}) =>
  new Promise(async (resolve, reject) => {
    try {
      // Xác định kiểu sắp xếp dựa vào filterType
      let sortQuery = "";
      switch (filterType) {
        case "newest":
          sortQuery = "createdAt:DESC"; // Sắp xếp mới nhất
          break;
        case "oldest":
          sortQuery = "createdAt:ASC"; // Sắp xếp cũ nhất
          break;
        case "most_commented":
          sortQuery = "commentCount%3ADESC"; // Sắp xếp theo số comment
          break;
        default:
          sortQuery = "createdAt:DESC"; // Mặc định
      }

      // Kiểm tra groupId trước khi dùng trong URL
      if (typeof pageParam !== "number") {
        //console.error("Invalid groupId:", groupId);
        return reject(new Error("pageParam should be a number"));
      }

      //console.log("Fetching group members for groupId:", groupId);

      // Gọi API với URL đã được truyền đúng groupId
      const response = await axiosConfig({
        method: "get",
        url: `/document-shares?sort=${sortQuery}&pagination[page]=${pageParam}&pagination[pageSize]=10&populate=*${searchText ? `&filters[title][$contains]=${searchText}` : ""
          }`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      //console.log("Response:", response); // Log ra chi tiết phản hồi
      resolve({
        data: response?.data?.data,
        hasNextPage: response?.data?.meta?.pagination?.pageCount,
        pageParam: pageParam, // Thêm pageParam vào kết quả trả về
      });
    } catch (error) {
      console.error("Error fetching group members:", error.response || error);
      reject(error);
    }
  });

export const apiGetBlogDetail = ({ documentId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/document-shares/${documentId}?populate=*`,
      });
      resolve(response);
    } catch (error) {
      console.error("Error fetching blog detail:", error.response || error);
      reject(error);
    }
  });


export const apiGetMyBlog = ({ userId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/document-shares?pagination[pageSize]=200&pagination[page]=1&populate=*&sort=createdAt:DESC&userId=${userId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      console.error("Error fetching blog detail:", error.response || error);
      reject(error);
    }
  });

export const apiCreateBlog = (payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "post",
        url: "/document-shares",
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUpdateBlog = ({ documentId, payload }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "put",
        url: `/document-shares/${documentId}`,
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiDeleteBlog = ({ documentId, token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "delete",
        url: `/document-shares/${documentId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

