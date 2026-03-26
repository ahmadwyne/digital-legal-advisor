import { useState } from "react";
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
} from "lucide-react";

import { useDocumentSummarizer } from "@/hooks/useDocumentSummarizer";
import UploadArea from "@/components/documentSummarizer/UploadArea";
import ProcessingStatus from "@/components/documentSummarizer/ProcessingStatus";
import SummaryDisplay from "@/components/documentSummarizer/SummaryDisplay";
import FeedbackModal from "@/components/documentSummarizer/FeedbackModal";

const DocumentSummarizer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
  } = useDocumentSummarizer();

  const tabs = [
    { label: "Chat", icon: MessageCircle, path: "/platform" },
    { label: "Summarizer", icon: FileText, path: "/document-summarizer" },
    { label: "Precedents", icon: BookOpen, path: "/legal-precedents" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>
      {/* Sidebar (Platform-like) */}
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
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span
                    className="text-xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Digital Legal
                  </span>
                  <span className="text-xs font-semibold text-gray-500 -mt-0.5" style={{ fontFamily: "Inter" }}>
                    Advisor
                  </span>
                </div>
              </Link>
            </div>

            <div className="p-4 border-b border-blue-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              className="m-4 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
              style={{ fontFamily: "Inter" }}
              onClick={handleReset}
            >
              <Plus className="w-5 h-5" />
              New summary
            </button>
          </>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Top Bar */}
        <div
          className="border-b-2 border-blue-200/50 px-6 py-4 flex items-center justify-between shadow-md flex-shrink-0"
          style={{
            backgroundImage: `linear-gradient(90deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #fef3c7 75%, #ffffff 100%)`,
          }}
        >
          <div className="flex items-center gap-2 w-36">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-blue-100/60 rounded-lg transition-all text-blue-600"
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all
                    ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"}`}
                  style={{ fontFamily: "Inter" }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 w-36 justify-end">
            <button className="p-2 hover:bg-amber-100/50 rounded-lg text-blue-600">
              <Sparkles className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-blue-100/50 rounded-lg text-blue-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
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
    </div>
  );
};

export default DocumentSummarizer;