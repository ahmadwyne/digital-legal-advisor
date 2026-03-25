// import { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Send,
//   Plus,
//   Settings,
//   MessageCircle,
//   Sparkles,
//   Trash2,
//   Copy,
//   Check,
//   Menu,
//   X,
//   Download,
//   Share2,
//   Scale,
//   Briefcase,
//   DollarSign,
//   Home,
//   Users,
//   Search,
//   FileText,
//   BookOpen,
// } from "lucide-react";

// // =============================================
// // MESSAGE BUBBLE COMPONENT
// // =============================================
// const MessageBubble = ({ message }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(message.text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (message.sender === "user") {
//     return (
//       <div className="flex justify-end animate-fade-in-up">
//         <div className="max-w-2xl group">
//           <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl rounded-br-none shadow-lg hover:shadow-blue-500/50 transition-all duration-300 relative overflow-hidden">
//             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             <p
//               className="relative z-10 text-base font-medium leading-relaxed break-words"
//               style={{ fontFamily: "Inter" }}
//             >
//               {message.text}
//             </p>
//           </div>
//           <p
//             className="text-xs text-gray-400 mt-2 px-2 font-semibold"
//             style={{ fontFamily: "Inter" }}
//           >
//             {message.timestamp.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-start animate-fade-in-up">
//       <div className="max-w-2xl group">
//         <div className="flex gap-3 items-start">
//           {/* Avatar with Scale Icon */}
//           <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 group-hover:shadow-blue-500/50 ring-2 ring-blue-200">
//             <Scale className="w-5 h-5 text-white" strokeWidth={2.5} />
//           </div>

//           {/* Message Bubble */}
//           <div className="relative group/msg">
//             <div className="px-6 py-4 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-100/30 text-gray-800 rounded-3xl rounded-bl-none border-2 border-blue-200 shadow-lg hover:shadow-blue-300/50 hover:border-blue-300 transition-all duration-300 relative group-hover:border-yellow-300/50">
//               <div className="absolute inset-0 bg-white/50 opacity-0 group-hover/msg:opacity-100 rounded-3xl transition-opacity duration-300"></div>
//               <p
//                 className="relative z-10 text-base font-medium leading-relaxed break-words text-gray-700"
//                 style={{ fontFamily: "Inter" }}
//               >
//                 {message.text}
//               </p>

//               {/* Copy Button */}
//               <button
//                 onClick={handleCopy}
//                 className="absolute -top-10 right-0 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 shadow-lg z-20"
//               >
//                 {copied ? (
//                   <>
//                     <Check className="w-3 h-3" />
//                     Copied
//                   </>
//                 ) : (
//                   <>
//                     <Copy className="w-3 h-3" />
//                     Copy
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-2 mt-2 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 ml-10 animate-fade-in">
//               <button className="p-1.5 hover:bg-blue-200 text-blue-600 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-md transform">
//                 <Download className="w-4 h-4" />
//               </button>
//               <button className="p-1.5 hover:bg-blue-200 text-blue-600 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-md transform">
//                 <Share2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <p
//           className="text-xs text-gray-500 mt-2 px-2 font-semibold"
//           style={{ fontFamily: "Inter" }}
//         >
//           {message.timestamp.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </p>
//       </div>
//     </div>
//   );
// };

// // =============================================
// // SIDEBAR CHAT COMPONENT
// // =============================================
// const SidebarChat = ({ session, isActive, onClick, onDelete }) => {
//   const [isHovering, setIsHovering] = useState(false);

//   return (
//     <div
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//       onClick={onClick}
//       className={`group p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center justify-between ${
//         isActive
//           ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-2 border-yellow-300/60 shadow-lg shadow-blue-500/30 text-white animate-scale-in"
//           : "hover:bg-blue-50 border border-transparent text-gray-700"
//       }`}
//     >
//       <div className="flex-1 min-w-0">
//         <p
//           className={`text-sm font-semibold truncate transition-colors duration-300 ${
//             isActive ? "text-white" : "text-gray-800 group-hover:text-blue-600"
//           }`}
//           style={{ fontFamily: "Inter" }}
//         >
//           {session.title}
//         </p>
//         <p
//           className={`text-xs truncate mt-1 ${
//             isActive ? "text-blue-100" : "text-gray-500"
//           }`}
//         >
//           {session.createdAt.toLocaleDateString()}
//         </p>
//       </div>

