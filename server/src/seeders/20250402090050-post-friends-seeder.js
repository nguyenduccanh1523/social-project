'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin Posts có type là 'private'
    const privatePosts = await queryInterface.sequelize.query(
      "SELECT documentId, user_id FROM Posts WHERE type = 'private';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (privatePosts.length === 0) {
      console.log('No private posts found. Skipping PostFriends seeding.');
      return;
    }

    // Lấy thông tin Users
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 20;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping PostFriends seeding.');
      return;
    }

    const postFriends = [];

    // Tạo PostFriends cho mỗi bài viết riêng tư
    for (const post of privatePosts) {
      // Số lượng bạn bè được cho phép xem (2-10 người)
      const friendCount = Math.floor(Math.random() * 9) + 2;
      
      // Lấy user_id của tác giả bài viết để loại trừ
      const postAuthorId = post.user_id;
      
      // Tạo danh sách index người dùng ngẫu nhiên để không bị trùng lặp
      const userIndexes = [];
      while (userIndexes.length < friendCount && userIndexes.length < users.length) {
        const randIndex = Math.floor(Math.random() * users.length);
        // Không thêm người tạo bài viết và không thêm trùng
        if (!userIndexes.includes(randIndex) && users[randIndex].documentId !== postAuthorId) {
          userIndexes.push(randIndex);
        }
      }
      
      // Tạo liên kết bạn bè cho bài viết từ danh sách index
      for (const userIndex of userIndexes) {
        postFriends.push({
          documentId: uuidv4(),
          post_id: post.documentId,
          user_id: users[userIndex].documentId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    if (postFriends.length === 0) {
      console.log('No data to seed for PostFriends.');
      return;
    }

    return queryInterface.bulkInsert('PostFriends', postFriends);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PostFriends', null, {});
  }
}; 