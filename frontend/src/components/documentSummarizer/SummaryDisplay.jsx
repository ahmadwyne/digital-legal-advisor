import { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  FileText,
  Calendar,
 FileSignature,
  Bot,
} from 'lucide-react';

const SummaryDisplay = ({ summary, onFeedback, onOpenFeedbackModal, onReset }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  if (!summary) return null;

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
    onFeedback?.('like');
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
    onFeedback?.('dislike');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 lg:mb-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
            Document Summary
          </h2>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-blue-700 border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200"
          style={{ fontFamily: 'Inter' }}
        >
          <RefreshCw size={14} />
          New Document
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {summary.type && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full" style={{ fontFamily: 'Inter' }}>
            <FileText className="w-3.5 h-3.5" /> {summary.type}
          </span>
        )}
        {summary.year && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-100 text-gray-700 text-xs font-semibold rounded-full" style={{ fontFamily: 'Inter' }}>
            <Calendar className="w-3.5 h-3.5" /> {summary.year}
          </span>
        )}
        {summary.wordCount && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-100 text-gray-700 text-xs font-semibold rounded-full" style={{ fontFamily: 'Inter' }}>
            <FileSignature className="w-3.5 h-3.5" /> {summary.wordCount.toLocaleString()} words
          </span>
        )}
      </div>

      <div
        className="max-w-5xl space-y-3 lg:space-y-4 text-gray-800 text-base lg:text-lg leading-relaxed bg-white/85 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-100 shadow-sm"
        style={{ fontFamily: 'Inter' }}
      >
        {summary.source && (
          <p className="text-sm text-gray-500 border-b border-blue-100 pb-3 mb-4">
            <span className="font-bold text-gray-700">Source:</span> {summary.source}
          </p>
        )}

        {summary.content && (
          <div className="space-y-3 lg:space-y-4">
            {summary.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>
                {paragraph.startsWith('AI-Generated Summary:') ? (
                  <>
                    <span className="font-bold text-blue-700">AI-Generated Summary: </span>
                    {paragraph.replace('AI-Generated Summary:', '').trim()}
                  </>
                ) : (
                  paragraph
                )}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-4 lg:gap-6 mt-10 lg:mt-14 pt-6 border-t border-blue-200">
        <span className="text-sm text-gray-500 mr-auto" style={{ fontFamily: 'Inter' }}>
          Was this summary helpful?
        </span>

        <button
          onClick={handleLike}
          className={`hover:opacity-80 transition-all p-2 rounded-lg ${liked ? 'bg-green-100' : 'hover:bg-gray-100'}`}
          aria-label="Like summary"
        >
          <ThumbsUp size={24} className={`transition-colors ${liked ? 'text-green-600 fill-green-600' : 'text-gray-800'}`} />
        </button>

        <button
          onClick={handleDislike}
          className={`hover:opacity-80 transition-all p-2 rounded-lg ${disliked ? 'bg-red-100' : 'hover:bg-gray-100'}`}
          aria-label="Dislike summary"
        >
          <ThumbsDown size={24} className={`transition-colors ${disliked ? 'text-red-600 fill-red-600' : 'text-gray-800'}`} />
        </button>

        <button
          onClick={() => onOpenFeedbackModal?.()}
          className="text-gray-800 text-base font-medium hover:text-blue-700 transition-colors"
          style={{ fontFamily: 'Inter' }}
        >
          Provide Feedback?
        </button>
      </div>
    </div>
  );
};

export default SummaryDisplay;