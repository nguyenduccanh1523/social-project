'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Xem nếu status_activity_id tồn tại, đổi tên thành status_id
    try {
      const tableInfo = await queryInterface.describeTable('Users');
      if (tableInfo.status_activity_id && !tableInfo.status_id) {
        await queryInterface.renameColumn('Users', 'status_activity_id', 'status_id');
        console.log('Renamed column status_activity_id to status_id');
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const tableInfo = await queryInterface.describeTable('Users');
      if (tableInfo.status_id && !tableInfo.status_activity_id) {
        await queryInterface.renameColumn('Users', 'status_id', 'status_activity_id');
        console.log('Renamed column status_id back to status_activity_id');
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  }
};
