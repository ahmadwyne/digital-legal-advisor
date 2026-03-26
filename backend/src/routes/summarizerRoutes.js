const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  summarize,
  submitFeedback,
  getSummaryHistory,
  getSummaryById,
  deleteSummary
} = require('../controllers/summarizerController');
const { protect } = require('../middlewares/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    const allowedExts = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

    if (allowed.includes(file.mimetype) || allowedExts.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOCX, DOC, and TXT files are allowed.'));
  },
});

router.post('/summarize', protect, upload.single('document'), summarize);
router.post('/feedback', protect, submitFeedback);

router.get('/history', protect, getSummaryHistory);
router.get('/history/:id', protect, getSummaryById);
router.delete('/history/:id', protect, deleteSummary);

module.exports = router;