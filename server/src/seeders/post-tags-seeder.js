'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin về Posts
    const posts = await queryInterface.sequelize.query(
      'SELECT documentId FROM Posts;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (posts.length === 0) {
      console.log('No posts found. Skipping PostTags seeding.');
      return;
    }

    // Lấy thông tin về Tags
    let tags = [];
    try {
      tags = await queryInterface.sequelize.query(
        'SELECT documentId FROM Tags;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
    } catch (error) {
      console.log('Tags table not found or error. Skipping PostTags seeding.');
      return;
    }

    if (tags.length === 0) {
      console.log('No tags found. Skipping PostTags seeding.');
      return;
    }

    const postTags = [];

    // Chọn 30-50% bài viết để thêm tags
    const postCount = Math.floor(posts.length * (0.3 + Math.random() * 0.2));
    const postsWithTags = [];
    
    while (postsWithTags.length < postCount) {
      const randIndex = Math.floor(Math.random() * posts.length);
      if (!postsWithTags.includes(randIndex)) {
        postsWithTags.push(randIndex);
      }
    }

    // Thêm tags cho mỗi bài viết
    for (const postIndex of postsWithTags) {
      const post = posts[postIndex];
      
      // Số lượng tags cho mỗi bài viết (1-5 tags)
      const tagCount = Math.floor(Math.random() * 5) + 1;
      
      // Tạo một danh sách những tags đã thêm để tránh trùng lặp
      const addedTags = [];
      
      for (let i = 0; i < tagCount && i < tags.length; i++) {
        let tagIndex;
        // Chọn tag chưa thêm vào bài viết
        do {
          tagIndex = Math.floor(Math.random() * tags.length);
        } while (addedTags.includes(tagIndex));
        
        addedTags.push(tagIndex);
        
        // Tạo ngày ngẫu nhiên trong 30 ngày qua
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
        
        postTags.push({
          documentId: uuidv4(),
          post_id: post.documentId,
          page_id: null,
          document_share_id: null,
          tag_id: tags[tagIndex].documentId,
          createdAt: createdDate,
          updatedAt: createdDate
        });
      }
    }

    return queryInterface.bulkInsert('PostTags', postTags);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('PostTags', null, {});
  }
}; 