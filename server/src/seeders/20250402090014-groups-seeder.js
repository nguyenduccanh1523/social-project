'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin users để làm admin
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 10;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping Groups seeding.');
      return;
    }

    // Lấy thông tin Media để làm group_image
    const medias = await queryInterface.sequelize.query(
      'SELECT documentId FROM Medias LIMIT 10;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Lấy thông tin Types cho loại nhóm
    const types = await queryInterface.sequelize.query(
      'SELECT documentId FROM Types;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Danh sách tên nhóm mẫu
    const groupNames = [
      'Nhóm Lập Trình Viên Việt Nam',
      'Cộng Đồng Framework X',
      'Hỗ Trợ Kỹ Thuật Công Nghệ',
      'Chia Sẻ Kiến Thức IT',
      'Tuyển Dụng IT',
      'UX/UI Designer Vietnam',
      'Nhóm Học Machine Learning',
      'DevOps Việt Nam',
      'Mobile Developers',
      'Blockchain Enthusiasts'
    ];

    // Danh sách mô tả nhóm mẫu
    const groupDescriptions = [
      'Diễn đàn trao đổi, học hỏi dành cho các lập trình viên tại Việt Nam',
      'Cộng đồng dành cho những người đam mê và làm việc với Framework X',
      'Nơi bạn có thể đặt câu hỏi và nhận sự trợ giúp về các vấn đề kỹ thuật',
      'Nơi mọi người có thể chia sẻ kiến thức, bài viết, và tài nguyên học tập IT',
      'Kết nối nhà tuyển dụng và ứng viên trong lĩnh vực công nghệ thông tin',
      'Cộng đồng cho những người làm việc trong lĩnh vực thiết kế UX/UI',
      'Nơi trao đổi và học hỏi về Machine Learning, AI và Data Science',
      'Diễn đàn dành cho những người làm DevOps, SRE và Cloud Computing',
      'Cộng đồng phát triển ứng dụng di động trên các nền tảng iOS, Android',
      'Nơi thảo luận về Blockchain, Cryptocurrency và Web3'
    ];

    const groups = [];
    const totalGroups = 15; // Số lượng nhóm sẽ tạo

    for (let i = 0; i < totalGroups; i++) {
      const nameIndex = i % groupNames.length;
      const descIndex = i % groupDescriptions.length;
      const userIndex = i % users.length;
      
      // Có media và type không phụ thuộc vào sự tồn tại của chúng
      const hasMedia = medias.length > 0 && Math.random() > 0.3;
      const hasType = types.length > 0 && Math.random() > 0.2;
      
      const mediaIndex = hasMedia ? Math.floor(Math.random() * medias.length) : null;
      const typeIndex = hasType ? Math.floor(Math.random() * types.length) : null;

      // Tạo ngày tạo ngẫu nhiên trong 90 ngày qua
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));
      
      groups.push({
        documentId: uuidv4(),
        group_name: `${groupNames[nameIndex]} ${i+1}`,
        description: groupDescriptions[descIndex],
        admin_id: users[userIndex].documentId,
        group_image: hasMedia ? medias[mediaIndex].documentId : null,
        type_id: hasType ? types[typeIndex].documentId : null,
        createdAt: createdDate,
        updatedAt: createdDate
      });
    }

    return queryInterface.bulkInsert('Groups', groups);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Groups', null, {});
  }
}; 