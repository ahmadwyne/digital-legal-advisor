/**
 * feedbackService.js
 * 
 * If you already have a Feedback model in your Sequelize setup, adapt accordingly.
 * This assumes a Feedback model with the fields below.
 * 
 * If you don't have a Feedback model yet, see the migration comment at the bottom.
 */

// const { Feedback } = require('../models'); // Uncomment when model exists

/**
 * Creates a new feedback record
 */
const createFeedback = async ({ userId, feature, rating, comment, metadata }) => {
  // Uncomment below when Feedback model exists:
  // return await Feedback.create({ userId, feature, rating, comment, metadata });

  // Temporary: just log and return a mock response until model is set up
  console.log('[FeedbackService] Feedback received:', { userId, feature, rating, comment, metadata });
  return {
    id: Date.now(),
    userId,
    feature,
    rating,
    comment,
    metadata,
    createdAt: new Date(),
  };
};

/**
 * Get all feedbacks for admin view (optional)
 */
const getFeedbacks = async ({ feature, page = 1, limit = 20 }) => {
  // return await Feedback.findAndCountAll({
  //   where: feature ? { feature } : {},
  //   order: [['createdAt', 'DESC']],
  //   offset: (page - 1) * limit,
  //   limit,
  // });
  return { rows: [], count: 0 };
};

module.exports = { createFeedback, getFeedbacks };

/*
──────────────────────────────────────────────────────
SEQUELIZE MIGRATION (run: npx sequelize-cli migration:generate --name create-feedbacks)
──────────────────────────────────────────────────────

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Feedbacks', {
      id:         { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId:     { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Users', key: 'id' } },
      feature:    { type: Sequelize.STRING(100), allowNull: false },
      rating:     { type: Sequelize.ENUM('like', 'dislike'), allowNull: false },
      comment:    { type: Sequelize.TEXT, allowNull: true },
      metadata:   { type: Sequelize.JSONB, allowNull: true },
      createdAt:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Feedbacks');
  },
};
*/