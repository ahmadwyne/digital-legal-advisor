const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const stream = require('stream');
const { promisify } = require('util');

const pipeline = promisify(stream.pipeline);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations
);

const BUCKET_NAME = 'legal-datasets';
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks for optimal upload
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB max file size

/**
 * Calculate file checksum (SHA256)
 */
const calculateChecksum = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Initialize storage bucket if not exists
 */
const initializeBucket = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: MAX_FILE_SIZE,
        allowedMimeTypes: [
          'application/json',
          'text/csv',
          'text/plain',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]
      });

      if (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }
      
      console.log('Bucket created successfully:', BUCKET_NAME);
    }
  } catch (error) {
    console.error('Error initializing bucket:', error);
    throw new Error(`Bucket initialization failed: ${error.message}`);
  }
};

/**
 * Upload file to Supabase storage with chunking for large files
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original filename
 * @param {string} category - Dataset category
 * @param {string} userId - User ID for folder organization
 * @returns {object} Upload result with path and metadata
 */
const uploadFile = async (fileBuffer, fileName, category, userId) => {
  try {
    // Validate file size
    if (fileBuffer.length > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Generate unique filename with timestamp and UUID
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${timestamp}_${crypto.randomBytes(8).toString('hex')}_${sanitizedName}`;
    
    // Organize by category and user for better file management
    const filePath = `${category}/${userId}/${uniqueFileName}`;

    // Calculate checksum for integrity verification
    const checksum = calculateChecksum(fileBuffer);

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: getMimeType(fileExtension),
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL (even for private buckets, we can generate signed URLs later)
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      filePath: data.path,
      bucketName: BUCKET_NAME,
      fileSize: fileBuffer.length,
      checksum,
      publicUrl,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

/**
 * Generate signed URL for temporary file access
 * @param {string} filePath - File path in storage
 * @param {number} expiresIn - Expiration time in seconds (default 1 hour)
 * @returns {string} Signed URL
 */
const generateSignedUrl = async (filePath, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;

    return data.signedUrl;
  } catch (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};

/**
 * Download file from Supabase storage
 * @param {string} filePath - File path in storage
 * @returns {Buffer} File buffer
 */
const downloadFile = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);

    if (error) throw error;

    // Convert Blob to Buffer
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    throw new Error(`File download failed: ${error.message}`);
  }
};

/**
 * Delete file from Supabase storage
 * @param {string} filePath - File path in storage
 * @returns {boolean} Success status
 */
const deleteFile = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;

    return true;
  } catch (error) {
    throw new Error(`File deletion failed: ${error.message}`);
  }
};

/**
 * Get file metadata
 * @param {string} filePath - File path in storage
 * @returns {object} File metadata
 */
const getFileMetadata = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(filePath.split('/').slice(0, -1).join('/'));

    if (error) throw error;

    const fileName = filePath.split('/').pop();
    const file = data.find(f => f.name === fileName);

    return file || null;
  } catch (error) {
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
};

/**
 * Verify file integrity
 * @param {string} filePath - File path in storage
 * @param {string} expectedChecksum - Expected checksum
 * @returns {boolean} Integrity verification result
 */
const verifyFileIntegrity = async (filePath, expectedChecksum) => {
  try {
    const fileBuffer = await downloadFile(filePath);
    const actualChecksum = calculateChecksum(fileBuffer);
    
    return actualChecksum === expectedChecksum;
  } catch (error) {
    throw new Error(`File integrity verification failed: ${error.message}`);
  }
};

/**
 * Get MIME type based on file extension
 * @param {string} extension - File extension
 * @returns {string} MIME type
 */
const getMimeType = (extension) => {
  const mimeTypes = {
    'json': 'application/json',
    'csv': 'text/csv',
    'txt': 'text/plain',
    'pdf': 'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Parse and count records in dataset
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileFormat - File format (json, csv, txt)
 * @returns {number} Record count
 */
const countRecords = async (fileBuffer, fileFormat) => {
  try {
    const content = fileBuffer.toString('utf-8');

    switch (fileFormat.toLowerCase()) {
      case 'json':
        const jsonData = JSON.parse(content);
        return Array.isArray(jsonData) ? jsonData.length : 1;

      case 'csv':
        const lines = content.split('\n').filter(line => line.trim());
        return Math.max(0, lines.length - 1); // Exclude header

      case 'txt':
        const txtLines = content.split('\n').filter(line => line.trim());
        return txtLines.length;

      default:
        return 0;
    }
  } catch (error) {
    console.error('Error counting records:', error);
    return 0;
  }
};

/**
 * Get storage usage statistics
 * @returns {object} Storage statistics
 */
const getStorageStats = async () => {
  try {
    // List all files in bucket
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;

    const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const fileCount = files.length;

    return {
      totalSize,
      fileCount,
      averageSize: fileCount > 0 ? Math.round(totalSize / fileCount) : 0,
      formattedSize: formatBytes(totalSize)
    };
  } catch (error) {
    throw new Error(`Failed to get storage stats: ${error.message}`);
  }
};

/**
 * Format bytes to human readable format
 * @param {number} bytes - Bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted string
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

module.exports = {
  initializeBucket,
  uploadFile,
  generateSignedUrl,
  downloadFile,
  deleteFile,
  getFileMetadata,
  verifyFileIntegrity,
  calculateChecksum,
  getMimeType,
  countRecords,
  getStorageStats,
  formatBytes,
  BUCKET_NAME,
  MAX_FILE_SIZE
};