//       {isHovering && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onDelete(session.id);
//           }}
//           className={`p-1.5 rounded-md transition-all duration-200 transform hover:scale-110 ml-2 animate-fade-in-up ${
//             isActive
//               ? "hover:bg-red-500/30 text-white"
//               : "hover:bg-red-100 text-red-600"
//           }`}
//         >
//           <Trash2 className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   );
// };

// // =============================================
// // SUGGESTED QUESTIONS CARD (COMPACT 2x2 GRID)
// // =============================================
// const SuggestedQuestionCard = ({ question, icon: Icon, onClick, index }) => {
//   return (
//     <button
//       onClick={onClick}
//       className="group relative bg-gradient-to-br from-blue-50 via-blue-100/50 to-yellow-50/30 hover:from-blue-100 hover:via-blue-150/60 hover:to-yellow-100/40 border-2 border-blue-200 hover:border-yellow-300/70 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 p-3 flex items-center gap-3 text-left overflow-hidden h-16"
//       style={{
//         fontFamily: "Inter",
//         animation: `slideInUp 0.5s ease-out ${index * 80}ms both`,
//       }}
//     >
//       {/* Background Gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-300/0 to-yellow-400/0 group-hover:from-yellow-400/5 group-hover:via-yellow-300/10 group-hover:to-yellow-400/5 transition-all duration-300"></div>

//       {/* Icon */}
//       <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all duration-300 transform flex-shrink-0">
//         <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
//       </div>

//       {/* Question Text - Truncated */}
//       <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 leading-tight relative z-10 line-clamp-2">
//         {question}
//       </p>

//       {/* Hover Effect Line */}
//       <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600 w-0 group-hover:w-full transition-all duration-300"></div>
//     </button>
//   );
// };

// // =============================================
// // MAIN PLATFORM COMPONENT
// // =============================================
// const Platform = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: "1",
//       text: "Welcome to Digital Legal Advisor! I'm your AI-powered companion for legal guidance. I specialize in Pakistani financial laws, corporate regulations, and legal procedures. Ask me anything you'd like to know!",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ]);

//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [currentSessionId, setCurrentSessionId] = useState("1");
//   const [showEmptyState, setShowEmptyState] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const messagesEndRef = useRef(null);
//   const messageContainerRef = useRef(null);

//   const [chatSessions, setChatSessions] = useState([
//     {
//       id: "1",
//       title: "Corporate Tax Liability",
//       messages: [],
//       createdAt: new Date(Date.now() - 86400000),
//     },
//     {
//       id: "2",
//       title: "Property Dispute Precedents",
//       messages: [],
//       createdAt: new Date(Date.now() - 172800000),
//     },
//     {
//       id: "3",
//       title: "Employment Law Guidelines",
//       messages: [],
//       createdAt: new Date(Date.now() - 259200000),
//     },
//   ]);

//   // Questions with icons - Single line
//   const suggestedQuestions = [
//     {
//       question: "What should I know about employment contracts?",
//       icon: Briefcase,
//     },
//     {
//       question: "Explain corporate tax liability",
//       icon: DollarSign,
//     },
//     {
//       question: "How do property disputes work?",
//       icon: Home,
//     },
//     {
//       question: "What are my tenant rights?",
//       icon: Users,
//     },
//   ];

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();

//     if (!inputValue.trim()) return;

//     setShowEmptyState(false);

//     const userMessage = {
//       id: Date.now().toString(),
//       text: inputValue,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");
//     setIsLoading(true);

//     // Simulate bot response
//     setTimeout(() => {
//       const botResponses = [
//         "Based on Pakistani financial laws, this is an important consideration. Let me break it down for you:\n\n1. Legal Framework: The relevant laws cover this aspect comprehensively.\n\n2. Key Points:\n   • First important point\n   • Second important point\n   • Third important point\n\nWould you like me to elaborate on any specific aspect?",
//         "That's a great question! Here's what you need to know:\n\nUnder Pakistani law, there are several key regulations:\n\n• Regulation 1: Addresses the first aspect\n• Regulation 2: Covers the second aspect\n• Regulation 3: Handles the third aspect\n\nDo you have any follow-up questions?",
//         "This is covered under multiple acts in Pakistani law. The primary consideration is:\n\nThe main requirement is to ensure compliance with:\n✓ All statutory obligations\n✓ Documentation requirements\n✓ Reporting procedures\n\nI recommend consulting with a qualified legal professional for specific advice on your situation.",
//       ];

