// const express = require('express');
// const router = express.Router();
// const chatController = require('../controllers/chatController');
// const { protect } = require('../middlewares/authMiddleware');

// // All chat routes require the user to be logged in
// router.use(protect);

// router.post('/', chatController.processMessage);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { sendMessage, getHistory } = require('../controllers/chatController');

// If you have auth middleware, add it here:
const { protect } = require('../middlewares/authMiddleware');
router.post('/', protect, sendMessage);
router.get('/history', protect, getHistory);

router.post('/', sendMessage);
router.get('/history', getHistory);

module.exports = router;