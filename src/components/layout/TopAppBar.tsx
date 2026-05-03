import { useState, useRef, useEffect } from 'react';
import { Settings, Bell, User, Trash2, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';

interface TopAppBarProps {
  userImage?: string;
  userName?: string;
  notifications?: Notification[];
  onDeleteNotification?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export default function TopAppBar({ 
  userImage = "https://lh3.googleusercontent.com/a/default-user", 
  userName = "JD",
  notifications = [],
  onDeleteNotification,
  onMarkAsRead,
  onProfileClick,
  onSettingsClick
}: TopAppBarProps) {
  const { t, n } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-surface-container-lowest border-b border-outline-variant">
      <div className="flex items-center gap-3">
        <button 
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden border border-outline-variant hover:ring-2 hover:ring-primary/20 transition-all active:scale-95"
        >
          {userImage ? (
            <img 
              src={userImage} 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold">{userName.charAt(0)}</div>
          )}
        </button>
        <span className="text-lg font-bold text-primary">Civic Hub</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 relative" ref={panelRef}>
        <button 
          onClick={onSettingsClick}
          className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
        >
          <Settings className="w-6 h-6 text-primary" />
        </button>

        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-full hover:bg-surface-container-low transition-colors relative"
        >
          <Bell className="w-6 h-6 text-primary" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-error text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
              {n(unreadCount)}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-14 w-[320px] sm:w-[380px] bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
                <h3 className="font-bold text-primary">{t('notif.title')}</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-surface-container rounded-full"
                >
                  <X className="w-4 h-4 text-outline" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-on-surface-variant">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">{t('notif.empty')}</p>
                    <p className="text-xs mt-1">{t('notif.emptyDesc')}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-outline-variant">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-4 hover:bg-surface transition-colors cursor-default group ${!notif.isRead ? 'bg-primary/5' : ''}`}
                        onClick={() => onMarkAsRead?.(notif.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-1 p-2 rounded-full ${!notif.isRead ? 'bg-primary text-white' : 'bg-surface-container text-outline'}`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <p className="font-bold text-sm text-primary truncate">{notif.title}</p>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteNotification?.(notif.id);
                                }}
                                className="p-1.5 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-outline mt-2 font-medium">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 bg-surface-container-lowest border-t border-outline-variant text-center">
                  <button 
                    className="text-xs font-bold text-primary hover:underline"
                    onClick={() => notifications.forEach(n => onDeleteNotification?.(n.id))}
                  >
                    {t('notif.clearAll')}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
