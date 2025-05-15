"use strict";
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy thông tin users để làm người tạo bài viết
    const users = await queryInterface.sequelize.query(
      "SELECT documentId FROM Users LIMIT 10;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log("No users found. Skipping Posts seeding.");
      return;
    }

    // Lấy thông tin về Types
    const types = await queryInterface.sequelize.query(
      "SELECT documentId FROM Types;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Lấy thông tin về Pages
    try {
      var pages = await queryInterface.sequelize.query(
        "SELECT documentId FROM Pages;",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
    } catch (error) {
      console.log("Page table not found or error. Continuing without pages.");
      var pages = [];
    }

    // Lấy thông tin về Groups
    try {
      var groups = await queryInterface.sequelize.query(
        "SELECT documentId FROM `Groups`;",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
    } catch (error) {
      console.log("Group table not found or error. Continuing without groups.");
      var groups = [];
    }

    // Lấy thông tin về Events
    try {
      var events = await queryInterface.sequelize.query(
        "SELECT documentId, name FROM Events;",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
    } catch (error) {
      console.log("Event table not found or error. Continuing without events.");
      var events = [];
    }

    // Mẫu nội dung bài viết
    const postContents = [
      "Hôm nay tôi vừa học được một kỹ thuật mới về ReactJS. Thật thú vị!",
      "Chúc mừng năm mới đến tất cả mọi người. Chúc các bạn có một năm mới nhiều sức khỏe và thành công!",
      "Ai có kinh nghiệm làm việc với NextJS không? Tôi đang gặp một số vấn đề khi setup dự án.",
      "Vừa hoàn thành dự án lớn sau 3 tháng làm việc không ngừng nghỉ. Cảm thấy thật hạnh phúc!",
      "Chia sẻ với mọi người một số tips để cải thiện hiệu suất làm việc tại nhà: 1. Tạo không gian làm việc riêng biệt. 2. Thiết lập lịch trình cụ thể. 3. Nghỉ ngơi đúng giờ.",
      "Đang tìm đồng nghiệp cho dự án mới về công nghệ AI. Ai quan tâm comment nhé!",
      'Review sách "Clean Code" của Robert C. Martin: Đây là cuốn sách gối đầu giường của mọi lập trình viên.',
      "Chia sẻ kinh nghiệm phỏng vấn xin việc cho các bạn fresher: Hãy chuẩn bị thật kỹ về các kiến thức cơ bản và có một portfolio tốt.",
      "Mọi người có ai biết event tech nào hay ho sắp diễn ra ở TP.HCM không?",
      "Vừa tham gia khóa học về Blockchain. Công nghệ này có tiềm năng thay đổi tương lai!",
    ];

    // Mẫu nội dung bài viết liên quan đến sự kiện
    const eventPostContents = [
      "Mọi người đừng quên tham gia sự kiện {eventName} sắp tới nhé! Đây sẽ là cơ hội tốt để học hỏi và kết nối.",
      "Tôi rất háo hức đến tham dự {eventName}. Ai cũng đi không?",
      "Vừa đăng ký tham gia {eventName}. Mong chờ gặp mọi người tại đó!",
      "Sự kiện {eventName} có nhiều điểm đáng để tham gia đấy. Mọi người nên cân nhắc.",
      "Mời mọi người cùng tham gia {eventName}. Đây sẽ là cơ hội tuyệt vời để mở rộng mạng lưới.",
    ];

    // Mẫu nội dung bài viết liên quan đến group
    const groupPostContents = [
      "Chào mọi người trong nhóm! Mình mới tham gia và rất vui được làm quen.",
      "Cảm ơn admin đã tạo group chia sẻ kiến thức bổ ích này.",
      "Nhóm mình đang ngày càng phát triển, chúc mừng tất cả chúng ta!",
      "Có ai trong nhóm đang tìm partner cho dự án không? Mình đang cần một người cùng hợp tác.",
      "Group có thể tổ chức offline meeting không nhỉ? Sẽ rất tuyệt nếu được gặp mặt mọi người.",
    ];

    // Mẫu nội dung bài viết liên quan đến page
    const pagePostContents = [
      "Cảm ơn mọi người đã theo dõi page của chúng tôi. Chúng tôi sẽ tiếp tục cập nhật các nội dung hữu ích!",
      "Page vừa đạt mốc 1000 người theo dõi! Cảm ơn sự ủng hộ của mọi người.",
      "Đừng quên check page thường xuyên để không bỏ lỡ các tin tức mới nhất nhé!",
      "Chúng tôi sẽ có buổi live stream trên page vào cuối tuần này. Mời mọi người đón xem!",
      "Hãy chia sẻ page với bạn bè nếu bạn thấy nội dung của chúng tôi hữu ích nhé.",
    ];

    const posts = [];
    const totalPosts = 50; // Tăng số lượng bài viết để đa dạng hơn

    for (let i = 0; i < totalPosts; i++) {
      const userIndex = Math.floor(Math.random() * users.length);
      const isPrivate = Math.random() > 0.8; // 20% bài viết là private
      const hasType = types.length > 0 && Math.random() > 0.5; // 50% bài viết có type (nếu có types)

      // Tạo ngày tạo ngẫu nhiên trong 60 ngày qua
      const createdDate = new Date();
      createdDate.setDate(
        createdDate.getDate() - Math.floor(Math.random() * 60)
      );

      // Quyết định loại bài viết: thông thường, liên quan đến event, group hoặc page
      const postType = Math.floor(Math.random() * 4); // 0: thông thường, 1: event, 2: group, 3: page

      let postData = {
        documentId: uuidv4(),
        user_id: users[userIndex].documentId,
        content: "",
        group_id: null,
        page_id: null,
        event_id: null,
        type_id: hasType
          ? types[Math.floor(Math.random() * types.length)].documentId
          : null,
        type: isPrivate ? "private" : "public",
        created_at: createdDate,
        updated_at: createdDate,
        createdAt: createdDate,
        updatedAt: createdDate,
      };

      switch (postType) {
        case 0: // Bài viết thông thường
          postData.content =
            postContents[Math.floor(Math.random() * postContents.length)];
          break;

        case 1: // Bài viết liên quan đến event
          if (events.length > 0) {
            const eventIndex = Math.floor(Math.random() * events.length);
            const eventName = events[eventIndex].name;
            const contentIndex = Math.floor(
              Math.random() * eventPostContents.length
            );

            postData.content = eventPostContents[contentIndex].replace(
              "{eventName}",
              eventName
            );
            postData.event_id = events[eventIndex].documentId;
          } else {
            postData.content =
              postContents[Math.floor(Math.random() * postContents.length)];
          }
          break;

        case 2: // Bài viết trong group
          if (groups.length > 0) {
            const groupIndex = Math.floor(Math.random() * groups.length);
            postData.content =
              groupPostContents[
                Math.floor(Math.random() * groupPostContents.length)
              ];
            postData.group_id = groups[groupIndex].documentId;
          } else {
            postData.content =
              postContents[Math.floor(Math.random() * postContents.length)];
          }
          break;

        case 3: // Bài viết về page
          if (pages.length > 0) {
            const pageIndex = Math.floor(Math.random() * pages.length);
            postData.content =
              pagePostContents[
                Math.floor(Math.random() * pagePostContents.length)
              ];
            postData.page_id = pages[pageIndex].documentId;
          } else {
            postData.content =
              postContents[Math.floor(Math.random() * postContents.length)];
          }
          break;
      }

      posts.push(postData);
    }

    return queryInterface.bulkInsert("Posts", posts);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Posts", null, {});
  },
};
