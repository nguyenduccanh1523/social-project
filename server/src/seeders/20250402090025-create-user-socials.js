'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng UserSocials chưa
      const existingUserSocials = await queryInterface.sequelize.query(
        'SELECT * FROM UserSocials LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng UserSocials:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingUserSocials.length > 0) {
        console.log('Bảng UserSocials đã có dữ liệu, bỏ qua seeding.');
        return;
      }

      // Lấy User IDs từ env hoặc từ bảng Users
      let user1Id = process.env.USER_1_ID;
      let user2Id = process.env.USER_2_ID;
      
      if (!user1Id || !user2Id) {
        try {
          const users = await queryInterface.sequelize.query(
            'SELECT documentId, username FROM Users',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (users.length > 0) {
            const user1 = users.find(user => user.username === 'user1');
            const user2 = users.find(user => user.username === 'user2');
            
            if (user1) user1Id = user1.documentId;
            if (user2) user2Id = user2.documentId;
          }
        } catch (error) {
          console.log('Không thể lấy user_id cho user socials:', error.message);
          return;
        }
      }

      // Lấy Social IDs từ env hoặc từ bảng Socials
      let social1Id = process.env.SOCIAL_1_ID;
      let social2Id = process.env.SOCIAL_2_ID;
      let social3Id = process.env.SOCIAL_3_ID;
      
      if (!social1Id || !social2Id || !social3Id) {
        try {
          const socials = await queryInterface.sequelize.query(
            'SELECT documentId, platform FROM Socials',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (socials.length > 0) {
            const social1 = socials.find(social => social.platform === 'Facebook');
            const social2 = socials.find(social => social.platform === 'Twitter');
            const social3 = socials.find(social => social.platform === 'LinkedIn');
            
            if (social1) social1Id = social1.documentId;
            if (social2) social2Id = social2.documentId;
            if (social3) social3Id = social3.documentId;
          }
        } catch (error) {
          console.log('Không thể lấy social_id cho user socials:', error.message);
          return;
        }
      }
      
      // Tạo dữ liệu mẫu cho UserSocials
      const userSocials = [
        {
          documentId: uuidv4(),
          user_id: user1Id,
          social_id: social1Id,
          accountUrl: 'https://facebook.com/user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user1Id,
          social_id: social2Id,
          accountUrl: 'https://twitter.com/user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user2Id,
          social_id: social1Id,
          accountUrl: 'https://facebook.com/user2',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: uuidv4(),
          user_id: user2Id,
          social_id: social3Id,
          accountUrl: 'https://linkedin.com/in/user2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Thêm dữ liệu vào bảng UserSocials
      await queryInterface.bulkInsert('UserSocials', userSocials, {});
      console.log('Đã thêm dữ liệu vào bảng UserSocials');
    } catch (error) {
      console.error('Lỗi khi seed UserSocials:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserSocials', null, {});
  }
}; 