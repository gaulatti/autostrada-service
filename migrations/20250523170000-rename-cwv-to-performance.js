'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check for any foreign key constraints on the cwv table
    try {
      // Get the foreign keys for the cwv table
      const foreignKeys = await queryInterface.sequelize.query(
        `SELECT constraint_name FROM information_schema.table_constraints
         WHERE table_name = 'cwv' AND constraint_type = 'FOREIGN KEY';`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      // Drop each foreign key constraint if it exists
      for (const fk of foreignKeys) {
        await queryInterface.removeConstraint('cwv', fk.constraint_name);
      }
    } catch (error) {
      console.log('No foreign keys to remove or error:', error.message);
    }
    
    // Rename the table
    await queryInterface.renameTable('cwv', 'performance');
    
    // Add the foreign key constraint with the new table name
    await queryInterface.addConstraint('performance', {
      fields: ['heartbeats_id'],
      type: 'foreign key',
      name: 'fk_performance_heartbeats',
      references: { table: 'heartbeats', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the new foreign key constraint
    try {
      await queryInterface.removeConstraint('performance', 'fk_performance_heartbeats');
    } catch (error) {
      console.log('Could not remove constraint:', error.message);
    }
    
    // Rename the table back to its original name
    await queryInterface.renameTable('performance', 'cwv');
    
    // Re-add the original foreign key constraint
    await queryInterface.addConstraint('cwv', {
      fields: ['heartbeats_id'],
      type: 'foreign key',
      name: 'fk_cwv_heartbeats',
      references: { table: 'heartbeats', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
};
