const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// All chat routes require the user to be logged in
router.use(protect);

router.post('/', chatController.processMessage);

module.exports = router;