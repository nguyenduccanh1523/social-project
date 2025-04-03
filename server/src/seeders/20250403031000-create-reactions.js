'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Reactions chưa
      const existingReactions = await queryInterface.sequelize.query(
        'SELECT * FROM Reactions LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Reactions:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingReactions.length > 0) {
        console.log('Bảng Reactions đã có dữ liệu, bỏ qua seeding.');
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
          console.log('Không thể lấy user_id cho reactions:', error.message);
          return;
        }
      }

      // Lấy Post IDs từ env hoặc từ bảng Posts
      let post1Id = process.env.POST_1_ID;
      let post2Id = process.env.POST_2_ID;
      let post3Id = process.env.POST_3_ID;
      let post4Id = process.env.POST_4_ID;
      let post5Id = process.env.POST_5_ID;
      
      if (!post1Id || !post2Id || !post3Id || !post4Id || !post5Id) {
        try {
          const posts = await queryInterface.sequelize.query(
            'SELECT documentId FROM Posts LIMIT 5',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (posts.length >= 5) {
            post1Id = posts[0].documentId;
            post2Id = posts[1].documentId;
            post3Id = posts[2].documentId;
            post4Id = posts[3].documentId;
            post5Id = posts[4].documentId;
          } else {
            console.log('Không đủ dữ liệu Posts để tạo Reactions');
            return;
          }
        } catch (error) {
          console.log('Không thể lấy post_id cho reactions:', error.message);
          return;
        }
      }

      // Lấy Comment IDs từ env hoặc từ bảng Comments
      let comment1Id = process.env.COMMENT_1_ID;
      let comment2Id = process.env.COMMENT_2_ID;
      
      if (!comment1Id || !comment2Id) {
        try {
          const comments = await queryInterface.sequelize.query(
            'SELECT documentId FROM Comments LIMIT 2',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (comments.length >= 2) {
            comment1Id = comments[0].documentId;
            comment2Id = comments[1].documentId;
          } else {
            console.log('Không đủ dữ liệu Comments để tạo Reactions');
            return;
          }
        } catch (error) {
          console.log('Không thể lấy comment_id cho reactions:', error.message);
          return;
        }
      }
      
      // Tạo dữ liệu mẫu cho Reactions
      const reactions = [
        // Phản ứng cho Posts
        {
          documentId: uuidv4(),
          user_id: user1Id,
          post_id: post2Id,
          comment_id: null,
          reaction_type: 'like',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user2Id,
          post_id: post1Id,
          comment_id: null,
          reaction_type: 'love',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: adminId,
          post_id: post1Id,
          comment_id: null,
          reaction_type: 'like',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user1Id,
          post_id: post3Id,
          comment_id: null,
          reaction_type: 'love',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user2Id,
          post_id: post4Id,
          comment_id: null,
          reaction_type: 'wow',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // Phản ứng cho Comments
        {
          documentId: uuidv4(),
          user_id: user1Id,
          post_id: null,
          comment_id: comment1Id,
          reaction_type: 'like',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user2Id,
          post_id: null,
          comment_id: comment2Id,
          reaction_type: 'love',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Thêm dữ liệu vào bảng Reactions
      await queryInterface.bulkInsert('Reactions', reactions, {});
      console.log('Đã thêm dữ liệu vào bảng Reactions');
    } catch (error) {
      console.error('Lỗi khi seed Reactions:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reactions', null, {});
  }
};