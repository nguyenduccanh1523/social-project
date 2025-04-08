'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin Pages
    const pages = await queryInterface.sequelize.query(
      'SELECT documentId FROM Pages;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (pages.length === 0) {
      console.log('No pages found. Skipping PageOpenHours seeding.');
      return;
    }

    const pageOpenHours = [];

    // Danh sách các ngày trong tuần
    const daysOfWeek = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    // Các trạng thái giờ mở cửa
    const statuses = ['open', 'closed'];

    // Tạo dữ liệu giờ mở cửa cho mỗi trang
    for (const page of pages) {
      const isOpen24_7 = Math.random() > 0.8; // 20% trang mở cửa 24/7
      const hasSomeDaysClosed = Math.random() > 0.7; // 30% trang có một số ngày đóng cửa

      if (isOpen24_7) {
        // Tạo giờ mở cửa 24/7 cho tất cả các ngày
        for (const day of daysOfWeek) {
          pageOpenHours.push({
            documentId: uuidv4(),
            page_id: page.documentId,
            open_time: '00:00:00',
            close_time: '23:59:59',
            day_of_week: day,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      } else {
        // Tạo giờ mở cửa riêng cho từng ngày
        for (const day of daysOfWeek) {
          const isDayClosed = hasSomeDaysClosed && (day === 'Sunday' || Math.random() > 0.8);
          const openHour = isDayClosed ? null : Math.floor(Math.random() * 12) + 6; // 6h-18h
          const closeHour = isDayClosed ? null : Math.floor(Math.random() * 6) + 17; // 17h-23h
          
          pageOpenHours.push({
            documentId: uuidv4(),
            page_id: page.documentId,
            open_time: isDayClosed ? '00:00:00' : `${openHour.toString().padStart(2, '0')}:00:00`,
            close_time: isDayClosed ? '00:00:00' : `${closeHour.toString().padStart(2, '0')}:00:00`,
            day_of_week: day,
            status: isDayClosed ? 'closed' : 'open',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    return queryInterface.bulkInsert('PageOpenHours', pageOpenHours);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PageOpenHours', null, {});
  }
}; 