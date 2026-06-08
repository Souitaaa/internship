import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('energyAlert', (data) => {
      setNotifications(prev => [{...data, read: false, id: Date.now()}, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    
    socket.on('appNotification', (data) => {
      setNotifications(prev => [{...data, read: false, id: Date.now() + 1}, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => socket.disconnect();
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
    setUnreadCount(0);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (data) => {
    setNotifications(prev => [{ ...data, read: false, id: Date.now() + Math.random() }, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, removeNotification, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
