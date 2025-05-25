'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add columns to performance table
    await queryInterface.addColumn('performance', 'platforms_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Initially allow null to avoid errors during migration
    });

    await queryInterface.addColumn('performance', 'provider_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Initially allow null to avoid errors during migration
    });

    await queryInterface.addColumn('performance', 'url_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Initially allow null to avoid errors during migration
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('performance', {
      fields: ['platforms_id'],
      type: 'foreign key',
      name: 'fk_performance_platforms',
      references: { table: 'platforms', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('performance', {
      fields: ['provider_id'],
      type: 'foreign key',
      name: 'fk_performance_providers',
      references: { table: 'providers', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('performance', {
      fields: ['url_id'],
      type: 'foreign key',
      name: 'fk_performance_urls',
      references: { table: 'urls', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraints
    try {
      await queryInterface.removeConstraint('performance', 'fk_performance_platforms');
      await queryInterface.removeConstraint('performance', 'fk_performance_providers');
      await queryInterface.removeConstraint('performance', 'fk_performance_urls');
    } catch (error) {
      console.log('Error removing constraints:', error.message);
    }

    // Remove columns
    await queryInterface.removeColumn('performance', 'platforms_id');
    await queryInterface.removeColumn('performance', 'provider_id');
    await queryInterface.removeColumn('performance', 'url_id');
  }
};
