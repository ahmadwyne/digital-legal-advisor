/**
 * LegalPrecedentsPage.jsx
 *
 * UI updated to exactly match Platform.jsx:
 *  - Top nav bar with Chat / Summarizer / Precedents tabs (same gradient header)
 *  - Main area background gradient (f0f9ff → dbeafe → dcfce7 → fffbeb → fef3c7)
 *  - History sidebar matching Platform.jsx sidebar styles (blue gradient bg,
 *    SidebarChat-style items, Trash2 on hover, scale-105 animation)
 *  - Feedback modal matching Platform.jsx (Thumbs Up/Down pill buttons,
 *    textarea, blue gradient submit)
 *
 * The precedent-specific components (search banner, results table, detail modal)
 * are unchanged from the previous version.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Scale, Download, FileText, X, Menu,
  Trash2, ThumbsUp, ThumbsDown, Eye,
  AlertCircle, RefreshCcw, BookOpen, Sparkles,
  Check, Copy, MessageCircle, Settings,
  CheckCircle2, Plus, LogOut, UserCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLegalPrecedents } from '@/hooks/useLegalPrecedents';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const matchColor = (pct) => {
  const n = parseInt(pct, 10);
  if (n >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (n >= 50) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (n >= 20) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-gray-100 text-gray-500 border-gray-200';
};

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────
const SkeletonRow = ({ delay = 0 }) => (
  <tr
    className="border-b border-blue-50"
    style={{ animation: `fadeIn 0.4s ease-out ${delay}ms both` }}
  >
    {[...Array(5)].map((_, i) => (
      <td key={i} className="p-4">
        <div
          className="h-4 rounded-lg"
          style={{
            width: `${[60, 85, 70, 40, 30][i]}%`,
            background: 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 50%, #eff6ff 100%)',
            backgroundSize: '600px 100%',
            animation: 'shimmer 1.8s infinite linear',
          }}
        />
      </td>
    ))}
  </tr>
);

// ─── Feedback Modal ───────────────────────────────────────────────────────────
// Matches Platform.jsx FeedbackModal exactly (ThumbsUp/Down pills + textarea + blue gradient button)
const FeedbackModal = ({ isOpen, onClose, onSubmit, searchId }) => {
  const [rating,     setRating]     = useState(null);
  const [comment,    setComment]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      await onSubmit({ searchId, rating, comment });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(null);
        setComment('');
        onClose();
      }, 1500);
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 w-full max-w-md p-6 animate-scale-in"
        style={{ fontFamily: 'Inter' }}
      >
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-lg font-bold text-gray-800">Thank you for your feedback!</p>
            <p className="text-sm text-gray-500 mt-1">Your input helps improve the system.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold text-gray-800">Provide Feedback</h3>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              How helpful were these legal precedent results?
            </p>

            {/* Exactly mirrors Platform.jsx thumb buttons */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setRating('helpful')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                  rating === 'helpful'
                    ? 'bg-green-500 text-white border-green-500 shadow-md'
                    : 'border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                Helpful
              </button>
              <button
                onClick={() => setRating('not_helpful')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                  rating === 'not_helpful'
                    ? 'bg-red-500 text-white border-red-500 shadow-md'
                    : 'border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                Not Helpful
              </button>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Additional comments (optional) – e.g. what was missing or could be improved?"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none transition-colors"
            />

            {/* Blue gradient button — same as Platform.jsx */}
            <button
              onClick={handleSubmit}
              disabled={!rating || submitting}
              className="mt-4 w-full py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-800 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              {submitting ? 'Submitting…' : 'Submit Feedback'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ precedent, loading, onClose, onDownload, downloading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(precedent?.citation || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!precedent && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out both' }}>
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ animation: 'scaleIn 0.25s ease-out both' }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {loading
                ? <div className="h-5 w-3/4 bg-white/30 rounded-lg mb-2 animate-pulse" />
                : <h2 className="text-white font-black text-lg leading-tight mb-1 line-clamp-2" style={{ fontFamily: 'Inter' }}>{precedent.title}</h2>
              }
              {!loading && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-blue-200 text-sm font-semibold cursor-pointer hover:text-white transition-colors" onClick={handleCopy} style={{ fontFamily: 'Inter' }}>{precedent.citation}</span>
                  <button onClick={handleCopy} className="text-blue-300 hover:text-white transition-colors">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="flex-shrink-0 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"><X size={20} /></button>
          </div>
          {!loading && (
            <div className="flex flex-wrap gap-2 mt-3">
              {precedent.court && <span className="bg-white/15 text-blue-100 text-xs px-3 py-1 rounded-full font-medium" style={{ fontFamily: 'Inter' }}>{precedent.court}</span>}
              {precedent.year  && <span className="bg-white/15 text-blue-100 text-xs px-3 py-1 rounded-full font-medium" style={{ fontFamily: 'Inter' }}>{precedent.year}</span>}
              {precedent.judge && <span className="bg-white/15 text-blue-100 text-xs px-3 py-1 rounded-full font-medium" style={{ fontFamily: 'Inter' }}>{precedent.judge}</span>}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
          {loading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => <div key={i} className="h-3 bg-blue-50 rounded-lg animate-pulse" style={{ width: `${85 - i * 5}%` }} />)}
            </div>
          ) : (
            <>
              {precedent.summary && (
                <div className="mb-6 p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
                  <h3 className="text-xs font-black text-blue-700 uppercase tracking-widest mb-2" style={{ fontFamily: 'Inter' }}>Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter' }}>{precedent.summary}</p>
                </div>
              )}
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3" style={{ fontFamily: 'Inter' }}>Full Judgment</h3>
              <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words bg-gray-50 rounded-2xl p-4 border border-gray-100" style={{ fontFamily: 'Inter', fontSize: '0.82rem' }}>
                {precedent.content}
              </pre>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="border-t border-blue-100 px-6 py-4 flex-shrink-0 flex justify-between items-center bg-gray-50">
            <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Inter' }}>Close</button>
            <button
              onClick={() => onDownload(precedent.id, precedent.citation)}
              disabled={downloading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg disabled:opacity-60"
              style={{ fontFamily: 'Inter' }}
            >
              {downloading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={16} />}
              Download Judgment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Results Table ────────────────────────────────────────────────────────────
const ResultsTable = ({ results, isSearching, onView, onDownload, downloading }) => {
  const HEADERS = ['Sr.', 'Case No.', 'Title / Judge', 'Match', 'Actions'];

  const headerRow = (
    <tr
      className="border-b-2 border-blue-200/50"
      style={{ backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #fef3c7 75%, #ffffff 100%)' }}
    >
      {HEADERS.map(h => (
        <th key={h} className="p-4 text-left text-xs font-black text-gray-600 uppercase tracking-widest" style={{ fontFamily: 'Inter' }}>{h}</th>
      ))}
    </tr>
  );

  if (isSearching) {
    return (
      <div className="bg-white/80 rounded-2xl border-2 border-blue-200/50 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>{headerRow}</thead>
            <tbody>{[...Array(4)].map((_, i) => <SkeletonRow key={i} delay={i * 80} />)}</tbody>
          </table>
        </div>
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <div className="bg-white/80 rounded-2xl border-2 border-blue-200/50 shadow-lg overflow-hidden" style={{ animation: 'slideInUp 0.5s ease-out both' }}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>{headerRow}</thead>
          <tbody className="divide-y divide-blue-50/80">
            {results.map((item, i) => (
              <tr
                key={item.id}
                className="hover:bg-blue-50/40 transition-colors group"
                style={{ animation: `fadeInUp 0.4s ease-out ${i * 60}ms both` }}
              >
                <td className="p-4 w-12">
                  <span className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-xs font-black shadow" style={{ fontFamily: 'Inter' }}>
                    {item.srNo}
                  </span>
                </td>
                <td className="p-4 max-w-[180px]">
                  <p className="text-sm font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Inter' }}>{item.caseNo}</p>
                  {item.year && <p className="text-xs text-gray-400 font-medium mt-0.5" style={{ fontFamily: 'Inter' }}>{item.year} · {item.court}</p>}
                </td>
                <td className="p-4">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug" style={{ fontFamily: 'Inter' }}>{item.title}</p>
                  {item.judge && <p className="text-xs text-blue-600 font-medium mt-0.5" style={{ fontFamily: 'Inter' }}>{item.judge}</p>}
                </td>
                <td className="p-4 w-24">
                  <span className={`inline-block text-xs font-black px-3 py-1.5 rounded-full border ${matchColor(item.matchPercent)}`} style={{ fontFamily: 'Inter' }}>
                    {item.matchPercent}
                  </span>
                </td>
                <td className="p-4 w-28">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onView(item.id)} title="View" className="p-2 rounded-xl text-gray-400 hover:text-blue-700 hover:bg-blue-100 transition-all"><Eye size={17} /></button>
                    <button
                      onClick={() => onDownload(item.id, item.citation)}
                      disabled={downloading[item.id]}
                      title="Download"
                      className="p-2 rounded-xl text-gray-400 hover:text-blue-700 hover:bg-blue-100 transition-all disabled:opacity-50"
                    >
                      {downloading[item.id]
                        ? <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin inline-block" />
                        : <Download size={17} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Sidebar History Item — matches Platform.jsx SidebarChat exactly ──────────
const SidebarHistoryItem = ({ item, isActive, onClick, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      className={`group p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center justify-between ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-2 border-amber-400/70 shadow-lg shadow-blue-500/30 text-white animate-scale-in'
          : 'hover:bg-blue-50 border border-transparent text-gray-700'
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-800 group-hover:text-blue-600'}`} style={{ fontFamily: 'Inter' }}>
          {item.query}
        </p>
        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500'}`} style={{ fontFamily: 'Inter' }}>
          {item.resultCount} result{item.resultCount !== 1 ? 's' : ''} · {formatDate(item.createdAt)}
        </p>
      </div>
      {isHovering && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className={`p-1.5 rounded-md transition-all duration-200 transform hover:scale-110 ml-2 animate-fade-in-up ${
            isActive ? 'hover:bg-red-500/30 text-white' : 'hover:bg-red-100 text-red-600'
          }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LegalPrecedentsPage() {
  const [sidebarOpen,       setSidebarOpen]       = useState(true);
  const [searchInput,       setSearchInput]       = useState('');
  const [feedbackModal,     setFeedbackModal]     = useState({ isOpen: false });
  const [showSettingsMenu,  setShowSettingsMenu]  = useState(false);
  const inputRef        = useRef(null);
  const settingsMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    };
    if (showSettingsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettingsMenu]);

  const handleLogout = async () => {
    setShowSettingsMenu(false);
    await logout();
    navigate('/login');
  };

  // Same tabs array as Platform.jsx
  const tabs = [
    { label: 'Chat',       icon: MessageCircle, path: '/platform'           },
    { label: 'Summarizer', icon: FileText,       path: '/document-summarizer' },
    { label: 'Precedents', icon: BookOpen,       path: '/legal-precedents'   },
  ];

  const {
    results, isSearching, searchError, hasSearched, currentSearchId, currentQuery,
    searchPrecedents, clearResults,
    history, historyLoading, historyError,
    loadHistory, deleteSearch,
    detailPrecedent, detailLoading, openDetail, closeDetail,
    feedbackState, submitFeedback,
    downloading, downloadJudgment,
  } = useLegalPrecedents();

  // load history on mount
  useEffect(() => { 
    loadHistory(); 
  }, [loadHistory]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchInput.trim() || isSearching) return;

    await searchPrecedents(searchInput.trim());
    await loadHistory(); // ensure newly created search appears in sidebar
  };

  const handleReplay = async (item) => {
    setSearchInput(item.query || '');
    await replaySearch(item.id);
  };

  const handleDeleteSearch = async (id) => {
    await deleteSearch(id);
    await loadHistory(); // refresh sidebar after delete
  };

  const SUGGESTED = [
    'Bail application murder PPC',
    'Tax evasion corporate liability',
    'Habeas corpus unlawful detention',
    'Land acquisition compensation',
    'Labor unfair termination',
    'NAB corruption proceedings',
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>

      {/* ══════════════════════ SIDEBAR — mirrors Platform.jsx ══════════════════════ */}
      <div
        className={`relative z-40 ${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r border-blue-200 overflow-hidden flex flex-col shadow-lg flex-shrink-0`}
        style={{ backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)' }}
      >
        {sidebarOpen && (
          <>
            {/* Logo */}
            <div
              className="px-5 pt-5 pb-4 border-b border-blue-200"
              style={{ backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #fef3c7 100%)' }}
            >
              <div className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105">
                <div className="relative w-11 h-11 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  <Scale className="w-6 h-6 text-white relative z-10" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins' }}>
                    Digital Legal
                  </span>
                  <span className="text-xs font-semibold text-gray-500 -mt-0.5" style={{ fontFamily: 'Inter' }}>Advisor</span>
                </div>
              </div>
            </div>

            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

            {/* New Search — mirrors Platform.jsx "New chat" button */}
            <button
              onClick={() => { clearResults(); setSearchInput(''); inputRef.current?.focus(); }}
              className="m-4 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-800 hover:via-amber-600 hover:to-blue-800 shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 group animate-pulse-glow"
              style={{ fontFamily: 'Inter' }}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              New Search
            </button>

            {/* History list */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'none' }}>
              <div className="flex items-center justify-between mb-3 px-2">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest" style={{ fontFamily: 'Inter' }}>History</p>
                {historyError && (
                  <button onClick={loadHistory} className="text-red-400 hover:text-red-600 transition-colors">
                    <RefreshCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="h-14 bg-blue-50 rounded-xl animate-pulse" />)}
                </div>
              ) : historyError ? (
                <div className="flex items-start gap-2 px-2 py-3 text-xs text-red-500" style={{ fontFamily: 'Inter' }}>
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>Could not load history. Check your connection.</span>
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4 px-2" style={{ fontFamily: 'Inter' }}>
                  No searches yet. Start searching!
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map(item => (
                    <SidebarHistoryItem
                      key={item.id}
                      item={item}
                      isActive={currentSearchId === item.id}
                      onClick={() => handleReplay(item)}
                      onDelete={handleDeleteSearch}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Settings footer */}
            <div
              ref={settingsMenuRef}
              className="relative border-t border-blue-200 p-4"
              style={{ backgroundImage: 'linear-gradient(135deg, #f0f9ff 0%, #fef3c7 100%)' }}
            >
              {showSettingsMenu && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl border border-blue-200 shadow-xl overflow-hidden z-50">
                  <button
                    onClick={() => { setShowSettingsMenu(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-blue-700 hover:bg-blue-50 transition-all duration-200 group"
                    style={{ fontFamily: 'Inter' }}
                  >
                    <UserCircle className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-semibold">Profile</span>
                  </button>
                  <div className="border-t border-blue-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    style={{ fontFamily: 'Inter' }}
                  >
                    <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-semibold">Log Out</span>
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowSettingsMenu((prev) => !prev)}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-700 rounded-lg hover:bg-blue-100/50 transition-all duration-300 group hover:shadow-md"
                style={{ fontFamily: 'Inter' }}
              >
                <Settings className={`w-5 h-5 transition-transform duration-500 ${showSettingsMenu ? 'rotate-180 text-blue-600' : 'group-hover:rotate-180'}`} />
                <span className="text-sm font-semibold">Settings</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ══════════════════════ MAIN AREA ══════════════════════ */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">

        {/* ── Top nav bar — exact copy of Platform.jsx header ── */}
        <div
          className="border-b-2 border-blue-200/50 px-6 py-4 flex items-center justify-between shadow-md flex-shrink-0"
          style={{ backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #fef3c7 75%, #ffffff 100%)' }}
        >
          {/* Left: sidebar toggle */}
          <div className="flex items-center gap-2 w-36">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="p-2 hover:bg-blue-100/60 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-blue-700"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Center: tab nav — identical to Platform.jsx */}
          <nav className="flex items-center gap-1 flex-1 justify-center">
            {tabs.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 group whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-400/30 hover:bg-blue-700'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                  style={{ fontFamily: 'Inter' }}
                >
                  <Icon className={`w-4 h-4 group-hover:scale-110 transition-transform ${isActive ? 'text-white' : ''}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: icons */}
          <div className="flex items-center gap-1 w-36 justify-end">
            <button className="p-2 hover:bg-amber-100/50 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-amber-500 group">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            <button className="p-2 hover:bg-blue-100/50 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600">
              <Settings className="w-4 h-4 transition-transform duration-300 hover:rotate-180" />
            </button>
          </div>
        </div>

        {/* ── Main scrollable content — same gradient as Platform.jsx messages pane ── */}
        <div
          className="flex-1 px-6 py-5 flex flex-col overflow-y-auto"
          style={{
            backgroundImage: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 20%, #dcfce7 40%, #fffbeb 60%, #fef3c7 80%, #f0f9ff 100%)',
            position: 'relative',
            scrollbarWidth: 'none',
          }}
        >
          {/* Radial overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(ellipse at 100% 0%, rgba(147,197,253,0.12) 0%, transparent 50%),
                                radial-gradient(ellipse at 0% 100%, rgba(134,239,172,0.08) 0%, transparent 50%)`,
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto w-full">

            {/* Hero search banner */}
            <div
              className="relative rounded-3xl overflow-hidden mb-6 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #3730a3 50%, #1e1b4b 100%)', animation: 'fadeIn 0.6s ease-out both' }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #60a5fa, transparent)', transform: 'translate(30%, -30%)' }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #818cf8, transparent)', transform: 'translate(-20%, 30%)' }} />

              <div className="relative z-10 px-6 sm:px-10 py-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-blue-200 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'Inter' }}>
                  <Sparkles size={12} /> AI-Powered Case Retrieval
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Inter' }}>
                  Search Case Law & Precedents
                </h2>
                <p className="text-blue-200 font-medium mb-8 max-w-xl mx-auto text-sm sm:text-base" style={{ fontFamily: 'Inter' }}>
                  Query the Supreme Court & High Court database to find relevant judgments for your legal arguments.
                </p>

                <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                  <div className="relative flex items-center">
                    <Search size={20} className="absolute left-5 text-gray-400 pointer-events-none" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="e.g. bail murder PPC, tax evasion corporate, habeas corpus…"
                      className="w-full bg-white text-gray-900 rounded-2xl py-4 pl-14 pr-36 text-base font-medium shadow-lg outline-none focus:ring-4 focus:ring-blue-400/40 transition-all"
                      style={{ fontFamily: 'Inter' }}
                    />
                    <button
                      type="submit"
                      disabled={isSearching || !searchInput.trim()}
                      className="absolute right-2 inset-y-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 hover:from-blue-800 hover:via-amber-600 hover:to-blue-800 text-white font-black text-sm px-5 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {isSearching
                        ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Searching</>
                        : <><Search size={14} /> Search</>}
                    </button>
                  </div>
                </form>

                {!hasSearched && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2" style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}>
                    {SUGGESTED.map(q => (
                      <button
                        key={q}
                        onClick={() => { setSearchInput(q); searchPrecedents(q); }}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 transition-all"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {searchError && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-5 py-4" style={{ animation: 'fadeIn 0.3s ease-out both', fontFamily: 'Inter' }}>
                <AlertCircle size={18} className="flex-shrink-0" />
                <p className="text-sm font-semibold">{searchError}</p>
                <button onClick={() => searchPrecedents(searchInput)} className="ml-auto flex items-center gap-1.5 text-xs font-bold hover:underline">
                  <RefreshCcw size={13} /> Retry
                </button>
              </div>
            )}

            {/* Results count */}
            {hasSearched && !isSearching && !searchError && (
              <div className="flex items-center justify-between mb-4" style={{ animation: 'fadeIn 0.4s ease-out both' }}>
                <div>
                  <h3 className="text-base font-black text-gray-800" style={{ fontFamily: 'Inter' }}>
                    {results.length > 0 ? `${results.length} precedent${results.length !== 1 ? 's' : ''} found` : 'No precedents found'}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5" style={{ fontFamily: 'Inter' }}>
                    For: "<span className="text-blue-600">{currentQuery}</span>"
                  </p>
                </div>
                {results.length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500" style={{ fontFamily: 'Inter' }}>
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" /> 80%+ High
                    <span className="w-2.5 h-2.5 bg-blue-400 rounded-full ml-2" /> 50%+ Mid
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full ml-2" /> Low
                  </div>
                )}
              </div>
            )}

            {/* Results table */}
            <ResultsTable
              results={results}
              isSearching={isSearching}
              onView={openDetail}
              onDownload={downloadJudgment}
              downloading={downloading}
            />

            {/* Empty state */}
            {hasSearched && !isSearching && results.length === 0 && !searchError && (
              <div className="bg-white/80 border-2 border-blue-100 rounded-3xl p-16 text-center shadow-sm" style={{ animation: 'scaleIn 0.4s ease-out both' }}>
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
                  <FileText size={36} className="text-blue-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2" style={{ fontFamily: 'Inter' }}>No Precedents Found</h3>
                <p className="text-gray-500 font-medium text-sm mb-6" style={{ fontFamily: 'Inter' }}>Try different keywords or a broader search term.</p>
                <button
                  onClick={() => { clearResults(); setSearchInput(''); inputRef.current?.focus(); }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg"
                  style={{ fontFamily: 'Inter' }}
                >
                  <RefreshCcw size={15} /> Try Again
                </button>
              </div>
            )}

            {/* Feedback bar — mirrors Platform.jsx message feedback row exactly */}
            {hasSearched && !isSearching && results.length > 0 && currentSearchId && (
              <div className="mt-5 flex items-center gap-3" style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}>
                {feedbackState[currentSearchId] ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-green-600" style={{ fontFamily: 'Inter' }}>
                    <CheckCircle2 className="w-4 h-4" /> Thank you for your feedback!
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => submitFeedback({ searchId: currentSearchId, rating: 'helpful', comment: '' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-200"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                    </button>
                    <button
                      onClick={() => submitFeedback({ searchId: currentSearchId, rating: 'not_helpful', comment: '' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" /> Not helpful
                    </button>
                    <button
                      onClick={() => setFeedbackModal({ isOpen: true })}
                      className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors underline underline-offset-2"
                      style={{ fontFamily: 'Inter' }}
                    >
                      Provide detailed feedback
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Pre-search info cards — styled as SuggestedQuestionCard from Platform.jsx */}
            {!hasSearched && !isSearching && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
                {[
                  { icon: Scale,    title: 'Supreme Court',     desc: "Landmark judgments from Pakistan's apex court", index: 0 },
                  { icon: BookOpen, title: 'High Court Rulings', desc: 'Provincial High Court precedents and orders',   index: 1 },
                  { icon: FileText, title: 'Full Judgments',     desc: 'Download complete texts of court decisions',    index: 2 },
                ].map(({ icon: Icon, title, desc, index }) => (
                  <button
                    key={title}
                    className="group relative bg-gradient-to-br from-blue-50 via-blue-100/50 to-amber-50/30 hover:from-blue-100 hover:via-blue-150/60 hover:to-amber-100/40 border-2 border-blue-200 hover:border-amber-400/70 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 p-3 flex items-center gap-3 text-left overflow-hidden h-16"
                    style={{ fontFamily: 'Inter', animation: `slideInUp 0.5s ease-out ${index * 80}ms both` }}
                  >
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600 w-0 group-hover:w-full transition-all duration-300" />
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-amber-500/50 transition-all duration-300 flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 leading-tight">{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* ── Footer bar — same as Platform.jsx input area footer ── */}
        <div
          className="border-t-2 border-blue-200/50 px-6 py-4 shadow-md flex-shrink-0"
          style={{ backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #fef3c7 75%, #ffffff 100%)' }}
        >
          <p className="text-xs text-gray-500 text-center font-semibold inline-flex items-center justify-center gap-1.5 w-full" style={{ fontFamily: 'Inter' }}>
            <Scale className="w-3.5 h-3.5" />
            Always verify critical legal information with a qualified professional.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {(detailPrecedent || detailLoading) && (
        <DetailModal
          precedent={detailPrecedent}
          loading={detailLoading}
          onClose={closeDetail}
          onDownload={downloadJudgment}
          downloading={detailPrecedent ? downloading[detailPrecedent.id] : false}
        />
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false })}
        onSubmit={({ searchId, rating, comment }) =>
          submitFeedback({ searchId: currentSearchId, rating, comment })
        }
        searchId={currentSearchId}
      />

      {/* Global keyframes — exact copy from Platform.jsx */}
      <style>{`
        @keyframes slideInUp  { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer    { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        @keyframes fadeIn     { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp   { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn    { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse      { 0%,100% { opacity:1; } 50% { opacity:0.85; } }
        .animate-shimmer      { background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); background-size:1000px 100%; animation: shimmer 3s infinite; }
        .animate-fade-in      { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up   { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-scale-in     { animation: scaleIn 0.5s ease-out forwards; }
        .animate-pulse-glow   { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        ::-webkit-scrollbar   { display: none; }
      `}</style>
    </div>
  );
}