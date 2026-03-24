// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Menu, MessageSquare, Plus, User, Bot, AlertCircle, RefreshCw } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast';

// // --- INTERNAL SUBCOMPONENTS ---

// const PlatformHeader = ({ sidebarOpen, setSidebarOpen }) => (
//   <header className="bg-white/95 backdrop-blur-md border-b-2 border-blue-100 px-6 py-4 flex items-center justify-between z-20">
//     <div className="flex items-center gap-4">
//       <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-blue-50 rounded-xl text-blue-700">
//         <Menu className="h-6 w-6" />
//       </button>
//       <h1 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" style={{ fontFamily: "Poppins" }}>
//         Digital Legal Advisor
//       </h1>
//     </div>
//     <div className="flex items-center gap-3">
//       <div className="bg-blue-100 p-2 rounded-full">
//         <User className="h-5 w-5 text-blue-700" />
//       </div>
//     </div>
//   </header>
// );

// const PlatformSidebar = ({ onHistoryClick, onNewChat }) => {
//   const mockHistory = ['Corporate Tax Liability', 'Property Dispute Precedents', 'Employment Law Guidelines'];
//   return (
//     <div className="h-full bg-white border-r-2 border-blue-100 flex flex-col p-4 w-72">
//       <Button 
//         onClick={onNewChat}
//         className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all mb-6 py-6"
//         style={{ fontFamily: "Inter" }}
//       >
//         <Plus className="mr-2 h-5 w-5" /> New Legal Query
//       </Button>
//       <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2" style={{ fontFamily: "Inter" }}>Recent Queries</p>
//       <div className="flex flex-col gap-2 overflow-y-auto">
//         {mockHistory.map((query, i) => (
//           <button 
//             key={i} 
//             onClick={() => onHistoryClick(query)}
//             className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-left transition-colors group"
//           >
//             <MessageSquare className="h-4 w-4 text-blue-400 group-hover:text-blue-600" />
//             <span className="text-sm font-medium text-gray-700 truncate" style={{ fontFamily: "Inter" }}>{query}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// // --- MAIN COMPONENT ---

// export default function Platform() {
//   const { toast } = useToast();
//   const [messages, setMessages] = useState([
//     { id: 'welcome', type: 'bot', content: 'Hello. I am your Digital Legal Advisor. How can I assist you with your legal queries today?', timestamp: new Date() }
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const messagesEndRef = useRef(null);

//   const getAuthToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token') || '';

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isLoading]);

//   const handleSendMessage = async (content) => {
//     if (!content.trim()) return;

//     const userMessage = { id: `user-${Date.now()}`, type: 'user', content, timestamp: new Date() };
//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       const token = getAuthToken();
//       const res = await fetch('http://localhost:5000/api/v1/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ message: content, history: messages })
//       });

//       const data = await res.json();

//       if (data.status === 'success') {
//         const botMessage = { id: `bot-${Date.now()}`, type: 'bot', content: data.data.reply, timestamp: new Date() };
//         setMessages(prev => [...prev, botMessage]);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: error.message || 'Failed to connect to the legal advisor.',
//       });
//       const errorMessage = { id: `err-${Date.now()}`, type: 'bot', content: '⚠️ I encountered an error processing your request. Please try again.', isError: true };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-blue-50/30">
//       <PlatformHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <div className="flex flex-1 overflow-hidden relative">
//         {/* Mobile Sidebar Overlay */}
//         {sidebarOpen && (
//           <div className="absolute inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
//         )}

//         <div className={cn(
//           "absolute md:relative z-40 h-full transition-transform duration-300",
//           sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         )}>
//           <PlatformSidebar 
//             onNewChat={() => { setMessages([{ id: 'welcome', type: 'bot', content: 'How can I help you today?' }]); setSidebarOpen(false); }} 
//             onHistoryClick={(q) => { handleSendMessage(q); setSidebarOpen(false); }} 
//           />
//         </div>

