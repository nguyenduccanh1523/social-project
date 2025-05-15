'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin về Posts
    const posts = await queryInterface.sequelize.query(
      'SELECT documentId FROM Posts;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (posts.length === 0) {
      console.log('No posts found. Skipping Reactions seeding.');
      return;
    }

    // Lấy thông tin về Comments
    let comments = [];
    try {
      comments = await queryInterface.sequelize.query(
        'SELECT documentId FROM Comments;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
    } catch (error) {
      console.log('Comments table not found or error. Will only create reactions for posts.');
    }

    // Lấy thông tin về Users
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 30;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping Reactions seeding.');
      return;
    }

    // Các loại reaction
    const reactionTypes = ['like', 'love', 'haha', 'wow', 'sad', 'angry'];

    const reactions = [];

    // Tạo reactions cho posts
    // Chọn 70-90% bài viết để thêm reaction
    const postCount = Math.floor(posts.length * (0.7 + Math.random() * 0.2));
    const postsWithReactions = [];
    
    while (postsWithReactions.length < postCount) {
      const randIndex = Math.floor(Math.random() * posts.length);
      if (!postsWithReactions.includes(randIndex)) {
        postsWithReactions.push(randIndex);
      }
    }

    // Thêm reactions cho mỗi bài viết
    for (const postIndex of postsWithReactions) {
      const post = posts[postIndex];
      
      // Số lượng reaction cho mỗi bài viết (5-20 reactions)
      const reactionCount = Math.floor(Math.random() * 16) + 5;
      
      // Tạo một danh sách những người đã thả reaction để tránh trùng lặp
      const reactedUsers = [];
      
      for (let i = 0; i < reactionCount && i < users.length; i++) {
        let userIndex;
        // Chọn người dùng chưa thả reaction
        do {
          userIndex = Math.floor(Math.random() * users.length);
        } while (reactedUsers.includes(userIndex));
        
        reactedUsers.push(userIndex);
        
        // Chọn loại reaction ngẫu nhiên
        const reactionTypeIndex = Math.floor(Math.random() * reactionTypes.length);
        
        // Tạo ngày ngẫu nhiên trong 30 ngày qua
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
        
        reactions.push({
          documentId: uuidv4(),
          user_id: users[userIndex].documentId,
          post_id: post.documentId,
          comment_id: null,
          reaction_type: reactionTypes[reactionTypeIndex],
          createdAt: createdDate,
          updatedAt: createdDate
        });
      }
    }

    // Tạo reactions cho comments nếu có
    if (comments.length > 0) {
      // Chọn 50-70% comments để thêm reaction
      const commentCount = Math.floor(comments.length * (0.5 + Math.random() * 0.2));
      const commentsWithReactions = [];
      
      while (commentsWithReactions.length < commentCount) {
        const randIndex = Math.floor(Math.random() * comments.length);
        if (!commentsWithReactions.includes(randIndex)) {
          commentsWithReactions.push(randIndex);
        }
      }

      // Thêm reactions cho mỗi comment
      for (const commentIndex of commentsWithReactions) {
        const comment = comments[commentIndex];
        
        // Số lượng reaction cho mỗi comment (1-8 reactions)
        const reactionCount = Math.floor(Math.random() * 8) + 1;
        
        // Tạo một danh sách những người đã thả reaction để tránh trùng lặp
        const reactedUsers = [];
        
        for (let i = 0; i < reactionCount && i < users.length; i++) {
          let userIndex;
          // Chọn người dùng chưa thả reaction
          do {
            userIndex = Math.floor(Math.random() * users.length);
          } while (reactedUsers.includes(userIndex));
          
          reactedUsers.push(userIndex);
          
          // Chọn loại reaction ngẫu nhiên (thường là like cho comments)
          const reactionTypeIndex = Math.floor(Math.random() * 3); // Chủ yếu là like, love, haha
          
          // Tạo ngày ngẫu nhiên trong 30 ngày qua
          const createdDate = new Date();
          createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
          
          reactions.push({
            documentId: uuidv4(),
            user_id: users[userIndex].documentId,
            post_id: null,
            comment_id: comment.documentId,
            reaction_type: reactionTypes[reactionTypeIndex],
            createdAt: createdDate,
            updatedAt: createdDate
          });
        }
      }
    }

    return queryInterface.bulkInsert('Reactions', reactions);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Reactions', null, {});
  }
}; 