//       const randomResponse =
//         botResponses[Math.floor(Math.random() * botResponses.length)];

//       const botMessage = {
//         id: (Date.now() + 1).toString(),
//         text: randomResponse,
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsLoading(false);
//     }, 1200);
//   };

//   const handleSuggestedQuestion = (question) => {
//     setShowEmptyState(false);

//     const userMessage = {
//       id: Date.now().toString(),
//       text: question,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setIsLoading(true);

//     setTimeout(() => {
//       const botMessage = {
//         id: (Date.now() + 1).toString(),
//         text: "This is an excellent question about Pakistani legal frameworks. Let me provide you with comprehensive guidance...\n\n**Key Points:**\n• Point 1: Detailed explanation\n• Point 2: Comprehensive coverage\n• Point 3: Practical implications\n\nI recommend reviewing the relevant documentation and consulting with legal professionals for personalized advice.",
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsLoading(false);
//     }, 1200);
//   };

//   const handleNewChat = () => {
//     const newSession = {
//       id: Date.now().toString(),
//       title: `New Chat - ${new Date().toLocaleDateString()}`,
//       messages: [],
//       createdAt: new Date(),
//     };
//     setChatSessions((prev) => [newSession, ...prev]);
//     setCurrentSessionId(newSession.id);
//     setMessages([
//       {
//         id: "1",
//         text: "Welcome to Digital Legal Advisor! I'm your AI-powered companion for legal guidance. What would you like to know about Pakistani laws?",
//         sender: "bot",
//         timestamp: new Date(),
//       },
//     ]);
//     setShowEmptyState(true);
//   };

//   const handleDeleteChat = (sessionId) => {
//     setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
//     if (currentSessionId === sessionId) {
//       const firstSession = chatSessions.find((s) => s.id !== sessionId);
//       if (firstSession) {
//         setCurrentSessionId(firstSession.id);
//       }
//     }
//   };

//   const filteredSessions = chatSessions.filter((session) =>
//     session.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="flex h-screen w-full bg-white overflow-hidden">
//       {/* ========================================
//           SIDEBAR
//           ======================================== */}
//       <div
//         className={`relative z-40 ${isSidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-gradient-to-b from-white via-blue-50/50 to-blue-100/30 border-r border-blue-200 overflow-hidden flex flex-col shadow-lg`}
//       >
//         {isSidebarOpen && (
//           <>
//             {/* Search Section */}
//             <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-white/80 via-blue-50/30 to-yellow-50/20">
//               <div className="relative group">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search chats..."
//                   className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-300/30 transition-all duration-300"
//                   style={{ fontFamily: "Inter" }}
//                 />
//               </div>
//             </div>

//             {/* Separator */}
//             <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

//             {/* New Chat Button */}
//             <button
//               onClick={handleNewChat}
//               className="m-4 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-800 hover:via-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 group hover:bg-gradient-to-r hover:from-blue-800 hover:to-yellow-600/30 animate-pulse-glow"
//               style={{ fontFamily: "Inter" }}
//             >
//               <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
//               New chat
//             </button>

