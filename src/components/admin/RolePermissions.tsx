import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Check, X, Lock, Info } from 'lucide-react';
import { RolePermission } from '../../types';

export const RolePermissions: React.FC = () => {
  const { rolePermissions, updateRolePermission, currentUser } = useApp();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const permissionLabels: Record<keyof RolePermission['permissions'], string> = {
    manageUsers: 'Manage Users & Accounts',
    manageAdmins: 'Manage Administrators',
    reviewDocuments: 'Review & Verify Documents',
    deleteDocuments: 'Delete Documents & Files',
    manageSettings: 'Configure System Settings',
    manageFeatures: 'Toggle System Features',
    viewReports: 'Generate & Export Reports',
    viewActivityLogs: 'Access Security Audit Logs',
    manageBackups: 'Export & Restore Backups',
    accessAdminPortal: 'Access Admin Dashboard'
  };

  const permKeys = Object.keys(permissionLabels) as (keyof RolePermission['permissions'])[];

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 pb-24 text-slate-100">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Role-Based Access Control (RBAC)</h2>
        <p className="text-xs text-slate-400">
          Enforce strict permission policies across administrative and standard user tiers
        </p>
      </div>

      {!isSuperAdmin && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-400/30 text-amber-300 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Only Super Administrators can modify authorization flags. Current view is read-only.</span>
        </div>
      )}

      {/* Permissions Matrix */}
      <div className="rounded-3xl glass-obsidian-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 text-[11px] font-semibold tracking-wider uppercase">
              <tr>
                <th className="py-4 px-5">System Capability</th>
                {rolePermissions.map((rp) => (
                  <th key={rp.role} className="py-4 px-5 text-center">
                    <span className="block text-white font-bold">{rp.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-normal">[{rp.role}]</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {permKeys.map((key) => (
                <tr key={key} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5 font-medium text-slate-200">
                    {permissionLabels[key]}
                  </td>

                  {rolePermissions.map((rp) => {
                    const isGranted = rp.permissions[key];
                    const canEdit = isSuperAdmin && rp.role !== 'super_admin';

                    return (
                      <td key={rp.role} className="py-3.5 px-5 text-center">
                        {canEdit ? (
                          <button
                            onClick={() => updateRolePermission(rp.role, key, !isGranted)}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer ${
                              isGranted
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-500 hover:bg-slate-700 border border-slate-700'
                            }`}
                            title={`Toggle ${permissionLabels[key]} for ${rp.label}`}
                          >
                            {isGranted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </button>
                        ) : (
                          <span
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center ${
                              isGranted
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-white/[0.02] text-slate-600 border border-white/5'
                            }`}
                          >
                            {isGranted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
