require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');
const { initializeBucket } = require('./src/utils/SupabaseStorage');

const PORT = process.env.PORT || 5000;

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database — avoid { alter: true } on Supabase pooled connections
    // as long-running ALTER TABLE statements get killed by PgBouncer.
    // Use migrations for schema changes instead.
    await sequelize.sync();
    console.log('✅ Database synchronized successfully.');

    // Initialize Supabase storage bucket
    await initializeBucket();
    console.log('✅ Supabase storage bucket initialized.');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();