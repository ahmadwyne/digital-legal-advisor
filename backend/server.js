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

    // Ensure Supabase storage bucket exists
    await initializeBucket();
    console.log('✅ Supabase storage bucket ready.');

    // Sync database (use { force: true } to drop tables - only in development)
    // await sequelize. sync({ alter: true });
    // console.log('✅ Database synchronized successfully.');

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