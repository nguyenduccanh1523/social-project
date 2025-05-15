'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Friends chưa
      const existingFriends = await queryInterface.sequelize.query(
        'SELECT * FROM Friends LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Friends:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingFriends.length > 0) {
        console.log('Bảng Friends đã có dữ liệu, bỏ qua seeding.');
        return;
      }

      // Lấy User IDs từ env hoặc từ bảng Users
      let user1Id = process.env.USER_1_ID;
      let user2Id = process.env.USER_2_ID;
      
      if (!user1Id || !user2Id) {
        try {
          const users = await queryInterface.sequelize.query(
            'SELECT documentId, username FROM Users',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (users.length > 0) {
            const user1 = users.find(user => user.username === 'user1');
            const user2 = users.find(user => user.username === 'user2');
            
            if (user1) user1Id = user1.documentId;
            if (user2) user2Id = user2.documentId;
          }
        } catch (error) {
          console.log('Không thể lấy user_id cho friend relationship:', error.message);
          return; // Không tiếp tục nếu không tìm thấy users
        }
      }
      
      // Lấy StatusAction ID cho trạng thái "Accepted"
      let statusActionId = null;
      try {
        const statuses = await queryInterface.sequelize.query(
          'SELECT documentId FROM StatusActions WHERE name = "Accepted" LIMIT 1',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        if (statuses.length > 0) {
          statusActionId = statuses[0].documentId;
        } else {
          // Nếu không tìm thấy, tạo mới một StatusAction
          const newStatusId = uuidv4();
          await queryInterface.bulkInsert('StatusActions', [{
            documentId: newStatusId,
            name: 'Accepted',
            description: 'Friend request accepted',
            createdAt: new Date(),
            updatedAt: new Date()
          }]);
          statusActionId = newStatusId;
        }
      } catch (error) {
        console.log('Không thể lấy hoặc tạo status_action_id:', error.message);
        return; // Không tiếp tục nếu không có status
      }
      
      // Tạo dữ liệu mẫu cho Friends (kết bạn hai chiều)
      const friends = [
        {
          documentId: uuidv4(),
          user_id: user1Id,
          friend_id: user2Id,
          status_action_id: statusActionId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user2Id,
          friend_id: user1Id,
          status_action_id: statusActionId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Thêm dữ liệu vào bảng Friends
      await queryInterface.bulkInsert('Friends', friends, {});
      console.log('Đã thêm dữ liệu vào bảng Friends');
    } catch (error) {
      console.error('Lỗi khi seed Friends:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Friends', null, {});
  }
};
