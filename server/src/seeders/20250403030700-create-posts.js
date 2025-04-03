'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem bảng Posts có tồn tại không
      const tableExists = await queryInterface.sequelize.query(
        "SHOW TABLES LIKE 'posts'",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Posts:', err.message);
        return [];
      });

      if (tableExists.length === 0) {
        console.log('Bảng Posts không tồn tại, bỏ qua seeding.');
        return;
      }

      // Lấy cấu trúc bảng Posts để biết các cột
      const tableColumns = await queryInterface.sequelize.query(
        "DESCRIBE `posts`",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi lấy cấu trúc bảng Posts:', err.message);
        return [];
      });

      console.log('Cấu trúc bảng Posts:', tableColumns);

      // Lấy các User IDs từ bảng Users
      let userIds = [];
      try {
        const users = await queryInterface.sequelize.query(
          'SELECT documentId FROM Users LIMIT 3',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (users.length === 0) {
          console.log('Không tìm thấy users cho Posts');
          return;
        }
        
        userIds = users.map(user => user.documentId);
      } catch (error) {
        console.log('Không thể lấy user_id cho Posts:', error.message);
        return;
      }

      // Lấy Group ID từ bảng Groups
      let groupId = null;
      try {
        const groups = await queryInterface.sequelize.query(
          "SELECT documentId FROM `Groups` LIMIT 1",
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (groups.length > 0) {
          groupId = groups[0].documentId;
        }
      } catch (error) {
        console.log('Không thể lấy group_id cho Posts:', error.message);
      }

      // Tạo dữ liệu mẫu cho Posts
      const posts = [];
      
      // Tạo 5 bài post ngẫu nhiên
      for (let i = 0; i < 5; i++) {
        const userId = userIds[i % userIds.length];
        const postId = uuidv4();
        
        // Lưu post ID đầu tiên để sử dụng cho các models khác
        if (i === 0) {
          process.env.POST_1_ID = postId;
        }
        
        posts.push({
          documentId: postId,
          user_id: userId,
          content: `Nội dung bài đăng số ${i + 1}. Đây là một bài đăng mẫu.`,
          group_id: i < 3 ? groupId : null, // 3 bài đăng đầu tiên thuộc về group
          type: 'public',
          createdAt: new Date(Date.now() - (5 - i) * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - (5 - i) * 24 * 60 * 60 * 1000)
        });
      }

      // Thêm dữ liệu vào bảng Posts
      await queryInterface.bulkInsert('Posts', posts, {});
      console.log('Đã thêm dữ liệu vào bảng Posts');
    } catch (error) {
      console.error('Lỗi khi seed Posts:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {});
  }
}; 