import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { markAsRead, markAllAsRead } from '../../services/notificationService';
import { getRelativeTime } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const { user } = useAuth();
  const { getUserNotifications, getUnread, refresh } = useAppData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const notifications = user ? getUserNotifications(user.id) : [];
  const unreadCount = user ? getUnread(user.id) : 0;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (notif) => {
    markAsRead(notif.id);
    refresh();
    setOpen(false);
    if (notif.scheduleId) {
      navigate(`/schedule/${notif.scheduleId}`);
    }
  };

  const handleMarkAll = () => {
    if (user) {
      markAllAsRead(user.id);
      refresh();
    }
  };

  const typeColors = {
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    REVISION_REQUIRED: 'bg-orange-100 text-orange-700',
    NEW_SUBMISSION: 'bg-blue-100 text-blue-700',
    NEW_ACTIVITY: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fadeIn">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifikasi</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <CheckCheck size={14} /> Tandai semua
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">Tidak ada notifikasi</div>
            ) : (
              notifications.slice(0, 10).map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 px-1.5 py-0.5 rounded text-xs font-semibold shrink-0 ${typeColors[notif.type] || 'bg-gray-100 text-gray-600'}`}>
                      {notif.type === 'APPROVED' ? '✓' :
                       notif.type === 'REJECTED' ? '✕' :
                       notif.type === 'REVISION_REQUIRED' ? '↩' : '●'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{getRelativeTime(notif.createdAt)}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

