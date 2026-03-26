import { useState } from 'react';
import { X, ThumbsUp, ThumbsDown } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rating) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment });
    } finally {
      setIsSubmitting(false);
      setRating(null);
      setComment('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 z-10 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Ropa Sans' }}>
          Share Your Feedback
        </h3>
        <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Noto Sans' }}>
          Help us improve the Document Summarizer for Pakistani legal documents.
        </p>

        {/* Rating */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setRating('like')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all duration-200 font-semibold
              ${rating === 'like'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300 text-gray-600'
              }`}
            style={{ fontFamily: 'Noto Sans' }}
          >
            <ThumbsUp size={18} className={rating === 'like' ? 'fill-green-600 text-green-600' : ''} />
            Helpful
          </button>
          <button
            onClick={() => setRating('dislike')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all duration-200 font-semibold
              ${rating === 'dislike'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-red-300 text-gray-600'
              }`}
            style={{ fontFamily: 'Noto Sans' }}
          >
            <ThumbsDown size={18} className={rating === 'dislike' ? 'fill-red-600 text-red-600' : ''} />
            Not helpful
          </button>
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more (optional) — e.g. 'Summary missed key clauses' or 'Worked great for FIR documents'"
          rows={4}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#29473E] transition-colors resize-none mb-5"
          style={{ fontFamily: 'Noto Sans' }}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!rating || isSubmitting}
          className="w-full bg-[#29473E] text-white py-3 rounded-full font-bold text-base hover:bg-[#1f3630] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Ropa Sans' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>

      <style>{`
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default FeedbackModal;