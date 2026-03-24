const multer = require('multer');
const path = require('path');

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.json', '.csv', '.txt', '.pdf', '.docx', '.xlsx'];

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/json',
  'text/csv',
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Maximum file size (500MB)
const MAX_FILE_SIZE = 500 * 1024 * 1024;

/**
 * File filter to validate uploaded files
 */
const fileFilter = (req, file, cb) => {
  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new Error(`Invalid file type. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`),
      false
    );
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error(`Invalid MIME type. File type not supported.`),
      false
    );
  }

  cb(null, true);
};

/**
 * Configure multer for memory storage
 * We use memory storage because we'll upload directly to Supabase
 */
const storage = multer.memoryStorage();

/**
 * Multer upload configuration
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1 // Only one file at a time
  }
});

/**
 * Middleware to handle single file upload
 */
exports.uploadDatasetFile = upload.single('file');

/**
 * Error handler for multer errors
 */
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          status: 'error',
          message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        });
      
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          status: 'error',
          message: 'Too many files. Only one file allowed per upload'
        });
      
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          status: 'error',
          message: 'Unexpected field name. Use "file" as field name'
        });
      
      default:
        return res.status(400).json({
          status: 'error',
          message: `Upload error: ${err.message}`
        });
    }
  } else if (err) {
    // Other errors (like from fileFilter)
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  next();
};

/**
 * Validate file format matches declared format
 */
exports.validateFileFormat = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const declaredFormat = req.body.fileFormat;
  const fileExtension = path.extname(req.file.originalname).toLowerCase().substring(1);

  if (declaredFormat && declaredFormat !== fileExtension) {
    return res.status(400).json({
      status: 'error',
      message: `File format mismatch. Declared: ${declaredFormat}, Actual: ${fileExtension}`
    });
  }

  next();
};

/**
 * Sanitize filename
 */
exports.sanitizeFilename = (req, res, next) => {
  if (req.file) {
    // Remove any path separators and special characters
    const sanitized = req.file.originalname
      .replace(/[/\\]/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    
    req.file.originalname = sanitized;
  }
  
  next();
};

module.exports.ALLOWED_EXTENSIONS = ALLOWED_EXTENSIONS;
module.exports.ALLOWED_MIME_TYPES = ALLOWED_MIME_TYPES;
module.exports.MAX_FILE_SIZE = MAX_FILE_SIZE;