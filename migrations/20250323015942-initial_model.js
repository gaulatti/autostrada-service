'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('platforms', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: Sequelize.ENUM('desktop', 'mobile'), allowNull: false },
      user_agent: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('projects', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.createTable('clusters', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.createTable('urls', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      url: { type: Sequelize.TEXT, allowNull: false },
      slug: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('pulses', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      url_id: { type: Sequelize.INTEGER, allowNull: false },
      slug: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      playlist_slug: {
        type: Sequelize.STRING(36),
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.createTable('providers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      synthetic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('heartbeats', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      pulses_id: { type: Sequelize.INTEGER, allowNull: false },
      platforms_id: { type: Sequelize.INTEGER, allowNull: false },
      provider_id: { type: Sequelize.INTEGER, allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('core_web_vitals', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      heartbeats_id: { type: Sequelize.INTEGER, allowNull: false },
      ttfb: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      fcp: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      dcl: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      lcp: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tti: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      si: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      cls: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: '0.00',
      },
      tbt: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('grades', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      heartbeats_id: { type: Sequelize.INTEGER, allowNull: false },
      performance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      accessibility: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      seo: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      best_practices: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      security: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      aesthetics: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('junctions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      clusters_id: { type: Sequelize.INTEGER, allowNull: false },
      urls_id: { type: Sequelize.INTEGER, allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.addConstraint('junctions', {
      fields: ['clusters_id', 'urls_id'],
      type: 'unique',
      name: 'unique_junctions',
    });

    await queryInterface.addConstraint('pulses', {
      fields: ['url_id'],
      type: 'foreign key',
      name: 'fk_pulses_urls',
      references: { table: 'urls', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('heartbeats', {
      fields: ['pulses_id'],
      type: 'foreign key',
      name: 'fk_heartbeats_pulses1',
      references: { table: 'pulses', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('heartbeats', {
      fields: ['platforms_id'],
      type: 'foreign key',
      name: 'fk_heartbeats_platforms',
      references: { table: 'platforms', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('heartbeats', {
      fields: ['provider_id'],
      type: 'foreign key',
      name: 'fk_heartbeats_providers',
      references: { table: 'providers', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('core_web_vitals', {
      fields: ['heartbeats_id'],
      type: 'foreign key',
      name: 'fk_core_web_vitals_heartbeats',
      references: { table: 'heartbeats', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('grades', {
      fields: ['heartbeats_id'],
      type: 'foreign key',
      name: 'fk_grades_heartbeats',
      references: { table: 'heartbeats', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('junctions', {
      fields: ['clusters_id'],
      type: 'foreign key',
      name: 'fk_junctions_clusters',
      references: { table: 'clusters', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('junctions', {
      fields: ['urls_id'],
      type: 'foreign key',
      name: 'fk_junctions_urls',
      references: { table: 'urls', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('junctions');
    await queryInterface.dropTable('grades');
    await queryInterface.dropTable('core_web_vitals');
    await queryInterface.dropTable('heartbeats');
    await queryInterface.dropTable('providers');
    await queryInterface.dropTable('pulses');
    await queryInterface.dropTable('urls');
    await queryInterface.dropTable('clusters');
    await queryInterface.dropTable('projects');
    await queryInterface.dropTable('platforms');
  },
};
