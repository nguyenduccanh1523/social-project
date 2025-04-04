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
      console.log('No posts found. Skipping Comments seeding.');
      return;
    }

    // Lấy thông tin về Users
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 20;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping Comments seeding.');
      return;
    }

    // Mẫu nội dung bình luận
    const commentContents = [
      'Cảm ơn bạn đã chia sẻ thông tin hữu ích!',
      'Tôi rất đồng ý với quan điểm của bạn.',
      'Thật là một bài viết hay, tôi đã học được nhiều điều.',
      'Bạn có thể giải thích thêm về điểm này được không?',
      'Tôi có một số kinh nghiệm về vấn đề này, có thể trao đổi thêm không?',
      'Cách tiếp cận của bạn rất sáng tạo!',
      'Tôi thích cách bạn trình bày vấn đề này.',
      'Đây đúng là những gì tôi đang tìm kiếm, cảm ơn nhiều!',
      'Tôi sẽ áp dụng những kiến thức này vào dự án của mình.',
      'Rất thú vị, tôi chưa bao giờ nghĩ đến điều này.',
      'Bạn có thể chia sẻ thêm tài liệu tham khảo không?',
      'Tôi vừa thử phương pháp này và nó hoạt động rất tốt!',
      'Cảm ơn về bài viết, nhưng tôi có một góc nhìn hơi khác.',
      'Thật tuyệt vời, tôi sẽ chia sẻ điều này với team của tôi.',
      'Đây là một trong những bài viết hay nhất về chủ đề này mà tôi từng đọc.'
    ];

    const comments = [];
    const parentComments = []; // Lưu trữ ID của các comment cha để tạo comment con

    // Số lượng bài viết sẽ có bình luận (60-80% tổng số bài viết)
    const postCount = Math.floor(posts.length * (0.6 + Math.random() * 0.2));
    const postsWithComments = [];
    
    while (postsWithComments.length < postCount) {
      const randIndex = Math.floor(Math.random() * posts.length);
      if (!postsWithComments.includes(randIndex)) {
        postsWithComments.push(randIndex);
      }
    }

    // Tạo comments cho mỗi bài viết được chọn
    for (const postIndex of postsWithComments) {
      const post = posts[postIndex];
      
      // Số lượng bình luận cho mỗi bài viết (2-15 bình luận)
      const commentCount = Math.floor(Math.random() * 14) + 2;
      
      // Tạo bình luận
      for (let i = 0; i < commentCount; i++) {
        const userIndex = Math.floor(Math.random() * users.length);
        const contentIndex = Math.floor(Math.random() * commentContents.length);
        const isReply = i > 0 && Math.random() > 0.7 && parentComments.length > 0; // 30% là bình luận phản hồi
        
        // Tạo ngày ngẫu nhiên trong 45 ngày qua
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 45));
        
        const commentId = uuidv4();
        
        // Nếu là bình luận phản hồi, chọn một bình luận cha ngẫu nhiên
        const parentId = isReply ? 
          parentComments[Math.floor(Math.random() * parentComments.length)] : 
          null;
        
        comments.push({
          documentId: commentId,
          content: commentContents[contentIndex],
          user_id: users[userIndex].documentId,
          post_id: post.documentId,
          parent_id: parentId,
          createdAt: createdDate,
          updatedAt: createdDate
        });
        
        // Nếu không phải là bình luận phản hồi, thêm vào danh sách bình luận cha
        if (!isReply) {
          parentComments.push(commentId);
        }
      }
    }

    return queryInterface.bulkInsert('Comments', comments);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Comments', null, {});
  }
}; 