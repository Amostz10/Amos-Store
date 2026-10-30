import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, XCircle, AlertTriangle, FileText, User, Calendar, ShieldCheck, Eye } from 'lucide-react';

export const DocumentReviewModal: React.FC = () => {
  const {
    selectedDocForReview,
    setSelectedDocForReview,
    updateDocumentStatus,
    currentUser
  } = useApp();

  const [decision, setDecision] = useState<'approve' | 'reject' | 'correction' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [errorText, setErrorText] = useState('');

  if (!selectedDocForReview) return null;

  const doc = selectedDocForReview;

  const handleAction = (status: 'approved' | 'rejected' | 'requires_correction') => {
    if ((status === 'rejected' || status === 'requires_correction') && !rejectionReason.trim()) {
      setErrorText('Please provide a specific feedback reason for the user.');
      return;
    }

    updateDocumentStatus(doc.id, status, rejectionReason.trim());
    setSelectedDocForReview(null);
    setDecision(null);
    setRejectionReason('');
    setErrorText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Administrator Document Verification</h3>
              <p className="text-xs text-slate-400">Reviewing: {doc.documentName}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedDocForReview(null);
              setDecision(null);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Document Visual Preview */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">Uploaded Document Preview</span>
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[260px] p-2">
                <img
                  src={doc.fileUrl}
                  alt={doc.documentName}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[320px] object-contain rounded-lg shadow-inner"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>File Size: {(doc.fileSizeKb / 1024).toFixed(2)} MB</span>
                <span>Type: {doc.fileType}</span>
              </div>
            </div>

            {/* Right: User & Document Details */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Submitting User</span>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-xs">
                    {doc.userFullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{doc.userFullName}</p>
                    <p className="text-slate-400">User ID: {doc.userId}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Category</span>
                  <span className="font-medium text-slate-200">{doc.categoryLabel}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Document Number</span>
                  <span className="font-mono text-slate-200">{doc.documentNumber || 'None'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Issue Date</span>
                  <span className="text-slate-200">{doc.issueDate || 'N/A'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Expiry Date</span>
                  <span className="text-slate-200">{doc.expiryDate || 'N/A'}</span>
                </div>
              </div>

              {doc.description && (
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400 block mb-1">User Notes</span>
                  <p className="text-slate-300">{doc.description}</p>
                </div>
              )}

              {/* Status Decision Box */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-white block mb-2">Select Verification Action</span>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    onClick={() => {
                      setDecision('approve');
                      setErrorText('');
                    }}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      decision === 'approve'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>

                  <button
                    onClick={() => {
                      setDecision('correction');
                      setErrorText('');
                    }}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      decision === 'correction'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/50'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Correction
                  </button>

                  <button
                    onClick={() => {
                      setDecision('reject');
                      setErrorText('');
                    }}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      decision === 'reject'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                        : 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/50'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>

                {/* Reason field (required for reject / correction) */}
                {(decision === 'reject' || decision === 'correction') && (
                  <div className="space-y-1.5 animate-in fade-in">
                    <label className="text-[11px] font-medium text-slate-300 block">
                      {decision === 'reject' ? 'Rejection Reason (Required)' : 'Correction Instructions (Required)'}
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => {
                        setRejectionReason(e.target.value);
                        setErrorText('');
                      }}
                      placeholder={
                        decision === 'reject'
                          ? 'e.g. Image is not clear. Please upload a better high-resolution copy with all 4 corners visible.'
                          : 'e.g. Expiry date entered does not match certificate text. Please update.'
                      }
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                    />
                    {errorText && <p className="text-[11px] text-rose-400">{errorText}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Reviewer: <span className="text-white font-medium">{currentUser?.profile.fullName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedDocForReview(null);
                setDecision(null);
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {decision === 'approve' && (
              <button
                onClick={() => handleAction('approved')}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-slate-950 transition-colors cursor-pointer shadow-sm"
              >
                Confirm Approval
              </button>
            )}

            {decision === 'correction' && (
              <button
                onClick={() => handleAction('requires_correction')}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-xs font-semibold text-slate-950 transition-colors cursor-pointer shadow-sm"
              >
                Send Correction Request
              </button>
            )}

            {decision === 'reject' && (
              <button
                onClick={() => handleAction('rejected')}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white transition-colors cursor-pointer shadow-sm"
              >
                Confirm Rejection
              </button>
            )}

            {!decision && (
              <span className="text-xs text-slate-500 italic">Select an action above</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
