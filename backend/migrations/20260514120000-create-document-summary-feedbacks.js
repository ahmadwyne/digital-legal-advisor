'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('document_summary_feedbacks', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      documentSummaryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'document_summaries', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      documentId: { type: Sequelize.STRING, allowNull: true },
      rating: { type: Sequelize.ENUM('like', 'dislike'), allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      documentName: { type: Sequelize.STRING, allowNull: true },
      summarySnippet: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('document_summary_feedbacks', ['userId']);
    await queryInterface.addIndex('document_summary_feedbacks', ['documentSummaryId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('document_summary_feedbacks');
  }
};
