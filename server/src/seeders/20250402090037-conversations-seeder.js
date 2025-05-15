'use strict';
import { v4 as uuidv4 } from 'uuid';

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
        console.log('No users found. Skipping Conversations seeding.');
        return;
      }

      // Lấy thông tin về Medias
      let medias = [];
      try {
        medias = await queryInterface.sequelize.query(
          "SELECT documentId FROM medias WHERE file_type LIKE '%image%' LIMIT 10;",
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        console.log(`Found ${medias.length} media records for conversations.`);
      } catch (error) {
        console.error('Error querying medias table:', error.message);
      }

      const conversations = [];

      // Tạo các cuộc trò chuyện cá nhân (one-to-one)
      const individualCount = Math.min(15, Math.floor((users.length * (users.length - 1)) / 2));
      
      // Danh sách các cặp người dùng đã tạo cuộc trò chuyện
      const userPairs = [];
      
      for (let i = 0; i < individualCount; i++) {
        let user1Index, user2Index;
        
        // Đảm bảo không tạo cuộc trò chuyện trùng lặp
        do {
          user1Index = Math.floor(Math.random() * users.length);
          user2Index = Math.floor(Math.random() * users.length);
        } while (
          user1Index === user2Index || 
          userPairs.some(pair => 
            (pair[0] === user1Index && pair[1] === user2Index) || 
            (pair[0] === user2Index && pair[1] === user1Index)
          )
        );
        
        userPairs.push([user1Index, user2Index]);
        
        // Ngày tạo ngẫu nhiên trong 90 ngày qua
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));
        
        conversations.push({
          documentId: uuidv4(),
          name: null, // Không cần tên cho cuộc trò chuyện cá nhân
          is_group_chat: false,
          conversation_created_by: users[user1Index].documentId,
          user_chated_with: users[user2Index].documentId,
          image_group_chat: null,
          createdAt: createdDate,
          updatedAt: createdDate
        });
      }
      
      // Tạo các cuộc trò chuyện nhóm
      const groupCount = Math.floor(Math.random() * 7) + 3; // 3-10 nhóm chat
      
      // Tên nhóm chat mẫu
      const groupNames = [
        'Nhóm bạn thân',
        'Đội dự án',
        'Nhóm học tập',
        'Gia đình',
        'Dự án khởi nghiệp',
        'Đi chơi cuối tuần',
        'Đồng nghiệp',
        'Lớp K20',
        'Team marketing',
        'Dự án nghiên cứu'
      ];
      
      for (let i = 0; i < groupCount; i++) {
        // Chọn người tạo nhóm
        const creatorIndex = Math.floor(Math.random() * users.length);
        
        // Chọn ảnh nhóm ngẫu nhiên nếu có
        let groupImage = null;
        if (medias.length > 0 && Math.random() > 0.3) { // 70% nhóm có ảnh
          const mediaIndex = Math.floor(Math.random() * medias.length);
          groupImage = medias[mediaIndex].documentId;
        }
        
        // Chọn tên nhóm
        const nameIndex = Math.floor(Math.random() * groupNames.length);
        const groupName = `${groupNames[nameIndex]} ${i+1}`;
        
        // Ngày tạo ngẫu nhiên trong 90 ngày qua
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));
        
        conversations.push({
          documentId: uuidv4(),
          name: groupName,
          is_group_chat: true,
          conversation_created_by: users[creatorIndex].documentId,
          user_chated_with: null, // Không cần user_chated_with cho group chat
          image_group_chat: groupImage,
          createdAt: createdDate,
          updatedAt: createdDate
        });
      }

      console.log(`Seeding ${conversations.length} conversations...`);
      return queryInterface.bulkInsert('Conversations', conversations);
    } catch (error) {
      console.error('Error seeding Conversations:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Conversations', null, {});
  }
}; 