import React from 'react';
import { useApp } from '../../context/AppContext';
import { History, Shield, UploadCloud, CheckCircle, Edit3, Key, LogIn, LogOut } from 'lucide-react';

export const UserActivity: React.FC = () => {
  const { currentUser, activityLogs } = useApp();

  if (!currentUser) return null;

  // Filter logs for this user
  const userLogs = activityLogs.filter((log) => log.userId === currentUser.id);

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'document upload':
        return <UploadCloud className="w-4 h-4 text-amber-400" />;
      case 'document approval':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'profile update':
        return <Edit3 className="w-4 h-4 text-cyan-400" />;
      case 'user authentication':
        return <LogIn className="w-4 h-4 text-blue-400" />;
      case 'user logout':
        return <LogOut className="w-4 h-4 text-slate-400" />;
      case 'password reset':
        return <Key className="w-4 h-4 text-purple-400" />;
      default:
        return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 pb-20">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Account Activity History</h2>
        <p className="text-xs text-slate-400">
          Cryptographically audited activity records for {currentUser.profile.fullName}
        </p>
      </div>

      {userLogs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
          <History className="w-8 h-8 mx-auto opacity-40 mb-2" />
          <h4 className="font-semibold text-white">No activity logged</h4>
          <p>Actions performed on your account will appear here in chronological order.</p>
        </div>
      ) : (
        <div className="relative border-l border-slate-800 ml-4 space-y-6">
          {userLogs.map((log) => (
            <div key={log.id} className="relative pl-6 group">
              {/* Timeline marker icon */}
              <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xs">
                {getActionIcon(log.action)}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-white">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{log.details}</p>
                {log.ipAddress && (
                  <p className="text-[10px] text-slate-500 font-mono mt-1">IP: {log.ipAddress}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
