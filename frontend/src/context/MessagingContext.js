        'use client';

        import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
        import io from 'socket.io-client';
        import Axios from '../../utils/Axios';
        import summeryApi from '../common/summeryApi';

        const MessagingContext = createContext(null);

        export function MessagingProvider({ children, currentUser }) {
          const [messages, setMessages] = useState([]);
          const [activeChat, setActiveChat] = useState(null); 
          const [loadingHistory, setLoadingHistory] = useState(false);
          const [socketConnected, setSocketConnected] = useState(false);
          const [onlineUsers, setOnlineUsers] = useState([]); 
          
          // Track unread messages for each user ID: { [senderUserId]: count }
          const [unreadCounts, setUnreadCounts] = useState({});
          
          const socketRef = useRef(null);
          // Keep activeChat in a mutable ref so the real-time socket event listener always knows the exact active tab instantly
          const activeChatRef = useRef(null);

          useEffect(() => {
            activeChatRef.current = activeChat;
          }, [activeChat]);

          // 1. CORE SOCKET LIFECYCLE ENGINE
          useEffect(() => {
            if (!currentUser?.id) return;

            const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
            
            const newSocket = io(socketServerUrl, {
              transports: ['websocket'],
              autoConnect: true,
              reconnection: true,
              reconnectionAttempts: Infinity,
              reconnectionDelay: 1000,
            });

            socketRef.current = newSocket;

            newSocket.on('connect', () => {
              console.log('⚡ Stream Linked. Socket ID:', newSocket.id);
              setSocketConnected(true);
              newSocket.emit('join_private', currentUser.id);
              newSocket.emit('join_notifications', currentUser.id);
            });

            newSocket.on('disconnect', () => {
              setSocketConnected(false);
            });

            newSocket.on('update_online_users', (userIdsArray) => {
              const normalizedIds = userIdsArray.map(id => Number(id));
              setOnlineUsers(normalizedIds);
            });

            newSocket.on('receive_private_message', (incomingMsg) => {
              const incomingSenderId = Number(incomingMsg.senderUserId);
              const incomingReceiverId = Number(incomingMsg.receiverUserId);
              const currentSessionUserId = Number(currentUser.id);
              
              const currentActive = activeChatRef.current;
              const activePeerId = Number(currentActive?.id);

              // A: Verify if this incoming message belongs to the conversation currently open on screen
              const isChattingWithThisUser = 
                (incomingSenderId === activePeerId && incomingReceiverId === currentSessionUserId) ||
                (incomingSenderId === currentSessionUserId && incomingReceiverId === activePeerId);

              if (isChattingWithThisUser) {
                setMessages((prev) => {
                  const normalizedMsg = {
                    ...incomingMsg,
                    id: incomingMsg.id !== undefined && incomingMsg.id !== null ? incomingMsg.id : `socket-${Date.now()}`
                  };
                  const cleanPrev = prev.filter(m => m && m.id);
                  if (cleanPrev.some((m) => m.id === normalizedMsg.id)) return cleanPrev;
                  return [...cleanPrev, normalizedMsg];
                });
              } else {
                // B: REAL-TIME UNREAD INCREMENT
                // If the message is for me, but I am NOT currently looking at that user's chat, increment their badge
                if (incomingReceiverId === currentSessionUserId) {
                  setUnreadCounts((prev) => ({
                    ...prev,
                    [incomingSenderId]: (prev[incomingSenderId] || 0) + 1
                  }));
                }
              }
            });

            return () => {
              if (newSocket) newSocket.disconnect();
            };
          }, [currentUser?.id]);

          // 2. FETCH HISTORICAL CONVERSATION LOGS & CLEAR UNREADS
          const loadChatLogs = useCallback(async (targetUserId) => {
            if (!targetUserId) return;
            try {
              setLoadingHistory(true);
              
              // Clear the unread counter locally for this user immediately when clicking their tab
              setUnreadCounts((prev) => ({
                ...prev,
                [targetUserId]: 0
              }));

              const response = await Axios({
                url: summeryApi.getChatHistory.url,
                method: summeryApi.getChatHistory.method,
                params: { receiverUserId: targetUserId }
              });
              
              if (response.data.success) {
                setMessages(response.data.data || []);
                
                // Optional: If your backend tracks unread message records in the database, 
                // trigger an update here to mark all messages from targetUserId as read.
                /*
                Axios({
                  url: '/api/chat/mark-read',
                  method: 'POST',
                  data: { senderUserId: targetUserId }
                }).catch(err => console.error(err));
                */
              } else {
                setMessages([]);
              }
            } catch (err) {
              console.error("Failed to load conversation logs:", err);
              setMessages([]);
            } finally {
              setLoadingHistory(false);
            }
          }, []);

          const selectChatContext = useCallback((type, targetUserId) => {
            setActiveChat({ id: targetUserId, type: "PRIVATE" });
            loadChatLogs(targetUserId);
          }, [loadChatLogs]);

          const dispatchMessage = useCallback(async (textContent) => {
            if (!textContent?.trim() || !activeChat?.id || !currentUser?.id) return;

            const cleanSenderId = parseInt(currentUser.id, 10);
            const cleanReceiverId = parseInt(activeChat.id, 10);
            const tempId = `temp-${Date.now()}`;

            const outgoingPayload = {
              id: tempId, 
              senderUserId: cleanSenderId,
              receiverUserId: cleanReceiverId, 
              messageContent: textContent.trim(),
              chatType: "TEXT",
              timestamp: new Date().toISOString()
            };

            setMessages((prev) => [...prev.filter(m => m && m.id !== tempId), outgoingPayload]);

            if (socketRef.current && socketRef.current.connected) {
              socketRef.current.emit('send_private_message', outgoingPayload);
            }

            Axios({
              url: summeryApi.sendChatMessage.url,
              method: summeryApi.sendChatMessage.method,
              data: {
                messageContent: textContent.trim(),
                chatType: "TEXT",
                receiverUserId: cleanReceiverId
              }
            })
            .then((response) => {
              if (response.data?.success && response.data?.data?.id) {
                setMessages((prev) => prev.map((msg) => msg.id === tempId ? response.data.data : msg));
              }
            })
            .catch((err) => console.error("❌ Database persistence write failed:", err));

          }, [activeChat?.id, currentUser?.id]);

          return (
            <MessagingContext.Provider value={{
              messages,
              activeChat,
              loadingHistory,
              selectChatContext,
              dispatchMessage,
              socketConnected,
              onlineUsers,
              unreadCounts // 👈 Exposing unread map database keys here
            }}>
              {children}
            </MessagingContext.Provider>
          );
        }

        export function useMessaging() {
          const context = useContext(MessagingContext);
          if (!context) throw new Error('useMessaging missing operational scope wrapper context');
          return context;
        }