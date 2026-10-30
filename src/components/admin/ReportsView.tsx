import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  Users,
  FileCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { users, documents, activityLogs } = useApp();
  const [reportType, setReportType] = useState<'users' | 'documents' | 'activities'>('documents');

  const exportCsv = () => {
    let csvContent = '';

    if (reportType === 'users') {
      csvContent = 'ID,Full Name,Username,Email,Role,Status,Country,Joined\n';
      users.forEach((u) => {
        csvContent += `"${u.id}","${u.profile.fullName}","${u.username}","${u.email}","${u.role}","${u.status}","${u.profile.country}","${new Date(u.createdAt).toISOString()}"\n`;
      });
    } else if (reportType === 'documents') {
      csvContent = 'ID,Document Name,User,Category,Status,Number,Uploaded Date,Reviewed By\n';
      documents.forEach((d) => {
        csvContent += `"${d.id}","${d.documentName}","${d.userFullName}","${d.categoryLabel}","${d.status}","${d.documentNumber || ''}","${new Date(d.uploadedAt).toISOString()}","${d.reviewedBy || ''}"\n`;
      });
    } else {
      csvContent = 'ID,Timestamp,User,Role,Action,Details\n';
      activityLogs.forEach((l) => {
        csvContent += `"${l.id}","${new Date(l.timestamp).toISOString()}","${l.userName}","${l.userRole}","${l.action}","${l.details}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amos_store_${reportType}_report_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 pb-24 text-slate-100">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">System Reporting & Analytics</h2>
          <p className="text-xs text-slate-400">
            Generate executive compliance reports and tabular exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 max-w-md text-xs">
        <button
          onClick={() => setReportType('documents')}
          className={`flex-1 py-2 font-medium rounded-lg transition-colors cursor-pointer ${
            reportType === 'documents' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Document Verification
        </button>
        <button
          onClick={() => setReportType('users')}
          className={`flex-1 py-2 font-medium rounded-lg transition-colors cursor-pointer ${
            reportType === 'users' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          User Registrations
        </button>
        <button
          onClick={() => setReportType('activities')}
          className={`flex-1 py-2 font-medium rounded-lg transition-colors cursor-pointer ${
            reportType === 'activities' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Security Audit
        </button>
      </div>

      {/* Report Summary Cards */}
      {reportType === 'documents' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl glass-obsidian-subtle border border-white/5">
            <span className="text-slate-400 block mb-1">Total Vault Documents</span>
            <p className="text-2xl font-bold text-white font-mono">{documents.length}</p>
          </div>
          <div className="p-4 rounded-2xl glass-obsidian-subtle border border-emerald-500/20">
            <span className="text-emerald-400 block mb-1">Approved & Active</span>
            <p className="text-2xl font-bold text-emerald-400 font-mono">
              {documents.filter((d) => d.status === 'approved').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl glass-obsidian-subtle border border-amber-500/20">
            <span className="text-amber-400 block mb-1">Pending In Pipeline</span>
            <p className="text-2xl font-bold text-amber-400 font-mono">
              {documents.filter((d) => d.status === 'pending').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl glass-obsidian-subtle border border-rose-500/20">
            <span className="text-rose-400 block mb-1">Rejected / Correction</span>
            <p className="text-2xl font-bold text-rose-400 font-mono">
              {documents.filter((d) => d.status === 'rejected' || d.status === 'requires_correction').length}
            </p>
          </div>
        </div>
      )}

      {/* Detailed Report Table */}
      <div className="rounded-3xl glass-obsidian-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {reportType === 'documents' && 'Document Verification Audit Breakdown'}
            {reportType === 'users' && 'Registered Users Directory Report'}
            {reportType === 'activities' && 'Cryptographic System Audit Log Report'}
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Generated: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'documents' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4">Reviewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-white">{d.documentName}</td>
                    <td className="py-3 px-4 text-slate-300">{d.userFullName}</td>
                    <td className="py-3 px-4 text-slate-400">{d.categoryLabel}</td>
                    <td className="py-3 px-4 font-mono uppercase text-[11px]">{d.status}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{new Date(d.uploadedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-slate-400">{d.reviewedBy || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'users' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-white">{u.profile.fullName}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{u.email}</td>
                    <td className="py-3 px-4 uppercase text-[11px] font-mono">{u.role}</td>
                    <td className="py-3 px-4 text-[11px] font-medium">{u.status}</td>
                    <td className="py-3 px-4 text-slate-300">{u.profile.country}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'activities' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activityLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{l.userName}</td>
                    <td className="py-3 px-4 uppercase text-[10px] font-mono text-slate-400">[{l.userRole}]</td>
                    <td className="py-3 px-4 text-amber-300 font-medium">{l.action}</td>
                    <td className="py-3 px-4 text-slate-300">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
