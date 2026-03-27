const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const datasetRoutes = require('./datasetRoutes');
const chatRoutes = require('./chatRoutes');
const summarizerRoutes = require('./summarizerRoutes');
const precedentRoutes = require('./precedentRoutes');

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
  });
});

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use('/datasets', datasetRoutes);
router.use('/chat', chatRoutes);
router.use('/summarizer', summarizerRoutes);
router.use('/precedents', precedentRoutes);

module.exports = router;