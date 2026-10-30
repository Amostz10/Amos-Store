import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Bell,
  Sparkles,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { UploadDocumentModal } from './UploadDocumentModal';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    documents,
    notifications,
    calculateProfileCompletion,
    setUserTab,
    setSelectedDocForView,
    setShowDigitalId
  } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (!currentUser) return null;

  const userDocs = documents.filter((d) => d.userId === currentUser.id);
  const approvedDocs = userDocs.filter((d) => d.status === 'approved');
  const pendingDocs = userDocs.filter((d) => d.status === 'pending');
  const rejectedDocs = userDocs.filter((d) => d.status === 'rejected' || d.status === 'requires_correction');
  const unreadNotifs = notifications.filter((n) => n.userId === currentUser.id && !n.isRead);

  const completionPct = calculateProfileCompletion(currentUser);

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 pb-20">
      {/* Top Welcome & Profile Card */}
      <div className="relative rounded-2xl p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* User Avatar & Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-md bg-slate-950">
                <img
                  src={currentUser.profile.profilePhotoUrl}
                  alt={currentUser.profile.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold ring-2 ring-slate-900">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Welcome, {currentUser.profile.fullName.split(' ')[0]}
                </h2>
                <span className="text-[11px] font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                  Verified User
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.profile.occupation} · {currentUser.profile.institution}
              </p>
            </div>
          </div>

          {/* Quick Digital ID Button */}
          <button
            onClick={() => setShowDigitalId(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-xs font-semibold text-amber-300 border border-amber-400/30 transition-all hover:scale-[1.02] shadow-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>Digital ID Card</span>
          </button>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Profile Completion Status</span>
            <span className="text-amber-400 font-bold font-mono">{completionPct}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          {completionPct < 100 && (
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
              <span>Add secondary contact and certificates to reach 100% verified status.</span>
              <button
                onClick={() => setUserTab('profile')}
                className="text-amber-400 hover:underline font-medium text-[11px] ml-2 shrink-0 cursor-pointer"
              >
                Complete Profile →
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Unread Notifications Strip */}
      {unreadNotifs.length > 0 && (
        <div
          onClick={() => setUserTab('notifications')}
          className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-between text-xs cursor-pointer hover:bg-amber-400/15 transition-colors"
        >
          <div className="flex items-center gap-2.5 text-amber-300">
            <Bell className="w-4 h-4 shrink-0 text-amber-400 animate-bounce" />
            <span className="font-medium">
              You have {unreadNotifs.length} new notification{unreadNotifs.length > 1 ? 's' : ''}:{' '}
              <span className="text-white font-normal">{unreadNotifs[0].title}</span>
            </span>
          </div>
          <span className="text-amber-400 text-xs font-semibold shrink-0">View all →</span>
        </div>
      )}

      {/* Key Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setUserTab('documents')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span>Total Documents</span>
            <FileText className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{userDocs.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Stored in vault</span>
        </div>

        <div
          onClick={() => setUserTab('documents')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-800/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{approvedDocs.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Verified by admin</span>
        </div>

        <div
          onClick={() => setUserTab('documents')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-800/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span>Pending Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-blue-400 font-mono">{pendingDocs.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Under evaluation</span>
        </div>

        <div
          onClick={() => setUserTab('documents')}
          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-800/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span>Attention</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono">{rejectedDocs.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Action needed</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="p-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>

        <button
          onClick={() => setUserTab('certificates')}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>My Certificates</span>
        </button>

        <button
          onClick={() => setUserTab('profile')}
          className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Manage Profile</span>
        </button>
      </div>

      {/* Recent Uploaded Documents Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Recent Stored Documents</h3>
          <button
            onClick={() => setUserTab('documents')}
            className="text-xs text-amber-400 hover:underline font-medium cursor-pointer"
          >
            View all ({userDocs.length}) →
          </button>
        </div>

        {userDocs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-white">No documents uploaded yet</p>
            <p className="mt-1">Upload your academic certificates and identification to store them safely.</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-3 px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs cursor-pointer"
            >
              Upload First Document
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {userDocs.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocForView(doc)}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={doc.fileUrl}
                      alt={doc.documentName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                      {doc.documentName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {doc.categoryLabel} · {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {doc.status === 'approved' && (
                    <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                  )}
                  {doc.status === 'pending' && (
                    <span className="text-[11px] font-medium text-blue-400 flex items-center gap-1 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/40">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                  {doc.status === 'rejected' && (
                    <span className="text-[11px] font-medium text-rose-400 flex items-center gap-1 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
                      <AlertTriangle className="w-3 h-3" /> Action Needed
                    </span>
                  )}
                  {doc.status === 'requires_correction' && (
                    <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                      <AlertTriangle className="w-3 h-3" /> Correction
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};
