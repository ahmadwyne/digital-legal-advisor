const SummarizerHeader = () => {
  return (
    <div className="px-6 lg:px-10 py-6 lg:py-12">
      {/* Title with Icon */}
      <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
        <h1
          className="text-3xl lg:text-5xl font-bold text-gray-900"
          style={{ fontFamily: 'Ropa Sans' }}
        >
          Document Summarizer
        </h1>
        <svg
          width="32"
          height="32"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 lg:w-11 lg:h-11 flex-shrink-0"
        >
          <path d="M33.3334 6.25H22.9167V43.75H33.3334V6.25Z" stroke="#333333" strokeWidth="2" strokeLinejoin="round" />
          <path d="M43.7502 6.25H33.3335V43.75H43.7502V6.25Z" stroke="#333333" strokeWidth="2" strokeLinejoin="round" />
          <path d="M10.4167 6.25L18.75 7.29167L15.1042 43.75L6.25 42.7083L10.4167 6.25Z" stroke="#333333" strokeWidth="2" strokeLinejoin="round" />
          <path d="M38.5415 18.75V15.625" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28.125 18.75V15.625" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-900 w-full" />
    </div>
  );
};

export default SummarizerHeader;