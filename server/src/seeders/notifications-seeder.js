'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về NoticeTypes
      const noticeTypes = await queryInterface.sequelize.query(
        'SELECT documentId, name FROM NoticeTypes;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (noticeTypes.length === 0) {
        console.log('No notice types found. Skipping Notifications seeding.');
        return;
      }

      // Mẫu nội dung thông báo dựa trên loại thông báo
      const notificationTemplates = {
        'friend_request': {
          title: 'Yêu cầu kết bạn',
          content: '{user} đã gửi cho bạn lời mời kết bạn.',
          link: '/friends/requests'
        },
        'friend_accept': {
          title: 'Chấp nhận kết bạn',
          content: '{user} đã chấp nhận lời mời kết bạn của bạn.',
          link: '/friends'
        },
        'post_like': {
          title: 'Thích bài viết',
          content: '{user} đã thích bài viết của bạn.',
          link: '/posts/{id}'
        },
        'post_comment': {
          title: 'Bình luận bài viết',
          content: '{user} đã bình luận về bài viết của bạn.',
          link: '/posts/{id}'
        },
        'post_share': {
          title: 'Chia sẻ bài viết',
          content: '{user} đã chia sẻ bài viết của bạn.',
          link: '/posts/{id}'
        },
        'comment_like': {
          title: 'Thích bình luận',
          content: '{user} đã thích bình luận của bạn.',
          link: '/posts/{id}'
        },
        'comment_reply': {
          title: 'Phản hồi bình luận',
          content: '{user} đã phản hồi bình luận của bạn.',
          link: '/posts/{id}'
        },
        'group_invite': {
          title: 'Lời mời tham gia nhóm',
          content: '{user} đã mời bạn tham gia nhóm {group}.',
          link: '/groups/{id}/invitations'
        },
        'group_request': {
          title: 'Yêu cầu tham gia nhóm',
          content: '{user} muốn tham gia nhóm {group}.',
          link: '/groups/{id}/requests'
        },
        'group_accept': {
          title: 'Chấp nhận tham gia nhóm',
          content: 'Yêu cầu tham gia nhóm {group} của bạn đã được chấp nhận.',
          link: '/groups/{id}'
        },
        'event_invite': {
          title: 'Lời mời tham gia sự kiện',
          content: '{user} đã mời bạn tham gia sự kiện {event}.',
          link: '/events/{id}'
        },
        'birthday': {
          title: 'Sinh nhật',
          content: 'Hôm nay là sinh nhật của {user}!',
          link: '/profile/{id}'
        },
        'system': {
          title: 'Thông báo hệ thống',
          content: '{content}',
          link: '/notifications'
        },
        'message': {
          title: 'Tin nhắn mới',
          content: 'Bạn có tin nhắn mới từ {user}.',
          link: '/messages/{id}'
        }
      };

      // Tạo danh sách thông báo
      const notifications = [];
      
      // Số lượng thông báo (30-50 thông báo)
      const notificationCount = Math.floor(Math.random() * 21) + 30;
      
      for (let i = 0; i < notificationCount; i++) {
        // Chọn loại thông báo ngẫu nhiên
        const noticeTypeIndex = Math.floor(Math.random() * noticeTypes.length);
        const noticeType = noticeTypes[noticeTypeIndex];
        
        // Lấy template tương ứng với loại thông báo
        const template = notificationTemplates[noticeType.name] || notificationTemplates['system'];
        
        // Tạo nội dung thông báo
        const user = 'Người dùng ' + (Math.floor(Math.random() * 100) + 1);
        const group = 'Nhóm ' + (Math.floor(Math.random() * 20) + 1);
        const event = 'Sự kiện ' + (Math.floor(Math.random() * 10) + 1);
        const id = uuidv4().substring(0, 8);
        
        let content = template.content
          .replace('{user}', user)
          .replace('{group}', group)
          .replace('{event}', event)
          .replace('{content}', 'Nội dung thông báo hệ thống ' + (i + 1));
        
        let link = template.link
          .replace('{id}', id);
        
        // Xác định xem có phải thông báo toàn cục không (10% cơ hội)
        const isGlobal = Math.random() < 0.1;
        
        // Thời gian tạo ngẫu nhiên trong 90 ngày qua
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));
        
        notifications.push({
          documentId: uuidv4(),
          title: template.title,
          content: content,
          link: link,
          is_read: false,
          is_global: isGlobal,
          notice_type_id: noticeType.documentId,
          createdAt: createdDate,
          updatedAt: createdDate
        });
      }

      console.log(`Seeding ${notifications.length} notifications...`);
      return queryInterface.bulkInsert('Notifications', notifications);
    } catch (error) {
      console.error('Error seeding Notifications:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Notifications', null, {});
  }
}; 