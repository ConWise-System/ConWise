"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Smile, Paperclip, Phone, Video, 
  X, Info, Bell, Camera, User, Edit3, FileText, 
  ChevronLeft, Search, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';

const CONTACTS = [
  { id: 1, name: 'Sarah Jenkins', role: 'Project Manager', online: true, avatar: 'SJ', bio: 'Design is intelligence made visible.', phone: '+251 911 22 33 44' },
  { id: 2, name: 'Marcus Thorne', role: 'Senior Developer', online: true, avatar: 'MT', bio: 'Coding my way through life.', phone: '+251 922 33 44 55' },
  { id: 3, name: 'Elena Rodriguez', role: 'UI/UX Designer', online: false, avatar: 'ER', bio: 'Pixel perfect advocate.', phone: '+251 933 44 55 66' },
];

export default function SupervisorMessage() {
  const [activeId, setActiveId] = useState(1);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [histories, setHistories] = useState({ 1: [], 2: [], 3: [] });
  const [showMyProfile, setShowMyProfile] = useState(false); 
  const [showContactProfile, setShowContactProfile] = useState(false); 
  const [showEmoji, setShowEmoji] = useState(false);
  
  const fileInputRef = useRef(null); 
  const attachmentRef = useRef(null);
  const scrollRef = useRef(null);

  const [myProfile, setMyProfile] = useState({
    name: 'Christy',
    handle: 'giftableti',
    bio: 'Software Engineering Student | Full Stack Developer',
    phone: '+251 900 00 00 00',
    avatar: 'C',
    avatarUrl: null 
  });

  const activeContact = CONTACTS.find(c => c.id === activeId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [histories, activeId]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setHistories(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), newMessage] }));
    setMessage('');
    setShowEmoji(false);
  };

  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMsg = {
          id: Date.now(),
          text: file.name,
          attachment: reader.result,
          isImage: file.type.startsWith('image/'),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true,
        };
        setHistories(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), newMsg] }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    /** * IMPORTANT: 
     * h-[calc(100vh-140px)] - Adjust '140px' to match your Top Nav + Dashboard Padding.
     * This ensures the chat fills only the available space without parent scrolling.
     */
    <div className="flex h-[calc(100vh-160px)] w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      
      {/* --- CHAT LIST SIDEBAR --- */}
      <aside className="w-80 bg-slate-50/50 flex flex-col shrink-0 border-r border-slate-200 h-full relative">
        <div className="p-5 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Messages</h2>
            <button className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm border border-transparent hover:border-slate-200 text-slate-500">
               <Edit3 size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search conversations..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-4 ring-indigo-500/5 focus:border-indigo-200 transition-all" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
          {CONTACTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
            <button key={c.id} onClick={() => { setActiveId(c.id); setShowContactProfile(false); }} 
              className={`w-full p-3.5 flex items-center gap-4 rounded-2xl transition-all ${activeId === c.id ? 'bg-white shadow-md border border-slate-100' : 'hover:bg-white/60'}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${activeId === c.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'}`}>{c.avatar}</div>
              <div className="text-left flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                    <p className={`font-bold text-sm ${activeId === c.id ? 'text-slate-900' : 'text-slate-700'}`}>{c.name}</p>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">12:45 PM</span>
                </div>
                <p className="text-[11px] truncate text-slate-400 font-medium">{c.role}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* --- MAIN CHAT DISPLAY --- */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-100 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowContactProfile(true)}>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black border border-indigo-100">
                {activeContact.avatar}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{activeContact.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase">Online Now</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <HeaderBtn icon={<Phone size={18}/>} />
            <HeaderBtn icon={<Video size={18}/>} />
            <div className="w-px h-6 bg-slate-100 mx-2" />
            <HeaderBtn icon={<Info size={18} />} onClick={() => setShowContactProfile(!showContactProfile)} />
          </div>
        </header>

        {/* --- SCROLLABLE MESSAGES --- */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 custom-scrollbar bg-slate-50/30"
        >
          {histories[activeId]?.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm relative ${msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                {msg.attachment ? (
                   <div className="space-y-2">
                     {msg.isImage ? (
                       <img src={msg.attachment} className="rounded-lg max-h-60 w-full object-cover" alt="sent" />
                     ) : (
                       <div className="flex items-center gap-2 bg-black/10 p-2 rounded-lg">
                         <FileText size={18} /> <span className="text-xs truncate">{msg.text}</span>
                       </div>
                     )}
                   </div>
                ) : (
                  <p className="text-[13px] leading-relaxed font-medium">{msg.text}</p>
                )}
                <div className="text-[9px] font-bold mt-2 opacity-60 text-right uppercase tracking-tighter">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Input */}
        <footer className="p-5 border-t border-slate-100 shrink-0">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-3 focus-within:bg-white focus-within:ring-4 ring-indigo-500/5 focus-within:border-indigo-200 transition-all">
              <button onClick={() => setShowEmoji(!showEmoji)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <Smile size={20}/>
              </button>
              <input 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                placeholder="Type your message..." 
                className="flex-1 bg-transparent py-3.5 px-2 outline-none text-[13px] font-medium" 
              />
              <input type="file" ref={attachmentRef} onChange={handleAttachment} className="hidden" />
              <button onClick={() => attachmentRef.current.click()} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <Paperclip size={20}/>
              </button>
            </div>
            <button onClick={handleSendMessage} className="bg-indigo-600 text-white w-12 h-12 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center">
              <Send size={18} fill="white"/>
            </button>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function HeaderBtn({ icon, onClick }) {
  return <button onClick={onClick} className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">{icon}</button>;
}