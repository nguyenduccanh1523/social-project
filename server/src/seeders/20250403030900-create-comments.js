'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem bảng Comments có tồn tại không
      const tableExists = await queryInterface.sequelize.query(
        "SHOW TABLES LIKE 'comments'",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Comments:', err.message);
        return [];
      });

      if (tableExists.length === 0) {
        console.log('Bảng Comments không tồn tại, bỏ qua seeding.');
        return;
      }

      // Lấy cấu trúc bảng Comments để biết các cột
      const tableColumns = await queryInterface.sequelize.query(
        "DESCRIBE `comments`",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi lấy cấu trúc bảng Comments:', err.message);
        return [];
      });

      console.log('Cấu trúc bảng Comments:', tableColumns);

      // Lấy các Post IDs từ bảng Posts
      let postIds = [];
      try {
        const posts = await queryInterface.sequelize.query(
          'SELECT documentId FROM posts',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (posts.length === 0) {
          console.log('Không tìm thấy posts cho Comments');
          return;
        }
        
        postIds = posts.map(post => post.documentId);
      } catch (error) {
        console.log('Không thể lấy post_id cho Comments:', error.message);
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
          console.log('Không tìm thấy users cho Comments');
          return;
        }
        
        userIds = users.map(user => user.documentId);
      } catch (error) {
        console.log('Không thể lấy user_id cho Comments:', error.message);
        return;
      }

      // Tạo dữ liệu mẫu cho Comments
      const comments = [];
      
      // Mỗi bài post có 2-4 comments
      for (let i = 0; i < Math.min(postIds.length, 5); i++) {
        const postId = postIds[i];
        const numComments = Math.floor(Math.random() * 3) + 2; // 2-4 comments
        
        for (let j = 0; j < numComments; j++) {
          const userId = userIds[Math.floor(Math.random() * userIds.length)]; // Random user
          const commentId = uuidv4();
          
          // Lưu commentId đầu tiên của mỗi post để tạo replies
          if (j === 0) {
            process.env[`COMMENT_POST_${i+1}_ID`] = commentId;
          }
          
          comments.push({
            documentId: commentId,
            user_id: userId,
            post_id: postId,
            parent_id: j > 0 && Math.random() > 0.5 ? process.env[`COMMENT_POST_${i+1}_ID`] : null, // 50% là reply của comment đầu tiên
            content: `Bình luận số ${j+1} cho bài viết ${i+1}. Đây là nội dung mẫu.`,
            createdAt: new Date(Date.now() - (5 - i) * 24 * 60 * 60 * 1000 + j * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - (5 - i) * 24 * 60 * 60 * 1000 + j * 60 * 60 * 1000)
          });
        }
      }

      // Thêm dữ liệu vào bảng Comments
      await queryInterface.bulkInsert('comments', comments, {});
      console.log('Đã thêm dữ liệu vào bảng Comments');
    } catch (error) {
      console.error('Lỗi khi seed Comments:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {});
  }
}; 