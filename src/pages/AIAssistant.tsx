import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { db, ChatMessage } from '../lib/db';
import { sendChatMessage } from '../lib/api';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../lib/AuthContext';
import ReactMarkdown from 'react-markdown';

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const history = await db.chats.getAll();
        // Sort by timestamp if necessary, db.chats.getAll returns ordered by timestamp desc usually, so we reverse it to show oldest to newest
        setMessages(history.sort((a, b) => a.timestamp - b.timestamp));
      } catch (e) {
        console.error(e);
      }
    };
    fetchHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || loading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      userId: user.uid,
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Save user message
      await db.chats.save(userMessage);

      // Call API
      const data = await sendChatMessage(
        userMessage.content,
        messages.map(m => ({ role: m.role, content: m.content }))
      );

      const aiMessage: ChatMessage = {
        id: uuidv4(),
        userId: user.uid,
        role: 'assistant',
        content: data.text,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      await db.chats.save(aiMessage);

      // Reward XP for interacting with AI (max once per message)
      db.gamification.addXP(10);

    } catch (e: any) {
      console.error("Chat Error:", e);
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        userId: user.uid,
        role: 'assistant',
        content: `Sorry, I'm having trouble connecting right now. Error details: ${e.message}. Please try again later.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!user || !window.confirm('Are you sure you want to clear your chat history?')) return;
    try {
      await db.chats.clearAll();
      setMessages([]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="text-purple-600"/> AI Assistant
          </h1>
          <p className="text-slate-500 mt-1">Ask me anything about studies, career, or planning.</p>
        </div>
        <button 
          onClick={handleClearHistory}
          disabled={messages.length === 0}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Clear History"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <Bot size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">How can I help you today?</h2>
              <p className="text-slate-500 mb-8">I can explain concepts, help you plan your week, or give you advice on your resume.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {['Explain Quantum Physics', 'Help me build a resume', 'Create a study schedule', 'How to write a cover letter?'].map(prompt => (
                  <button 
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="p-3 text-sm text-left bg-slate-50 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors text-slate-700 font-medium"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                  {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'} prose prose-sm max-w-none`}>
                  {msg.role === 'assistant' ? (
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap m-0">{msg.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 text-slate-800 rounded-tl-none flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-purple-600" />
                <span className="text-sm font-medium text-slate-500 animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AI Assistant..."
              disabled={loading}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-6 pr-14 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all disabled:opacity-50 disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 w-10 h-10 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-purple-600"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-400 font-medium">AI can make mistakes. Verify important information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
