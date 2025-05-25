'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add index on created_at (instead of recorded_at which doesn't exist)
    await queryInterface.addIndex('performance', ['created_at'], {
      name: 'idx_performance_created_at',
    });

    // Add composite index on url_id and created_at
    await queryInterface.addIndex('performance', ['url_id', 'created_at'], {
      name: 'idx_performance_url_created_at',
    });

    // Add composite index to optimize the most common query pattern
    // This index will help with queries that filter by url_id, platform_id, provider_id, and date range
    await queryInterface.addIndex(
      'performance',
      ['url_id', 'platforms_id', 'provider_id', 'created_at'],
      {
        name: 'idx_performance_query_pattern',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove the indexes
    await queryInterface.removeIndex('performance', 'idx_performance_created_at');
    await queryInterface.removeIndex('performance', 'idx_performance_url_created_at');
    await queryInterface.removeIndex('performance', 'idx_performance_query_pattern');
  }
};
