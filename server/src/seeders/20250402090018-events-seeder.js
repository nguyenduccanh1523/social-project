'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin users để sử dụng làm host
    const users = await queryInterface.sequelize.query(
      'SELECT documentId FROM Users LIMIT 5;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('No users found. Skipping Events seeding.');
      return;
    }

    // Lấy thông tin media để sử dụng làm ảnh sự kiện
    const medias = await queryInterface.sequelize.query(
      'SELECT documentId FROM Medias LIMIT 5;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Danh sách tên sự kiện
    const eventNames = [
      'Workshop Lập Trình Web',
      'Hội Thảo Khởi Nghiệp',
      'Triển Lãm Công Nghệ',
      'Ngày Hội Việc Làm IT',
      'Cuộc Thi Lập Trình',
      'Workshop UX/UI Design',
      'Offline Meeting Cộng Đồng Dev',
      'Talkshow Chuyển Đổi Số',
      'Giao Lưu Doanh Nghiệp',
      'Hội Thảo Blockchain'
    ];

    // Danh sách mô tả sự kiện
    const eventDescriptions = [
      'Workshop chia sẻ kiến thức về lập trình web hiện đại, các công nghệ và framework mới nhất.',
      'Hội thảo chia sẻ kinh nghiệm khởi nghiệp từ các founder thành công trong lĩnh vực công nghệ.',
      'Triển lãm giới thiệu các sản phẩm công nghệ mới nhất từ các doanh nghiệp hàng đầu.',
      'Cơ hội kết nối với các nhà tuyển dụng hàng đầu trong lĩnh vực IT.',
      'Cuộc thi lập trình với nhiều giải thưởng hấp dẫn, thử thách kỹ năng coding.',
      'Workshop chia sẻ kiến thức và kỹ năng thiết kế trải nghiệm người dùng.',
      'Buổi gặp mặt trực tiếp của cộng đồng developer, cơ hội networking và chia sẻ kinh nghiệm.',
      'Talkshow về xu hướng và giải pháp chuyển đổi số cho doanh nghiệp.',
      'Cơ hội giao lưu và kết nối với các doanh nghiệp hàng đầu trong ngành công nghệ.',
      'Hội thảo về công nghệ blockchain và ứng dụng thực tiễn.'
    ];

    // Danh sách địa điểm
    const locations = [
      'Trung tâm Hội nghị Quốc gia, Hà Nội',
      'Đại học Bách Khoa, TP.HCM',
      'Cung Văn hóa Hữu nghị Việt Xô, Hà Nội',
      'Diamond Place, Quận 1, TP.HCM',
      'Trung tâm Triển lãm Quốc tế ICE, Hà Nội',
      'Nhà Văn hóa Sinh viên, TP.HCM',
      'Vincom Center, Đà Nẵng',
      'Trung tâm Hội nghị White Palace, TP.HCM',
      'Cung Hữu nghị Việt Trung, Hà Nội',
      'Pullman Hotel, TP.HCM'
    ];

    const events = [];

    // Tạo 15 sự kiện ngẫu nhiên
    for (let i = 0; i < 15; i++) {
      const nameIndex = i % eventNames.length;
      const descIndex = i % eventDescriptions.length;
      const locIndex = i % locations.length;
      const userIndex = i % users.length;
      const mediaIndex = i % (medias.length || 1);
      
      // Tạo ngày bắt đầu ngẫu nhiên trong 60 ngày tới
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60));
      
      // Tạo ngày kết thúc (1-3 ngày sau ngày bắt đầu)
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1);
      
      events.push({
        documentId: uuidv4(),
        name: `${eventNames[nameIndex]} ${i+1}`,
        description: eventDescriptions[descIndex],
        host_id: users[userIndex].documentId,
        start_time: startDate,
        end_time: endDate,
        location: locations[locIndex],
        event_image: medias.length > 0 ? medias[mediaIndex].documentId : null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('Events', events);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Events', null, {});
  }
}; 