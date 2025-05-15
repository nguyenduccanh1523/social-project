"use strict";
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Posts
      const posts = await queryInterface.sequelize.query(
        "SELECT documentId, user_id FROM Posts;",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (posts.length === 0) {
        console.log("No posts found. Skipping Shares seeding.");
        return;
      }

      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        "SELECT documentId FROM Users LIMIT 30;",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log("No users found. Skipping Shares seeding.");
        return;
      }

      const shares = [];

      // Chọn ngẫu nhiên 30-50% số bài viết để chia sẻ
      const postCount = Math.floor(posts.length * (0.3 + Math.random() * 0.2));
      const postsToShare = [];

      while (postsToShare.length < postCount) {
        const randIndex = Math.floor(Math.random() * posts.length);
        if (!postsToShare.includes(randIndex)) {
          postsToShare.push(randIndex);
        }
      }

      // Với mỗi bài viết được chọn, tạo các lượt chia sẻ
      for (const postIndex of postsToShare) {
        const post = posts[postIndex];

        // Số lượng người chia sẻ cho mỗi bài viết (1-6 người)
        const shareCount = Math.floor(Math.random() * 6) + 1;

        // Danh sách người đã chia sẻ để tránh trùng lặp
        const sharerIndexes = [];

        // Thêm người chia sẻ ngẫu nhiên, nhưng không bao gồm người tạo bài viết
        while (
          sharerIndexes.length < shareCount &&
          sharerIndexes.length < users.length - 1
        ) {
          const randIndex = Math.floor(Math.random() * users.length);

          // Không trùng người và không phải người tạo bài viết
          if (
            !sharerIndexes.includes(randIndex) &&
            users[randIndex].documentId !== post.user_id
          ) {
            sharerIndexes.push(randIndex);

            // Thời điểm chia sẻ ngẫu nhiên trong 60 ngày qua
            const shareDate = new Date();
            shareDate.setDate(
              shareDate.getDate() - Math.floor(Math.random() * 60)
            );

            shares.push({
              documentId: uuidv4(),
              post_id: post.documentId,
              user_id: users[randIndex].documentId,
              createdAt: shareDate,
              updatedAt: shareDate,
            });
          }
        }
      }

      // Giới hạn số lượng để tránh quá tải
      const limitedShares = shares.slice(0, 150);

      console.log(`Seeding ${limitedShares.length} shares...`);
      return queryInterface.bulkInsert("Shares", limitedShares);
    } catch (error) {
      console.error("Error seeding Shares:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Shares", null, {});
  },
};
