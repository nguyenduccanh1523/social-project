'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Kiểm tra xem đã có dữ liệu trong bảng Medias chưa
      const existingMedias = await queryInterface.sequelize.query(
        'SELECT * FROM Medias LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ).catch(err => {
        console.log('Lỗi khi kiểm tra bảng Medias:', err.message);
        return [];
      });

      // Nếu đã có dữ liệu, không thêm nữa
      if (existingMedias.length > 0) {
        console.log('Bảng Medias đã có dữ liệu, bỏ qua seeding.');
        return;
      }

      // Lấy một type_id từ bảng Types nếu có
      let typeId = null;
      try {
        const types = await queryInterface.sequelize.query(
          'SELECT documentId FROM Types WHERE name = "Media Type" LIMIT 1',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        if (types.length > 0) {
          typeId = types[0].documentId;
        }
      } catch (error) {
        console.log('Không thể lấy type_id cho media:', error.message);
      }

      // Tạo dữ liệu mẫu cho Medias
      const medias = [
        {
          documentId: uuidv4(),
          file_path: 'https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/174978/Originals/avatar%20one%20piece%20(26).jpg',
          file_type: 'image/jpeg',
          file_size: 1024,
          type_id: typeId,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          documentId: uuidv4(),
          file_path: 'https://img.freepik.com/free-photo/abstract-grunge-decorative-relief-navy-blue-stucco-wall-texture-wide-angle-rough-colored-background_1258-28311.jpg',
          file_type: 'image/jpeg',
          file_size: 2048,
          type_id: typeId,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          documentId: uuidv4(),
          file_path: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
          file_type: 'image/jpeg',
          file_size: 1536,
          type_id: typeId,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          documentId: uuidv4(),
          file_path: 'https://www.example.com/sample-video.mp4',
          file_type: 'video/mp4',
          file_size: 10240,
          type_id: typeId,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      // Lưu ID của các media để sử dụng cho các model khác
      process.env.DEFAULT_AVATAR_ID = medias[0].documentId;
      process.env.DEFAULT_COVER_PHOTO_ID = medias[1].documentId;
      process.env.SAMPLE_POST_IMAGE_ID = medias[2].documentId;
      process.env.SAMPLE_VIDEO_ID = medias[3].documentId;

      // Thêm dữ liệu vào bảng Medias
      await queryInterface.bulkInsert('Medias', medias, {});
      console.log('Đã thêm dữ liệu vào bảng Medias');
    } catch (error) {
      console.error('Lỗi khi seed Medias:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Medias', null, {});
  }
};
