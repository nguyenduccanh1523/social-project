'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy ID của các CategorySupport
    const categorySupportIds = await queryInterface.sequelize.query(
      'SELECT documentId FROM CategorySupports;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (categorySupportIds.length === 0) {
      console.log('No CategorySupports found. Skipping Guides seeding.');
      return;
    }

    const guides = [];

    // Mảng các tiêu đề hướng dẫn theo từng danh mục
    const guideTitles = {
      'Tài khoản và Bảo mật': [
        'Hướng dẫn đổi mật khẩu tài khoản',
        'Cách bật xác thực hai lớp',
        'Khôi phục tài khoản bị mất quyền truy cập'
      ],
      'Bài viết và Nội dung': [
        'Cách tạo bài viết có hình ảnh và video',
        'Hướng dẫn chỉnh sửa và xóa bài viết',
        'Quản lý quyền riêng tư cho bài đăng'
      ],
      'Nhóm và Sự kiện': [
        'Hướng dẫn tạo nhóm mới',
        'Quản lý thành viên trong nhóm',
        'Tạo và quản lý sự kiện'
      ],
      'Trang và Doanh nghiệp': [
        'Tạo trang doanh nghiệp từ A-Z',
        'Cách thiết lập giờ mở cửa cho trang',
        'Quản lý bài đăng doanh nghiệp hiệu quả'
      ],
      'Chia sẻ tài liệu': [
        'Hướng dẫn đăng tải tài liệu lên hệ thống',
        'Cách chia sẻ tài liệu với người khác',
        'Quản lý quyền truy cập tài liệu'
      ]
    };
    
    // Lấy thông tin tên của từng danh mục
    const categoryNames = await queryInterface.sequelize.query(
      'SELECT documentId, name FROM CategorySupports;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    // Map từ ID sang tên danh mục
    const idToNameMap = {};
    categoryNames.forEach(cat => {
      idToNameMap[cat.documentId] = cat.name;
    });

    // Tạo Guide cho mỗi danh mục hỗ trợ
    for (const cat of categorySupportIds) {
      const categoryName = idToNameMap[cat.documentId];
      const titlesForCategory = guideTitles[categoryName] || ['Hướng dẫn sử dụng cơ bản'];
      
      for (let i = 0; i < titlesForCategory.length; i++) {
        guides.push({
          documentId: uuidv4(),
          title: titlesForCategory[i],
          content: `
# ${titlesForCategory[i]}

## Giới thiệu
Đây là hướng dẫn chi tiết về ${titlesForCategory[i].toLowerCase()}.

## Các bước thực hiện
1. Bước 1: Đăng nhập vào tài khoản của bạn
2. Bước 2: Điều hướng đến mục cài đặt
3. Bước 3: Thực hiện các tùy chỉnh cần thiết
4. Bước 4: Lưu thay đổi

## Lưu ý quan trọng
- Đảm bảo bạn đã đăng nhập với đúng tài khoản
- Kiểm tra kỹ thông tin trước khi xác nhận
- Liên hệ hỗ trợ nếu gặp vấn đề

## Kết luận
Hy vọng hướng dẫn này giúp bạn thực hiện thành công. Nếu có thắc mắc, hãy liên hệ đội ngũ hỗ trợ.
          `,
          category_id: cat.documentId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return queryInterface.bulkInsert('Guides', guides);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Guides', null, {});
  }
}; 