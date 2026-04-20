'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Smile, Paperclip, Phone, Video, 
  X, Info, Bell, Search, MoreHorizontal, CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONTACTS = [
  { id: 1, name: 'Sarah Jenkins', role: 'Project Manager', online: true, avatar: 'SJ', bio: 'Architecture & Design Lead', phone: '+251 911 22 33 44' },
  { id: 2, name: 'Marcus Thorne', role: 'Senior Developer', online: true, avatar: 'MT', bio: 'Full-stack engineering systems.', phone: '+251 922 33 44 55' },
  { id: 3, name: 'Elena Rodriguez', role: 'UI/UX Designer', online: false, avatar: 'ER', bio: 'Creating seamless human interfaces.', phone: '+251 933 44 55 66' },
];

export default function SovereignChat() {
  const [activeId, setActiveId] = useState(1);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [histories, setHistories] = useState({ 1: [], 2: [], 3: [] });
  const [showContactProfile, setShowContactProfile] = useState(false); 
  const [showEmoji, setShowEmoji] = useState(false);
  
  const attachmentRef = useRef(null);
  const messagesEndRef = useRef(null); // Constant scroll anchor

  const [myProfile] = useState({
    name: 'Christy',
    handle: 'giftableti',
    bio: 'Software Engineering Student | Full Stack Developer',
    avatar: 'C',
  });

  const activeContact = CONTACTS.find(c => c.id === activeId);

  // Function to handle constant scrolling
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [histories, activeId]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setHistories(prev => ({ 
      ...prev, 
      [activeId]: [...(prev[activeId] || []), newMessage] 
    }));
    setMessage('');
    setShowEmoji(false);
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl mx-4 my-4">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-96 bg-slate-50/50 flex flex-col shrink-0 border-r border-slate-100 h-full relative z-30">
        <div className="p-8 space-y-6 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-12 h-12 bg-[#111827] rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl group-hover:scale-105 transition-transform">
                {myProfile.avatar}
              </div>
              <div>
                <h1 className="text-[#111827] font-black text-xl tracking-tighter uppercase italic leading-none">Sovereign</h1>
                <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest">Secure Intel</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search communications..." 
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[11px] font-bold uppercase tracking-wider outline-none focus:ring-2 ring-blue-500/10 transition-all shadow-sm" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 custom-scrollbar">
          {CONTACTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
            <button 
              key={c.id} 
              onClick={() => { setActiveId(c.id); setShowContactProfile(false); }} 
              className={`w-full p-5 flex items-center gap-4 rounded-[2rem] transition-all ${activeId === c.id ? 'bg-white shadow-md border border-slate-100' : 'hover:bg-white/60'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${activeId === c.id ? 'bg-[#111827] text-white' : 'bg-slate-200 text-slate-500'}`}>
                {c.avatar}
              </div>
              <div className="text-left flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <p className={`font-black text-xs uppercase tracking-tight ${activeId === c.id ? 'text-[#111827]' : 'text-slate-600'}`}>{c.name}</p>
                  <span className="text-[8px] font-black text-slate-300 uppercase">12:45 PM</span>
                </div>
                <p className="text-[10px] font-bold truncate text-slate-400 uppercase tracking-widest italic">{c.role}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* --- MAIN CHAT --- */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
        <header className="h-24 border-b border-slate-50 px-10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setShowContactProfile(true)}>
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-[#111827] flex items-center justify-center font-black border border-slate-100 group-hover:border-blue-200 transition-colors shadow-sm">
              {activeContact.avatar}
            </div>
            <div>
              <h3 className="font-black text-[#111827] text-lg uppercase italic tracking-tighter leading-tight">{activeContact.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] text-slate-400 font-black tracking-[0.2em] uppercase">Encrypted Channel</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HeaderBtn icon={<Phone size={18} strokeWidth={3} />} />
            <HeaderBtn icon={<Video size={18} strokeWidth={3} />} />
            <HeaderBtn icon={<MoreHorizontal size={18} strokeWidth={3} />} onClick={() => setShowContactProfile(!showContactProfile)} />
          </div>
        </header>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#FDFDFD] custom-scrollbar">
          {histories[activeId]?.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`max-w-[60%] p-6 rounded-[2rem] shadow-sm relative ${
                  msg.isMe 
                    ? 'bg-[#111827] text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}
              >
                <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-end gap-2 mt-3 opacity-40">
                   <span className="text-[9px] font-black uppercase">{msg.time}</span>
                   {msg.isMe && <CheckCheck size={12} />}
                </div>
              </motion.div>
            </div>
          ))}
          {/* INVISIBLE ANCHOR FOR SCROLLING */}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* FOOTER */}
        <footer className="p-8 bg-white border-t border-slate-50 shrink-0 relative">
          <div className="max-w-5xl mx-auto flex items-center gap-5">
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center px-6 focus-within:bg-white focus-within:ring-8 ring-blue-500/5 transition-all shadow-inner">
              <button onClick={() => setShowEmoji(!showEmoji)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Smile size={22} />
              </button>
              <input 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                placeholder="Compose secure message..." 
                className="flex-1 bg-transparent py-5 px-3 outline-none text-xs font-black uppercase tracking-wider text-[#111827]" 
              />
              <button onClick={() => attachmentRef.current?.click()} className="p-2 text-slate-400 hover:text-blue-600">
                <Paperclip size={22} />
                <input type="file" ref={attachmentRef} className="hidden" />
              </button>
            </div>
            <button 
              onClick={handleSendMessage} 
              className="bg-[#111827] text-white p-5 rounded-2xl shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
            >
              <Send size={24} fill="currentColor" />
            </button>
          </div>
        </footer>
      </main>

      {/* --- CONTACT INTEL SIDEBAR --- */}
      <AnimatePresence>
        {showContactProfile && (
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-96 bg-white border-l border-slate-100 flex flex-col h-full z-40 shadow-2xl"
          >
            <div className="p-8 flex items-center justify-between border-b border-slate-50">
              <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 font-mono">Resource_Intel</span>
              <button onClick={() => setShowContactProfile(false)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors">
                <X size={20}/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-4xl font-black text-[#111827] border-4 border-white shadow-2xl mb-6">
                  {activeContact.avatar}
                </div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic">{activeContact.name}</h2>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-2">{activeContact.role}</p>
              </div>

              <div className="space-y-8">
                <IntelSection label="Brief" icon={<Info size={14}/>} value={activeContact.bio} />
                <IntelSection label="Contact Hash" icon={<Phone size={14}/>} value={activeContact.phone} />
                
                <div className="grid grid-cols-2 gap-3 pt-6">
                   <button className="py-4 px-4 rounded-2xl bg-slate-50 text-slate-600 font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all flex flex-col items-center gap-2">
                     <Bell size={18}/> Mute
                   </button>
                   <button className="py-4 px-4 rounded-2xl bg-rose-50 text-rose-600 font-black text-[9px] uppercase tracking-widest hover:bg-rose-100 transition-all flex flex-col items-center gap-2">
                     <X size={18}/> Block
                   </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F5F9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E2E8F0; }
      `}</style>
    </div>
  );
}

function IntelSection({ label, icon, value }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{value}</p>
    </div>
  );
}

function HeaderBtn({ icon, onClick }) {
  return (
    <button onClick={onClick} className="p-4 text-slate-400 hover:text-[#111827] hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-sm">
      {icon}
    </button>
  );
}