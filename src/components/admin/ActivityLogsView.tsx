import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Search, Filter, ShieldCheck, Download } from 'lucide-react';

export const ActivityLogsView: React.FC = () => {
  const { activityLogs } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredLogs = activityLogs.filter((log) => {
    if (roleFilter !== 'all' && log.userRole !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchUser = log.userName.toLowerCase().includes(q);
      if (!matchAction && !matchDetails && !matchUser) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 pb-24 text-slate-100">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">System Security & Activity Audit Trail</h2>
        <p className="text-xs text-slate-400">
          Immutable logging of user authentication, document reviews, and administrative changes
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, keyword, or user..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] shrink-0">Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Log Feed */}
      <div className="rounded-3xl glass-obsidian-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between text-xs">
          <span className="font-semibold text-white">Audit Entries ({filteredLogs.length})</span>
          <span className="text-[11px] text-slate-400">Timestamp format: Local Device Time</span>
        </div>

        <div className="divide-y divide-white/5">
          {filteredLogs.length === 0 ? (
            <p className="py-12 text-center text-xs text-slate-500">No logs match criteria.</p>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{log.action}</span>
                    <span className="text-[10px] text-amber-400 font-mono">by {log.userName}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-slate-400">
                      {log.userRole}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{log.details}</p>
                  {log.ipAddress && (
                    <span className="text-[10px] text-slate-500 font-mono">Client IP: {log.ipAddress}</span>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
