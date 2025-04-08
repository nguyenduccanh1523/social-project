"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Posts
      const posts = await queryInterface.sequelize.query(
        "SELECT documentId FROM Posts;",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (posts.length === 0) {
        console.log("No posts found. Skipping post_medias seeding.");
        return;
      }

      // Lấy thông tin về Medias
      // Sửa truy vấn để phù hợp với cấu trúc bảng medias hiện có
      let medias = [];
      try {
        // Chú ý: Đảm bảo đúng tên bảng (medias thay vì Medias)
        medias = await queryInterface.sequelize.query(
          "SELECT documentId, file_type FROM medias;",
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        console.log(`Found ${medias.length} media records.`);
      } catch (error) {
        console.error("Error querying medias table:", error.message);
        return;
      }

      if (medias.length === 0) {
        console.log("No media found. Skipping post_medias seeding.");
        return;
      }

      const postMedias = [];

      // Chọn 50-70% bài viết để thêm media
      const postCount = Math.floor(posts.length * (0.5 + Math.random() * 0.2));
      const postsWithMedia = [];

      while (postsWithMedia.length < postCount) {
        const randIndex = Math.floor(Math.random() * posts.length);
        if (!postsWithMedia.includes(randIndex)) {
          postsWithMedia.push(randIndex);
        }
      }

      // Thêm media cho mỗi bài viết
      for (const postIndex of postsWithMedia) {
        const post = posts[postIndex];

        // Số lượng media cho mỗi bài viết (1-3 media)
        const mediaCount = Math.floor(Math.random() * 3) + 1;

        // Tạo một danh sách những media đã thêm để tránh trùng lặp
        const addedMedias = [];

        for (let i = 0; i < mediaCount && i < medias.length; i++) {
          let mediaIndex;
          // Chọn media chưa thêm vào bài viết
          do {
            mediaIndex = Math.floor(Math.random() * medias.length);
          } while (addedMedias.includes(mediaIndex));

          addedMedias.push(mediaIndex);

          // Tạo ngày ngẫu nhiên trong 30 ngày qua
          const createdDate = new Date();
          createdDate.setDate(
            createdDate.getDate() - Math.floor(Math.random() * 30)
          );

          postMedias.push({
            documentId: uuidv4(),
            post_id: post.documentId,
            media_id: medias[mediaIndex].documentId,
            createdAt: createdDate,
            updatedAt: createdDate,
          });
        }
      }

      // Giới hạn số lượng để tránh vấn đề hiệu suất
      const limitedPostMedias = postMedias.slice(0, 100);

      console.log(`Seeding ${limitedPostMedias.length} post_medias...`);
      return queryInterface.bulkInsert("post_medias", limitedPostMedias);
    } catch (error) {
      console.error("Error in post_medias seeder:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("post_medias", null, {});
  },
};
