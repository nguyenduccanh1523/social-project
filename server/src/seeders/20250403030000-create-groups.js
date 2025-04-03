'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem bảng Groups có tồn tại không
      const tableExists = await queryInterface.sequelize.query(
        "SHOW TABLES LIKE 'groups'",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Groups:', err.message);
        return [];
      });

      if (tableExists.length === 0) {
        console.log('Bảng Groups không tồn tại, bỏ qua seeding.');
        return;
      }

      // Lấy cấu trúc bảng Groups để biết các cột
      const tableColumns = await queryInterface.sequelize.query(
        "DESCRIBE `groups`",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi lấy cấu trúc bảng Groups:', err.message);
        return [];
      });

      console.log('Cấu trúc bảng Groups:', tableColumns);

      // Lấy User IDs từ bảng Users
      let creatorId = null;
      try {
        const users = await queryInterface.sequelize.query(
          'SELECT documentId FROM Users LIMIT 1',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (users.length > 0) {
          creatorId = users[0].documentId;
        } else {
          console.log('Không tìm thấy users cho Groups');
          return;
        }
      } catch (error) {
        console.log('Không thể lấy user_id cho Groups:', error.message);
        return;
      }

      // Tạo dữ liệu mẫu cho Groups
      const groups = [
        {
          documentId: uuidv4(),
          group_name: 'Nhóm công nghệ',
          description: 'Nhóm thảo luận về công nghệ mới',
          admin_id: creatorId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          group_name: 'Nhóm du lịch',
          description: 'Chia sẻ kinh nghiệm du lịch',
          admin_id: creatorId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Lưu group IDs vào biến môi trường
      process.env.GROUP_1_ID = groups[0].documentId;
      process.env.GROUP_2_ID = groups[1].documentId;

      // Thêm dữ liệu vào bảng Groups
      await queryInterface.bulkInsert('Groups', groups, {});
      console.log('Đã thêm dữ liệu vào bảng Groups');
    } catch (error) {
      console.error('Lỗi khi seed Groups:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('groups', null, {});
  }
}; 