'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin về Groups và admin của nhóm
    const groups = await queryInterface.sequelize.query(
      'SELECT documentId, admin_id FROM Groups;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (groups.length === 0) {
      console.log('No groups found. Skipping group_members seeding.');
      return;
    }

    // Lấy thông tin về Users
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 30;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping group_members seeding.');
      return;
    }

    const groupMembers = [];

    // Duyệt qua từng nhóm để thêm thành viên
    for (const group of groups) {
      // Admin của nhóm luôn là thành viên
      const adminId = group.admin_id;
      
      // Thêm admin vào nhóm
      const adminJoinedDate = new Date();
      adminJoinedDate.setDate(adminJoinedDate.getDate() - Math.floor(Math.random() * 120));
      
      groupMembers.push({
        documentId: uuidv4(),
        group_id: group.documentId,
        user_id: adminId,
        joined_at: adminJoinedDate,
        createdAt: adminJoinedDate,
        updatedAt: adminJoinedDate
      });
      
      // Số lượng thành viên ngẫu nhiên cho mỗi nhóm (5-20 thành viên)
      const memberCount = Math.floor(Math.random() * 16) + 5;
      
      // Tạo danh sách index người dùng ngẫu nhiên để không bị trùng lặp
      const memberIndexes = [];
      while (memberIndexes.length < memberCount && memberIndexes.length < users.length) {
        const randIndex = Math.floor(Math.random() * users.length);
        // Không thêm admin và không thêm trùng người
        if (!memberIndexes.includes(randIndex) && users[randIndex].documentId !== adminId) {
          memberIndexes.push(randIndex);
        }
      }
      
      // Thêm các thành viên khác vào nhóm
      for (const userIndex of memberIndexes) {
        // Ngày tham gia nhóm sau ngày admin tạo nhóm
        const joinedDate = new Date(adminJoinedDate);
        joinedDate.setDate(joinedDate.getDate() + Math.floor(Math.random() * 100) + 1);
        
        // Đảm bảo ngày tham gia không vượt quá ngày hiện tại
        const now = new Date();
        const actualJoinedDate = joinedDate > now ? now : joinedDate;
        
        groupMembers.push({
          documentId: uuidv4(),
          group_id: group.documentId,
          user_id: users[userIndex].documentId,
          joined_at: actualJoinedDate,
          createdAt: actualJoinedDate,
          updatedAt: actualJoinedDate
        });
      }
    }

    return queryInterface.bulkInsert('group_members', groupMembers);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('group_members', null, {});
  }
}; 