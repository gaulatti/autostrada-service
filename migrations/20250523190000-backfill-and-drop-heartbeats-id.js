'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Backfill the new columns from the heartbeats table
    await queryInterface.sequelize.query(`
      UPDATE performance p
      JOIN heartbeats h ON p.heartbeats_id = h.id
      SET 
        p.platforms_id = h.platforms_id,
        p.provider_id = h.provider_id
    `);

    // Step 2: Get the url_id through the heartbeats -> pulses -> urls relationship
    await queryInterface.sequelize.query(`
      UPDATE performance p
      INNER JOIN heartbeats h ON p.heartbeats_id = h.id
      INNER JOIN pulses pu ON h.pulses_id = pu.id
      SET p.url_id = pu.url_id
    `);
    
    // Handle any orphaned records (in case there are any performance records without valid relationships)
    await queryInterface.sequelize.query(`
      UPDATE performance p
      SET p.url_id = (SELECT MIN(id) FROM urls)
      WHERE p.url_id IS NULL
    `);

    // Step 3: Set NOT NULL constraints now that data is backfilled
    await queryInterface.changeColumn('performance', 'platforms_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('performance', 'provider_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('performance', 'url_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Step 4: Remove the foreign key constraint on heartbeats_id
    try {
      const foreignKeys = await queryInterface.sequelize.query(
        `SELECT constraint_name FROM information_schema.table_constraints
         WHERE table_name = 'performance' AND constraint_type = 'FOREIGN KEY' 
         AND constraint_name = 'fk_performance_heartbeats';`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (foreignKeys.length > 0) {
        await queryInterface.removeConstraint('performance', 'fk_performance_heartbeats');
      }
    } catch (error) {
      console.log('Error removing constraint:', error.message);
    }

    // Step 5: Drop the heartbeats_id column
    await queryInterface.removeColumn('performance', 'heartbeats_id');
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Add the heartbeats_id column back
    await queryInterface.addColumn('performance', 'heartbeats_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Step 2: We can't accurately restore the heartbeats_id relationships, 
    // so this is a best-effort attempt
    await queryInterface.sequelize.query(`
      UPDATE performance p
      JOIN heartbeats h ON 
        h.platforms_id = p.platforms_id AND
        h.provider_id = p.provider_id
      SET p.heartbeats_id = h.id
    `);

    // Step 3: Re-add the foreign key constraint
    await queryInterface.addConstraint('performance', {
      fields: ['heartbeats_id'],
      type: 'foreign key',
      name: 'fk_performance_heartbeats',
      references: { table: 'heartbeats', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Step 4: Make the columns nullable since they're no longer the primary source of relationship
    await queryInterface.changeColumn('performance', 'platforms_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('performance', 'provider_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('performance', 'url_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
