import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  FileCheck2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Activity,
  FileText,
  UserCheck,
  UserX,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    documents,
    activityLogs,
    setAdminTab,
    setSelectedDocForReview,
    setSelectedDocForView
  } = useApp();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const inactiveUsers = users.filter((u) => u.status === 'inactive').length;
  const suspendedUsers = users.filter((u) => u.status === 'suspended').length;

  const totalDocs = documents.length;
  const pendingDocs = documents.filter((d) => d.status === 'pending');
  const approvedDocs = documents.filter((d) => d.status === 'approved');
  const rejectedDocs = documents.filter((d) => d.status === 'rejected' || d.status === 'requires_correction');
  const adminCount = users.filter((u) => u.role === 'super_admin' || u.role === 'admin' || u.role === 'staff').length;

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 pb-24 text-slate-100">
      {/* Black Glassmorphism Header Hero */}
      <div className="relative rounded-3xl p-5 sm:p-6 glass-obsidian-card border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                BLACK GLASSMORPHISM CONTROL ENGINE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Administration Overview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Centralized monitoring, role-based governance, and document verification center
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setAdminTab('documents')}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-400/10 cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Review Queue ({pendingDocs.length})</span>
            </button>
            <button
              onClick={() => setAdminTab('users')}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Manage Users</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 Admin Statistics Cards Grid (Section 18) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Users */}
        <div
          onClick={() => setAdminTab('users')}
          className="p-3.5 rounded-2xl glass-obsidian-subtle border border-white/5 hover:border-white/15 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Total Users</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white font-mono">{totalUsers}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Registered records</span>
        </div>

        {/* Active Users */}
        <div
          onClick={() => setAdminTab('users')}
          className="p-3.5 rounded-2xl glass-obsidian-subtle border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-1.5">
            <span>Active Users</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">{activeUsers}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">In good standing</span>
        </div>

        {/* Inactive / Suspended */}
        <div
          onClick={() => setAdminTab('users')}
          className="p-3.5 rounded-2xl glass-obsidian-subtle border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-400 text-xs mb-1.5">
            <span>Suspended</span>
            <UserX className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-rose-400 font-mono">{suspendedUsers + inactiveUsers}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Access restricted</span>
        </div>

        {/* Total Documents */}
        <div
          onClick={() => setAdminTab('documents')}
          className="p-3.5 rounded-2xl glass-obsidian-subtle border border-white/5 hover:border-white/15 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Total Documents</span>
            <FileText className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white font-mono">{totalDocs}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Certificates & IDs</span>
        </div>

        {/* Pending Verification */}
        <div
          onClick={() => setAdminTab('documents')}
          className="p-3.5 rounded-2xl glass-obsidian-subtle border border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-400 text-xs mb-1.5">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 animate-pulse" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">{pendingDocs.length}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Awaiting admin review</span>
        </div>

        {/* Approved Documents */}
        <div
          onClick={() => setAdminTab('documents')}
          className="p-3.5 rounded-2xl glass-obsidian-subtle border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-1.5">
            <span>Approved Docs</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">{approvedDocs.length}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Cryptographically valid</span>
        </div>

        {/* Rejected Documents */}
        <div
          onClick={() => setAdminTab('documents')}
          className="p-3.5 rounded-2xl glass-obsidian-subtle border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-400 text-xs mb-1.5">
            <span>Rejected Docs</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-rose-400 font-mono">{rejectedDocs.length}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Notice sent to user</span>
        </div>

        {/* Administrators */}
        <div
          onClick={() => setAdminTab('administrators')}
          className="p-3.5 rounded-2xl glass-obsidian-subtle border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-cyan-400 text-xs mb-1.5">
            <span>Administrators</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">{adminCount}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">RBAC officers</span>
        </div>

        {/* System Activities */}
        <div
          onClick={() => setAdminTab('activities')}
          className="p-3.5 rounded-2xl glass-obsidian-subtle border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-purple-400 text-xs mb-1.5">
            <span>System Activities</span>
            <Activity className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-purple-400 font-mono">{activityLogs.length}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Audited operations</span>
        </div>

        {/* Verification Success Rate */}
        <div className="p-3.5 rounded-2xl glass-obsidian-subtle border border-white/5 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Approval Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white font-mono">
            {totalDocs > 0 ? Math.round((approvedDocs.length / totalDocs) * 100) : 0}%
          </p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Quality compliance</span>
        </div>
      </div>

      {/* Two Column Layout: Verification Queue + Live Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Verification Queue (Pending Reviews) */}
        <div className="p-5 rounded-3xl glass-obsidian-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Pending Document Queue</h3>
            </div>
            <button
              onClick={() => setAdminTab('documents')}
              className="text-xs text-amber-400 hover:underline cursor-pointer font-medium"
            >
              View all ({pendingDocs.length}) →
            </button>
          </div>

          {pendingDocs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 text-slate-400 text-xs">
              <ShieldCheck className="w-7 h-7 mx-auto mb-2 text-emerald-400 opacity-60" />
              <p className="font-semibold text-white">All documents verified!</p>
              <p className="text-[11px] mt-0.5">There are no pending submissions in the review pipeline.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDocs.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-400/30 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={doc.fileUrl}
                        alt={doc.documentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate text-xs">
                      <h4 className="font-semibold text-white truncate">{doc.documentName}</h4>
                      <p className="text-[11px] text-slate-400">
                        {doc.userFullName} · {doc.categoryLabel}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDocForReview(doc)}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent System Activity Stream */}
        <div className="p-5 rounded-3xl glass-obsidian-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Security & Audit Logs</h3>
            </div>
            <button
              onClick={() => setAdminTab('activities')}
              className="text-xs text-amber-400 hover:underline cursor-pointer font-medium"
            >
              Full log ({activityLogs.length}) →
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {activityLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{log.action}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                      [{log.userRole}]
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-snug">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
