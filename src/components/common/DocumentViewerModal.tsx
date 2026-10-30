import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, FileText, Calendar, CheckCircle2, Clock, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export const DocumentViewerModal: React.FC = () => {
  const { selectedDocForView, setSelectedDocForView } = useApp();

  if (!selectedDocForView) return null;

  const doc = selectedDocForView;

  const getStatusBadge = () => {
    switch (doc.status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2.5 py-1 rounded-md">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'requires_correction':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-md">
            <AlertTriangle className="w-3.5 h-3.5" /> Requires Correction
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  const handleDownload = () => {
    // Creates a download trigger
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = `${doc.documentName.toLowerCase().replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">
                {doc.documentName}
              </h3>
              <p className="text-xs text-slate-400">
                {doc.categoryLabel} · Owner: {doc.userFullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Download Document"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDocForView(null)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Document Preview Frame */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[260px] group">
            <img
              src={doc.fileUrl}
              alt={doc.documentName}
              referrerPolicy="no-referrer"
              className="w-full max-h-[380px] object-contain rounded-lg shadow-md"
            />
            <div className="absolute top-3 right-3">
              {getStatusBadge()}
            </div>
          </div>

          {/* Rejection / Correction Banner */}
          {doc.rejectionReason && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                Administrator Feedback:
              </div>
              <p>{doc.rejectionReason}</p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Document Number</span>
              <span className="font-mono text-slate-200 font-medium">{doc.documentNumber || 'N/A'}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Issue Date</span>
              <span className="text-slate-200 font-medium">{doc.issueDate || 'Undated'}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Expiry Date</span>
              <span className="text-slate-200 font-medium">{doc.expiryDate || 'No Expiry'}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">File Size</span>
              <span className="font-mono text-slate-200 font-medium">{(doc.fileSizeKb / 1024).toFixed(2)} MB</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Uploaded On</span>
              <span className="text-slate-200 font-medium">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Verified By</span>
              <span className="text-slate-200 font-medium">{doc.reviewedBy || 'Pending'}</span>
            </div>
          </div>

          {/* Description */}
          {doc.description && (
            <div className="text-xs text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1 font-medium">Notes / Description:</span>
              <p>{doc.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Vault Encrypted Document ID: {doc.id}</span>
          </div>
          <button
            onClick={() => setSelectedDocForView(null)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
