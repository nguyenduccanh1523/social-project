"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Kiểm tra xem đã có dữ liệu trong bảng Types chưa
    try {
      const existingTypes = await queryInterface.sequelize.query(
        "SELECT * FROM Types LIMIT 1",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingTypes.length > 0) {
        console.log("Bảng Types đã có dữ liệu, bỏ qua seeding.");
        return;
      }

      // Tạo các type cơ bản
      const userTypeId = uuidv4();
      process.env.USER_TYPE_ID = userTypeId;

      const types = [
        {
          documentId: userTypeId,
          name: "User Type",
          description: "Loại người dùng",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          name: "User Status",
          description: "Loại trạng thái người dùng",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          name: "Post Type",
          description: "Loại bài đăng",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          name: "Media Type",
          description: "Loại media",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          name: "Group Type",
          description: "Loại nhóm",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Thêm dữ liệu vào bảng Types
      await queryInterface.bulkInsert("Types", types, {});
      console.log("Đã thêm dữ liệu vào bảng Types");
    } catch (error) {
      console.log("Lỗi khi thêm dữ liệu vào bảng Types:", error.message);
      // Nếu bảng Types chưa tồn tại, hãy tạo nó
      if (error.message.includes("doesn't exist")) {
        console.log("Bảng Types chưa tồn tại, bỏ qua seeding.");
      }
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Xóa toàn bộ dữ liệu trong bảng Types
      await queryInterface.bulkDelete("Types", null, {});
    } catch (error) {
      console.log("Lỗi khi xóa dữ liệu trong bảng Types:", error.message);
    }
  },
};
