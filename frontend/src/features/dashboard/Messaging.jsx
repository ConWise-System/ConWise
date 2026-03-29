"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

export default function Messaging() {
  const [activeChat, setActiveChat] = useState('Sarah Jenkins');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'Sarah Jenkins', text: "Hey! Did you check the Q3 figures?", time: '10:35 AM', isMe: false },
    { id: 2, sender: 'Me', text: "Just looking at them now. Singapore looks a bit high.", time: '10:38 AM', isMe: true },
  ]);

  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'Me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Sidebar: Chat Selection */}
      <aside className="w-80 border-r border-slate-100 flex flex-col">
        <div className="p-8"><h2 className="text-2xl font-black text-slate-900">Messages</h2></div>
        <div className="flex-1 overflow-y-auto">
          {['Sarah Jenkins', 'Marcus Thorne', 'Elena Rodriguez'].map(user => (
            <button 
              key={user}
              onClick={() => setActiveChat(user)}
              className={`w-full p-6 text-left border-l-4 transition-all ${activeChat === user ? 'bg-slate-50 border-slate-900' : 'border-transparent hover:bg-slate-50'}`}
            >
              <p className="font-bold text-slate-900">{user}</p>
              <p className="text-xs text-slate-400 truncate">Click to view conversation...</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col bg-[#F8FAFC]">
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">{activeChat}</h3>
        </header>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
          {chatHistory.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-md p-4 rounded-2xl text-sm font-medium ${msg.isMe ? 'bg-[#0F172A] text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                {msg.text}
              </div>
              <span className="text-[10px] font-bold text-slate-300 mt-2 uppercase">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Controlled Input Form */}
        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="bg-[#0F172A] text-white px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2">
              SEND <Send size={14} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}