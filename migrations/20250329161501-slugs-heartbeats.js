'use strict';
const { nanoid } = require('../dist/utils/nanoid');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('heartbeats', 'slug', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    const [heartbeats] = await queryInterface.sequelize.query(
      'SELECT id FROM heartbeats',
    );

    for (const heartbeat of heartbeats) {
      const slug = nanoid();
      await queryInterface.sequelize.query(
        `UPDATE heartbeats SET slug = :slug WHERE id = :id`,
        {
          replacements: { slug, id: heartbeat.id },
        },
      );
    }
    await queryInterface.changeColumn('heartbeats', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('heartbeats', 'slug');
  },
};
