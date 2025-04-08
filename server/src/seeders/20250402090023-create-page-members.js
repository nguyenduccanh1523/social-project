'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng PageMembers chưa
      const existingPageMembers = await queryInterface.sequelize.query(
        'SELECT * FROM PageMembers LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng PageMembers:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingPageMembers.length > 0) {
        console.log('Bảng PageMembers đã có dữ liệu, bỏ qua seeding.');
        return;
      }

      // Lấy User IDs từ env hoặc từ bảng Users
      let user1Id = process.env.USER_1_ID;
      let user2Id = process.env.USER_2_ID;
      let adminId = process.env.ADMIN_ID;
      
      if (!user1Id || !user2Id || !adminId) {
        try {
          const users = await queryInterface.sequelize.query(
            'SELECT documentId, username FROM Users',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (users.length > 0) {
            const user1 = users.find(user => user.username === 'user1');
            const user2 = users.find(user => user.username === 'user2');
            const admin = users.find(user => user.username === 'admin');
            
            if (user1) user1Id = user1.documentId;
            if (user2) user2Id = user2.documentId;
            if (admin) adminId = admin.documentId;
          }
        } catch (error) {
          console.log('Không thể lấy user_id cho page members:', error.message);
          return;
        }
      }

      // Lấy Page IDs từ env hoặc từ bảng Pages
      let page1Id = process.env.PAGE_1_ID;
      let page2Id = process.env.PAGE_2_ID;
      
      if (!page1Id || !page2Id) {
        try {
          const pages = await queryInterface.sequelize.query(
            'SELECT documentId, page_name FROM Pages',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (pages.length > 0) {
            const page1 = pages.find(page => page.page_name === 'Trang công nghệ');
            const page2 = pages.find(page => page.page_name === 'Trang thiết kế');
            
            if (page1) page1Id = page1.documentId;
            if (page2) page2Id = page2.documentId;
          }
        } catch (error) {
          console.log('Không thể lấy page_id cho page members:', error.message);
          return;
        }
      }
      
      // Tạo dữ liệu mẫu cho PageMembers
      const pageMembers = [
        {
          documentId: uuidv4(),
          user_id: user1Id,
          page_id: page1Id,
          role: 'admin',
          joined_at: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user2Id,
          page_id: page1Id,
          role: 'member',
          joined_at: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: adminId,
          page_id: page2Id,
          role: 'admin',
          joined_at: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user1Id,
          page_id: page2Id,
          role: 'member',
          joined_at: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Thêm dữ liệu vào bảng PageMembers
      await queryInterface.bulkInsert('PageMembers', pageMembers, {});
      console.log('Đã thêm dữ liệu vào bảng PageMembers');
    } catch (error) {
      console.error('Lỗi khi seed PageMembers:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PageMembers', null, {});
  }
}; 