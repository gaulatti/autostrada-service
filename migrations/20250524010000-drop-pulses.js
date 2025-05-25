'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the pulses table which is no longer needed
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS pulses;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Recreating the pulses table is not supported as we're removing this entirely from the application
    console.warn('Down migration not supported for dropping pulses table');
  }
};
