'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin users để làm người tạo bài viết
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 10;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping Posts seeding.');
      return;
    }

    // Lấy thông tin về Types
    const types = await queryInterface.sequelize.query(
      'SELECT documentId FROM Types;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Lấy thông tin về Groups
    try {
      var groups = await queryInterface.sequelize.query(
        'SELECT documentId FROM `Groups`;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
    } catch (error) {
      console.log('Group table not found or error. Continuing without groups.');
      var groups = [];
    }

    // Mẫu nội dung bài viết
    const postContents = [
      'Hôm nay tôi vừa học được một kỹ thuật mới về ReactJS. Thật thú vị!',
      'Chúc mừng năm mới đến tất cả mọi người. Chúc các bạn có một năm mới nhiều sức khỏe và thành công!',
      'Ai có kinh nghiệm làm việc với NextJS không? Tôi đang gặp một số vấn đề khi setup dự án.',
      'Vừa hoàn thành dự án lớn sau 3 tháng làm việc không ngừng nghỉ. Cảm thấy thật hạnh phúc!',
      'Chia sẻ với mọi người một số tips để cải thiện hiệu suất làm việc tại nhà: 1. Tạo không gian làm việc riêng biệt. 2. Thiết lập lịch trình cụ thể. 3. Nghỉ ngơi đúng giờ.',
      'Đang tìm đồng nghiệp cho dự án mới về công nghệ AI. Ai quan tâm comment nhé!',
      'Review sách "Clean Code" của Robert C. Martin: Đây là cuốn sách gối đầu giường của mọi lập trình viên.',
      'Chia sẻ kinh nghiệm phỏng vấn xin việc cho các bạn fresher: Hãy chuẩn bị thật kỹ về các kiến thức cơ bản và có một portfolio tốt.',
      'Mọi người có ai biết event tech nào hay ho sắp diễn ra ở TP.HCM không?',
      'Vừa tham gia khóa học về Blockchain. Công nghệ này có tiềm năng thay đổi tương lai!'
    ];

    const posts = [];
    const totalPosts = 30; // Tổng số bài viết sẽ tạo

    for (let i = 0; i < totalPosts; i++) {
      const userIndex = Math.floor(Math.random() * users.length);
      const contentIndex = Math.floor(Math.random() * postContents.length);
      const isPrivate = Math.random() > 0.8; // 20% bài viết là private
      const hasGroup = groups.length > 0 && Math.random() > 0.7; // 30% bài viết thuộc về group (nếu có groups)
      const hasType = types.length > 0 && Math.random() > 0.5; // 50% bài viết có type (nếu có types)
      
      const groupIndex = hasGroup ? Math.floor(Math.random() * groups.length) : null;
      const typeIndex = hasType ? Math.floor(Math.random() * types.length) : null;
      
      // Tạo ngày tạo ngẫu nhiên trong 60 ngày qua
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));
      
      posts.push({
        documentId: uuidv4(),
        user_id: users[userIndex].documentId,
        content: postContents[contentIndex],
        group_id: hasGroup ? groups[groupIndex].documentId : null,
        page_id: null, // Không gán page_id trong seed
        type_id: hasType ? types[typeIndex].documentId : null,
        type: isPrivate ? 'private' : 'public',
        created_at: createdDate,
        updated_at: createdDate,
        createdAt: createdDate,
        updatedAt: createdDate
      });
    }

    return queryInterface.bulkInsert('Posts', posts);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Posts', null, {});
  }
}; 