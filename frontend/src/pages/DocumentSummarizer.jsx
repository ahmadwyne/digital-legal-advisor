import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Menu,
  X,
  MessageCircle,
  FileText,
  BookOpen,
  Settings,
  Sparkles,
  Search,
  Plus,
  Scale,
  Clock3,
  Trash2,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

import { useDocumentSummarizer } from "@/hooks/useDocumentSummarizer";
import { useSummarizerHistory } from "@/hooks/useSummarizerHistory";
import UploadArea from "@/components/documentSummarizer/UploadArea";
import ProcessingStatus from "@/components/documentSummarizer/ProcessingStatus";
import SummaryDisplay from "@/components/documentSummarizer/SummaryDisplay";
import FeedbackModal from "@/components/documentSummarizer/FeedbackModal";

const HistoryItem = ({ item, isActive, onClick, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);
  const date = item?.uploadDate ? new Date(item.uploadDate) : null;
  const dateText = date ? date.toLocaleDateString() : "Unknown date";

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      className={`group p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center justify-between ${
        isActive
          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-2 border-amber-400/70 shadow-lg shadow-blue-500/30 text-white animate-scale-in"
          : "hover:bg-blue-50 border border-transparent text-gray-700"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold truncate transition-colors duration-300 ${
            isActive ? "text-white" : "text-gray-800 group-hover:text-blue-600"
          }`}
          style={{ fontFamily: "Inter" }}
        >
          {item.fileName}
        </p>
        <p className={`text-xs truncate mt-1 ${isActive ? "text-blue-100" : "text-gray-500"}`} style={{ fontFamily: "Inter" }}>
          {item.fileType?.toUpperCase()} • {dateText}
        </p>
      </div>

      {isHovering && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className={`p-1.5 rounded-md transition-all duration-200 transform hover:scale-110 ml-2 animate-fade-in-up ${
            isActive ? "hover:bg-red-500/30 text-white" : "hover:bg-red-100 text-red-600"
          }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const DocumentSummarizer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    };
    if (showSettingsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettingsMenu]);

  const handleLogout = async () => {
    setShowSettingsMenu(false);
    await logout();
    navigate("/login");
  };
  const [activeHistoryId, setActiveHistoryId] = useState(null);
  
  const {
    uploadedFile,
    summary,
    isProcessing,
    uploadProgress,
    error,
    feedbackSubmitted,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    handleFileUpload,
    handleFeedback,
    handleFeedbackModalSubmit,
    handleReset,
    setSummary,
    setError,
  } = useDocumentSummarizer();

  const {
    history,
    loading: historyLoading,
    refetchHistory,
    getHistoryItemSummary,
    deleteHistoryItem,
  } = useSummarizerHistory({ limit: 50 });

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return history;
    return history.filter((h) => {
      const file = (h.fileName || "").toLowerCase();
      const type = (h.fileType || "").toLowerCase();
      const docType = (h.docType || "").toLowerCase();
      return file.includes(q) || type.includes(q) || docType.includes(q);
    });
  }, [history, searchQuery]);

  const tabs = [
    { label: "Chat", icon: MessageCircle, path: "/platform" },
    { label: "Summarizer", icon: FileText, path: "/document-summarizer" },
    { label: "Precedents", icon: BookOpen, path: "/legal-precedents" },
  ];

  const handleNewSummary = () => {
    setActiveHistoryId(null);
    handleReset();
    refetchHistory();
  };

  const handleHistorySelect = async (id) => {
    try {
      setError(null);
      setActiveHistoryId(id);
      const data = await getHistoryItemSummary(id);
      setSummary(data);
    } catch (e) {
      toast.error("Could not load saved summary.");
    }
  };

  const handleHistoryDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      if (activeHistoryId === id) {
        setActiveHistoryId(null);
        handleReset();
      }
      toast.success("Summary deleted.");
    } catch (e) {
      toast.error("Could not delete summary.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
      {/* Sidebar */}
      <div
        className={`relative z-40 ${isSidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-blue-200 overflow-hidden flex flex-col shadow-lg`}
        style={{
          backgroundImage: `linear-gradient(180deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)`,
        }}
      >
        {isSidebarOpen && (
          <>
            <div
              className="px-5 pt-5 pb-4 border-b border-blue-200"
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #fef3c7 100%)`,
              }}
            >
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105">
                <div className="relative w-11 h-11 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  <Scale className="w-6 h-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent" style={{ fontFamily: "Poppins" }}>
                    Digital Legal
                  </span>
                  <span className="text-xs font-semibold text-gray-500 -mt-0.5" style={{ fontFamily: "Inter" }}>
                    Advisor
                  </span>
                </div>
              </Link>
            </div>

            <div
              className="p-4 border-b border-blue-200"
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #fef3c7 100%)`,
              }}
            >
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search summaries..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-300/30 transition-all duration-300"
                  style={{ fontFamily: "Inter" }}
                />
              </div>
            </div>

            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

            <button
              className="m-4 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-800 hover:via-amber-600 hover:to-blue-800 shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 group animate-pulse-glow"
              style={{ fontFamily: "Inter" }}
              onClick={handleNewSummary}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              New summary
            </button>

            {/* History */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 px-2 flex items-center gap-2" style={{ fontFamily: "Inter" }}>
                <Clock3 className="w-3.5 h-3.5" />
                History
              </p>

              {historyLoading ? (
                <p className="text-xs text-gray-500 text-center py-4" style={{ fontFamily: "Inter" }}>
                  Loading history...
                </p>
              ) : filteredHistory.length > 0 ? (
                <div className="space-y-2">
                  {filteredHistory.map((item) => (
                    <HistoryItem
                      key={item.id}
                      item={item}
                      isActive={activeHistoryId === item.id}
                      onClick={() => handleHistorySelect(item.id)}
                      onDelete={handleHistoryDelete}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4" style={{ fontFamily: "Inter" }}>
                  No summaries found
                </p>
              )}
            </div>
            
            <div
              ref={settingsMenuRef}
              className="relative border-t border-blue-200 p-4"
              style={{ backgroundImage: `linear-gradient(135deg, #f0f9ff 0%, #fef3c7 100%)` }}
            >
              {showSettingsMenu && (
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl border border-blue-200 shadow-xl overflow-hidden z-50">
                  <button
                    onClick={() => { setShowSettingsMenu(false); navigate("/profile"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-blue-700 hover:bg-blue-50 transition-all duration-200 group"
                    style={{ fontFamily: "Inter" }}
                  >
                    <UserCircle className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-semibold">Profile</span>
                  </button>
                  <div className="border-t border-blue-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    style={{ fontFamily: "Inter" }}
                  >
                    <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm font-semibold">Log Out</span>
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowSettingsMenu((prev) => !prev)}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-700 rounded-lg hover:bg-blue-100/50 transition-all duration-300 group hover:shadow-md"
                style={{ fontFamily: "Inter" }}
              >
                <Settings className={`w-5 h-5 transition-transform duration-500 ${showSettingsMenu ? "rotate-180 text-blue-600" : "group-hover:rotate-180"}`} />
                <span className="text-sm font-semibold">Settings</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <div
          className="border-b-2 border-blue-200/50 px-6 py-4 flex items-center justify-between shadow-md flex-shrink-0"
          style={{
            backgroundImage: `linear-gradient(90deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #fef3c7 75%, #ffffff 100%)`,
          }}
        >
          <div className="flex items-center gap-2 w-36">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-blue-100/60 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-blue-700"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex items-center gap-1 flex-1 justify-center">
            {tabs.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 group whitespace-nowrap
                    ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-400/30 hover:bg-blue-700" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"}`}
                  style={{ fontFamily: "Inter" }}
                >
                  <Icon className={`w-4 h-4 group-hover:scale-110 transition-transform ${isActive ? "text-white" : ""}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 w-36 justify-end">
            <button className="p-2 hover:bg-amber-100/50 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-amber-500 group">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            <button className="p-2 hover:bg-blue-100/50 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600">
              <Settings className="w-4 h-4 transition-transform duration-300 hover:rotate-180" />
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-6 py-6"
          style={{
            backgroundImage: `linear-gradient(135deg, #f0f9ff 0%, #dbeafe 20%, #dcfce7 40%, #fffbeb 60%, #fef3c7 80%, #f0f9ff 100%)`,
          }}
        >
          <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {!isProcessing && !summary && (
              <UploadArea
                onFileUpload={handleFileUpload}
                disabled={isProcessing}
                uploadedFileName={uploadedFile?.name}
                uploadProgress={uploadProgress}
              />
            )}

            {error && !isProcessing && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <p className="font-semibold text-red-700 text-sm">Summarization Failed</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button onClick={handleReset} className="mt-3 text-sm text-red-700 underline">
                  Try again
                </button>
              </div>
            )}

            {isProcessing && <ProcessingStatus progress={uploadProgress} />}

            {summary && !isProcessing && (
              <SummaryDisplay
                summary={summary}
                onFeedback={handleFeedback}
                onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
                onReset={handleReset}
              />
            )}

            {feedbackSubmitted && (
              <p className="text-sm text-[#29473E] font-medium">✅ Thank you for your feedback! It helps us improve.</p>
            )}
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackModalSubmit}
      />

      <style>{`
        .animate-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-pulse-glow { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};

export default DocumentSummarizer;