import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, MessageSquare, Plus, User, Bot, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// --- INTERNAL SUBCOMPONENTS ---

const PlatformHeader = ({ sidebarOpen, setSidebarOpen }) => (
  <header className="bg-white/95 backdrop-blur-md border-b-2 border-blue-100 px-6 py-4 flex items-center justify-between z-20">
    <div className="flex items-center gap-4">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-blue-50 rounded-xl text-blue-700">
        <Menu className="h-6 w-6" />
      </button>
      <h1 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" style={{ fontFamily: "Poppins" }}>
        Digital Legal Advisor
      </h1>
    </div>
    <div className="flex items-center gap-3">
      <div className="bg-blue-100 p-2 rounded-full">
        <User className="h-5 w-5 text-blue-700" />
      </div>
    </div>
  </header>
);

const PlatformSidebar = ({ onHistoryClick, onNewChat }) => {
  const mockHistory = ['Corporate Tax Liability', 'Property Dispute Precedents', 'Employment Law Guidelines'];
  return (
    <div className="h-full bg-white border-r-2 border-blue-100 flex flex-col p-4 w-72">
      <Button 
        onClick={onNewChat}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all mb-6 py-6"
        style={{ fontFamily: "Inter" }}
      >
        <Plus className="mr-2 h-5 w-5" /> New Legal Query
      </Button>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2" style={{ fontFamily: "Inter" }}>Recent Queries</p>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {mockHistory.map((query, i) => (
          <button 
            key={i} 
            onClick={() => onHistoryClick(query)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-left transition-colors group"
          >
            <MessageSquare className="h-4 w-4 text-blue-400 group-hover:text-blue-600" />
            <span className="text-sm font-medium text-gray-700 truncate" style={{ fontFamily: "Inter" }}>{query}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function Platform() {
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    { id: 'welcome', type: 'bot', content: 'Hello. I am your Digital Legal Advisor. How can I assist you with your legal queries today?', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const getAuthToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token') || '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = { id: `user-${Date.now()}`, type: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const token = getAuthToken();
      const res = await fetch('http://localhost:5000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: content, history: messages })
      });

      const data = await res.json();

      if (data.status === 'success') {
        const botMessage = { id: `bot-${Date.now()}`, type: 'bot', content: data.data.reply, timestamp: new Date() };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to connect to the legal advisor.',
      });
      const errorMessage = { id: `err-${Date.now()}`, type: 'bot', content: '⚠️ I encountered an error processing your request. Please try again.', isError: true };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50/30">
      <PlatformHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="absolute inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}

        <div className={cn(
          "absolute md:relative z-40 h-full transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <PlatformSidebar 
            onNewChat={() => { setMessages([{ id: 'welcome', type: 'bot', content: 'How can I help you today?' }]); setSidebarOpen(false); }} 
            onHistoryClick={(q) => { handleSendMessage(q); setSidebarOpen(false); }} 
          />
        </div>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col w-full h-full relative">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex w-full animate-fade-in", msg.type === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 shadow-sm",
                  msg.type === 'user' 
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none" 
                    : msg.isError 
                      ? "bg-red-50 border-2 border-red-200 text-red-900 rounded-bl-none"
                      : "bg-white border-2 border-blue-100 text-gray-800 rounded-bl-none"
                )}>
                  <div className="flex items-center gap-2 mb-2 opacity-80">
                    {msg.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "Inter" }}>
                      {msg.type === 'user' ? 'You' : 'Legal Advisor'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium" style={{ fontFamily: "Inter" }}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start w-full animate-fade-in">
                <div className="bg-white border-2 border-blue-100 rounded-2xl rounded-bl-none p-5 flex items-center gap-3">
                  <Bot className="h-5 w-5 text-blue-600 animate-pulse" />
                  <p className="text-sm font-bold text-gray-500" style={{ fontFamily: "Inter" }}>Analyzing legal context...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-t-2 border-blue-100">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} 
              className="flex items-center gap-3 max-w-4xl mx-auto bg-white border-2 border-blue-200 rounded-2xl p-2 shadow-lg focus-within:border-blue-500 transition-colors"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a legal question or describe your scenario..."
                disabled={isLoading}
                className="flex-1 bg-transparent outline-none px-4 py-3 text-gray-800 font-medium placeholder-gray-400 w-full"
                style={{ fontFamily: "Inter" }}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 w-12 p-0 flex items-center justify-center shrink-0 transition-all shadow-md disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-1" />}
              </Button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-3 font-medium" style={{ fontFamily: "Inter" }}>
              AI can make mistakes. Always verify critical legal information with a qualified professional.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}