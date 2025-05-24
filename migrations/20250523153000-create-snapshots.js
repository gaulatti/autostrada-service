'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('snapshots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        type: Sequelize.STRING(36),
        allowNull: false,
        unique: true
      },
      url_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'urls',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      platforms_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'platforms',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'providers',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('1m', '1h', '3h', '6h', '12h', '1d', '1w', '2w', '1mo'),
        allowNull: false
      },
      from: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Inclusive window start'
      },
      to: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Exclusive window end'
      },
      stats: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Aggregated CWV metrics'
      },
      aggregated_from_slugs: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of child snapshot slugs'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create composite unique constraint
    await queryInterface.addConstraint('snapshots', {
      fields: ['url_id', 'platforms_id', 'provider_id', 'type', 'from', 'to'],
      type: 'unique',
      name: 'snapshots_unique_constraint'
    });

    // Add indexes for performance
    await queryInterface.addIndex('snapshots', ['slug']);
    await queryInterface.addIndex('snapshots', ['url_id', 'type', 'from', 'to']);
    await queryInterface.addIndex('snapshots', ['type', 'from', 'to']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('snapshots');
  }
};
