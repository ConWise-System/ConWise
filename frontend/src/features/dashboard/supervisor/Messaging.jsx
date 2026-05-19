"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Smile, Paperclip, Phone, Video, Info, 
  Search, Edit3, Loader2, MessageSquare, User, CheckCheck
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useUser } from "../../../context/UserContext"; 
import { useMessaging } from "../../../context/MessagingContext";

import Axios from "../../../../utils/Axios";
import summeryApi from "../../../common/summeryApi";

export default function SovereignChat() {
  const { user: currentUser } = useUser(); 
  const { 
    messages, 
    activeChat, 
    loadingHistory, 
    selectChatContext, 
    dispatchMessage,
    onlineUsers,
    unreadCounts
  } = useMessaging();
  
  const [coworkers, setCoworkers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  
  const scrollRef = useRef(null);

  // 1. Fetch company directory profiles on mount
  useEffect(() => {
    const syncCompanyDirectory = async () => {
      try {
        setLoadingUsers(true);
        const response = await Axios({
          url: summeryApi.getUsers.url,
          method: summeryApi.getUsers.method
        });
        
        if (response.data.success) {
          const allUsers = response.data.data?.users || response.data.data || [];          
          const filteredStaff = allUsers.filter(u => Number(u.id) !== Number(currentUser?.id));
          
          const formattedChannels = filteredStaff.map((staff) => ({
            id: staff.id,
            name: `${staff.firstName} ${staff.lastName || ''}`.trim(),
            role: staff.role ? staff.role.replace("_", " ") : "Staff Member",
            avatar: staff.firstName.substring(0, 2).toUpperCase()
          }));

          setCoworkers(formattedChannels);

          if (formattedChannels.length > 0 && !activeChat) {
            selectChatContext("PRIVATE", formattedChannels[0].id);
          }
        }
      } catch (err) {
        console.error("Critical error mapping company staff directories:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (currentUser?.id) {
      syncCompanyDirectory();
    }
  }, [currentUser]);

  // 2. Lock scroll position cleanly to screen container floor
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loadingHistory]);

  const activePeer = coworkers.find(c => c.id === activeChat?.id && activeChat?.type === "PRIVATE");
  const isPeerOnline = activePeer ? onlineUsers.includes(Number(activePeer.id)) : false;

  const handleSend = async () => {
    if (!messageText.trim()) return;
    
    try {
      await dispatchMessage(messageText.trim());
      setMessageText('');
      setShowEmoji(false);
    } catch (err) {
      console.error("Direct transmission from engineer desk failed:", err);
    }
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl font-sans antialiased text-slate-100">
      
      {/* --- SIDEBAR: TEAM SPACE CHANNELS --- */}
      <aside className="w-80 bg-slate-950 flex flex-col shrink-0 border-r border-slate-800/60 h-full relative">
        {/* Header Branding Container */}
        <div className="p-5 space-y-4 shrink-0 border-b border-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]" />
              <h2 className="text-sm font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                Team Workspace
              </h2>
            </div>
            <button className="p-2 hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-800 text-slate-400 hover:text-slate-200">
               <Edit3 size={15} />
            </button>
          </div>
          
          {/* Custom Search Input Engine */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search conversations..." 
              className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder-slate-500 text-slate-200 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/40 transition-all" 
            />
          </div>
        </div>
        
        {/* Contact Loop Navigation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5 custom-scrollbar">
          {loadingUsers ? (
            <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center gap-2.5 h-32">
              <Loader2 size={18} className="animate-spin text-teal-400" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Syncing Network Channels...</span>
            </div>
          ) : coworkers.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-[10px] font-black tracking-wider uppercase mt-8">
              No active crew mapped.
            </div>
          ) : (
            coworkers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((peer) => {
              const isSelected = activeChat?.id === peer.id && activeChat?.type === "PRIVATE";
              const userActiveStatus = onlineUsers.includes(Number(peer.id));
              const countOfUnreads = unreadCounts[peer.id] || 0;
              
              return (
                <button 
                  key={`private-${peer.id}`} 
                  onClick={() => selectChatContext("PRIVATE", peer.id)} 
                  className={`w-full p-3 flex items-center justify-between rounded-xl transition-all duration-200 border group ${
                    isSelected 
                      ? 'bg-gradient-to-r from-slate-900 to-slate-900/80 border-slate-800 shadow-xl' 
                      : 'hover:bg-slate-900/40 border-transparent hover:border-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5 text-left overflow-hidden">
                    {/* Rounded Profile Container and Dot Marker */}
                    <div className="relative shrink-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                        isSelected 
                          ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/10' 
                          : 'bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {peer.avatar}
                      </div>
                      {userActiveStatus && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)] z-10" />
                      )}
                    </div>
                    
                    <div className="overflow-hidden">
                      <p className={`font-bold text-xs uppercase tracking-tight truncate ${isSelected ? 'text-slate-100' : 'text-slate-300 group-hover:text-slate-100'}`}>
                        {peer.name}
                      </p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 truncate">
                        {peer.role}
                      </p>
                    </div>
                  </div>

                  {/* SPRINGY NOTIFICATION COUNT BADGES */}
                  {countOfUnreads > 0 && !isSelected && (
                    <span className="min-w-4.5 h-4.5 px-1.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg flex items-center justify-center font-black text-[9px] shadow-lg shadow-rose-500/20 tracking-tighter animate-pulse shrink-0">
                      {countOfUnreads}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* --- CENTRAL CONVERSATION CORE VIEWPORT FEED --- */}
      <main className="flex-1 flex flex-col h-full bg-slate-900/40 overflow-hidden relative">
        {activePeer ? (
          <>
            {/* Active Header Profile Metadata Navigation Block */}
            <header className="h-20 border-b border-slate-800/60 px-6 flex items-center justify-between shrink-0 bg-slate-950/20 backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center font-black">
                  <User size={15} className={isPeerOnline ? "text-teal-400" : "text-slate-500"} />
                </div>
                <div>
                  <h3 className="font-black text-slate-100 text-xs uppercase tracking-wider">{activePeer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isPeerOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-600'}`} />
                    <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">
                      {isPeerOnline ? "Online Now" : "Offline Link"} • {activePeer.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-800"><Phone size={15}/></button>
                <button className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-800"><Video size={15}/></button>
                <div className="w-px h-5 bg-slate-800 mx-1.5" />
                <button className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-800"><Info size={15} /></button>
              </div>
            </header>

            {/* Premium Message Timeline Scroll Port */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 p-6 space-y-4 custom-scrollbar bg-slate-900/20">
              {loadingHistory ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Loader2 className="animate-spin text-teal-400 mb-2" size={22} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reassembling History Core...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-80">
                  <MessageSquare size={26} className="stroke-1 text-slate-600 mb-2 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Direct Node Active. Say Hello.</span>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = Number(msg.senderUserId) === Number(currentUser?.id);
                  const uniqueKey = msg.id || `msg-${index}-${msg.timestamp}`;
                  
                  return (
                    <div key={uniqueKey} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group transition-all duration-200`}>
                      <div className={`max-w-[65%] px-4 py-3 rounded-2xl border relative transition-shadow ${
                        isMe 
                          ? 'bg-gradient-to-br from-teal-500 to-teal-600 border-teal-500/20 text-slate-950 font-semibold rounded-tr-none shadow-lg shadow-teal-500/5' 
                          : 'bg-slate-950 border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                      }`}>
                        <p className="text-xs leading-relaxed font-medium tracking-wide whitespace-pre-wrap">{msg.messageContent}</p>
                        
                        <div className={`text-[8px] font-bold mt-2 flex items-center justify-end gap-1 uppercase tracking-wider ${isMe ? 'text-teal-950/70' : 'text-slate-500'}`}>
                          <span>{formatTimestamp(msg.timestamp)}</span>
                          {isMe && <CheckCheck size={11} className="text-teal-950/60" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Premium Message Input Dispatch Dock */}
            <footer className="p-5 border-t border-slate-800/50 shrink-0 bg-slate-950/10 relative">
              {showEmoji && (
                <div className="absolute bottom-full mb-3 left-6 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <EmojiPicker 
                    onEmojiClick={(emojiData) => setMessageText(prev => prev + emojiData.emoji)}
                    height={320}
                    width={280}
                    theme="dark"
                    skinTonesDisabled
                    searchDisabled
                  />
                </div>
              )}

              <div className="max-w-5xl mx-auto flex items-center gap-3">
                <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center px-3.5 focus-within:bg-slate-950 focus-within:ring-2 ring-teal-500/10 focus-within:border-teal-500/30 transition-all duration-200">
                  <button type="button" onClick={() => setShowEmoji(!showEmoji)} className={`p-2 transition-colors ${showEmoji ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Smile size={17}/>
                  </button>
                  <input 
                    value={messageText} 
                    onChange={e => setMessageText(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()} 
                    placeholder={`Message ${activePeer.name.split(' ')[0]}...`} 
                    className="flex-1 bg-transparent py-3.5 px-2 outline-none text-xs font-semibold text-slate-200 placeholder-slate-500" 
                  />
                  <button type="button" className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
                    <Paperclip size={17}/>
                  </button>
                </div>
                <button type="button" onClick={handleSend} className="bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-slate-950 w-11 h-11 rounded-xl shadow-lg shadow-teal-500/10 transition-all flex items-center justify-center shrink-0 active:scale-95">
                  <Send size={14} fill="currentColor" className="mr-0.5"/>
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs font-black tracking-widest uppercase">
            {!loadingUsers ? "Select a workspace teammate to stream logs" : "Initializing connection ports..."}
          </div>
        )}
      </main>

      {/* Styled JSX Custom Minimal Scroll Trackers */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}