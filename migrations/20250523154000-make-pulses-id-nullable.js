'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Make pulses_id nullable to support direct heartbeat creation without pulses
    await queryInterface.changeColumn('heartbeats', 'pulses_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to non-nullable (this might fail if there are null values)
    await queryInterface.changeColumn('heartbeats', 'pulses_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
