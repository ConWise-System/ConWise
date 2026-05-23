'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserContext';
import Axios from '../../utils/Axios';
import summeryApi from '../common/summeryApi';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper to translate Prisma Schema properties to match UI Layout fields cleanly
  const mapSchemaToUI = useCallback((dbNotif) => {
    const formattedTime = dbNotif.notifiedDate 
      ? new Date(dbNotif.notifiedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Just now';

    return {
      id: dbNotif.id,
      type: dbNotif.relatedEntityType, // e.g., 'SECURITY', 'TASK', 'MESSAGE'
      title: dbNotif.notificationTitle,
      description: dbNotif.notificationDescription || '',
      time: formattedTime,
      isRead: dbNotif.isRead,
      badges: [dbNotif.relatedEntityType],
    };
  }, []);

  // 1. GET /api/notifications -> Load live user notification database logs
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await Axios({
        method: summeryApi.getNotifications?.method || 'GET',
        url: summeryApi.getNotifications?.url || '/api/notifications'
      });

      if (response.data.success) {
        const rawList = response.data.data || [];
        const mappedList = rawList.map(mapSchemaToUI);
        
        setNotifications(mappedList);
        
        // Instantly sync local unread status block badge state counts
        const unread = mappedList.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Failed to load notifications framework history:", error);
    } finally {
      setLoading(false);
    }
  }, [user, mapSchemaToUI]);

// 2. PATCH /api/notifications/:id/read -> Mark a specific notification as read
  const markAsRead = useCallback(async (id) => {
    // Optimistic UI updates
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      // Resolve the dynamic URL by invoking it as a function execution block
      const targetUrl = typeof summeryApi.readNotification?.url === 'function'
        ? summeryApi.readNotification.url(id)
        : `/api/notifications/${id}/read`;

      await Axios({
        method: summeryApi.readNotification?.method || 'PATCH',
        url: targetUrl,
      });
      
      console.log(`✅ Notification ${id} marked as read successfully.`);
    } catch (error) {
      console.error(`❌ Server Patch Failed for notification ${id}:`, error?.response?.data || error.message);
      // Fallback: reload state from DB if backend explicitly drops or fails
      fetchNotifications(); 
    }
  }, [fetchNotifications]);

  // 3. PATCH /api/notifications/read-all -> Flush and mark everything as read
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await Axios({
        method: summeryApi.readAllNotifications?.method || 'PATCH',
        url: summeryApi.readAllNotifications?.url || '/api/notifications/read-all',
      });
      console.log("✅ All notifications marked as read.");
    } catch (error) {
      console.error("❌ Failed to clear all notifications on server:", error?.response?.data || error.message);
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // 4. WebSocket Engine Lifecycle Setup
  useEffect(() => {
    if (!user?.id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Pull initial database payload array immediately upon logging in
    fetchNotifications();

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const newSocket = io(socketUrl, { transports: ['websocket'] });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_notifications', user.id);
    });

    // Capture explicit real-time events, map on the fly, and prepend to view state
    newSocket.on('new_notification', (rawNotification) => {
      const mappedNotif = mapSchemaToUI(rawNotification);
      setNotifications((prev) => [mappedNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, fetchNotifications, mapSchemaToUI]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loading, 
      markAsRead, 
      markAllAsRead, 
      fetchNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};