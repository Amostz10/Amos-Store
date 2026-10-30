import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  ShieldCheck,
  Download,
  Trash2
} from 'lucide-react';
import { DocumentStatus } from '../../types';

export const DocumentVerification: React.FC = () => {
  const {
    documents,
    setSelectedDocForReview,
    setSelectedDocForView,
    updateDocumentStatus,
    deleteDocument
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter((doc) => {
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDocName = doc.documentName.toLowerCase().includes(q);
      const matchUserName = doc.userFullName.toLowerCase().includes(q);
      const matchDocNum = doc.documentNumber?.toLowerCase().includes(q);
      if (!matchDocName && !matchUserName && !matchDocNum) return false;
    }
    return true;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded-md">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'requires_correction':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3 h-3" /> Correction
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 pb-24 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Document & Certificate Verification</h2>
          <p className="text-xs text-slate-400">
            Audit user certificates, evaluate legal documentation, and record approval verdicts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-xl font-mono">
            Pending Queue: {documents.filter((d) => d.status === 'pending').length}
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document title or user name..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Statuses ({documents.length})</option>
            <option value="pending">Pending Review ({documents.filter((d) => d.status === 'pending').length})</option>
            <option value="approved">Approved ({documents.filter((d) => d.status === 'approved').length})</option>
            <option value="rejected">Rejected ({documents.filter((d) => d.status === 'rejected').length})</option>
            <option value="requires_correction">Correction Needed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] shrink-0">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="education">Education Certificates</option>
            <option value="personal">Personal Documents</option>
            <option value="professional">Professional Certificates</option>
            <option value="training">Training</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Verification List / Table */}
      <div className="rounded-3xl glass-obsidian-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 text-[11px] font-semibold tracking-wider uppercase">
              <tr>
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No documents found matching this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Title & Preview */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setSelectedDocForView(doc)}
                          className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 overflow-hidden shrink-0 cursor-pointer hover:border-amber-400 transition-colors"
                        >
                          <img src={doc.fileUrl} alt={doc.documentName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p
                            onClick={() => setSelectedDocForView(doc)}
                            className="font-semibold text-white hover:text-amber-300 transition-colors cursor-pointer"
                          >
                            {doc.documentName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {doc.documentNumber || 'No Ref Number'} · {(doc.fileSizeKb / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Submitter */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">{doc.userFullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{doc.userId}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {doc.categoryLabel}
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(doc.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDocForReview(doc)}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => setSelectedDocForView(doc)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Quick preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
