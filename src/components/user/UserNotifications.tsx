import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, CheckCircle2, AlertTriangle, XCircle, Info, FileText } from 'lucide-react';

export const UserNotifications: React.FC = () => {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedDocForView,
    documents
  } = useApp();

  if (!currentUser) return null;

  const userNotifs = notifications.filter((n) => n.userId === currentUser.id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.documentId) {
      const doc = documents.find((d) => d.id === notif.documentId);
      if (doc) {
        setSelectedDocForView(doc);
      }
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">System Notifications</h2>
          <p className="text-xs text-slate-400">Updates regarding document reviews, account changes, and system alerts</p>
        </div>

        {userNotifs.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications Feed */}
      {userNotifs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-2">
          <Bell className="w-8 h-8 mx-auto opacity-40 text-slate-500" />
          <h4 className="font-semibold text-white">No notifications</h4>
          <p>You're all caught up! You'll receive updates when your documents are verified.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                notif.isRead
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                  : 'bg-slate-900 border-amber-400/30 shadow-md text-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(notif.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold leading-tight">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{notif.message}</p>

                  {notif.documentId && (
                    <div className="pt-1.5 flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                      <FileText className="w-3 h-3" />
                      <span>Tap to view referenced document</span>
                    </div>
                  )}
                </div>

                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
