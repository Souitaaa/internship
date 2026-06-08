import React, { useState, useRef, useEffect } from 'react';
import { Settings, Bell, Factory, AlertTriangle, CheckCircle, Edit, Trash2, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { useMachines } from '../context/MachineContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { notifications, unreadCount, markAllAsRead, removeNotification } = useNotifications();
  const { searchTerm, setSearchTerm } = useMachines();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Energy': return <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0" />;
      case 'Add': return <CheckCircle className="text-primary-500 w-5 h-5 shrink-0" />;
      case 'Edit': return <Edit className="text-primary-500 w-5 h-5 shrink-0" />;
      case 'Delete': return <Trash2 className="text-red-500 w-5 h-5 shrink-0" />;
      default: return <Info className="text-slate-500 w-5 h-5 shrink-0" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'Energy': return 'bg-amber-50 border-l-4 border-amber-500';
      case 'Add': return 'bg-primary-50 border-l-4 border-primary-500';
      case 'Edit': return 'bg-primary-50 border-l-4 border-primary-500';
      case 'Delete': return 'bg-red-50 border-l-4 border-red-500';
      default: return 'bg-slate-50 border-l-4 border-slate-500';
    }
  };

  const handleToggle = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <Factory className="w-6 h-6 text-primary-600" />
        <Link to="/" className="text-xl font-bold text-slate-800">IndusWeb</Link>
      </div>
      <div className="flex items-center space-x-4">
        
        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={handleToggle}
            className="relative text-slate-500 hover:text-primary-600 transition-colors p-2"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full px-1 shadow-sm border-2 border-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <span className="text-xs text-gray-500">{notifications.length} total</span>
              </div>
              
              <div className="p-2 flex flex-col gap-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`relative rounded-md p-3 flex items-start gap-3 transition-colors ${getNotificationColor(notif.type)}`}
                    >
                      {getNotificationIcon(notif.type)}
                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className="font-semibold text-gray-800 text-sm">{notif.type === 'Energy' ? 'High Energy Alert' : `${notif.type} Event`}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1.5 block">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 bg-white/50 rounded-full p-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="text-slate-500 hover:text-primary-600 transition-colors p-2">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold ml-2 shadow-sm border border-primary-200">
          A
        </div>
      </div>
    </nav>
  );
}