//             {/* History Section */}
//             <div className="flex-1 overflow-y-auto px-4 py-4">
//               <p
//                 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 px-2"
//                 style={{ fontFamily: "Inter" }}
//               >
//                 History
//               </p>
//               <div className="space-y-2">
//                 {filteredSessions.length > 0 ? (
//                   filteredSessions.map((session) => (
//                     <SidebarChat
//                       key={session.id}
//                       session={session}
//                       isActive={currentSessionId === session.id}
//                       onClick={() => setCurrentSessionId(session.id)}
//                       onDelete={handleDeleteChat}
//                     />
//                   ))
//                 ) : (
//                   <p className="text-xs text-gray-500 text-center py-4">
//                     No chats found
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Settings */}
//             <div className="border-t border-blue-200 p-4 bg-gradient-to-r from-blue-50/50 to-yellow-50/30">
//               <button
//                 className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-300 group hover:shadow-md"
//                 style={{ fontFamily: "Inter" }}
//               >
//                 <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
//                 <span className="text-sm font-semibold">Settings</span>
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* ========================================
//           MAIN CHAT AREA
//           ======================================== */}
//       <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
//         {/* Header - Transparent like Landing Page */}
//         <div className="border-b border-blue-200/30 bg-gradient-to-r from-white/60 via-white/50 to-white/40 backdrop-blur-md px-8 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
//           {/* Logo - Exact Code from Landing Page */}
//           <Link
//             to="/"
//             className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105 flex-shrink-0 z-50"
//           >
//             <div className="relative w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow overflow-hidden group">
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
//               <Scale className="w-7 h-7 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
//             </div>
//             <div className="flex flex-col leading-tight">
//               <span
//                 className="text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent"
//                 style={{ fontFamily: "Poppins" }}
//               >
//                 Digital Legal
//               </span>
//               <span
//                 className="text-sm font-semibold text-gray-600 -mt-1"
//                 style={{ fontFamily: "Inter" }}
//               >
//                 Advisor
//               </span>
//             </div>
//           </Link>

//           {/* Navigation Tabs - Center */}
//           <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
//             <button className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-semibold text-base transition-all duration-300 group">
//               <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
//               <span>Chat</span>
//             </button>
//             <button className="flex items-center gap-2 text-gray-600 hover:text-blue-700 font-semibold text-base transition-all duration-300 group">
//               <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
//               <span>Summarizer</span>
//             </button>
//             <button className="flex items-center gap-2 text-gray-600 hover:text-blue-700 font-semibold text-base transition-all duration-300 group">
//               <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
//               <span>Precedents</span>
//             </button>
//           </div>

//           {/* Right Icons */}
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="p-2 hover:bg-blue-100/50 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-blue-700 md:hidden"
//             >
//               {isSidebarOpen ? (
//                 <X className="w-5 h-5" />
//               ) : (
//                 <Menu className="w-5 h-5" />
//               )}
//             </button>

//             <button className="p-2 hover:bg-blue-100/50 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-yellow-500 group hover:shadow-sm hidden md:block">
//               <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
//             </button>

//             <button className="p-2 hover:bg-blue-100/50 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:shadow-sm hidden md:block">
//               <Settings className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
//             </button>
//           </div>
//         </div>

//         {/* Messages Container - NO SCROLLBAR */}
//         <div
//           ref={messageContainerRef}
//           className="flex-1 px-6 py-5 space-y-3 flex flex-col bg-gradient-to-br from-white via-blue-50/20 to-yellow-50/10 overflow-hidden"
//         >
//           {showEmptyState && messages.length <= 1 ? (
//             <div className="flex flex-col items-center justify-center flex-1 text-center animate-fade-in gap-2">
//               {/* Title */}
//               <h2
//                 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent animate-fade-in-up"
//                 style={{ fontFamily: "Poppins", animationDelay: "0.1s" }}
//               >
//                 Ask Away!
//               </h2>

//               {/* Subtitle */}
//               <p
//                 className="text-xs text-gray-600 max-w-md leading-relaxed font-medium animate-fade-in-up px-4"
//                 style={{ fontFamily: "Inter", animationDelay: "0.2s" }}
//               >
//                 I'm ready to help with questions about Pakistani financial laws, corporate regulations, property rights, and employment law.
//               </p>

//               {/* Suggested Questions - 2x2 Grid */}
//               <div
//                 className="w-full max-w-2xl animate-fade-in"
//                 style={{ animationDelay: "0.3s" }}
//               >
//                 <p
//                   className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest"
//                   style={{ fontFamily: "Inter" }}
//                 >
//                   Try asking:
//                 </p>
//                 <div className="grid grid-cols-2 gap-2">
//                   {suggestedQuestions.map((item, index) => (
//                     <SuggestedQuestionCard
//                       key={index}
//                       question={item.question}
//                       icon={item.icon}
//                       onClick={() => handleSuggestedQuestion(item.question)}
//                       index={index}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="flex-1 overflow-y-auto space-y-3">
//                 {messages.map((message) => (
//                   <MessageBubble key={message.id} message={message} />
//                 ))}

