'use strict';

/**
 * Adds a VECTOR(384) column to the `precedents` table for semantic search
 * using pgvector.
 *
 * BEFORE running this migration you must enable the pgvector extension
 * in Supabase. Open the Supabase SQL Editor and run:
 *
 *   CREATE EXTENSION IF NOT EXISTS vector;
 *
 * Then run the migration:
 *   npx sequelize-cli db:migrate
 */
module.exports = {
  async up(queryInterface) {
    // Add the embedding column (NULL allowed — rows get populated by the import script)
    await queryInterface.sequelize.query(`
      ALTER TABLE precedents
        ADD COLUMN IF NOT EXISTS embedding VECTOR(384);
    `);

    // Partial index: only index rows that actually have an embedding.
    // This keeps the index small while data is being imported incrementally.
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS precedents_embedding_idx
        ON precedents
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 10)
        WHERE embedding IS NOT NULL;
    `);

    console.log('✅  Added embedding VECTOR(384) column + ivfflat index to precedents table.');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS precedents_embedding_idx;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE precedents
        DROP COLUMN IF EXISTS embedding;
    `);
  },
};
