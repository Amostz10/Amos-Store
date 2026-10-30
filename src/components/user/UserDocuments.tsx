import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Trash2,
  Award,
  Layers
} from 'lucide-react';
import { DocumentCategory, DocumentStatus } from '../../types';
import { UploadDocumentModal } from './UploadDocumentModal';

interface UserDocumentsProps {
  initialCategory?: DocumentCategory;
  isCertificatesOnly?: boolean;
}

export const UserDocuments: React.FC<UserDocumentsProps> = ({
  initialCategory,
  isCertificatesOnly = false
}) => {
  const {
    currentUser,
    documents,
    setSelectedDocForView,
    deleteDocument
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    isCertificatesOnly ? 'education' : initialCategory || 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (!currentUser) return null;

  // Filter user's documents
  const userDocs = documents.filter((d) => d.userId === currentUser.id);

  const filteredDocs = userDocs.filter((doc) => {
    // If certificates only page
    if (isCertificatesOnly && doc.category !== 'education' && doc.category !== 'professional' && doc.category !== 'training') {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatus !== 'all' && doc.status !== selectedStatus) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = doc.documentName.toLowerCase().includes(q);
      const matchNum = doc.documentNumber?.toLowerCase().includes(q);
      const matchCat = doc.categoryLabel.toLowerCase().includes(q);
      if (!matchName && !matchNum && !matchCat) return false;
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
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  const handleDownload = (e: React.MouseEvent, doc: any) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = `${doc.documentName.toLowerCase().replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this pending document from your vault?')) {
      deleteDocument(docId);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 pb-20">
      {/* Header & Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {isCertificatesOnly ? 'My Certificates Archive' : 'My Documents Vault'}
          </h2>
          <p className="text-xs text-slate-400">
            {isCertificatesOnly
              ? 'Academic degrees, diplomas, and certified technical qualifications'
              : 'Secure repository of official personal, educational, and professional records'}
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload {isCertificatesOnly ? 'Certificate' : 'Document'}</span>
        </button>
      </div>

      {/* Search & Category Tabs */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by document title, reference number, or category..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Category Tabs */}
          {!isCertificatesOnly ? (
            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-900 rounded-xl border border-slate-800 max-w-full">
              {[
                { id: 'all', label: 'All Files' },
                { id: 'education', label: 'Education' },
                { id: 'personal', label: 'Personal' },
                { id: 'professional', label: 'Professional' },
                { id: 'training', label: 'Training' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-900 rounded-xl border border-slate-800">
              {[
                { id: 'all', label: 'All Certificates' },
                { id: 'education', label: 'Academic Degrees' },
                { id: 'professional', label: 'Professional' },
                { id: 'training', label: 'Workshops' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="requires_correction">Requires Correction</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid / List */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No documents match criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting different filters, or upload a new certificate.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl text-xs cursor-pointer inline-flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocForView(doc)}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div>
                {/* Header: Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                    {doc.categoryLabel}
                  </span>
                  {getStatusBadge(doc.status)}
                </div>

                {/* Thumbnail & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={doc.fileUrl}
                      alt={doc.documentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {doc.documentName}
                    </h4>
                    {doc.documentNumber && (
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                        Ref: {doc.documentNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rejection / Correction alert message */}
                {doc.rejectionReason && (
                  <div className="mb-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-[11px] text-rose-300">
                    <span className="font-semibold block mb-0.5">Admin Note:</span>
                    <p className="line-clamp-2">{doc.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Card Footer: Metadata & Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDownload(e, doc)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Download document"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedDocForView(doc)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {doc.status === 'pending' && (
                    <button
                      onClick={(e) => handleDelete(e, doc.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete pending document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultCategory={isCertificatesOnly ? 'education' : 'education'}
      />
    </div>
  );
};