//                 {isLoading && (
//                   <div className="flex justify-start animate-fade-in-up">
//                     <div className="flex gap-3 px-6 py-4 bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-100/30 rounded-3xl border-2 border-blue-300 shadow-lg">
//                       <div className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full animate-bounce shadow-md"></div>
//                       <div
//                         className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full animate-bounce shadow-md"
//                         style={{ animationDelay: "0.15s" }}
//                       ></div>
//                       <div
//                         className="w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full animate-bounce shadow-md"
//                         style={{ animationDelay: "0.3s" }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>
//             </>
//           )}
//         </div>

//         {/* Input Section */}
//         <div className="border-t border-blue-200/30 bg-gradient-to-r from-white/60 via-white/50 to-white/40 backdrop-blur-md px-6 py-3 shadow-sm animate-fade-in flex-shrink-0" style={{ animationDelay: "0.2s" }}>
//           <form onSubmit={handleSendMessage} className="flex gap-2 mb-1.5">
//             <div className="flex-1 relative group">
//               <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder="Ask a legal question..."
//                 className="w-full px-5 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-300/30 transition-all duration-300 font-medium text-sm resize-none hover:border-yellow-300/40"
//                 style={{ fontFamily: "Inter" }}
//                 rows="1"
//               />
//               <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/0 to-yellow-300/0 group-focus-within:from-yellow-400/5 group-focus-within:to-yellow-300/5 transition-all duration-300 pointer-events-none"></div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="px-4 py-2.5 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-800 hover:via-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group hover:bg-gradient-to-r hover:from-blue-800 hover:to-yellow-600/20 flex-shrink-0"
//             >
//               <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//             </button>
//           </form>

//           <p
//             className="text-xs text-gray-500 text-center font-semibold"
//             style={{ fontFamily: "Inter" }}
//           >
//             ⚖️ Always verify critical legal information with a qualified professional.
//           </p>
//         </div>
//       </div>

