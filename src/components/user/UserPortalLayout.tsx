import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserDashboard } from './UserDashboard';
import { UserProfile } from './UserProfile';
import { UserDocuments } from './UserDocuments';
import { UserNotifications } from './UserNotifications';
import { UserActivity } from './UserActivity';
import {
  LayoutDashboard,
  FolderLock,
  Award,
  User,
  Bell,
  History,
  ShieldAlert,
  LogOut,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { AMOS_EMBLEM_URL } from '../../data/mockData';

export const UserPortalLayout: React.FC = () => {
  const {
    currentUser,
    userTab,
    setUserTab,
    notifications,
    setPortalView,
    logout,
    setShowDigitalId
  } = useApp();

  if (!currentUser) return null;

  const unreadCount = notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length;

  const canAccessAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'admin' ||
    currentUser.role === 'staff';

  return (
    <div className="flex-1 flex flex-col min-h-full bg-slate-950 text-slate-100">
      {/* Top Mobile/App Header */}
      <header className="sticky top-0 z-30 h-14 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <img
            src={AMOS_EMBLEM_URL}
            alt="Amos Store"
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-lg object-cover border border-amber-400/40"
          />
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
              AMOS STORE
            </h1>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">USER PORTAL</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Switch to Admin Portal if privileged */}
          {canAccessAdmin && (
            <button
              onClick={() => setPortalView('admin')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/50 text-xs font-semibold transition-colors cursor-pointer"
              title="Access Admin Glassmorphism Portal"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Mode</span>
            </button>
          )}

          {/* Notifications Button */}
          <button
            onClick={() => setUserTab('notifications')}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
            title="Secure Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Tab Content Viewport */}
      <div className="flex-1 flex flex-col">
        {userTab === 'dashboard' && <UserDashboard />}
        {userTab === 'documents' && <UserDocuments />}
        {userTab === 'certificates' && <UserDocuments isCertificatesOnly={true} />}
        {userTab === 'profile' && <UserProfile />}
        {userTab === 'notifications' && <UserNotifications />}
        {userTab === 'activity' && <UserActivity />}
      </div>

      {/* Ergonomic Mobile Fixed Bottom Navigation Bar (Natural Thumb Zone) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/90 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
          <button
            onClick={() => setUserTab('dashboard')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              userTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Home</span>
          </button>

          <button
            onClick={() => setUserTab('documents')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              userTab === 'documents' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderLock className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Documents</span>
          </button>

          <button
            onClick={() => setUserTab('certificates')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              userTab === 'certificates' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Certificates</span>
          </button>

          <button
            onClick={() => setUserTab('activity')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              userTab === 'activity' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Activity</span>
          </button>

          <button
            onClick={() => setUserTab('profile')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              userTab === 'profile' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
