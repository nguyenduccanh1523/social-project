'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Pages chưa
      const existingPages = await queryInterface.sequelize.query(
        'SELECT * FROM Pages LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Pages:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingPages.length > 0) {
        console.log('Bảng Pages đã có dữ liệu, bỏ qua seeding.');
        return;
      }

      // Lấy User IDs từ env hoặc từ bảng Users
      let user1Id = process.env.USER_1_ID;
      let adminId = process.env.ADMIN_ID;
      
      if (!user1Id || !adminId) {
        try {
          const users = await queryInterface.sequelize.query(
            'SELECT documentId, username FROM Users',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (users.length > 0) {
            const user1 = users.find(user => user.username === 'user1');
            const admin = users.find(user => user.username === 'admin');
            
            if (user1) user1Id = user1.documentId;
            if (admin) adminId = admin.documentId;
          }
        } catch (error) {
          console.log('Không thể lấy user_id cho pages:', error.message);
          return;
        }
      }

      // Lấy Type ID cho trang
      let typeId = null;
      try {
        const types = await queryInterface.sequelize.query(
          'SELECT documentId FROM Types WHERE name = "Page" LIMIT 1',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        if (types.length > 0) {
          typeId = types[0].documentId;
        }
      } catch (error) {
        console.log('Không thể lấy type_id cho page:', error.message);
      }

      // Lấy Media ID cho avatar và cover photo
      let avatarId = process.env.DEFAULT_AVATAR_ID;
      let coverPhotoId = process.env.DEFAULT_COVER_PHOTO_ID;
      
      if (!avatarId || !coverPhotoId) {
        try {
          const medias = await queryInterface.sequelize.query(
            'SELECT documentId FROM Medias LIMIT 2',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (medias.length > 0) {
            avatarId = medias[0].documentId;
            if (medias.length > 1) {
              coverPhotoId = medias[1].documentId;
            }
          }
        } catch (error) {
          console.log('Không thể lấy media_id cho page:', error.message);
        }
      }
      
      // Lấy Nation ID
      let nationId = null;
      try {
        const nations = await queryInterface.sequelize.query(
          'SELECT documentId FROM Nations LIMIT 1',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        if (nations.length > 0) {
          nationId = nations[0].documentId;
        }
      } catch (error) {
        console.log('Không thể lấy nation_id cho page:', error.message);
      }

      // Tạo dữ liệu mẫu cho Pages
      const page1Id = uuidv4();
      const page2Id = uuidv4();
      
      // Lưu page IDs vào env để sử dụng cho các models khác
      process.env.PAGE_1_ID = page1Id;
      process.env.PAGE_2_ID = page2Id;
      
      const pages = [
        {
          documentId: page1Id,
          page_name: 'Trang công nghệ',
          intro: 'Thông tin về công nghệ mới nhất',
          about: 'Chia sẻ các thông tin công nghệ mới nhất trên thế giới',
          author: user1Id,
          profile_picture: avatarId,
          cover_picture: coverPhotoId,
          email: 'tech@example.com',
          phone: '+84123456789',
          lives_in: nationId,
          rate: '4.5',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          documentId: page2Id,
          page_name: 'Trang thiết kế',
          intro: 'Chia sẻ các dự án thiết kế đẹp',
          about: 'Nơi chia sẻ các thiết kế đẹp và sáng tạo',
          author: adminId,
          profile_picture: avatarId,
          cover_picture: coverPhotoId,
          email: 'design@example.com',
          phone: '+84987654321',
          lives_in: nationId,
          rate: '4.8',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Thêm dữ liệu vào bảng Pages
      await queryInterface.bulkInsert('Pages', pages, {});
      console.log('Đã thêm dữ liệu vào bảng Pages');
    } catch (error) {
      console.error('Lỗi khi seed Pages:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pages', null, {});
  }
}; 