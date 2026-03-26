const express = require('express');
const router = express.Router();
const multer = require('multer');
const { summarize, submitFeedback } = require('../controllers/summarizerController');
const { protect  } = require('../middlewares/authMiddleware');

// Multer: store in memory (no disk writes needed — we parse buffer directly)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    const allowedExts = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

    if (allowed.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, DOC, and TXT files are allowed.'));
    }
  },
});

// POST /api/v1/summarizer/summarize
router.post('/summarize', protect , upload.single('document'), summarize);

// POST /api/v1/summarizer/feedback
router.post('/feedback', protect , submitFeedback);

module.exports = router;