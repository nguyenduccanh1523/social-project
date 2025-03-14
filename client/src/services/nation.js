import axiosConfig from "../axiosConfig";

export const apiGetNation = async () => {
  let allNations = [];
  let page = 1;
  let pageCount = 0;

  do {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/nations?populate=*&pagination[pageSize]=100&pagination[page]=${page}`,
      });
      
      //console.log(`Fetched page ${page}:`, response);
      
      // Kiểm tra dữ liệu và meta.pagination
      if (response.data && response.data.data) {
        allNations = [...allNations, ...response.data.data];
      }
      
      if (response.data && response.data.meta && response.data.meta.pagination) {
        pageCount = response.data.meta.pagination.pageCount;
      }
      
      page++;
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      throw error;
    }
  } while (page <= pageCount);

  //console.log(`Total items fetched: ${allNations.length}`);
  return allNations;
};
