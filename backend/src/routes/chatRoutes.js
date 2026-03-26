// const express = require('express');
// const router = express.Router();
// const chatController = require('../controllers/chatController');
// const { protect } = require('../middlewares/authMiddleware');

// // All chat routes require the user to be logged in
// router.use(protect);

// router.post('/', chatController.processMessage);

// module.exports = router;

const express = require('express');
const router  = express.Router();
const { sendMessage, getHistory, deleteMessage, postFeedback } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

router.post('/', sendMessage);   // Send a message → get AI response
router.get('/history', getHistory);    // Fetch user's chat history
router.delete('/:queryId', deleteMessage); // Delete a specific chat entry
router.post('/feedback', postFeedback);  // Submit like/dislike + comment

module.exports = router;