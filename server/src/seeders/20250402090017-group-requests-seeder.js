"use strict";
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin về Groups
    const groups = await queryInterface.sequelize.query(
      "SELECT documentId FROM `Groups`;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (groups.length === 0) {
      console.log("No groups found. Skipping group_requests seeding.");
      return;
    }

    // Lấy thông tin về Users
    const users = await queryInterface.sequelize.query(
      "SELECT documentId FROM Users LIMIT 20;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log("No users found. Skipping group_requests seeding.");
      return;
    }

    // Lấy thông tin về StatusActions
    const statusActions = await queryInterface.sequelize.query(
      "SELECT documentId, name FROM StatusActions;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (statusActions.length === 0) {
      console.log("No status actions found. Skipping group_requests seeding.");
      return;
    }

    // Tìm ID của trạng thái cần thiết
    const pendingStatus =
      statusActions.find((s) => s.name === "Đang chờ")?.documentId ||
      "sa0001pending000000";
    const approvedStatus =
      statusActions.find((s) => s.name === "Đã chấp nhận")?.documentId ||
      "sa0002approved0000";
    const rejectedStatus =
      statusActions.find((s) => s.name === "Đã từ chối")?.documentId ||
      "sa0003rejected0000";

    const allStatuses = [pendingStatus, approvedStatus, rejectedStatus];

    const groupRequests = [];

    // Tạo group requests
    for (const group of groups) {
      // Số lượng yêu cầu ngẫu nhiên cho mỗi nhóm (2-8 yêu cầu)
      const requestCount = Math.floor(Math.random() * 7) + 2;

      // Tạo danh sách index người dùng ngẫu nhiên để không bị trùng lặp
      const userIndexes = [];
      while (
        userIndexes.length < requestCount &&
        userIndexes.length < users.length
      ) {
        const randIndex = Math.floor(Math.random() * users.length);
        if (!userIndexes.includes(randIndex)) {
          userIndexes.push(randIndex);
        }
      }

      // Tạo yêu cầu tham gia nhóm từ danh sách index
      for (const userIndex of userIndexes) {
        const statusIndex = Math.floor(Math.random() * allStatuses.length);
        const createdDate = new Date();
        createdDate.setDate(
          createdDate.getDate() - Math.floor(Math.random() * 30)
        ); // Ngày tạo trong 30 ngày qua

        groupRequests.push({
          documentId: uuidv4(),
          group_id: group.documentId,
          user_request: users[userIndex].documentId,
          status_action_id: allStatuses[statusIndex],
          createdAt: createdDate,
          updatedAt: new Date(),
        });
      }
    }

    return queryInterface.bulkInsert("group_requests", groupRequests);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("group_requests", null, {});
  },
};
