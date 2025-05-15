'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Stories
      const stories = await queryInterface.sequelize.query(
        'SELECT documentId, user_id, expired_at FROM Stories;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (stories.length === 0) {
        console.log('No stories found. Skipping ViewStories seeding.');
        return;
      }

      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        'SELECT documentId FROM Users LIMIT 30;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found. Skipping ViewStories seeding.');
        return;
      }

      const viewStories = [];
      
      // Với mỗi story, tạo các lượt xem
      for (const story of stories) {
        // Số lượng người xem cho mỗi story (2-8 người)
        const viewCount = Math.floor(Math.random() * 7) + 2;
        
        // Danh sách người đã xem để tránh trùng lặp
        const viewerIndexes = [];
        
        // Thêm người xem ngẫu nhiên, nhưng không bao gồm người tạo story
        while (viewerIndexes.length < viewCount && viewerIndexes.length < users.length - 1) {
          const randIndex = Math.floor(Math.random() * users.length);
          
          // Không trùng người và không phải người tạo story
          if (!viewerIndexes.includes(randIndex) && users[randIndex].documentId !== story.user_id) {
            viewerIndexes.push(randIndex);
            
            // Thời điểm xem ngẫu nhiên sau khi tạo story và trước thời điểm hiện tại
            const storyDate = new Date(story.expired_at);
            storyDate.setHours(storyDate.getHours() - 24); // Lấy thời điểm tạo story (24h trước expired_at)
            
            const viewDate = new Date(storyDate);
            // Thêm random từ 1 phút đến 23 giờ
            viewDate.setMinutes(viewDate.getMinutes() + Math.floor(Math.random() * 23 * 60) + 1);
            
            // Nếu viewDate > hiện tại, dùng thời điểm hiện tại
            const now = new Date();
            const actualViewDate = viewDate > now ? now : viewDate;
            
            viewStories.push({
              documentId: uuidv4(),
              user_id: users[randIndex].documentId,
              story_id: story.documentId,
              createdAt: actualViewDate,
              expired_at: story.expired_at, // Sử dụng thời hạn của story
              updatedAt: actualViewDate
            });
          }
        }
      }

      // Giới hạn số lượng để tránh quá tải
      const limitedViewStories = viewStories.slice(0, 200);
      
      console.log(`Seeding ${limitedViewStories.length} view stories...`);
      return queryInterface.bulkInsert('ViewStories', limitedViewStories);
    } catch (error) {
      console.error('Error seeding ViewStories:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ViewStories', null, {});
  }
}; 