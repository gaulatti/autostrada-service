'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the heartbeats table
    await queryInterface.dropTable('heartbeats');
  },

  async down(queryInterface, Sequelize) {
    // This is irreversible - heartbeats functionality has been moved to CWV
    throw new Error('Cannot rollback heartbeats table drop - functionality moved to CWV');
  }
};