//         {/* Chat Area */}
//         <main className="flex-1 flex flex-col w-full h-full relative">
//           <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
//             {messages.map((msg) => (
//               <div key={msg.id} className={cn("flex w-full animate-fade-in", msg.type === 'user' ? "justify-end" : "justify-start")}>
//                 <div className={cn(
//                   "max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 shadow-sm",
//                   msg.type === 'user' 
//                     ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none" 
//                     : msg.isError 
//                       ? "bg-red-50 border-2 border-red-200 text-red-900 rounded-bl-none"
//                       : "bg-white border-2 border-blue-100 text-gray-800 rounded-bl-none"
//                 )}>
//                   <div className="flex items-center gap-2 mb-2 opacity-80">
//                     {msg.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
//                     <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "Inter" }}>
//                       {msg.type === 'user' ? 'You' : 'Legal Advisor'}
//                     </span>
//                   </div>
//                   <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium" style={{ fontFamily: "Inter" }}>
//                     {msg.content}
//                   </p>
//                 </div>
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex justify-start w-full animate-fade-in">
//                 <div className="bg-white border-2 border-blue-100 rounded-2xl rounded-bl-none p-5 flex items-center gap-3">
//                   <Bot className="h-5 w-5 text-blue-600 animate-pulse" />
//                   <p className="text-sm font-bold text-gray-500" style={{ fontFamily: "Inter" }}>Analyzing legal context...</p>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-t-2 border-blue-100">
//             <form 
//               onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} 
//               className="flex items-center gap-3 max-w-4xl mx-auto bg-white border-2 border-blue-200 rounded-2xl p-2 shadow-lg focus-within:border-blue-500 transition-colors"
//             >
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder="Ask a legal question or describe your scenario..."
//                 disabled={isLoading}
//                 className="flex-1 bg-transparent outline-none px-4 py-3 text-gray-800 font-medium placeholder-gray-400 w-full"
//                 style={{ fontFamily: "Inter" }}
//               />
//               <Button 
//                 type="submit" 
//                 disabled={isLoading || !inputValue.trim()}
//                 className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 w-12 p-0 flex items-center justify-center shrink-0 transition-all shadow-md disabled:opacity-50"
//               >
//                 {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-1" />}
//               </Button>
//             </form>
//             <p className="text-center text-xs text-gray-400 mt-3 font-medium" style={{ fontFamily: "Inter" }}>
//               AI can make mistakes. Always verify critical legal information with a qualified professional.
//             </p>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

