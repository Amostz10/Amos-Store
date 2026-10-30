import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { UserManagement } from './UserManagement';
import { DocumentVerification } from './DocumentVerification';
import { AdminManagement } from './AdminManagement';
import { RolePermissions } from './RolePermissions';
import { ReportsView } from './ReportsView';
import { ActivityLogsView } from './ActivityLogsView';
import { FeatureManagement } from './FeatureManagement';
import { SystemSettingsView } from './SystemSettingsView';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  ShieldAlert,
  KeyRound,
  BarChart3,
  Activity,
  Sliders,
  Settings,
  LogOut,
  User,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { AMOS_EMBLEM_URL } from '../../data/mockData';

export const AdminPortalLayout: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setPortalView,
    logout,
    currentUser,
    documents
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  const pendingCount = documents.filter((d) => d.status === 'pending').length;

  const navItems: { id: typeof adminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'User Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'documents', label: 'Verification', icon: <FileCheck2 className="w-4 h-4" />, badge: pendingCount },
    { id: 'administrators', label: 'Admins', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'roles', label: 'RBAC Roles', icon: <KeyRound className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'activities', label: 'Security Audit', icon: <Activity className="w-4 h-4" /> },
    { id: 'features', label: 'Features', icon: <Sliders className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Vault', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-full bg-slate-950 text-slate-100">
      {/* Top Black Glassmorphism Bar */}
      <header className="sticky top-0 z-30 h-14 glass-obsidian border-b border-white/10 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <img
            src={AMOS_EMBLEM_URL}
            alt="Amos Store"
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-lg object-cover border border-amber-400/40"
          />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <h1 className="text-sm font-bold text-white tracking-tight">AMOS STORE</h1>
              <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Logged in: {currentUser.profile.fullName.split(' ')[0]} ({currentUser.role})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Switch to User Portal View */}
          <button
            onClick={() => setPortalView('user')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-colors cursor-pointer"
            title="Switch to User Portal View"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">User Portal</span>
          </button>

          {/* Mobile navigation toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
            title="Secure Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Horizontal Tab Navigation Bar (Black Glassmorphism) */}
      <div className="hidden sm:block glass-obsidian border-b border-white/5 px-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 py-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                adminTab === item.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    adminTab === item.id
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu (When open on narrow screen) */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-obsidian border-b border-white/10 p-3 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setAdminTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
                adminTab === item.id
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] bg-amber-400 text-slate-950 font-mono font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Tab Content Viewport */}
      <div className="flex-1 flex flex-col">
        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'users' && <UserManagement />}
        {adminTab === 'documents' && <DocumentVerification />}
        {adminTab === 'administrators' && <AdminManagement />}
        {adminTab === 'roles' && <RolePermissions />}
        {adminTab === 'reports' && <ReportsView />}
        {adminTab === 'activities' && <ActivityLogsView />}
        {adminTab === 'features' && <FeatureManagement />}
        {adminTab === 'settings' && <SystemSettingsView />}
      </div>

      {/* Mobile Thumb Fixed Bottom Navigation for Admin Mode */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass-obsidian border-t border-white/10 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-1">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              adminTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Overview</span>
          </button>

          <button
            onClick={() => setAdminTab('documents')}
            className={`min-h-[48px] relative flex flex-col items-center justify-center transition-colors cursor-pointer ${
              adminTab === 'documents' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Verify</span>
            {pendingCount > 0 && (
              <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => setAdminTab('users')}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              adminTab === 'users' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Users</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              mobileMenuOpen ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
