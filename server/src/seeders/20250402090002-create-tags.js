"use strict";
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Kiểm tra xem bảng Tags có tồn tại không
      const tableExists = await queryInterface.sequelize
        .query("SHOW TABLES LIKE 'tags'", {
          type: queryInterface.sequelize.QueryTypes.SHOWTABLES,
        })
        .catch((err) => {
          console.log("Lỗi khi kiểm tra bảng Tags:", err.message);
          return [];
        });

      if (tableExists.length === 0) {
        console.log("Bảng Tags không tồn tại, bỏ qua seeding.");
        return;
      }

      // Lấy cấu trúc bảng Tags để biết các cột
      const tableColumns = await queryInterface.sequelize
        .query("DESCRIBE `tags`", {
          type: queryInterface.sequelize.QueryTypes.SHOWTABLES,
        })
        .catch((err) => {
          console.log("Lỗi khi lấy cấu trúc bảng Tags:", err.message);
          return [];
        });

      console.log("Cấu trúc bảng Tags:", tableColumns);

      // Tạo dữ liệu mẫu cho Tags
      const tags = [
        {
          documentId: uuidv4(),
          name: "Công nghệ",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          name: "Du lịch",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          name: "Thời trang",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          name: "Ẩm thực",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          name: "Giáo dục",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Lưu tag IDs vào biến môi trường
      process.env.TAG_1_ID = tags[0].documentId;
      process.env.TAG_2_ID = tags[1].documentId;
      process.env.TAG_3_ID = tags[2].documentId;
      process.env.TAG_4_ID = tags[3].documentId;
      process.env.TAG_5_ID = tags[4].documentId;

      // Thêm dữ liệu vào bảng Tags
      await queryInterface.bulkInsert("Tags", tags, {});
      console.log("Đã thêm dữ liệu vào bảng Tags");
    } catch (error) {
      console.error("Lỗi khi seed Tags:", error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tags", null, {});
  },
};
