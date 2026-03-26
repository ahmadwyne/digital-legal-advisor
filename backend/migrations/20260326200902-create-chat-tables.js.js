'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ── 1. queries ──────────────────────────────────────────────────────────
    await queryInterface.createTable('queries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'userId',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      queryText: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'queryText',
      },
      queryType: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'general',
        field: 'queryType',
      },
      status: {
        type: Sequelize.ENUM('pending', 'answered', 'closed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('queries', ['userId']);
    await queryInterface.addIndex('queries', ['status']);

    // ── 2. responses ─────────────────────────────────────────────────────────
    await queryInterface.createTable('responses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      queryId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'queryId',
        references: { model: 'queries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      responseText: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'responseText',
      },
      citations: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      confidence: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      numSources: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'numSources',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('responses', ['queryId'], { unique: true });

    // ── 3. history ───────────────────────────────────────────────────────────
    await queryInterface.createTable('history', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'userId',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      queryId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'queryId',
        references: { model: 'queries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      entryTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
        field: 'entryTime',
      },
    });

    await queryInterface.addIndex('history', ['userId']);
    await queryInterface.addIndex('history', ['queryId']);

    // ── 4. feedback table (bonus – needed for thumbs up/down) ─────────────
    await queryInterface.createTable('feedback', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'userId',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      responseId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'responseId',
        references: { model: 'responses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rating: {
        type: Sequelize.ENUM('like', 'dislike'),
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('feedback', ['userId', 'responseId'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('feedback');
    await queryInterface.dropTable('history');
    await queryInterface.dropTable('responses');
    await queryInterface.dropTable('queries');
  },
};