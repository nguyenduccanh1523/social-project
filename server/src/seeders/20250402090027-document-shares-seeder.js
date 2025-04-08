'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin user để làm author
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 5;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping DocumentShares seeding.');
      return;
    }

    // Lấy thông tin media để đính kèm
    const medias = await queryInterface.sequelize.query(
      'SELECT documentId FROM Medias LIMIT 5;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const documentShares = [];
    
    // Danh sách các tiêu đề và mô tả mẫu
    const titles = [
      'Hướng dẫn sử dụng Excel cơ bản',
      'Báo cáo thị trường quý 1/2023',
      'Tài liệu đào tạo nhân viên mới',
      'Kỹ năng giao tiếp hiệu quả',
      'Tổng hợp kiến thức marketing online',
      'Quy trình làm việc nhóm hiệu quả',
      'Tài liệu phân tích dữ liệu',
      'Cẩm nang phỏng vấn ứng viên'
    ];
    
    const descriptions = [
      'Tài liệu hướng dẫn chi tiết về cách sử dụng các tính năng cơ bản trong Excel',
      'Báo cáo tổng hợp và phân tích tình hình thị trường trong quý 1 năm 2023',
      'Tài liệu đào tạo dành cho nhân viên mới gia nhập công ty',
      'Tổng hợp các kỹ năng giao tiếp cần thiết trong môi trường làm việc',
      'Các kiến thức và chiến lược marketing online hiện đại',
      'Quy trình và phương pháp làm việc nhóm để đạt hiệu quả cao',
      'Hướng dẫn phân tích và xử lý dữ liệu trong công việc',
      'Tài liệu hướng dẫn cách phỏng vấn và đánh giá ứng viên'
    ];

    // Tạo 10 document shares
    for (let i = 0; i < 10; i++) {
      const titleIndex = i % titles.length;
      const userIndex = i % users.length;
      const mediaIndex = i % (medias.length || 1);

      documentShares.push({
        documentId: uuidv4(),
        title: titles[titleIndex],
        description: descriptions[titleIndex],
        content: `
# ${titles[titleIndex]}

## Giới thiệu
${descriptions[titleIndex]}

## Nội dung chính
1. Phần 1: Tổng quan
2. Phần 2: Chi tiết về chủ đề
3. Phần 3: Các bước thực hiện
4. Phần 4: Ví dụ thực tế
5. Phần 5: Tổng kết

## Đặc điểm nổi bật
- Dễ hiểu và áp dụng
- Bao gồm các ví dụ thực tế
- Được cập nhật thường xuyên
- Có tài liệu tham khảo đầy đủ

## Kết luận
Tài liệu này cung cấp đầy đủ thông tin cần thiết về chủ đề. Nếu có thắc mắc hoặc góp ý, vui lòng liên hệ tác giả.

## Tài liệu tham khảo
1. Reference 1
2. Reference 2
3. Reference 3
`,
        thumbnail: `https://picsum.photos/id/${(i + 10)}/800/600`,
        media_id: medias.length > 0 ? medias[mediaIndex].documentId : null,
        is_global: Math.random() > 0.5, // 50% là global
        link_document: `https://docs.example.com/doc-${i+1}`,
        author: users[userIndex].documentId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('DocumentShares', documentShares);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('DocumentShares', null, {});
  }
}; 