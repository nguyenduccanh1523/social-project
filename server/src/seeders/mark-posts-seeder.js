'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin DocumentShares
    const documentShares = await queryInterface.sequelize.query(
      'SELECT documentId FROM DocumentShares;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Lấy thông tin Posts
    const posts = await queryInterface.sequelize.query(
      'SELECT documentId FROM Posts;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Lấy thông tin Users
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 20;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping MarkPosts seeding.');
      return;
    }

    const markPosts = [];

    // Tạo mark posts cho DocumentShares
    if (documentShares.length > 0) {
      // Số lượng đánh dấu cho mỗi tài liệu (1-5 đánh dấu)
      for (const docShare of documentShares) {
        const markCount = Math.floor(Math.random() * 5) + 1;
        
        // Tạo danh sách index người dùng ngẫu nhiên để không bị trùng lặp
        const userIndexes = [];
        while (userIndexes.length < markCount && userIndexes.length < users.length) {
          const randIndex = Math.floor(Math.random() * users.length);
          if (!userIndexes.includes(randIndex)) {
            userIndexes.push(randIndex);
          }
        }
        
        // Tạo đánh dấu cho tài liệu
        for (const userIndex of userIndexes) {
          markPosts.push({
            documentId: uuidv4(),
            document_share_id: docShare.documentId,
            post_id: null,
            user_id: users[userIndex].documentId,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    // Tạo mark posts cho Posts
    if (posts.length > 0) {
      // Số lượng đánh dấu cho mỗi bài viết (1-10 đánh dấu)
      for (const post of posts) {
        const markCount = Math.floor(Math.random() * 10) + 1;
        
        // Tạo danh sách index người dùng ngẫu nhiên để không bị trùng lặp
        const userIndexes = [];
        while (userIndexes.length < markCount && userIndexes.length < users.length) {
          const randIndex = Math.floor(Math.random() * users.length);
          if (!userIndexes.includes(randIndex)) {
            userIndexes.push(randIndex);
          }
        }
        
        // Tạo đánh dấu cho bài viết
        for (const userIndex of userIndexes) {
          markPosts.push({
            documentId: uuidv4(),
            document_share_id: null,
            post_id: post.documentId,
            user_id: users[userIndex].documentId,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    if (markPosts.length === 0) {
      console.log('No data to seed for MarkPosts.');
      return;
    }

    return queryInterface.bulkInsert('MarkPosts', markPosts);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('MarkPosts', null, {});
  }
}; 