import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, UserPlus, Shield, Key, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { UserAccount, UserRole, UserStatus } from '../../types';

export const AdminManagement: React.FC = () => {
  const {
    users,
    currentUser,
    addNewUserByAdmin,
    setUserAccountStatus,
    resetUserPassword,
    deleteUserAccount,
    updateUserAccount
  } = useApp();

  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    role: 'admin' as UserRole
  });
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Filter users with administrative roles
  const admins = users.filter(
    (u) => u.role === 'super_admin' || u.role === 'admin' || u.role === 'staff'
  );

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminForm.fullName || !newAdminForm.email || !newAdminForm.username) return;

    addNewUserByAdmin({
      username: newAdminForm.username.toLowerCase(),
      email: newAdminForm.email.toLowerCase(),
      role: newAdminForm.role,
      status: 'active',
      profile: {
        fullName: newAdminForm.fullName,
        phone: newAdminForm.phone || '+1 (555) 200-3000',
        occupation: 'Systems Administrator',
        country: 'United States'
      }
    });

    setIsAddAdminOpen(false);
    setNewAdminForm({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      role: 'admin'
    });
  };

  const handlePasswordReset = (userId: string, name: string) => {
    const token = resetUserPassword(userId);
    setResetToken(`Temporary token for ${name}: ${token}`);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 pb-24 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Administrator Governance</h2>
          <p className="text-xs text-slate-400">
            Super Administrator privilege management, role delegations, and security monitors
          </p>
        </div>

        <button
          onClick={() => setIsAddAdminOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Administrator</span>
        </button>
      </div>

      {resetToken && (
        <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs flex items-center justify-between">
          <span className="font-mono">{resetToken}</span>
          <button onClick={() => setResetToken(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admins Table */}
      <div className="rounded-3xl glass-obsidian-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 text-[11px] font-semibold tracking-wider uppercase">
              <tr>
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Role Assigned</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                        <img src={adm.profile.profilePhotoUrl} alt={adm.profile.fullName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{adm.profile.fullName}</p>
                        <p className="text-[11px] text-slate-400">@{adm.username} · {adm.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${
                      adm.role === 'super_admin'
                        ? 'bg-purple-950/60 border-purple-800/60 text-purple-300'
                        : adm.role === 'admin'
                        ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {adm.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {adm.status === 'active' ? (
                      <span className="text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                        Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
                        Disabled
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {adm.lastLogin ? new Date(adm.lastLogin).toLocaleDateString() : 'Recent'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handlePasswordReset(adm.id, adm.profile.fullName)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-400/20 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Reset credentials"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>

                      {adm.status === 'active' ? (
                        <button
                          onClick={() => setUserAccountStatus(adm.id, 'inactive')}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Disable admin"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setUserAccountStatus(adm.id, 'active')}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-950 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Enable admin"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {adm.id !== currentUser?.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove admin account for ${adm.profile.fullName}?`)) {
                              deleteUserAccount(adm.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove admin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Provision New Administrator</h3>
              <button onClick={() => setIsAddAdminOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAdminSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newAdminForm.fullName}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, fullName: e.target.value })}
                  placeholder="e.g. Officer Alex Vance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Username *</label>
                <input
                  type="text"
                  value={newAdminForm.username}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                  placeholder="e.g. avance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Email *</label>
                <input
                  type="email"
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  placeholder="avance@amosstore.io"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Administrative Role *</label>
                <select
                  value={newAdminForm.role}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value as UserRole })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="admin">Administrator (User & Document Management)</option>
                  <option value="staff">Staff Member (Queue & View Access)</option>
                  <option value="super_admin">Super Administrator (Full System Control)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAdminOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                >
                  Confirm Provisioning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