//       {/* CSS for custom animations */}
//       <style jsx>{`
//         @keyframes slideInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes shimmer {
//           0% {
//             background-position: -1000px 0;
//           }
//           100% {
//             background-position: 1000px 0;
//           }
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         .animate-shimmer {
//           background: linear-gradient(
//             90deg,
//             rgba(255, 255, 255, 0) 0%,
//             rgba(255, 255, 255, 0.3) 50%,
//             rgba(255, 255, 255, 0) 100%
//           );
//           background-size: 1000px 100%;
//           animation: shimmer 3s infinite;
//         }

//         .animate-fade-in {
//           animation: fadeIn 0.6s ease-out forwards;
//         }

//         .animate-fade-in-up {
//           animation: fadeInUp 0.6s ease-out forwards;
//         }

//         .animate-scale-in {
//           animation: scaleIn 0.5s ease-out forwards;
//         }

//         .animate-pulse-glow {
//           animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.85;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Platform;
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 group-hover:shadow-blue-500/50 ring-2 ring-blue-200">
            <Scale className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>

          <div className="relative group/msg">
            <div className="px-6 py-4 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-100/30 text-gray-800 rounded-3xl rounded-bl-none border-2 border-blue-200 shadow-lg hover:shadow-blue-300/50 hover:border-blue-300 transition-all duration-300 relative group-hover:border-amber-400/50">
              <div className="absolute inset-0 bg-white/50 opacity-0 group-hover/msg:opacity-100 rounded-3xl transition-opacity duration-300"></div>
              <p
                className="relative z-10 text-base font-medium leading-relaxed break-words text-gray-700"
                style={{ fontFamily: "Inter" }}
              >
                {message.text}
              </p>

              <button
                onClick={handleCopy}
                className="absolute -top-10 right-0 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 shadow-lg z-20"
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

            <div className="flex gap-2 mt-2 opacity-0 group-hover/msg:opacity-100 transition-all duration-200 ml-10 animate-fade-in">
              <button className="p-1.5 hover:bg-amber-200 text-blue-600 hover:text-amber-600 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-md transform">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-amber-200 text-blue-600 hover:text-amber-600 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-md transform">
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
// SUGGESTED QUESTIONS CARD
// =============================================
const SuggestedQuestionCard = ({ question, icon: Icon, onClick, index }) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-gradient-to-br from-blue-50 via-blue-100/50 to-amber-50/30 hover:from-blue-100 hover:via-blue-150/60 hover:to-amber-100/40 border-2 border-blue-200 hover:border-amber-400/70 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40 p-3 flex items-center gap-3 text-left overflow-hidden h-16"
      style={{
        fontFamily: "Inter",
        animation: `slideInUp 0.5s ease-out ${index * 80}ms both`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-amber-300/0 to-amber-400/0 group-hover:from-amber-400/5 group-hover:via-amber-300/10 group-hover:to-amber-400/5 transition-all duration-300"></div>

      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-amber-500/50 transition-all duration-300 transform flex-shrink-0">
        <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>

      <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 leading-tight relative z-10 truncate">
        {question}
      </p>

      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600 w-0 group-hover:w-full transition-all duration-300"></div>
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
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);

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
    setTimeout(() => {
      const botResponses = [
        "Based on Pakistani financial laws, this is an important consideration. Let me break it down for you:\n\n1. Legal Framework: The relevant laws cover this aspect comprehensively.\n\n2. Key Points:\n   • First important point\n   • Second important point\n   • Third important point\n\nWould you like me to elaborate on any specific aspect?",
        "That's a great question! Here's what you need to know:\n\nUnder Pakistani law, there are several key regulations:\n\n• Regulation 1: Addresses the first aspect\n• Regulation 2: Covers the second aspect\n• Regulation 3: Handles the third aspect\n\nDo you have any follow-up questions?",
        "This is covered under multiple acts in Pakistani law. The primary consideration is:\n\nThe main requirement is to ensure compliance with:\n✓ All statutory obligations\n✓ Documentation requirements\n✓ Reporting procedures\n\nI recommend consulting with a qualified legal professional for specific advice on your situation.",
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
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

  const filteredSessions = chatSessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      {/* ========================================
          SIDEBAR
          ======================================== */}
      <div
        className={`relative z-40 ${isSidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-blue-200 overflow-hidden flex flex-col shadow-lg`}
        style={{
          backgroundImage: `linear-gradient(180deg, 
            #ffffff 0%, 
            #f0f9ff 50%, 
            #e0f2fe 100%)`
        }}
      >
        {isSidebarOpen && (
          <>
            {/* ── LOGO at top of sidebar ── */}
            <div 
              className="px-5 pt-5 pb-4 border-b border-blue-200"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  #ffffff 0%, 
                  #f0f9ff 50%, 
                  #fef3c7 100%)`
              }}
            >
              <Link
                to="/"
                className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative w-11 h-11 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse-glow overflow-hidden group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  <Scale className="w-6 h-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span
                    className="text-xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent"
                    style={{ fontFamily: "Poppins" }}
                  >
                    Digital Legal
                  </span>
                  <span
                    className="text-xs font-semibold text-gray-500 -mt-0.5"
                    style={{ fontFamily: "Inter" }}
                  >
                    Advisor
                  </span>
                </div>
              </Link>
            </div>

            {/* Search Section */}
            <div 
              className="p-4 border-b border-blue-200"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  #ffffff 0%, 
                  #f0f9ff 50%, 
                  #fef3c7 100%)`
              }}
            >
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-300/30 transition-all duration-300"
                  style={{ fontFamily: "Inter" }}
                />
              </div>
            </div>

            {/* Separator */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="m-4 px-4 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-800 hover:via-amber-600 hover:to-blue-800 shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 group animate-pulse-glow"
              style={{ fontFamily: "Inter" }}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              New chat
            </button>

            {/* History Section - Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={scrollbarStyles}>
              <p
                className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3 px-2"
                style={{ fontFamily: "Inter" }}
              >
                History
              </p>
              <div className="space-y-2">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <SidebarChat
                      key={session.id}
                      session={session}
                      isActive={currentSessionId === session.id}
                      onClick={() => setCurrentSessionId(session.id)}
                      onDelete={handleDeleteChat}
                    />
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">
                    No chats found
                  </p>
                )}
              </div>
            </div>

            {/* Settings */}
            <div 
              className="border-t border-blue-200 p-4"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  #f0f9ff 0%, 
                  #fef3c7 100%)`
              }}
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

      {/* ========================================
          MAIN CHAT AREA
          ======================================== */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* ── HEADER WITH GRADIENT ── */}
        <div 
          className="border-b-2 border-blue-200/50 px-6 py-4 flex items-center justify-between shadow-md flex-shrink-0"
          style={{
            backgroundImage: `linear-gradient(90deg, 
              #ffffff 0%, 
              #f0f9ff 25%,
              #e0f2fe 50%,
              #fef3c7 75%,
              #ffffff 100%)`
          }}
        >
          {/* Left: sidebar toggle */}
          <div className="flex items-center gap-2 w-36">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-blue-100/60 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-blue-700"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Center: Navigation tabs */}
          <nav className="flex items-center gap-1 flex-1 justify-center">
            {[
              { label: "Chat", icon: MessageCircle },
              { label: "Summarizer", icon: FileText },
              { label: "Precedents", icon: BookOpen },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 group whitespace-nowrap
                  ${label === "Chat"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-400/30 hover:bg-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                style={{ fontFamily: "Inter" }}
              >
                <Icon className={`w-4 h-4 group-hover:scale-110 transition-transform ${label === "Chat" ? "text-white" : ""}`} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Right: action icons */}
          <div className="flex items-center gap-1 w-36 justify-end">
            <button className="p-2 hover:bg-amber-100/50 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600 hover:text-amber-500 group">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            <button className="p-2 hover:bg-blue-100/50 rounded-lg transition-all duration-300 transform hover:scale-110 text-blue-600">
              <Settings className="w-4 h-4 transition-transform duration-300 hover:rotate-180" />
            </button>
          </div>
        </div>

        {/* Messages Container - Enhanced Gradient Background */}
        <div
          ref={messageContainerRef}
          className="flex-1 px-6 py-5 space-y-3 flex flex-col overflow-y-auto"
          style={messageContainerStyles}
        >
          {/* Animated overlay for depth */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(ellipse at 100% 0%, rgba(147, 197, 253, 0.12) 0%, transparent 50%),
                                radial-gradient(ellipse at 0% 100%, rgba(134, 239, 172, 0.08) 0%, transparent 50%),
                                radial-gradient(ellipse at 50% 50%, rgba(251, 191, 36, 0.06) 0%, transparent 60%)`
            }}
          ></div>

          {/* Content wrapper */}
          <div className="relative z-10 flex flex-col">
            {showEmptyState && messages.length <= 1 ? (
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

                <div
                  className="w-full max-w-2xl animate-fade-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <p
                    className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest"
                    style={{ fontFamily: "Inter" }}
                  >
                    Try asking:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
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
                <div className="space-y-3">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-fade-in-up">
                      <div className="flex gap-3 px-6 py-4 bg-gradient-to-r from-blue-100 via-blue-50 to-amber-100/30 rounded-3xl border-2 border-blue-300 shadow-lg">
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
                </div>
              </>
            )}
          </div>
        </div>

        {/* Input Section WITH GRADIENT */}
        <div
          className="border-t-2 border-blue-200/50 px-6 py-4 shadow-md flex-shrink-0"
          style={{
            backgroundImage: `linear-gradient(90deg, 
              #ffffff 0%, 
              #f0f9ff 25%,
              #e0f2fe 50%,
              #fef3c7 75%,
              #ffffff 100%)`
          }}
        >
          <form onSubmit={handleSendMessage} className="flex gap-2 mb-1.5">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a legal question..."
                className="w-full px-5 py-3 bg-white border-2 border-blue-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-300/40 transition-all duration-300 font-medium text-sm resize-none"
                style={{ fontFamily: "Inter" }}
                rows="1"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-800 hover:via-amber-600 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group flex-shrink-0"
            >
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
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

      {/* CSS for custom animations and scrollbar */}
      <style jsx>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
        .animate-pulse-glow { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        /* Hide scrollbars but keep functionality */
        ::-webkit-scrollbar {
          display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;
      `}</style>
    </div>
  );
};

// Inline styles for better control
const scrollbarStyles = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none'
};

const messageContainerStyles = {
  backgroundImage: `linear-gradient(135deg, 
    #f0f9ff 0%, 
    #dbeafe 20%,
    #dcfce7 40%,
    #fffbeb 60%,
    #fef3c7 80%,
    #f0f9ff 100%)`,
  position: 'relative'
};

export default Platform;