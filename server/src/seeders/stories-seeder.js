'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Lấy thông tin về Users
      const users = await queryInterface.sequelize.query(
        'SELECT documentId FROM Users LIMIT 20;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (users.length === 0) {
        console.log('No users found. Skipping Stories seeding.');
        return;
      }

      // Lấy thông tin về Medias
      let medias = [];
      try {
        medias = await queryInterface.sequelize.query(
          "SELECT documentId, file_type FROM medias WHERE file_type LIKE '%image%' OR file_type LIKE '%video%' LIMIT 20;",
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        console.log(`Found ${medias.length} media records for stories.`);
      } catch (error) {
        console.error('Error querying medias table:', error.message);
      }

      // Lấy thông tin về Types
      let types = [];
      try {
        types = await queryInterface.sequelize.query(
          'SELECT documentId FROM Types LIMIT 5;',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.error('Error querying Types table:', error.message);
        return;
      }

      if (types.length === 0) {
        console.log('No types found. Skipping Stories seeding.');
        return;
      }

      const stories = [];
      
      // Các loại Story
      const storyTypes = ['image', 'video', 'text'];
      
      // Các background cho text stories
      const backgrounds = [
        '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A8',
        'linear-gradient(45deg, #FF5733, #33FF57)',
        'linear-gradient(135deg, #3357FF, #F033FF)',
        'linear-gradient(225deg, #FF33A8, #FF5733)',
        'linear-gradient(315deg, #33FF57, #3357FF)'
      ];
      
      // Các mẫu nội dung text
      const textContents = [
        'Hôm nay là một ngày tuyệt vời!',
        'Đã đến lúc để thay đổi!',
        'Hãy luôn tích cực và hạnh phúc!',
        'Cuộc sống vẫn luôn tươi đẹp!',
        'Đừng bao giờ từ bỏ ước mơ!',
        'Thành công không đến từ may mắn!',
        'Sống là để trải nghiệm!',
        'Mỗi ngày là một khởi đầu mới!',
        'Hãy mỉm cười với cuộc sống!',
        'Thời gian là thứ quý giá nhất!'
      ];

      // Tạo stories cho mỗi user
      for (const user of users) {
        // Số lượng story cho mỗi user (0-3)
        const storyCount = Math.floor(Math.random() * 4);
        
        for (let i = 0; i < storyCount; i++) {
          // Chọn loại story ngẫu nhiên
          const storyTypeIndex = Math.floor(Math.random() * storyTypes.length);
          const storyType = storyTypes[storyTypeIndex];
          
          // Ngày tạo trong vòng 24 giờ qua
          const createdDate = new Date();
          createdDate.setHours(createdDate.getHours() - Math.floor(Math.random() * 24));
          
          // Ngày hết hạn (24 giờ sau khi tạo)
          const expiredDate = new Date(createdDate);
          expiredDate.setHours(expiredDate.getHours() + 24);
          
          // Chọn type_id ngẫu nhiên
          const typeIndex = Math.floor(Math.random() * types.length);
          
          let story = {
            documentId: uuidv4(),
            user_id: user.documentId,
            story_type: storyType,
            status_story: 'active',
            type_id: types[typeIndex].documentId,
            createdAt: createdDate,
            expired_at: expiredDate,
            updatedAt: createdDate
          };
          
          // Tùy thuộc vào loại story, thêm các thuộc tính tương ứng
          if (storyType === 'text') {
            // Text story
            const textIndex = Math.floor(Math.random() * textContents.length);
            const bgIndex = Math.floor(Math.random() * backgrounds.length);
            
            story.text = textContents[textIndex];
            story.background = backgrounds[bgIndex];
            story.media_id = null;
          } else {
            // Image hoặc video story
            if (medias.length > 0) {
              // Lọc media phù hợp với loại story
              const filteredMedias = medias.filter(media => {
                if (storyType === 'image') return media.file_type.includes('image');
                if (storyType === 'video') return media.file_type.includes('video');
                return true;
              });
              
              if (filteredMedias.length > 0) {
                const mediaIndex = Math.floor(Math.random() * filteredMedias.length);
                story.media_id = filteredMedias[mediaIndex].documentId;
              } else {
                // Nếu không có media phù hợp, chuyển thành text story
                const textIndex = Math.floor(Math.random() * textContents.length);
                const bgIndex = Math.floor(Math.random() * backgrounds.length);
                
                story.text = textContents[textIndex];
                story.background = backgrounds[bgIndex];
                story.media_id = null;
                story.story_type = 'text';
              }
            } else {
              // Nếu không có media nào, chuyển thành text story
              const textIndex = Math.floor(Math.random() * textContents.length);
              const bgIndex = Math.floor(Math.random() * backgrounds.length);
              
              story.text = textContents[textIndex];
              story.background = backgrounds[bgIndex];
              story.media_id = null;
              story.story_type = 'text';
            }
          }
          
          stories.push(story);
        }
      }

      // Giới hạn số lượng story để tránh quá tải
      const limitedStories = stories.slice(0, 50);
      
      console.log(`Seeding ${limitedStories.length} stories...`);
      return queryInterface.bulkInsert('Stories', limitedStories);
    } catch (error) {
      console.error('Error seeding Stories:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Stories', null, {});
  }
}; 