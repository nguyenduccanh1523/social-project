'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Reports chưa
      const existingReports = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM `Reports`;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (existingReports[0].count > 0) {
        console.log('Reports table already has data. Skipping seeding.');
        return;
      }

      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        'SELECT documentId FROM Users LIMIT 20;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found. Skipping Reports seeding.');
        return;
      }

      // Thu thập dữ liệu từ các bảng khác
      let posts = [];
      try {
        posts = await queryInterface.sequelize.query(
          'SELECT documentId, user_id FROM Posts LIMIT 10;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Posts table not found or error. Continuing without posts data.');
      }

      let pages = [];
      try {
        pages = await queryInterface.sequelize.query(
          'SELECT documentId, user_id FROM Pages LIMIT 5;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Pages table not found or error. Continuing without pages data.');
      }

      let groups = [];
      try {
        groups = await queryInterface.sequelize.query(
          'SELECT documentId, user_id FROM `Groups` LIMIT 5;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Groups table not found or error. Continuing without groups data.');
      }

      let events = [];
      try {
        events = await queryInterface.sequelize.query(
          'SELECT documentId, user_id FROM Events LIMIT 5;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Events table not found or error. Continuing without events data.');
      }

      let stories = [];
      try {
        stories = await queryInterface.sequelize.query(
          'SELECT documentId, user_id FROM Stories LIMIT 5;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Stories table not found or error. Continuing without stories data.');
      }

      let documentShares = [];
      try {
        documentShares = await queryInterface.sequelize.query(
          'SELECT documentId, user_id FROM DocumentShares LIMIT 5;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('DocumentShares table not found or error. Continuing without document shares data.');
      }

      let livestreams = [];
      try {
        livestreams = await queryInterface.sequelize.query(
          'SELECT documentId, user_id FROM Livestreams LIMIT 5;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.log('Livestreams table not found or error. Continuing without livestreams data.');
      }

      // Danh sách các lý do báo cáo
      const reportReasons = [
        { name: 'Nội dung không phù hợp', question: 'Nội dung này vi phạm điều khoản sử dụng?' },
        { name: 'Nội dung quấy rối', question: 'Nội dung này đang quấy rối người khác?' },
        { name: 'Thông tin sai lệch', question: 'Thông tin này có đúng không?' },
        { name: 'Spam', question: 'Bạn nghĩ đây là spam?' },
        { name: 'Bản quyền', question: 'Nội dung này vi phạm bản quyền?' },
        { name: 'Lừa đảo', question: 'Bạn cho rằng đây là hành vi lừa đảo?' },
        { name: 'Ngôn từ gây thù ghét', question: 'Nội dung này có chứa ngôn từ thù ghét không?' },
        { name: 'Bạo lực', question: 'Nội dung này có chứa hình ảnh bạo lực không?' },
        { name: 'Xúc phạm', question: 'Nội dung này có xúc phạm bạn hoặc người khác không?' },
        { name: 'Khác', question: 'Vui lòng cung cấp thêm thông tin về vấn đề này?' }
      ];

      // Danh sách trạng thái báo cáo
      const reportStatuses = ['pending', 'reviewing', 'resolved', 'rejected'];

      const reports = [];
      const maxReports = 50; // Giới hạn số báo cáo để tránh quá nhiều dữ liệu
      const usedContentIds = new Set(); // Theo dõi ID đã sử dụng để tránh trùng lặp

      // Tạo báo cáo cho posts
      for (const post of posts) {
        if (reports.length >= maxReports) break;
        
        // Chọn người dùng ngẫu nhiên để báo cáo, không phải người tạo bài viết
        const availableReporters = users.filter(user => user.documentId !== post.user_id);
        if (availableReporters.length === 0) continue;
        
        const reporter = availableReporters[Math.floor(Math.random() * availableReporters.length)];
        const contentKey = `post_${post.documentId}`;
        
        if (!usedContentIds.has(contentKey)) {
          const reason = reportReasons[Math.floor(Math.random() * reportReasons.length)];
          const status = reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
          
          reports.push({
            documentId: uuidv4(),
            name: reason.name,
            question: reason.question,
            user_id: reporter.documentId,
            reported_user_id: post.user_id,
            post_id: post.documentId,
            page_id: null,
            group_id: null,
            event_id: null,
            document_share_id: null,
            story_id: null,
            livestream_id: null,
            status: status,
            resolution_note: status === 'resolved' || status === 'rejected' ? 'Đã xử lý báo cáo này.' : null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          usedContentIds.add(contentKey);
        }
      }

      // Tạo báo cáo cho pages
      for (const page of pages) {
        if (reports.length >= maxReports) break;
        
        const availableReporters = users.filter(user => user.documentId !== page.user_id);
        if (availableReporters.length === 0) continue;
        
        const reporter = availableReporters[Math.floor(Math.random() * availableReporters.length)];
        const contentKey = `page_${page.documentId}`;
        
        if (!usedContentIds.has(contentKey)) {
          const reason = reportReasons[Math.floor(Math.random() * reportReasons.length)];
          const status = reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
          
          reports.push({
            documentId: uuidv4(),
            name: reason.name,
            question: reason.question,
            user_id: reporter.documentId,
            reported_user_id: page.user_id,
            post_id: null,
            page_id: page.documentId,
            group_id: null,
            event_id: null,
            document_share_id: null,
            story_id: null,
            livestream_id: null,
            status: status,
            resolution_note: status === 'resolved' || status === 'rejected' ? 'Đã xử lý báo cáo này.' : null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          usedContentIds.add(contentKey);
        }
      }

      // Tạo báo cáo cho groups
      for (const group of groups) {
        if (reports.length >= maxReports) break;
        
        const availableReporters = users.filter(user => user.documentId !== group.user_id);
        if (availableReporters.length === 0) continue;
        
        const reporter = availableReporters[Math.floor(Math.random() * availableReporters.length)];
        const contentKey = `group_${group.documentId}`;
        
        if (!usedContentIds.has(contentKey)) {
          const reason = reportReasons[Math.floor(Math.random() * reportReasons.length)];
          const status = reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
          
          reports.push({
            documentId: uuidv4(),
            name: reason.name,
            question: reason.question,
            user_id: reporter.documentId,
            reported_user_id: group.user_id,
            post_id: null,
            page_id: null,
            group_id: group.documentId,
            event_id: null,
            document_share_id: null,
            story_id: null,
            livestream_id: null,
            status: status,
            resolution_note: status === 'resolved' || status === 'rejected' ? 'Đã xử lý báo cáo này.' : null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          usedContentIds.add(contentKey);
        }
      }

      // Tạo báo cáo cho events
      for (const event of events) {
        if (reports.length >= maxReports) break;
        
        const availableReporters = users.filter(user => user.documentId !== event.user_id);
        if (availableReporters.length === 0) continue;
        
        const reporter = availableReporters[Math.floor(Math.random() * availableReporters.length)];
        const contentKey = `event_${event.documentId}`;
        
        if (!usedContentIds.has(contentKey)) {
          const reason = reportReasons[Math.floor(Math.random() * reportReasons.length)];
          const status = reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
          
          reports.push({
            documentId: uuidv4(),
            name: reason.name,
            question: reason.question,
            user_id: reporter.documentId,
            reported_user_id: event.user_id,
            post_id: null,
            page_id: null,
            group_id: null,
            event_id: event.documentId,
            document_share_id: null,
            story_id: null,
            livestream_id: null,
            status: status,
            resolution_note: status === 'resolved' || status === 'rejected' ? 'Đã xử lý báo cáo này.' : null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          usedContentIds.add(contentKey);
        }
      }

      // Tạo báo cáo cho stories
      for (const story of stories) {
        if (reports.length >= maxReports) break;
        
        const availableReporters = users.filter(user => user.documentId !== story.user_id);
        if (availableReporters.length === 0) continue;
        
        const reporter = availableReporters[Math.floor(Math.random() * availableReporters.length)];
        const contentKey = `story_${story.documentId}`;
        
        if (!usedContentIds.has(contentKey)) {
          const reason = reportReasons[Math.floor(Math.random() * reportReasons.length)];
          const status = reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
          
          reports.push({
            documentId: uuidv4(),
            name: reason.name,
            question: reason.question,
            user_id: reporter.documentId,
            reported_user_id: story.user_id,
            post_id: null,
            page_id: null,
            group_id: null,
            event_id: null,
            document_share_id: null,
            story_id: story.documentId,
            livestream_id: null,
            status: status,
            resolution_note: status === 'resolved' || status === 'rejected' ? 'Đã xử lý báo cáo này.' : null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          usedContentIds.add(contentKey);
        }
      }

      // Tạo báo cáo cho document shares
      for (const docShare of documentShares) {
        if (reports.length >= maxReports) break;
        
        const availableReporters = users.filter(user => user.documentId !== docShare.user_id);
        if (availableReporters.length === 0) continue;
        
        const reporter = availableReporters[Math.floor(Math.random() * availableReporters.length)];
        const contentKey = `docShare_${docShare.documentId}`;
        
        if (!usedContentIds.has(contentKey)) {
          const reason = reportReasons[Math.floor(Math.random() * reportReasons.length)];
          const status = reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
          
          reports.push({
            documentId: uuidv4(),
            name: reason.name,
            question: reason.question,
            user_id: reporter.documentId,
            reported_user_id: docShare.user_id,
            post_id: null,
            page_id: null,
            group_id: null,
            event_id: null,
            document_share_id: docShare.documentId,
            story_id: null,
            livestream_id: null,
            status: status,
            resolution_note: status === 'resolved' || status === 'rejected' ? 'Đã xử lý báo cáo này.' : null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          usedContentIds.add(contentKey);
        }
      }

      // Tạo báo cáo cho livestreams
      for (const livestream of livestreams) {
        if (reports.length >= maxReports) break;
        
        const availableReporters = users.filter(user => user.documentId !== livestream.user_id);
        if (availableReporters.length === 0) continue;
        
        const reporter = availableReporters[Math.floor(Math.random() * availableReporters.length)];
        const contentKey = `livestream_${livestream.documentId}`;
        
        if (!usedContentIds.has(contentKey)) {
          const reason = reportReasons[Math.floor(Math.random() * reportReasons.length)];
          const status = reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
          
          reports.push({
            documentId: uuidv4(),
            name: reason.name,
            question: reason.question,
            user_id: reporter.documentId,
            reported_user_id: livestream.user_id,
            post_id: null,
            page_id: null,
            group_id: null,
            event_id: null,
            document_share_id: null,
            story_id: null,
            livestream_id: livestream.documentId,
            status: status,
            resolution_note: status === 'resolved' || status === 'rejected' ? 'Đã xử lý báo cáo này.' : null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          usedContentIds.add(contentKey);
        }
      }

      // Tạo báo cáo cho người dùng (không liên quan đến nội dung cụ thể)
      for (let i = 0; i < 10; i++) {
        if (reports.length >= maxReports) break;
        
        // Chọn ngẫu nhiên hai người dùng khác nhau
        const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
        if (shuffledUsers.length < 2) continue;
        
        const reporter = shuffledUsers[0];
        const reportedUser = shuffledUsers[1];
        const contentKey = `user_${reportedUser.documentId}_${i}`;
        
        if (!usedContentIds.has(contentKey)) {
          const reason = reportReasons[Math.floor(Math.random() * reportReasons.length)];
          const status = reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
          
          reports.push({
            documentId: uuidv4(),
            name: reason.name,
            question: reason.question,
            user_id: reporter.documentId,
            reported_user_id: reportedUser.documentId,
            post_id: null,
            page_id: null,
            group_id: null,
            event_id: null,
            document_share_id: null,
            story_id: null,
            livestream_id: null,
            status: status,
            resolution_note: status === 'resolved' || status === 'rejected' ? 'Đã xử lý báo cáo này.' : null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          usedContentIds.add(contentKey);
        }
      }

      console.log(`Seeding ${reports.length} reports...`);
      return queryInterface.bulkInsert('Reports', reports);
    } catch (error) {
      console.error('Error seeding Reports:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Reports', null, {});
  }
}; 