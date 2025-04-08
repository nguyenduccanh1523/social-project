"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, check if data already exists
    const existingData = await queryInterface.sequelize.query(
      'SELECT documentId FROM statusactions',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Extract existing IDs for easier comparison
    const existingIds = existingData.map((item) => item.documentId);

    const statusActions = [
      {
        documentId: "sa0001pending000000", // ID cố định cho trạng thái đang chờ
        name: "Đang chờ",
        description: "Yêu cầu đang chờ xử lý",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: "sa0002approved0000", // ID cố định cho trạng thái đã chấp nhận
        name: "Đã chấp nhận",
        description: "Yêu cầu đã được chấp nhận",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: "sa0003rejected0000", // ID cố định cho trạng thái đã từ chối
        name: "Đã từ chối",
        description: "Yêu cầu đã bị từ chối",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: "sa0004cancelled000", // ID cố định cho trạng thái đã hủy
        name: "Đã hủy",
        description: "Yêu cầu đã bị hủy bởi người tạo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: "sa0005completed000", // ID cố định cho trạng thái đã hoàn thành
        name: "Đã hoàn thành",
        description: "Yêu cầu đã được hoàn thành",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: "sa0006inprocess000", // ID cố định cho trạng thái đang xử lý
        name: "Đang xử lý",
        description: "Yêu cầu đang trong quá trình xử lý",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documentId: "sa0007expired00000", // ID cố định cho trạng thái đã hết hạn
        name: "Đã hết hạn",
        description: "Yêu cầu đã hết thời hạn xử lý",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Filter out any status actions that already exist in the database
    const newStatusActions = statusActions.filter(
      (status) => !existingIds.includes(status.documentId)
    );

    // Only insert if there are new records to add
    if (newStatusActions.length > 0) {
      return queryInterface.bulkInsert("StatusActions", newStatusActions);
    }

    console.log("No new status actions to insert");
    return Promise.resolve();
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("StatusActions", null, {});
  },
};
