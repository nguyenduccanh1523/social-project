"use strict";
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Kiểm tra nếu bảng medias đã có dữ liệu
      const existingMedias = await queryInterface.sequelize.query(
        "SELECT COUNT(*) as count FROM medias;",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (existingMedias && existingMedias[0] && existingMedias[0].count > 0) {
        console.log(
          `Medias table already has ${existingMedias[0].count} records. Skipping seeding.`
        );
        return;
      }

      // Danh sách mẫu các file_path để seed
      const sampleMedias = [
        {
          documentId: uuidv4(),
          file_path:
            "https://cdn2.fptshop.com.vn/unsafe/Uploads/Images/products/tablet.jpg",
          file_type: "image/jpeg",
          file_size: 1024,
          type_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          file_path: "https://www.example.com/sample-video.mp4",
          file_type: "video/mp4",
          file_size: 10240,
          type_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          file_path:
            "https://img.freepik.com/free-photo/abstract-grunge-decorative.jpg",
          file_type: "image/jpeg",
          file_size: 2048,
          type_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          file_path:
            "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
          file_type: "image/jpeg",
          file_size: 1536,
          type_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          file_path: "https://example.com/profile-picture.jpg",
          file_type: "image/jpeg",
          file_size: 512,
          type_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          file_path: "https://example.com/vacation.mp4",
          file_type: "video/mp4",
          file_size: 15360,
          type_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          file_path: "https://example.com/presentation.pdf",
          file_type: "application/pdf",
          file_size: 3072,
          type_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          documentId: uuidv4(),
          file_path: "https://example.com/document.docx",
          file_type: "application/msword",
          file_size: 2560,
          type_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      console.log(`Seeding ${sampleMedias.length} media records...`);
      return queryInterface.bulkInsert("medias", sampleMedias);
    } catch (error) {
      console.error("Error in medias seeder:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("medias", null, {});
  },
};
