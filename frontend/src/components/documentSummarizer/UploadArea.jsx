import { useRef, useState } from 'react';

const UploadArea = ({ onFileUpload, disabled, uploadedFileName, uploadProgress }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="mb-8 lg:mb-12">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          w-full border-2 border-dashed rounded-2xl p-8 lg:p-12 flex flex-col items-center justify-center gap-4
          transition-all duration-300 cursor-pointer shadow-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50/60'}
          ${isDragging ? 'border-blue-600 bg-blue-100/70 scale-[1.01]' : 'border-blue-200 bg-white/80 backdrop-blur-sm'}
        `}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 35 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-colors duration-200 ${isDragging ? 'text-blue-600' : 'text-blue-300'}`}
        >
          <path d="M8.515 14.359C5.305 15.1 2.917 17.904 2.917 21.25C2.917 25.162 6.181 28.333 10.208 28.333C10.899 28.333 11.568 28.24 12.201 28.066" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26.29 14.359C29.5 15.1 31.888 17.904 31.888 21.25C31.888 25.162 28.624 28.333 24.597 28.333C23.906 28.333 23.237 28.24 22.604 28.066" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26.25 14.167C26.25 9.472 22.333 5.667 17.5 5.667C12.668 5.667 8.75 9.472 8.75 14.167" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.444 19.749L17.5 14.821L22.7 19.834" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.5 26.917V17.327" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="text-center">
          <p className="text-base lg:text-lg font-semibold text-gray-800" style={{ fontFamily: 'Inter' }}>
            {isDragging ? 'Drop your document here' : 'Drag & drop your document'}
          </p>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
            or{' '}
            <span className="text-blue-700 font-semibold underline underline-offset-2">
              click to browse
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-2" style={{ fontFamily: 'Inter' }}>
            Supports PDF, DOCX, DOC, TXT — Max 10MB
          </p>
        </div>

        <button
          type="button"
          disabled={disabled}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-800 hover:via-blue-700 hover:to-blue-800 transition-all duration-300 border-2 border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-2"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <span className="font-bold text-base lg:text-lg" style={{ fontFamily: 'Inter' }}>
            {uploadedFileName ? 'Change Document' : 'Upload Document'}
          </span>
        </button>
      </div>

      {uploadedFileName && (
        <p className="mt-3 text-sm text-gray-700" style={{ fontFamily: 'Inter' }}>
          Selected: <span className="font-semibold text-blue-800">{uploadedFileName}</span>
        </p>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-700 to-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadArea;