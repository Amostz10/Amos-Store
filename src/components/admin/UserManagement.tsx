import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Key,
  Trash2,
  Edit2,
  FileText,
  Shield,
  Eye,
  X,
  Lock
} from 'lucide-react';
import { UserAccount, UserRole, UserStatus } from '../../types';

export const UserManagement: React.FC = () => {
  const {
    users,
    documents,
    setUserAccountStatus,
    deleteUserAccount,
    resetUserPassword,
    addNewUserByAdmin,
    setSelectedDocForView,
    updateUserAccount
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [inspectingUserDocs, setInspectingUserDocs] = useState<UserAccount | null>(null);
  const [passwordResetNotice, setPasswordResetNotice] = useState<{ name: string; token: string } | null>(null);

  // Add User Form State
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    role: 'user' as UserRole,
    status: 'active' as UserStatus,
    occupation: 'Professional',
    country: 'United States'
  });

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.profile.fullName.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchUsername = u.username.toLowerCase().includes(q);
      const matchPhone = u.profile.phone.toLowerCase().includes(q);
      const matchId = u.id.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchUsername && !matchPhone && !matchId) return false;
    }
    return true;
  });

  const handleResetPassword = (user: UserAccount) => {
    const tempPass = resetUserPassword(user.id);
    setPasswordResetNotice({ name: user.profile.fullName, token: tempPass });
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.fullName || !newUserForm.email || !newUserForm.username) return;

    addNewUserByAdmin({
      username: newUserForm.username.toLowerCase(),
      email: newUserForm.email.toLowerCase(),
      role: newUserForm.role,
      status: newUserForm.status,
      profile: {
        fullName: newUserForm.fullName,
        phone: newUserForm.phone || '+1 (555) 123-4567',
        occupation: newUserForm.occupation,
        country: newUserForm.country
      }
    });

    setIsAddUserModalOpen(false);
    setNewUserForm({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      occupation: 'Professional',
      country: 'United States'
    });
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUserAccount(editingUser.id, {
      role: editingUser.role,
      status: editingUser.status,
      profile: {
        ...editingUser.profile,
        fullName: editingUser.profile.fullName,
        phone: editingUser.profile.phone,
        occupation: editingUser.profile.occupation
      }
    });

    setEditingUser(null);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 pb-24 text-slate-100">
      {/* Header & Add User CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">User Account Management</h2>
          <p className="text-xs text-slate-400">
            Control permissions, monitor account states, and manage personal data records
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Password Reset Notice Banner */}
      {passwordResetNotice && (
        <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Temporary Password Issued for {passwordResetNotice.name}</p>
              <p className="text-amber-300 font-mono mt-0.5">
                Token: <span className="bg-slate-900 px-2 py-0.5 rounded text-white font-bold">{passwordResetNotice.token}</span> (Advise user to change upon next login)
              </p>
            </div>
          </div>
          <button
            onClick={() => setPasswordResetNotice(null)}
            className="p-1 rounded-lg hover:bg-amber-400/20 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Search */}
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone, ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] shrink-0">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">Standard User</option>
            <option value="admin">Administrator</option>
            <option value="super_admin">Super Admin</option>
            <option value="staff">Staff Member</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table / Mobile Cards */}
      <div className="rounded-3xl glass-obsidian-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 text-[11px] font-semibold tracking-wider uppercase">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No users found matching query criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const userDocCount = documents.filter((d) => d.userId === u.id).length;
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                            <img
                              src={u.profile.profilePhotoUrl}
                              alt={u.profile.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{u.profile.fullName}</p>
                            <p className="text-[11px] text-slate-400">
                              @{u.username} · {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-slate-300 font-mono">
                          {u.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {u.status === 'active' && (
                          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                            Active
                          </span>
                        )}
                        {u.status === 'suspended' && (
                          <span className="text-[11px] font-medium text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
                            Suspended
                          </span>
                        )}
                        {u.status === 'inactive' && (
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Documents Count */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setInspectingUserDocs(u)}
                          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{userDocCount} files</span>
                        </button>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Active / Suspend */}
                          {u.status === 'active' ? (
                            <button
                              onClick={() => setUserAccountStatus(u.id, 'suspended')}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Suspend account"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setUserAccountStatus(u.id, 'active')}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-950 text-slate-400 hover:text-emerald-400 transition-colors"
                              title="Activate account"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Reset Password */}
                          <button
                            onClick={() => handleResetPassword(u)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-400/20 text-slate-400 hover:text-amber-400 transition-colors"
                            title="Reset password"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Edit user details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => {
                              if (confirm(`Delete account for ${u.profile.fullName}? All associated documents will also be removed.`)) {
                                deleteUserAccount(u.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Create New User Account</h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Username *</label>
                  <input
                    type="text"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    placeholder="e.g. jdoe"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="jdoe@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">Administrator</option>
                    <option value="staff">Staff Member</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Initial Status</label>
                  <select
                    value={newUserForm.status}
                    onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value as UserStatus })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Edit User: {editingUser.profile.fullName}</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.profile.fullName}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      profile: { ...editingUser.profile, fullName: e.target.value }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">Administrator</option>
                    <option value="staff">Staff Member</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.profile.phone}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      profile: { ...editingUser.profile, phone: e.target.value }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect User's Stored Documents Modal */}
      {inspectingUserDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Vault Documents for {inspectingUserDocs.profile.fullName}
                </h3>
                <p className="text-xs text-slate-400">Total stored files: {documents.filter((d) => d.userId === inspectingUserDocs.id).length}</p>
              </div>
              <button
                onClick={() => setInspectingUserDocs(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {documents.filter((d) => d.userId === inspectingUserDocs.id).length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No documents uploaded by this user.</p>
              ) : (
                documents
                  .filter((d) => d.userId === inspectingUserDocs.id)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                          <img src={doc.fileUrl} alt={doc.documentName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{doc.documentName}</p>
                          <p className="text-[11px] text-slate-400">{doc.categoryLabel} · Status: {doc.status}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setInspectingUserDocs(null);
                          setSelectedDocForView(doc);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                      >
                        Inspect
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
