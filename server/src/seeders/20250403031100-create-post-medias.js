'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng PostMedias chưa
      const existingPostMedias = await queryInterface.sequelize.query(
        'SELECT * FROM post_medias LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng post_medias:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingPostMedias.length > 0) {
        console.log('Bảng post_medias đã có dữ liệu, bỏ qua seeding.');
        return;
      }

      // Lấy Post IDs từ env hoặc từ bảng Posts
      let post1Id = process.env.POST_1_ID;
      let post3Id = process.env.POST_3_ID;
      let post5Id = process.env.POST_5_ID;
      
      if (!post1Id || !post3Id || !post5Id) {
        try {
          const posts = await queryInterface.sequelize.query(
            'SELECT documentId FROM Posts WHERE documentId IN (?, ?, ?)',
            { 
              type: queryInterface.sequelize.QueryTypes.SELECT,
              replacements: [process.env.POST_1_ID, process.env.POST_3_ID, process.env.POST_5_ID]
            }
          );
          
          if (posts.length >= 3) {
            post1Id = posts[0].documentId;
            post3Id = posts[1].documentId;
            post5Id = posts[2].documentId;
          } else {
            console.log('Không đủ dữ liệu Posts để tạo PostMedias');
            return;
          }
        } catch (error) {
          console.log('Không thể lấy post_id cho post medias:', error.message);
          return;
        }
      }

      // Lấy Media IDs
      let mediaIds = [];
      try {
        const medias = await queryInterface.sequelize.query(
          'SELECT documentId FROM Medias LIMIT 5',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        if (medias.length >= 2) {
          for (const media of medias) {
            mediaIds.push(media.documentId);
          }
        } else {
          console.log('Không đủ dữ liệu Medias để tạo PostMedias');
          return;
        }
      } catch (error) {
        console.log('Không thể lấy media_id cho post medias:', error.message);
        return;
      }
      
      // Tạo dữ liệu mẫu cho PostMedias
      const postMedias = [
        {
          documentId: uuidv4(),
          post_id: post1Id,
          media_id: mediaIds[0],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          documentId: uuidv4(),
          post_id: post3Id,
          media_id: mediaIds[1],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          documentId: uuidv4(),
          post_id: post5Id,
          media_id: mediaIds[0],
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      // Thêm dữ liệu vào bảng PostMedias
      await queryInterface.bulkInsert('post_medias', postMedias, {});
      console.log('Đã thêm dữ liệu vào bảng post_medias');
    } catch (error) {
      console.error('Lỗi khi seed PostMedias:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('post_medias', null, {});
  }
}; 