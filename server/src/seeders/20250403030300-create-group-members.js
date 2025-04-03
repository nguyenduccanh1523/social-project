'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem bảng GroupMembers có tồn tại không
      const tableExists = await queryInterface.sequelize.query(
        "SHOW TABLES LIKE 'groupmembers'",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng GroupMembers:', err.message);
        return [];
      });

      if (tableExists.length === 0) {
        console.log('Bảng GroupMembers không tồn tại, bỏ qua seeding.');
        return;
      }

      // Lấy cấu trúc bảng GroupMembers để biết các cột
      const tableColumns = await queryInterface.sequelize.query(
        "DESCRIBE `groupmembers`",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi lấy cấu trúc bảng GroupMembers:', err.message);
        return [];
      });

      console.log('Cấu trúc bảng GroupMembers:', tableColumns);

      // Lấy các Group IDs từ bảng Groups
      let groupIds = [];
      try {
        const groups = await queryInterface.sequelize.query(
          'SELECT documentId FROM groups',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (groups.length === 0) {
          console.log('Không tìm thấy groups cho GroupMembers');
          return;
        }
        
        groupIds = groups.map(group => group.documentId);
      } catch (error) {
        console.log('Không thể lấy group_id cho GroupMembers:', error.message);
        return;
      }

      // Lấy các User IDs từ bảng Users
      let userIds = [];
      try {
        const users = await queryInterface.sequelize.query(
          'SELECT documentId FROM Users',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (users.length === 0) {
          console.log('Không tìm thấy users cho GroupMembers');
          return;
        }
        
        userIds = users.map(user => user.documentId);
      } catch (error) {
        console.log('Không thể lấy user_id cho GroupMembers:', error.message);
        return;
      }

      // Tạo dữ liệu mẫu cho GroupMembers
      const groupMembers = [];
      
      // Thêm thành viên vào từng nhóm
      for (let i = 0; i < Math.min(groupIds.length, 2); i++) {
        const groupId = groupIds[i];
        
        for (let j = 0; j < Math.min(userIds.length, 3); j++) {
          const userId = userIds[j];
          
          // Người dùng đầu tiên là admin, những người khác là members
          const isAdmin = j === 0;
          
          groupMembers.push({
            documentId: uuidv4(),
            group_id: groupId,
            user_id: userId,
            role: isAdmin ? 'admin' : 'member',
            joined_at: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      // Thêm dữ liệu vào bảng GroupMembers
      await queryInterface.bulkInsert('groupmembers', groupMembers, {});
      console.log('Đã thêm dữ liệu vào bảng GroupMembers');
    } catch (error) {
      console.error('Lỗi khi seed GroupMembers:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('groupmembers', null, {});
  }
}; 