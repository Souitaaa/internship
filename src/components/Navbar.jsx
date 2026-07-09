import React, { useState, useEffect, useMemo } from 'react';
import { useMachines } from '../context/MachineContext';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Search, LogOut, Settings, User, PlusCircle, PenTool, Trash2, AlertTriangle, Info, CheckCircle, X, CheckSquare } from 'lucide-react';

export default function Navbar() {
  const { searchTerm, setSearchTerm } = useMachines();
  const { notifications, markAllAsRead, removeNotification, unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  
  // Manage expandable search bar state
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Memoized notifications to prevent redundant allocations and provide premium default fallback notifications
  const displayNotifications = useMemo(() => {
    return notifications && notifications.length > 0 
      ? notifications 
      : [
          { id: 'def-1', text: "⚠️ Overload: Pump Beta (155 kWh)", time: "2 min ago", type: "Energy" },
          { id: 'def-2', text: "Added: Conveyor Line A", time: "10 min ago", type: "Add" }
        ];
  }, [notifications]);

  const clearAllNotifs = (e) => {
    e.stopPropagation();
    // Dismiss all active notifications from roster
    if (notifications && notifications.length > 0) {
      notifications.forEach(notif => {
        if (removeNotification) removeNotification(notif.id);
      });
    }
    setNotifDropdownOpen(false);
  };

  const handleReadAll = (e) => {
    e.stopPropagation();
    if (markAllAsRead) {
      markAllAsRead();
    }
  };

  // Premium helper to retrieve status-colored icons and backgrounds based on type
  const getNotifStyle = (notif) => {
    const type = (notif.type || '').toLowerCase();
    const text = (notif.text || notif.message || '').toLowerCase();

    if (type === 'energy' || type === 'warning' || text.includes('overload') || text.includes('alert')) {
      return {
        bg: 'bg-red-500/10 border-red-500/20 text-red-400',
        icon: <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
      };
    }
    if (type === 'add' || text.includes('added') || text.includes('online')) {
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        icon: <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
      };
    }
    if (type === 'edit' || text.includes('updated')) {
      return {
        bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
        icon: <Info className="w-4 h-4 text-indigo-400 shrink-0" />
      };
    }
    if (type === 'delete' || text.includes('deleted') || text.includes('offline')) {
      return {
        bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        icon: <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
      };
    }

    return {
      bg: 'bg-[#121b2d] border-[#232f48]/40 text-slate-300',
      icon: <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
    };
  };

  return (
    <header className="h-16 bg-[#121b2d] border-b border-[#1e293b] px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      
      {/* Left side spacer */}
      <div className="hidden md:flex items-center text-slate-400 text-xs font-semibold">
      </div>

      {/* Action Controls & Profile Area */}
      <div className="flex items-center space-x-4 ml-auto">
        
        {/* Smooth Expandable Search Bar */}
        <div className={`relative transition-all duration-300 ease-in-out ${searchExpanded || searchTerm !== '' ? 'w-64' : 'w-10'}`}>
          <input
            type="text"
            placeholder={searchExpanded || searchTerm !== '' ? "Search machines, UUIDs..." : ""}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchExpanded(true)}
            onBlur={() => {
              if (searchTerm === '') setSearchExpanded(false);
            }}
            className={`h-10 pl-10 pr-4 bg-[#161f30] border border-[#232f48] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all duration-300 w-full ${
              searchExpanded || searchTerm !== '' ? 'cursor-text pl-10' : 'cursor-pointer pl-10 bg-transparent hover:bg-[#161f30]'
            }`}
          />
          <Search 
            onClick={() => setSearchExpanded(true)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5 cursor-pointer hover:text-white transition-colors" 
          />
        </div>

        {/* Notifications Icon and Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-[#161f30] rounded-xl transition-all cursor-pointer relative"
          >
            <Bell className="w-4.5 h-4.5" />
            {(unreadCount > 0 || displayNotifications.length > 0) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-[#161f30] border border-[#232f48] rounded-2xl shadow-2xl p-4 z-50 text-slate-200 animate-slide-in origin-top-right">
              
              {/* Dropdown Toolbar */}
              <div className="flex justify-between items-center pb-2.5 border-b border-[#232f48]/50">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white">Live Alerts</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                  <button 
                    onClick={handleReadAll}
                    className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1"
                    title="Mark all as read"
                  >
                    <CheckSquare className="w-3 h-3" />
                    <span>Read All</span>
                  </button>
                  <button 
                    onClick={clearAllNotifs}
                    className="hover:text-rose-400 cursor-pointer transition-colors"
                    title="Dismiss all"
                  >
                    Dismiss All
                  </button>
                </div>
              </div>

              {/* Notification List Scrollbox */}
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {displayNotifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-500 font-medium">No new notifications</p>
                ) : (
                  displayNotifications.map((notif) => {
                    const style = getNotifStyle(notif);
                    const text = notif.text || notif.message;
                    
                    return (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                          if (removeNotification) removeNotification(notif.id);
                        }}
                        title="Click to dismiss"
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-200 cursor-pointer hover:bg-slate-800/40 relative group ${style.bg} ${notif.read ? 'opacity-55' : ''}`}
                      >
                        <div className="shrink-0">{style.icon}</div>
                        <div className="space-y-0.5 min-w-0 flex-1 pr-4">
                          <p className="text-xs font-semibold leading-normal truncate">{text}</p>
                          <p className="text-[8px] text-slate-500 font-bold tracking-wide">
                            {notif.time || notif.timestamp ? new Date(notif.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                          </p>
                        </div>
                        
                        {/* Read one notif close/check trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (removeNotification) removeNotification(notif.id);
                          }}
                          className="p-1 text-slate-500 hover:text-white rounded hover:bg-white/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Dismiss notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Card & Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1 hover:bg-[#161f30] rounded-xl transition-all cursor-pointer"
          >
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-200">C.SOUITA</span>
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Site Manager</span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md border border-white">
              A
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#161f30] border border-[#232f48] rounded-xl shadow-2xl py-1 z-50 text-slate-300 animate-slide-in">
              <div className="px-4 py-2 border-b border-[#232f48]/50 text-xs text-slate-500 font-medium">
                Connected as <strong className="text-slate-200">souita.c</strong>
              </div>
              <button onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2 text-slate-300">
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </button>
              <button onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2 text-slate-300">
                <Settings className="w-3.5 h-3.5" />
                <span>System Settings</span>
              </button>
              <hr className="border-[#232f48]/50 my-1" />
              <button onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800 flex items-center space-x-2 text-rose-400 font-medium">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
