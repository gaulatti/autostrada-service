'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Get all foreign key constraints that reference the heartbeats table from any table
      const foreignKeys = await queryInterface.sequelize.query(
        `SELECT 
           TABLE_NAME,
           CONSTRAINT_NAME 
         FROM information_schema.KEY_COLUMN_USAGE 
         WHERE REFERENCED_TABLE_NAME = 'heartbeats' 
           AND TABLE_SCHEMA = DATABASE();`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      // Remove each foreign key constraint
      for (const fk of foreignKeys) {
        queryInterface.sequelize.log(`Removing foreign key constraint ${fk.CONSTRAINT_NAME} from table ${fk.TABLE_NAME}`);
        try {
          await queryInterface.removeConstraint(fk.TABLE_NAME, fk.CONSTRAINT_NAME);
        } catch (error) {
          queryInterface.sequelize.log(`Could not remove constraint ${fk.CONSTRAINT_NAME}: ${error.message}`);
        }
      }

      // Check and remove heartbeats_id columns from any tables that might have them
      const tablesToCheck = ['performance'];
      
      for (const tableName of tablesToCheck) {
        try {
          const tableDescription = await queryInterface.describeTable(tableName);
          if (tableDescription.heartbeats_id) {
            console.log(`Removing heartbeats_id column from ${tableName} table`);
            await queryInterface.removeColumn(tableName, 'heartbeats_id');
          }
        } catch (error) {
          console.log(`Table ${tableName} does not exist or heartbeats_id column not found:`, error.message);
        }
      }

    } catch (error) {
      console.log('Error during foreign key cleanup:', error.message);
      // Continue execution - this cleanup is not critical for the service to function
    }
  },

  async down(queryInterface, Sequelize) {
    // This migration is irreversible since we're removing the heartbeat dependency
    throw new Error('Cannot rollback removal of heartbeats foreign key - heartbeats functionality has been moved to CWV');
  },
};
