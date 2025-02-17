export const colorsTag = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

export const convertToVietnamHour = (dateString) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh', // Múi giờ Việt Nam
  };

  const date = new Date(dateString); // Chuyển đổi chuỗi thành đối tượng Date
  const formattedTime = new Intl.DateTimeFormat('en-GB', options).format(date);

  return formattedTime;
};

export const convertToVietnamDate = (dateString) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh', // Múi giờ Việt Nam
  };

  const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  return formattedDate;
};
