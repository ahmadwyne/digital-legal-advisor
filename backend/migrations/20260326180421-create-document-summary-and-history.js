'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('document_summaries', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      documentId: { type: Sequelize.STRING, allowNull: false, unique: true },
      fileName: { type: Sequelize.STRING, allowNull: false },
      fileType: { type: Sequelize.STRING, allowNull: false },
      uploadDate: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      isValid: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      summaryContent: { type: Sequelize.TEXT, allowNull: true },
      docType: { type: Sequelize.STRING, allowNull: true },
      docYear: { type: Sequelize.STRING, allowNull: true },
      wordCount: { type: Sequelize.INTEGER, allowNull: true },
      method: { type: Sequelize.STRING, allowNull: true },
      usedAI: { type: Sequelize.BOOLEAN, defaultValue: false },

      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.createTable('document_summary_history', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      documentSummaryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'document_summaries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      entryTime: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('document_summaries', ['userId']);
    await queryInterface.addIndex('document_summaries', ['uploadDate']);
    await queryInterface.addIndex('document_summary_history', ['userId']);
    await queryInterface.addIndex('document_summary_history', ['documentSummaryId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('document_summary_history');
    await queryInterface.dropTable('document_summaries');
  }
};