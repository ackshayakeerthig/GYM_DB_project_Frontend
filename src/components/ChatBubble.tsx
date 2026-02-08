import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '../services/api';

export function ChatBubble() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Create a unique session ID for the LangGraph thread
  const [sessionId] = useState(() => `sess_${Math.random().toString(36).substring(2, 11)}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user?.id && user?.role) {
      // Include role in the key to prevent ID overlap between Employees and Members
      const storageKey = `chat_${user.role.toLowerCase()}_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([]); // Clear if no history for this specific role/id combo
      }
    }
  }, [user?.id, user?.role]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Note: We use fetch here, but ensure your interceptor logic 
      // from api.ts is applied if you switch back to axiosInstance.
      const response = await fetch("https://gym-database-management.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: currentInput,
          user_id: user?.id,
          role: user?.role,
          session_id: sessionId
        }),
      });

      if (!response.ok) throw new Error("Failed to reach AI");

      // Force the ID to a number and ensure it's not undefined


// const response = await api.chat.sendMessage(
//   currentInput, 
//   Number(user?.id) || 0, 
//   user?.role || 'Member'
// );

      // const data = await api.chat.sendMessage(currentInput, user?.id, user?.role);
      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: Date.now() + 1,
      };

      setMessages((prev) => {
        const updated = [...prev, assistantMessage];
        const storageKey = `chat_${user?.role?.toLowerCase()}_${user?.id}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to the gym database right now.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110 z-30 animate-glow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div 
          style={{ 
            resize: 'both', 
            overflow: 'hidden',
            minWidth: '380px',
            minHeight: '450px' 
          }}
          className="fixed bottom-24 right-6 w-[450px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[80vh] bg-slate-800 rounded-lg shadow-2xl flex flex-col z-30 border border-slate-700"
        >
          {/* Header */}
          <div className="bg-emerald-500/20 border-b border-slate-700 p-4 shrink-0">
            <h3 className="text-white font-semibold">GymTech AI Assistant</h3>
            <p className="text-slate-400 text-xs">Stateless JWT Authenticated Session</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-slate-400 text-sm">How can I help you today, {user.name}?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['My schedule', 'Inventory', 'Revenue', 'Help'].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleQuickAction(item)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded transition border border-slate-600"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] px-4 py-3 rounded-lg text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
                    }`}
                  >
                    <div className="prose prose-invert prose-sm max-w-none overflow-x-auto custom-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 border border-slate-600 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4 flex gap-2 bg-slate-800 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Query the gym database..."
              className="flex-1 bg-slate-900 text-white rounded-md px-4 py-2 text-sm border border-slate-700 focus:border-emerald-500 focus:outline-none transition-colors"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-md px-4 py-2 transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {/* Resize Handle CSS Hint */}
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-transparent" />
        </div>
      )}

      {/* Internal Style for Markdown Tables */}
      <style>{`
        .custom-markdown table {
          border-collapse: collapse;
          width: 100%;
          margin: 8px 0;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-markdown th, .custom-markdown td {
          border: 1px solid #475569;
          padding: 6px 10px;
          text-align: left;
        }
        .custom-markdown th {
          background: #065f46;
          color: white;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}