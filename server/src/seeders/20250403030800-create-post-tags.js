'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem bảng PostTags có tồn tại không
      const tableExists = await queryInterface.sequelize.query(
        "SHOW TABLES LIKE 'posttags'",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng PostTags:', err.message);
        return [];
      });

      if (tableExists.length === 0) {
        console.log('Bảng PostTags không tồn tại, bỏ qua seeding.');
        return;
      }

      // Lấy cấu trúc bảng PostTags để biết các cột
      const tableColumns = await queryInterface.sequelize.query(
        "DESCRIBE `posttags`",
        { type: queryInterface.sequelize.QueryTypes.SHOWTABLES }
      ).catch(err => {
        console.log('Lỗi khi lấy cấu trúc bảng PostTags:', err.message);
        return [];
      });

      console.log('Cấu trúc bảng PostTags:', tableColumns);

      // Lấy các Post IDs từ bảng Posts
      let postIds = [];
      try {
        const posts = await queryInterface.sequelize.query(
          'SELECT documentId FROM posts',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (posts.length === 0) {
          console.log('Không tìm thấy posts cho PostTags');
          return;
        }
        
        postIds = posts.map(post => post.documentId);
      } catch (error) {
        console.log('Không thể lấy post_id cho PostTags:', error.message);
        return;
      }

      // Lấy các Tag IDs từ bảng Tags
      let tagIds = [];
      try {
        const tags = await queryInterface.sequelize.query(
          'SELECT documentId FROM tags',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (tags.length === 0) {
          console.log('Không tìm thấy tags cho PostTags');
          return;
        }
        
        tagIds = tags.map(tag => tag.documentId);
      } catch (error) {
        console.log('Không thể lấy tag_id cho PostTags:', error.message);
        return;
      }

      // Tạo dữ liệu mẫu cho PostTags
      const postTags = [];
      
      // Thêm tags vào các posts
      for (let i = 0; i < Math.min(postIds.length, 5); i++) {
        const postId = postIds[i];
        
        // Mỗi bài post có 1-3 tags
        const numTags = Math.min(Math.floor(Math.random() * 3) + 1, tagIds.length);
        
        for (let j = 0; j < numTags; j++) {
          const tagIndex = (i + j) % tagIds.length; // Đảm bảo không vượt quá số lượng tag
          
          postTags.push({
            documentId: uuidv4(),
            post_id: postId,
            tag_id: tagIds[tagIndex],
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      // Thêm dữ liệu vào bảng PostTags
      await queryInterface.bulkInsert('posttags', postTags, {});
      console.log('Đã thêm dữ liệu vào bảng PostTags');
    } catch (error) {
      console.error('Lỗi khi seed PostTags:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posttags', null, {});
  }
}; 