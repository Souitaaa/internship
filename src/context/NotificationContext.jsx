import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Optimized Socket options to prevent endless polling background threads when offline
    const socket = io('http://localhost:3000', {
      reconnectionAttempts: 5,
      timeout: 10000,
      transports: ['websocket', 'polling']
    });

    socket.on('energyAlert', (data) => {
      setNotifications(prev => [{...data, read: false, id: Date.now() + Math.random()}, ...prev]);
    });
    
    socket.on('appNotification', (data) => {
      setNotifications(prev => [{...data, read: false, id: Date.now() + Math.random() + 1}, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  // Derived state to ensure unreadCount is always perfectly synchronized with notifications list
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (data) => {
    setNotifications(prev => [{ ...data, read: false, id: data.id || (Date.now() + Math.random()) }, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead, removeNotification, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
