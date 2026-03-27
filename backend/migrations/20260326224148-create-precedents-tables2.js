'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('precedents', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      title: { type: Sequelize.STRING(500), allowNull: false },
      citation: { type: Sequelize.STRING(300), allowNull: false },
      caseNo: { type: Sequelize.STRING(200), allowNull: true },
      court: { type: Sequelize.STRING(200), allowNull: true, defaultValue: 'Supreme Court of Pakistan' },
      judge: { type: Sequelize.STRING(300), allowNull: true },
      year: { type: Sequelize.INTEGER, allowNull: true },
      content: { type: Sequelize.TEXT, allowNull: false },
      summary: { type: Sequelize.TEXT, allowNull: true },
      keywords: { type: Sequelize.JSONB, allowNull: true, defaultValue: [] },
      fileUrl: { type: Sequelize.STRING(1000), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('precedent_searches', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      query: { type: Sequelize.TEXT, allowNull: false },
      resultCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('query_precedents', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      searchId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'precedent_searches', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      precedentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'precedents', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      relevanceScore: { type: Sequelize.DECIMAL(5, 4), allowNull: true },
      retrievedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('precedent_feedbacks', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      searchId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'precedent_searches', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      rating: { type: Sequelize.ENUM('helpful', 'not_helpful'), allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addIndex('precedent_searches', ['userId']);
    await queryInterface.addIndex('query_precedents', ['searchId']);
    await queryInterface.addIndex('query_precedents', ['precedentId']);
    await queryInterface.addIndex('precedents', ['citation']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('precedent_feedbacks');
    await queryInterface.dropTable('query_precedents');
    await queryInterface.dropTable('precedent_searches');
    await queryInterface.dropTable('precedents');
  },
};