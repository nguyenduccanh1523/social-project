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

export const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  return `${seconds} seconds ago`;
};
