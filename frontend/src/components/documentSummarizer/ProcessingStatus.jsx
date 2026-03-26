const ProcessingStatus = ({ progress }) => {
  const steps = [
    { label: 'Extracting text from document', done: progress >= 25 },
    { label: 'Analyzing legal content', done: progress >= 50 },
    { label: 'Generating AI summary', done: progress >= 75 },
    { label: 'Finalizing results', done: progress >= 100 },
  ];

  return (
    <div className="w-full">
      <div className="bg-white/85 backdrop-blur-sm border-2 border-blue-100 rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-start gap-4 lg:gap-6">
          {/* Spinner */}
          <div className="w-12 h-12 lg:w-14 lg:h-14 flex-shrink-0 mt-1 flex items-center justify-center rounded-full bg-blue-50 border border-blue-200">
            <svg
              className="animate-spin text-blue-600"
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>

          <div className="flex-1 pt-1">
            <p
              className="text-lg lg:text-xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: 'Inter' }}
            >
              Analyzing your legal document
              <span className="inline-flex gap-0.5 ml-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="animate-bounce text-blue-600"
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    .
                  </span>
                ))}
              </span>
            </p>

            {/* Progress Bar */}
            <div className="mb-5">
              <div className="w-full h-2.5 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(8, progress)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
                Overall progress: {progress}%
              </p>
            </div>

            {/* Step Indicators */}
            <div className="space-y-2.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-500 ${
                      step.done ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    {step.done && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <span
                    className={`text-sm transition-colors duration-300 ${
                      step.done ? 'text-blue-700 font-medium' : 'text-gray-400'
                    }`}
                    style={{ fontFamily: 'Inter' }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4" style={{ fontFamily: 'Inter' }}>
              This may take 10–30 seconds depending on document length
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;