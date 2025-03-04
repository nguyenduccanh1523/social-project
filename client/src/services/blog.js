import axiosConfig from "../axiosConfig";

export const apiGetBlogList = ({
  pageParam = 1,
  searchText = "",
  filterType = "all",
}) =>
  new Promise(async (resolve, reject) => {
    try {
      // Xác định kiểu sắp xếp dựa vào filterType
      let sortQuery = "";
      switch (filterType) {
        case "newest":
          sortQuery = "id%3ADESC"; // Sắp xếp mới nhất
          break;
        case "oldest":
          sortQuery = "id%3AASC"; // Sắp xếp cũ nhất
          break;
        case "most_commented":
          sortQuery = "commentCount%3ADESC"; // Sắp xếp theo số comment
          break;
        default:
          sortQuery = "id%3ADESC"; // Mặc định
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
        url: `/document-shares?sort=${sortQuery}&pagination[page]=${pageParam}&pagination[pageSize]=10&populate=*${
          searchText ? `&filters[title][$contains]=${searchText}` : ""
        }`,
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
