'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        documentId: uuidv4(),
        name: 'Tài khoản và Bảo mật',
        description: 'Hỗ trợ về các vấn đề liên quan đến tài khoản, đăng nhập và bảo mật thông tin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: uuidv4(),
        name: 'Bài viết và Nội dung',
        description: 'Hướng dẫn đăng, chỉnh sửa bài viết và quản lý nội dung cá nhân',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: uuidv4(),
        name: 'Nhóm và Sự kiện',
        description: 'Giải đáp về cách tạo, quản lý và tham gia các nhóm, sự kiện trên hệ thống',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: uuidv4(),
        name: 'Trang và Doanh nghiệp',
        description: 'Hỗ trợ về việc tạo và quản lý trang doanh nghiệp, thương hiệu',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        documentId: uuidv4(),
        name: 'Chia sẻ tài liệu',
        description: 'Hướng dẫn chia sẻ và tương tác với tài liệu trên nền tảng',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return queryInterface.bulkInsert('CategorySupports', categories);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('CategorySupports', null, {});
  }
}; 