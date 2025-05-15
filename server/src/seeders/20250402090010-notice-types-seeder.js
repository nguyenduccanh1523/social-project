'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Kiểm tra xem bảng đã có dữ liệu chưa
      const existingTypes = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM NoticeTypes;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (existingTypes && existingTypes[0] && existingTypes[0].count > 0) {
        console.log(`NoticeTypes table already has ${existingTypes[0].count} records. Skipping seeding.`);
        return;
      }

      // Các loại thông báo
      const noticeTypes = [
        {
          documentId: uuidv4(),
          name: 'friend_request',
          description: 'Thông báo yêu cầu kết bạn',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'friend_accept',
          description: 'Thông báo chấp nhận kết bạn',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'post_like',
          description: 'Thông báo thích bài viết',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'post_comment',
          description: 'Thông báo bình luận bài viết',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'post_share',
          description: 'Thông báo chia sẻ bài viết',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'comment_like',
          description: 'Thông báo thích bình luận',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'comment_reply',
          description: 'Thông báo phản hồi bình luận',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'group_invite',
          description: 'Thông báo lời mời tham gia nhóm',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'group_request',
          description: 'Thông báo yêu cầu tham gia nhóm',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'group_accept',
          description: 'Thông báo chấp nhận tham gia nhóm',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'event_invite',
          description: 'Thông báo lời mời tham gia sự kiện',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'birthday',
          description: 'Thông báo sinh nhật',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'system',
          description: 'Thông báo hệ thống',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          name: 'message',
          description: 'Thông báo tin nhắn mới',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      console.log(`Seeding ${noticeTypes.length} notice types...`);
      return queryInterface.bulkInsert('NoticeTypes', noticeTypes);
    } catch (error) {
      console.error('Error seeding NoticeTypes:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('NoticeTypes', null, {});
  }
}; 