// =============================================
// MESSAGE BUBBLE COMPONENT
// =============================================
const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.sender === "user") {
    return (
      <div className="flex justify-end animate-fade-in-up">
        <div className="max-w-2xl group">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl rounded-br-none shadow-lg hover:shadow-blue-500/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <p
              className="relative z-10 text-base font-medium leading-relaxed break-words"
              style={{ fontFamily: "Inter" }}
            >
              {message.text}
            </p>
          </div>
          <p
            className="text-xs text-gray-400 mt-2 px-2 font-semibold"
            style={{ fontFamily: "Inter" }}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="max-w-2xl group">
        <div className="flex gap-3 items-start">
          {/* Avatar with Scale Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 group-hover:shadow-blue-500/50 ring-2 ring-blue-200">
            <Scale className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>

          {/* Message Bubble */}
          <div className="relative group/msg">
            <div className="px-6 py-4 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-100/30 text-gray-800 rounded-3xl rounded-bl-none border-2 border-blue-200 shadow-lg hover:shadow-blue-300/50 hover:border-blue-300 transition-all duration-300 relative group-hover:border-yellow-300/50">
              <div className="absolute inset-0 bg-white/50 opacity-0 group-hover/msg:opacity-100 rounded-3xl transition-opacity duration-300"></div>
              <p
                className="relative z-10 text-base font-medium leading-relaxed break-words text-gray-700"
                style={{ fontFamily: "Inter" }}
              >
                {message.text}
              </p>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="absolute -top-10 right-0 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 shadow-lg z-20"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-2 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 ml-10 animate-fade-in">
              <button className="p-1.5 hover:bg-blue-200 text-blue-600 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-md transform">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-blue-200 text-blue-600 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-md transform">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <p
          className="text-xs text-gray-500 mt-2 px-2 font-semibold"
          style={{ fontFamily: "Inter" }}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

// =============================================
// SIDEBAR CHAT COMPONENT
// =============================================
const SidebarChat = ({ session, isActive, onClick, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      className={`group p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center justify-between ${
        isActive
          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-2 border-yellow-300/60 shadow-lg shadow-blue-500/30 text-white animate-scale-in"
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
        <p
          className={`text-xs truncate mt-1 ${
            isActive ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {session.createdAt.toLocaleDateString()}
        </p>
      </div>

      {isHovering && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(session.id);
          }}
          className={`p-1.5 rounded-md transition-all duration-200 transform hover:scale-110 ml-2 animate-fade-in-up ${
            isActive
              ? "hover:bg-red-500/30 text-white"
              : "hover:bg-red-100 text-red-600"
          }`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// =============================================
// SUGGESTED QUESTIONS CARD (2x2 GRID)
// =============================================
const SuggestedQuestionCard = ({ question, icon: Icon, onClick, index }) => {
  return (
    <button
      onClick={onClick}
      className="group relative h-40 bg-gradient-to-br from-blue-50 via-blue-100/50 to-yellow-50/30 hover:from-blue-100 hover:via-blue-150/60 hover:to-yellow-100/40 border-2 border-blue-200 hover:border-yellow-300/70 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-300/40 p-6 flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        fontFamily: "Inter",
        animation: `slideInUp 0.6s ease-out ${index * 100}ms both`,
      }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-300/0 to-yellow-400/0 group-hover:from-yellow-400/5 group-hover:via-yellow-300/10 group-hover:to-yellow-400/5 transition-all duration-300"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all duration-300 transform">
          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>

        {/* Question Text */}
        <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 leading-tight">
          {question}
        </p>
      </div>

      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600 w-0 group-hover:w-full transition-all duration-300"></div>
    </button>
  );
};

// =============================================
// MAIN PLATFORM COMPONENT
// =============================================
const Platform = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Welcome to Digital Legal Advisor! I'm your AI-powered companion for legal guidance. I specialize in Pakistani financial laws, corporate regulations, and legal procedures. Ask me anything you'd like to know!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState("1");
  const [showEmptyState, setShowEmptyState] = useState(true);
  const messagesEndRef = useRef(null);

  const [chatSessions, setChatSessions] = useState([
    {
      id: "1",
      title: "Corporate Tax Liability",
      messages: [],
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      title: "Property Dispute Precedents",
      messages: [],
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      title: "Employment Law Guidelines",
      messages: [],
      createdAt: new Date(Date.now() - 259200000),
    },
  ]);

  // Questions with icons
  const suggestedQuestions = [
    {
      question: "What should I know about employment contracts?",
      icon: Briefcase,
    },
    {
      question: "Explain corporate tax liability",
      icon: DollarSign,
    },
    {
      question: "How do property disputes work?",
      icon: Home,
    },
    {
      question: "What are my tenant rights?",
      icon: Users,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setShowEmptyState(false);

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Based on Pakistani financial laws, this is an important consideration. Let me break it down for you:\n\n1. Legal Framework: The relevant laws cover this aspect comprehensively.\n\n2. Key Points:\n   • First important point\n   • Second important point\n   • Third important point\n\n3. Practical Application: In practice, this means you should...\n\n4. Documentation: You'll need to maintain proper records of...\n\nWould you like me to elaborate on any specific aspect?",
        "That's a great question! Here's what you need to know:\n\nUnder Pakistani law, there are several key regulations:\n\n• Regulation 1: Addresses the first aspect\n• Regulation 2: Covers the second aspect\n• Regulation 3: Handles the third aspect\n\nThe penalty for non-compliance can be quite serious, so it's essential to understand these fully.\n\nDo you have any follow-up questions?",
        "This is covered under multiple acts in Pakistani law. The primary consideration is:\n\nThe main requirement is to ensure compliance with:\n✓ All statutory obligations\n✓ Documentation requirements\n✓ Reporting procedures\n\nI recommend consulting with a qualified legal professional for specific advice on your situation.",
      ];

      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const handleSuggestedQuestion = (question) => {
    setShowEmptyState(false);

    const userMessage = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "This is an excellent question about Pakistani legal frameworks. Let me provide you with comprehensive guidance...\n\n**Key Points:**\n• Point 1: Detailed explanation\n• Point 2: Comprehensive coverage\n• Point 3: Practical implications\n\nI recommend reviewing the relevant documentation and consulting with legal professionals for personalized advice.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const handleNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: `New Chat - ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date(),
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([
      {
        id: "1",
        text: "Welcome to Digital Legal Advisor! I'm your AI-powered companion for legal guidance. What would you like to know about Pakistani laws?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setShowEmptyState(true);
  };

  const handleDeleteChat = (sessionId) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const firstSession = chatSessions.find((s) => s.id !== sessionId);
      if (firstSession) {
        setCurrentSessionId(firstSession.id);
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* ========================================
          SIDEBAR
          ======================================== */}
      <div
        className={`relative z-40 ${isSidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-gradient-to-b from-white via-blue-50/50 to-blue-100/30 border-r border-blue-200 overflow-hidden flex flex-col shadow-lg`}
      >
        {isSidebarOpen && (
          <>
            {/* Logo Section with Header Styling */}
            <div className="p-6 border-b border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-yellow-50/30 group">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-all duration-300 animate-fade-in">
                {/* Logo Icon from Header */}
                <div className="relative w-11 h-11 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  <Scale className="w-6 h-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                {/* Logo Text from Header */}
                <div className="flex flex-col leading-tight">
                  <span
                    className="text-lg font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Digital Legal
                  </span>
                  <span
                    className="text-xs font-semibold text-gray-600 -mt-1"
                    style={{ fontFamily: "Inter" }}
                  >
                    Advisor
                  </span>
                </div>
              </div>
            </div>

            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="m-4 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-800 hover:via-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 group hover:bg-gradient-to-r hover:from-blue-800 hover:to-yellow-600/30 animate-pulse-glow"
              style={{ fontFamily: "Inter" }}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              New chat
            </button>

            {/* History Section */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <p
                className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 px-2"
                style={{ fontFamily: "Inter" }}
              >
                History
              </p>
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <SidebarChat
                    key={session.id}
                    session={session}
                    isActive={currentSessionId === session.id}
                    onClick={() => setCurrentSessionId(session.id)}
                    onDelete={handleDeleteChat}
                  />
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="border-t border-blue-200 p-4 bg-gradient-to-r from-blue-50/50 to-yellow-50/30">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-300 group hover:shadow-md"
                style={{ fontFamily: "Inter" }}
              >
                <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-sm font-semibold">Settings</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ========================================
          MAIN CHAT AREA
          ======================================== */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header - Light Clean Look */}
        <div className="border-b border-blue-200 bg-gradient-to-r from-white via-blue-50/50 to-yellow-50/30 px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4 animate-fade-in">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-blue-700 lg:hidden"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div>
              <h1
                className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins" }}
              >
                Digital Legal Advisor
              </h1>
              <p
                className="text-xs text-gray-600 font-semibold"
                style={{ fontFamily: "Inter" }}
              >
                Your AI-powered companion for legal guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <button className="p-2.5 hover:bg-blue-100 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-yellow-500 group hover:shadow-md">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            <button className="p-2.5 hover:bg-blue-100 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:shadow-md">
              <Settings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
            </button>
          </div>
        </div>

        {/* Messages Container - Responsive */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 flex flex-col bg-gradient-to-br from-white via-blue-50/20 to-yellow-50/10">
          {showEmptyState && messages.length <= 1 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center animate-fade-in">
              {/* Animated Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-full flex items-center justify-center mb-8 shadow-2xl group relative overflow-hidden animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-300/10 to-yellow-400/0 rounded-full"></div>
                <Scale className="w-12 h-12 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              </div>

              {/* Title */}
              <h2
                className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent mb-3 animate-fade-in-up"
                style={{ fontFamily: "Poppins", animationDelay: "0.1s" }}
              >
                Ask Away!
              </h2>

              {/* Subtitle */}
              <p
                className="text-gray-600 max-w-md mb-12 leading-relaxed font-medium animate-fade-in-up"
                style={{ fontFamily: "Inter", animationDelay: "0.2s" }}
              >
                I'm ready to help with questions about Pakistani financial laws, corporate regulations, property rights, employment law, and more.
              </p>

              {/* Suggested Questions - 2x2 Grid */}
              <div
                className="w-full max-w-4xl animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <p
                  className="text-sm font-bold text-gray-600 mb-6 uppercase tracking-widest"
                  style={{ fontFamily: "Inter" }}
                >
                  Try asking:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="flex gap-3 px-6 py-4 bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-100/30 rounded-3xl border-2 border-blue-300 shadow-lg">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full animate-bounce shadow-md"></div>
                    <div
                      className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full animate-bounce shadow-md"
                      style={{ animationDelay: "0.15s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full animate-bounce shadow-md"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Section */}
        <div className="border-t border-blue-200 bg-gradient-to-r from-white via-blue-50/50 to-yellow-50/30 px-6 py-6 shadow-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <form onSubmit={handleSendMessage} className="flex gap-3 mb-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a legal question..."
                className="w-full px-6 py-4 bg-white border-2 border-blue-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-300/30 transition-all duration-300 font-medium resize-none hover:border-yellow-300/40"
                style={{ fontFamily: "Inter" }}
                rows="1"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/0 to-yellow-300/0 group-focus-within:from-yellow-400/5 group-focus-within:to-yellow-300/5 transition-all duration-300 pointer-events-none"></div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-2xl font-bold hover:from-blue-800 hover:via-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group hover:bg-gradient-to-r hover:from-blue-800 hover:to-yellow-600/20"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>

          <p
            className="text-xs text-gray-500 text-center font-semibold"
            style={{ fontFamily: "Inter" }}
          >
            ⚖️ Always verify critical legal information with a qualified professional.
          </p>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-pulse-glow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
};

export default Platform;