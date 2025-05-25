'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS grades;
    `);

    // Drop the existing heartbeats table if it exists
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS heartbeats;
    `);

    // Create the new heartbeats table with all required columns
    await queryInterface.createTable('heartbeats', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      url_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'urls',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      platforms_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'platforms',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      provider_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'providers',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      type: { 
        type: Sequelize.ENUM('5m','10m','15m','30m','1h','2h','3h','6h','12h','1d','2d','3d','1w','2w','3w','1m','2m','3m','6m','1y'), 
        allowNull: false 
      },
      from: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },
      to: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },
      // Core Web Vitals metrics with statistics columns
      // Largest Contentful Paint
      lcp_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      lcp_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      lcp_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      lcp_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      lcp_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      lcp_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      lcp_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Cumulative Layout Shift
      cls_min: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: '0.00' },
      cls_p50: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: '0.00' },
      cls_avg: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: '0.00' },
      cls_p75: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: '0.00' },
      cls_p90: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: '0.00' },
      cls_p99: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: '0.00' },
      cls_max: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: '0.00' },
      
      // First Contentful Paint
      fcp_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      fcp_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      fcp_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      fcp_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      fcp_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      fcp_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      fcp_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Time to First Byte
      ttfb_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ttfb_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ttfb_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ttfb_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ttfb_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ttfb_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ttfb_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Total Blocking Time
      tbt_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tbt_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tbt_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tbt_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tbt_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tbt_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tbt_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // DOMContentLoaded
      dcl_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      dcl_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      dcl_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      dcl_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      dcl_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      dcl_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      dcl_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Speed Index
      si_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      si_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      si_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      si_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      si_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      si_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      si_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Time to Interactive
      tti_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tti_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tti_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tti_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tti_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tti_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      tti_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Grade metrics with statistics columns
      // Performance grade
      performance_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      performance_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      performance_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      performance_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      performance_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      performance_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      performance_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Accessibility grade
      accessibility_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      accessibility_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      accessibility_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      accessibility_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      accessibility_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      accessibility_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      accessibility_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // SEO grade
      seo_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      seo_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      seo_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      seo_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      seo_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      seo_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      seo_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Best Practices grade
      best_practices_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      best_practices_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      best_practices_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      best_practices_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      best_practices_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      best_practices_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      best_practices_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Security grade
      security_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      security_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      security_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      security_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      security_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      security_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      security_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Aesthetics grade
      aesthetics_min: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      aesthetics_p50: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      aesthetics_avg: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      aesthetics_p75: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      aesthetics_p90: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      aesthetics_p99: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      aesthetics_max: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      
      // Timestamps
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });

    // Add composite unique constraint
    await queryInterface.addConstraint('heartbeats', {
      fields: ['url_id', 'platforms_id', 'provider_id', 'type', 'from', 'to'],
      type: 'unique',
      name: 'heartbeats_unique_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the heartbeats table
    await queryInterface.dropTable('heartbeats');
  }
};
