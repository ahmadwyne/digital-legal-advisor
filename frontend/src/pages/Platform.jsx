import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Send,
  Plus,
  Settings,
  MessageCircle,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Menu,
  X,
  Download,
  Share2,
  Scale,
  Briefcase,
  DollarSign,
  Home,
  Users,
  Search,
  FileText,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  RefreshCcw,
  CheckCircle2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/hooks/useAuth";

// ─────────────────────────────────────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  // Try multiple common token storage locations
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const chatApi = {
  sendMessage: async ({ message, sessionId, queryType = "general", userId }) => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, sessionId, queryType, top_k: 5, userId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Server error ${res.status}`);
    }
    return res.json(); // { status, data: { query, response } }
  },

  getHistory: async ({ limit = 50, offset = 0, userId } = {}) => {
    const params = new URLSearchParams({ limit, offset });
    if (userId) params.set("userId", userId);
    const res = await fetch(
      `${API_BASE}/chat/history?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error("Failed to load history");
    return res.json(); // { status, data: { total, items } }
  },

  deleteChat: async (queryId, userId) => {
    const params = userId ? `?userId=${userId}` : "";
    const res = await fetch(`${API_BASE}/chat/${queryId}${params}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: userId ? JSON.stringify({ userId }) : undefined,
    });
    if (!res.ok) throw new Error("Failed to delete chat");
    return res.json();
  },

  submitFeedback: async ({ responseId, rating, comment, userId }) => {
    const res = await fetch(`${API_BASE}/chat/feedback`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ responseId, rating, comment, userId }),
    });
    if (!res.ok) throw new Error("Failed to submit feedback");
    return res.json();
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN MESSAGE RENDERER
// ─────────────────────────────────────────────────────────────────────────────
const MarkdownContent = ({ content }) => (
  <div className="prose prose-sm max-w-none text-gray-700">
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1 className="text-lg font-extrabold text-blue-800 mb-2">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-base font-bold text-blue-700 mb-1.5 mt-3">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-sm font-bold text-blue-600 mb-1 mt-2">{children}</h3>
      ),
      strong: ({ children }) => (
        <strong className="font-bold text-gray-800">{children}</strong>
      ),
      ul: ({ children }) => (
        <ul className="list-disc list-outside ml-4 space-y-1 my-2">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal list-outside ml-4 space-y-1 my-2">{children}</ol>
      ),
      li: ({ children }) => (
        <li className="text-gray-700 text-sm leading-relaxed">{children}</li>
      ),
      p: ({ children }) => (
        <p className="text-sm leading-relaxed text-gray-700 mb-2">{children}</p>
      ),
      table: ({ children }) => (
        <div className="overflow-x-auto my-3">
          <table className="min-w-full border border-blue-200 rounded-lg text-xs">
            {children}
          </table>
        </div>
      ),
      th: ({ children }) => (
        <th className="px-3 py-2 bg-blue-100 text-blue-800 font-bold border border-blue-200 text-left">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-3 py-2 border border-blue-100 text-gray-700">{children}</td>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-amber-400 pl-3 italic text-gray-600 my-2 bg-amber-50/50 py-1 rounded-r">
          {children}
        </blockquote>
      ),
      code: ({ inline, children }) =>
        inline ? (
          <code className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded text-xs font-mono">
            {children}
          </code>
        ) : (
          <pre className="bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto text-xs font-mono my-2">
            <code>{children}</code>
          </pre>
        ),
    }}
  >
    {content}
  </ReactMarkdown>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FEEDBACK MODAL
// ─────────────────────────────────────────────────────────────────────────────
const FeedbackModal = ({ isOpen, onClose, onSubmit, messageId, responseId }) => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    try {
      await onSubmit({ responseId, rating, comment });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(null);
        setComment("");
        onClose();
      }, 1500);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 w-full max-w-md p-6 animate-scale-in"
        style={{ fontFamily: "Inter" }}
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
              How helpful was this legal response?
            </p>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setRating("like")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                  rating === "like"
                    ? "bg-green-500 text-white border-green-500 shadow-md"
                    : "border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                Helpful
              </button>
              <button
                onClick={() => setRating("dislike")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                  rating === "dislike"
                    ? "bg-red-500 text-white border-red-500 shadow-md"
                    : "border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50"
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                Not Helpful
              </button>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Additional comments (optional) – e.g. what was inaccurate or could be improved?"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none transition-colors"
            />

            <button
              onClick={handleSubmit}
              disabled={!rating || submitting}
              className="mt-4 w-full py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-800 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const MessageBubble = ({ message, isLatest, onFeedback, onOpenFeedbackModal }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (disliked) setDisliked(false);
    if (message.responseId) {
      onFeedback?.({ responseId: message.responseId, rating: newLiked ? "like" : null });
    }
  };

  const handleDislike = () => {
    const newDisliked = !disliked;
    setDisliked(newDisliked);
    if (liked) setLiked(false);
    if (message.responseId) {
      onFeedback?.({ responseId: message.responseId, rating: newDisliked ? "dislike" : null });
    }
  };

  if (message.sender === "user") {
    return (
      <div className="flex justify-end animate-fade-in-up">
        <div className="max-w-2xl group">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl rounded-br-none shadow-lg hover:shadow-blue-500/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p
              className="relative z-10 text-base font-medium leading-relaxed break-words"
              style={{ fontFamily: "Inter" }}
            >
              {message.text}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2 px-2 font-semibold" style={{ fontFamily: "Inter" }}>
            {message.timestamp instanceof Date
              ? message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    );
  }

  // Bot message
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="max-w-2xl group w-full">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 group-hover:shadow-blue-500/50 ring-2 ring-blue-200">
            <Scale className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>

          <div className="relative group/msg flex-1">
            <div className="px-6 py-4 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-100/30 text-gray-800 rounded-3xl rounded-bl-none border-2 border-blue-200 shadow-lg hover:shadow-blue-300/50 hover:border-blue-300 transition-all duration-300 relative group-hover:border-amber-400/50">
              <div className="absolute inset-0 bg-white/50 opacity-0 group-hover/msg:opacity-100 rounded-3xl transition-opacity duration-300" />

              {/* Citations & confidence badge */}
              {(message.citations?.length > 0 || message.confidence > 0) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {message.confidence > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {(message.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                  {message.numSources > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      <BookOpen className="w-3.5 h-3.5" />
                      {message.numSources} source{message.numSources > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}

              <div className="relative z-10">
                <MarkdownContent content={message.text} />
              </div>

              {/* Citations list */}
              {message.citations?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs font-bold text-blue-700 mb-1.5">References:</p>
                  <ul className="space-y-1">
                    {message.citations.map((c, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleCopy}
                className="absolute -top-10 right-0 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 shadow-lg z-20"
              >
                {copied ? (
                  <><Check className="w-3 h-3" /> Copied</>
                ) : (
                  <><Copy className="w-3 h-3" /> Copy</>
                )}
              </button>
            </div>

            {/* Feedback bar – only on latest bot message */}
            {isLatest && message.sender === "bot" && (
              <div className="flex items-center gap-3 mt-3 ml-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                    liked
                      ? "bg-green-100 border-green-300 text-green-700"
                      : "border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-200"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                    disliked
                      ? "bg-red-100 border-red-300 text-red-700"
                      : "border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Not helpful
                </button>
                <button
                  onClick={() => onOpenFeedbackModal?.(message)}
                  className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors underline underline-offset-2"
                  style={{ fontFamily: "Inter" }}
                >
                  Provide detailed feedback
                </button>

                <div className="flex gap-1 ml-auto">
                  <button className="p-1.5 hover:bg-amber-100 text-blue-500 hover:text-amber-600 rounded-md transition-all duration-200">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 hover:bg-amber-100 text-blue-500 hover:text-amber-600 rounded-md transition-all duration-200">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2 px-2 font-semibold" style={{ fontFamily: "Inter" }}>
              {message.timestamp instanceof Date
                ? message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR CHAT ITEM
// ─────────────────────────────────────────────────────────────────────────────
const SidebarChat = ({ session, isActive, onClick, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);

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
          {session.title}
        </p>
        <p className={`text-xs truncate mt-0.5 ${isActive ? "text-blue-100" : "text-gray-500"}`}>
          {new Date(session.createdAt).toLocaleDateString()}
        </p>
      </div>

      {isHovering && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
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

// ─────────────────────────────────────────────────────────────────────────────
// SUGGESTED QUESTION CARD
// ─────────────────────────────────────────────────────────────────────────────
const SuggestedQuestionCard = ({ question, icon: Icon, onClick, index }) => (
  <button
    onClick={onClick}
    className="group relative bg-gradient-to-br from-blue-50 via-blue-100/50 to-amber-50/30 hover:from-blue-100 hover:via-blue-150/60 hover:to-amber-100/40 border-2 border-blue-200 hover:border-amber-400/70 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 p-3 flex items-center gap-3 text-left overflow-hidden h-16"
    style={{ fontFamily: "Inter", animation: `slideInUp 0.5s ease-out ${index * 80}ms both` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-400/0 group-hover:from-amber-400/5 group-hover:to-amber-400/5 transition-all duration-300" />
    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-amber-500/50 transition-all duration-300 flex-shrink-0">
      <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
    </div>
    <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 leading-tight relative z-10 truncate">
      {question}
    </p>
    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600 w-0 group-hover:w-full transition-all duration-300" />
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PLATFORM COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Platform = () => {
  // Get authenticated user from your existing AuthContext
  const { user } = useAuth();

  const [messages, setMessages]         = useState([]);
  const [inputValue, setInputValue]     = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [searchQuery, setSearchQuery]   = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Chat sessions loaded from backend
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Feedback modal
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, message: null });

  const messagesEndRef      = useRef(null);
  const messageContainerRef = useRef(null);
  const navigate            = useNavigate();
  const location            = useLocation();

  const suggestedQuestions = [
    { question: "What should I know about employment contracts?",    icon: Briefcase   },
    { question: "Explain corporate tax liability in Pakistan",        icon: DollarSign  },
    { question: "How do property disputes work in Pakistan?",         icon: Home        },
    { question: "What are my tenant rights in Pakistan?",             icon: Users       },
    { question: "What are the key SBP banking regulations?",          icon: Scale       },
    { question: "Explain divorce procedure under MFLO in Pakistan",   icon: BookOpen    },
  ];

  const tabs = [
    { label: "Chat",       icon: MessageCircle, path: "/platform"          },
    { label: "Summarizer", icon: FileText,      path: "/document-summarizer" },
    { label: "Precedents", icon: BookOpen,      path: "/legal-precedents"   },
  ];

  // ── Load history from backend on mount ──────────────────────────────────
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const data = await chatApi.getHistory({ limit: 50, userId: user?.id });
      if (data?.data?.items) {
        // Build sidebar sessions from history items
        const sessions = data.data.items.map((item) => ({
          id: item.queryId,
          title: item.queryText.slice(0, 60) + (item.queryText.length > 60 ? "…" : ""),
          queryText: item.queryText,
          response: item.response,
          createdAt: item.queryCreatedAt,
        }));
        setChatSessions(sessions);
      }
    } catch (err) {
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // ── Load a history item into the chat ───────────────────────────────────
  const handleLoadHistoryItem = (session) => {
    const msgs = [
      {
        id: `user-${session.id}`,
        text: session.queryText,
        sender: "user",
        timestamp: new Date(session.createdAt),
      },
    ];

    if (session.response) {
      msgs.push({
        id: `bot-${session.id}`,
        text: session.response.responseText,
        sender: "bot",
        timestamp: new Date(session.response.responseCreatedAt),
        citations:   session.response.citations   || [],
        confidence:  session.response.confidence  || 0,
        numSources:  session.response.numSources  || 0,
        responseId:  session.response.responseId,
      });
    }

    setMessages(msgs);
    setCurrentSessionId(session.id);
    setShowEmptyState(false);
  };

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setShowEmptyState(false);
    const text = inputValue.trim();

    const userMsg = {
      id: `user-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const data = await chatApi.sendMessage({
        message: text,
        sessionId: currentSessionId,
        queryType: "general",
        userId: user?.id,
      });

      const { response: r, query: q } = data.data;

      const botMsg = {
        id: `bot-${r.id}`,
        text: r.responseText,
        sender: "bot",
        timestamp: new Date(r.createdAt),
        citations:   r.citations  || [],
        confidence:  r.confidence || 0,
        numSources:  r.numSources || 0,
        responseId:  r.id,
      };
      setMessages((prev) => [...prev, botMsg]);

      // Add to sidebar history
      const newSession = {
        id: q.id,
        title: text.slice(0, 60) + (text.length > 60 ? "…" : ""),
        queryText: text,
        response: {
          responseId: r.id,
          responseText: r.responseText,
          citations: r.citations || [],
          confidence: r.confidence || 0,
          numSources: r.numSources || 0,
          responseCreatedAt: r.createdAt,
        },
        createdAt: q.createdAt,
      };
      setChatSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(q.id);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          text: `⚠️ **Error:** ${err.message}\n\nPlease check your connection or try again.`,
          sender: "bot",
          timestamp: new Date(),
          citations: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  // ── New chat ──────────────────────────────────────────────────────────────
  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setShowEmptyState(true);
  };

  // ── Delete chat ───────────────────────────────────────────────────────────
  const handleDeleteChat = async (sessionId) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      handleNewChat();
    }
    try {
      await chatApi.deleteChat(sessionId);
    } catch {
      // Re-load history if delete fails
      loadHistory();
    }
  };

  // ── Quick feedback (thumbs) ───────────────────────────────────────────────
  const handleQuickFeedback = async ({ responseId, rating }) => {
    if (!responseId || !rating) return;
    try {
      await chatApi.submitFeedback({ responseId, rating, comment: "" });
    } catch { /* silent */ }
  };

  // ── Detailed feedback (modal) ─────────────────────────────────────────────
  const handleOpenFeedbackModal = (message) => {
    setFeedbackModal({ isOpen: true, message });
  };

  const handleSubmitFeedback = async ({ responseId, rating, comment }) => {
    await chatApi.submitFeedback({ responseId, rating, comment });
  };

  const filteredSessions = chatSessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: "#f8fafc" }}>

      {/* ═══════════════════════════ SIDEBAR ═══════════════════════════ */}
      <div
        className={`relative z-40 ${isSidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-blue-200 overflow-hidden flex flex-col shadow-lg`}
        style={{ backgroundImage: "linear-gradient(180deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)" }}
      >
        {isSidebarOpen && (
          <>
            {/* Logo */}
            <div
              className="px-5 pt-5 pb-4 border-b border-blue-200"
              style={{ backgroundImage: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #fef3c7 100%)" }}
            >
              <Link
                to="/"
                className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative w-11 h-11 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow overflow-hidden group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  <Scale className="w-6 h-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
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

            {/* Search */}
            <div
              className="p-4 border-b border-blue-200"
              style={{ backgroundImage: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #fef3c7 100%)" }}
            >
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
                  style={{ fontFamily: "Inter" }}
                />
              </div>
            </div>

            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

            {/* New Chat */}
            <button
              onClick={handleNewChat}
              className="m-4 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-800 hover:via-amber-600 hover:to-blue-800 shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 group animate-pulse-glow"
              style={{ fontFamily: "Inter" }}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              New chat
            </button>

            {/* History */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
              <div className="flex items-center justify-between mb-3 px-2">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest" style={{ fontFamily: "Inter" }}>
                  History
                </p>
                {historyError && (
                  <button onClick={loadHistory} className="text-red-400 hover:text-red-600 transition-colors">
                    <RefreshCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-blue-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : historyError ? (
                <div className="flex items-start gap-2 px-2 py-3 text-xs text-red-500" style={{ fontFamily: "Inter" }}>
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>Could not load history. Check your connection.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <SidebarChat
                        key={session.id}
                        session={session}
                        isActive={currentSessionId === session.id}
                        onClick={() => handleLoadHistoryItem(session)}
                        onDelete={handleDeleteChat}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4 px-2" style={{ fontFamily: "Inter" }}>
                      {searchQuery ? "No chats found" : "No history yet. Start chatting!"}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <div
              className="border-t border-blue-200 p-4"
              style={{ backgroundImage: "linear-gradient(135deg, #f0f9ff 0%, #fef3c7 100%)" }}
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-700 rounded-lg hover:bg-blue-100/50 transition-all duration-300 group hover:shadow-md"
                style={{ fontFamily: "Inter" }}
              >
                <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-sm font-semibold">Settings</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ═══════════════════════════ MAIN CHAT AREA ═══════════════════════════ */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">

        {/* Header */}
        <div
          className="border-b-2 border-blue-200/50 px-6 py-4 flex items-center justify-between shadow-md flex-shrink-0"
          style={{ backgroundImage: "linear-gradient(90deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #fef3c7 75%, #ffffff 100%)" }}
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 group whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-400/30 hover:bg-blue-700"
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
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

        {/* Messages */}
        <div
          ref={messageContainerRef}
          className="flex-1 px-6 py-5 space-y-3 flex flex-col overflow-y-auto"
          style={{
            backgroundImage: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 20%, #dcfce7 40%, #fffbeb 60%, #fef3c7 80%, #f0f9ff 100%)",
            position: "relative",
            scrollbarWidth: "none",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(ellipse at 100% 0%, rgba(147,197,253,0.12) 0%, transparent 50%),
                                radial-gradient(ellipse at 0% 100%, rgba(134,239,172,0.08) 0%, transparent 50%)`,
            }}
          />

          <div className="relative z-10 flex flex-col">
            {showEmptyState && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center animate-fade-in gap-2 py-12">
                <h2
                  className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent animate-fade-in-up"
                  style={{ fontFamily: "Poppins", animationDelay: "0.1s" }}
                >
                  Ask Away!
                </h2>
                <p
                  className="text-xs text-gray-600 max-w-md leading-relaxed font-medium animate-fade-in-up px-4"
                  style={{ fontFamily: "Inter", animationDelay: "0.2s" }}
                >
                  I'm ready to help with questions about Pakistani financial laws, corporate regulations, property rights, and employment law.
                </p>
                <div className="w-full max-w-2xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest" style={{ fontFamily: "Inter" }}>
                    Try asking:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {suggestedQuestions.map((item, index) => (
                      <SuggestedQuestionCard
                        key={index}
                        question={item.question}
                        icon={item.icon}
                        onClick={() => handleSuggestedQuestion(item.question)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isLatest={idx === messages.length - 1}
                    onFeedback={handleQuickFeedback}
                    onOpenFeedbackModal={handleOpenFeedbackModal}
                  />
                ))}

                {isLoading && (
                  <div className="flex justify-start animate-fade-in-up">
                    <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-100 via-blue-50 to-amber-100/30 rounded-3xl border-2 border-blue-300 shadow-lg">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" />
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                      <span className="text-xs text-blue-600 font-semibold ml-2" style={{ fontFamily: "Inter" }}>
                        Researching Pakistani law…
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div
          className="border-t-2 border-blue-200/50 px-6 py-4 shadow-md flex-shrink-0"
          style={{ backgroundImage: "linear-gradient(90deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #fef3c7 75%, #ffffff 100%)" }}
        >
          <form onSubmit={handleSendMessage} className="flex gap-2 mb-1.5">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask a legal question..."
                className="w-full px-5 py-3 bg-white border-2 border-blue-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-300/40 transition-all duration-300 font-medium text-sm"
                style={{ fontFamily: "Inter" }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-800 hover:via-amber-600 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group flex-shrink-0"
            >
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>
          <p
            className="text-xs text-gray-500 text-center font-semibold inline-flex items-center justify-center gap-1.5 w-full"
            style={{ fontFamily: "Inter" }}
          >
            <Scale className="w-3.5 h-3.5" />
            Always verify critical legal information with a qualified professional.
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false, message: null })}
        onSubmit={handleSubmitFeedback}
        messageId={feedbackModal.message?.id}
        responseId={feedbackModal.message?.responseId}
      />

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: -1000px 0; }
          100% { background-position:  1000px 0; }
        }
        @keyframes fadeIn      { from { opacity: 0; }  to { opacity: 1; } }
        @keyframes fadeInUp    { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn     { from { opacity: 0; transform: scale(0.9); }      to { opacity: 1; transform: scale(1);      } }
        @keyframes pulse       { 0%,100% { opacity:1; } 50% { opacity:0.85; } }
        .animate-shimmer       { background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%); background-size:1000px 100%; animation: shimmer 3s infinite; }
        .animate-fade-in       { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up    { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-scale-in      { animation: scaleIn 0.5s ease-out forwards; }
        .animate-pulse-glow    { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        ::-webkit-scrollbar    { display: none; }
      `}</style>
    </div>
  );
};

export default Platform;