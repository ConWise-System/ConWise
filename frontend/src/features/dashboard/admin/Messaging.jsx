"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Smile, Paperclip, Phone, Video, 
  X, Info, Bell, Camera, User, Edit3, FileText, 
  ChevronLeft, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';

const CONTACTS = [
  { id: 1, name: 'Sarah Jenkins', role: 'Project Manager', online: true, avatar: 'SJ', bio: 'Design is intelligence made visible.', phone: '+251 911 22 33 44' },
  { id: 2, name: 'Marcus Thorne', role: 'Senior Developer', online: true, avatar: 'MT', bio: 'Coding my way through life.', phone: '+251 922 33 44 55' },
  { id: 3, name: 'Elena Rodriguez', role: 'UI/UX Designer', online: false, avatar: 'ER', bio: 'Pixel perfect advocate.', phone: '+251 933 44 55 66' },
];

export default function SovereignChat() {
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

  // Auto-scroll to bottom only when messages change
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
    /* OUTERMOST CONTAINER: Fixed to viewport height, no scroll allowed here */
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      
      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-80 bg-white flex flex-col shrink-0 border-r border-slate-200 h-full relative z-30">
        <AnimatePresence>
          {showMyProfile && (
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="absolute inset-0 bg-white z-50 flex flex-col shadow-xl"
            >
              <div className="p-5 flex items-center gap-5 border-b border-slate-100 bg-slate-50/50">
                <button onClick={() => setShowMyProfile(false)} className="hover:bg-slate-200 p-2 rounded-full text-slate-600 transition-colors">
                  <ChevronLeft size={20}/>
                </button>
                <span className="font-bold text-lg text-slate-800">Profile Settings</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {/* Profile content stays as it was */}
                <div className="py-8 flex flex-col items-center">
                   <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-4xl font-black text-white overflow-hidden border-2 border-white shadow-xl">
                        {myProfile.avatarUrl ? <img src={myProfile.avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : myProfile.avatar}
                      </div>
                      <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full shadow-lg text-white border-2 border-white">
                        <Camera size={16} />
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setMyProfile({...myProfile, avatarUrl: reader.result});
                          reader.readAsDataURL(file);
                        }
                      }} />
                   </div>
                   <h3 className="font-bold text-slate-800">{myProfile.name}</h3>
                   <p className="text-xs text-slate-400">@{myProfile.handle}</p>
                </div>
                <div className="text-left space-y-1">
                  <EditableItem icon={<User size={18}/>} label="Full Name" value={myProfile.name} onSave={(val) => setMyProfile({...myProfile, name: val})} />
                  <EditableItem icon={<Info size={18}/>} label="Bio" value={myProfile.bio} onSave={(val) => setMyProfile({...myProfile, bio: val})} />
                  <EditableItem icon={<Phone size={18}/>} label="Phone" value={myProfile.phone} onSave={(val) => setMyProfile({...myProfile, phone: val})} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 space-y-4 shrink-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setShowMyProfile(true)}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg overflow-hidden group-hover:scale-110 transition-transform">
                {myProfile.avatarUrl ? <img src={myProfile.avatarUrl} className="w-full h-full object-cover" alt="avatar" /> : myProfile.avatar}
              </div>
              <div>
                <h1 className="text-slate-800 font-black text-xl tracking-tight leading-none">Sovereign</h1>
                <p className="text-[9px] font-bold text-indigo-500 mt-1 uppercase">Messenger</p>
              </div>
            </div>
          </div>
          <div className="relative px-1">
            <Search className="absolute left-4 top-3 text-slate-400" size={16} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search chats..." className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 ring-indigo-500/10 transition-all" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
          {CONTACTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
            <button key={c.id} onClick={() => { setActiveId(c.id); setShowContactProfile(false); }} 
              className={`w-full p-4 flex items-center gap-4 rounded-[1.5rem] transition-all ${activeId === c.id ? 'bg-indigo-50 shadow-sm' : 'hover:bg-slate-50'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${activeId === c.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-500'}`}>{c.avatar}</div>
              <div className="text-left flex-1 overflow-hidden">
                <p className={`font-bold text-[15px] ${activeId === c.id ? 'text-indigo-900' : 'text-slate-700'}`}>{c.name}</p>
                <p className="text-xs truncate text-slate-400">{c.role}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* --- MAIN CHAT AREA: This fills the remaining screen width and doesn't scroll itself --- */}
      <main className="flex-1 flex flex-col h-screen bg-white overflow-hidden relative">
        
        {/* Header - Stays at the top */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setShowContactProfile(true)}>
            <div className="w-11 h-11 rounded-2xl bg-slate-100 text-indigo-600 flex items-center justify-center font-black border border-slate-200 group-hover:bg-indigo-50 transition-colors">{activeContact.avatar}</div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">{activeContact.name}</h3>
              <p className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HeaderBtn icon={<Phone size={20}/>} />
            <HeaderBtn icon={<Video size={20}/>} />
            <HeaderBtn icon={<Info size={20} className={showContactProfile ? 'text-indigo-600' : ''} />} onClick={() => setShowContactProfile(!showContactProfile)} />
          </div>
        </header>

        {/* MESSAGE AREA: The only scrollable part. min-h-0 is essential here. */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto min-h-0 p-8 space-y-6 custom-scrollbar bg-slate-50/20"
        >
          {histories[activeId]?.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`max-w-[70%] p-4 rounded-[1.5rem] shadow-sm relative ${msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                {msg.attachment ? (
                  <div className="space-y-2">
                    {msg.isImage ? (
                      <img src={msg.attachment} className="rounded-lg max-h-60 w-full object-cover" alt="sent" />
                    ) : (
                      <div className="flex items-center gap-2 bg-black/10 p-2 rounded-lg">
                        <FileText size={20} /> <span className="text-sm truncate">{msg.text}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                )}
                <div className="text-[9px] font-bold mt-2 opacity-50 text-right">{msg.time}</div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Footer - Stays at the bottom */}
        <footer className="p-6 bg-white border-t border-slate-100 shrink-0 relative">
          <AnimatePresence>
            {showEmoji && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-24 left-6 z-50 shadow-2xl rounded-2xl overflow-hidden">
                <EmojiPicker onEmojiClick={(emojiData) => setMessage(prev => prev + emojiData.emoji)} theme="light" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-4 focus-within:bg-white focus-within:ring-4 ring-indigo-500/5 border border-transparent focus-within:border-indigo-100 transition-all">
              <button onClick={() => setShowEmoji(!showEmoji)} className={`p-2 transition-colors ${showEmoji ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}>
                <Smile size={24}/>
              </button>
              <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Write something..." className="flex-1 bg-transparent py-4 px-2 outline-none text-sm font-medium" />
              <input type="file" ref={attachmentRef} onChange={handleAttachment} className="hidden" />
              <button onClick={() => attachmentRef.current.click()} className="p-2 text-slate-400 hover:text-indigo-600">
                <Paperclip size={22}/>
              </button>
            </div>
            <button onClick={handleSendMessage} className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">
              <Send size={22} fill="white"/>
            </button>
          </div>
        </footer>
      </main>

      {/* --- RIGHT SIDEBAR: Contact Profile --- */}
      <AnimatePresence>
        {showContactProfile && (
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80 bg-white border-l border-slate-200 flex flex-col h-full z-40 shadow-2xl shrink-0"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-50 shrink-0">
              <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Contact Details</span>
              <button onClick={() => setShowContactProfile(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                <X size={20}/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-4xl font-black text-indigo-600 shadow-inner border-4 border-white shadow-slate-200">
                  {activeContact.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">{activeContact.name}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{activeContact.role}</p>
                </div>
              </div>

              <div className="px-6 space-y-6 pb-8">
                <ProfileInfoSection label="About" icon={<Info size={16}/>} value={activeContact.bio} />
                <ProfileInfoSection label="Phone" icon={<Phone size={16}/>} value={activeContact.phone} />
                
                <div className="pt-4 border-t border-slate-50 space-y-3">
                   <button className="w-full py-3 px-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-colors flex items-center gap-3">
                     <Bell size={16}/> Mute Notifications
                   </button>
                   <button className="w-full py-3 px-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-colors flex items-center gap-3">
                     <X size={16}/> Block Contact
                   </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
}

// Sub-components
function EditableItem({ icon, label, value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const handleSave = () => { setIsEditing(false); onSave(tempValue); };
  return (
    <div className="p-4 hover:bg-slate-50 rounded-[1.5rem] transition-all group flex items-center gap-4 cursor-pointer" onClick={() => !isEditing && setIsEditing(true)}>
      <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">{icon}</div>
      <div className="flex-1">
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
        {isEditing ? (
          <input autoFocus className="w-full bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm font-bold outline-none mt-1" value={tempValue} onChange={e => setTempValue(e.target.value)} onBlur={handleSave} onKeyDown={e => e.key === 'Enter' && handleSave()} />
        ) : ( <p className="text-sm font-bold text-slate-700 mt-0.5">{value}</p> )}
      </div>
      {!isEditing && <Edit3 size={14} className="text-slate-300 opacity-0 group-hover:opacity-100" />}
    </div>
  );
}

function ProfileInfoSection({ label, icon, value }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-indigo-500">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-700 leading-relaxed pl-6">{value}</p>
    </div>
  );
}

function HeaderBtn({ icon, onClick, className }) {
  return <button onClick={onClick} className={`p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all ${className}`}>{icon}</button>;
}