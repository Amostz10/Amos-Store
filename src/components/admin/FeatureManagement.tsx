import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, CheckCircle2, Shield, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { FeatureFlags } from '../../types';

export const FeatureManagement: React.FC = () => {
  const { features, toggleFeature, currentUser } = useApp();

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const moduleDefinitions: {
    key: keyof FeatureFlags;
    title: string;
    description: string;
    status: boolean;
    tag: string;
  }[] = [
    {
      key: 'userRegistration',
      title: 'Public User Registration',
      description: 'Allow new visitors to register accounts from the authentication portal.',
      status: features.userRegistration,
      tag: 'Core Identity'
    },
    {
      key: 'documents',
      title: 'Document Management Engine',
      description: 'Permit users to upload, store, and categorize personal and official documents.',
      status: features.documents,
      tag: 'Core Storage'
    },
    {
      key: 'certificates',
      title: 'Academic & Professional Certificates',
      description: 'Dedicated certificate management module for diplomas, degrees, and accreditations.',
      status: features.certificates,
      tag: 'Certificates'
    },
    {
      key: 'notifications',
      title: 'In-App Notification Dispatcher',
      description: 'Send instant alerts to users upon document approval, rejection, or system updates.',
      status: features.notifications,
      tag: 'Messaging'
    },
    {
      key: 'reports',
      title: 'Reporting & Analytics System',
      description: 'Generate compliance reports, registration timelines, and CSV export capabilities.',
      status: features.reports,
      tag: 'Auditing'
    },
    {
      key: 'digitalIdCard',
      title: 'Digital ID Card Generation',
      description: 'Issue official Amos Store verified digital identity cards to qualified users.',
      status: features.digitalIdCard,
      tag: 'Verification'
    },
    {
      key: 'qrVerification',
      title: 'QR Code Instant Verification',
      description: 'Provide machine-readable QR codes on digital IDs for instant validation.',
      status: features.qrVerification,
      tag: 'Verification'
    },
    {
      key: 'messaging',
      title: 'Internal User-Admin Messaging',
      description: 'Direct communication channel between users and document review staff.',
      status: features.messaging,
      tag: 'Future-Ready'
    },
    {
      key: 'appointments',
      title: 'Physical Verification Appointments',
      description: 'Booking schedule for in-person original document verification.',
      status: features.appointments,
      tag: 'Future-Ready'
    },
    {
      key: 'payments',
      title: 'Certification Verification Fees',
      description: 'Accept online payments for expedited certificate verification and processing.',
      status: features.payments,
      tag: 'Future-Ready'
    }
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 pb-24 text-slate-100">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">System Feature Management</h2>
        <p className="text-xs text-slate-400">
          Super Administrator modular switchboard to activate or deactivate platform capabilities
        </p>
      </div>

      {!isSuperAdmin && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-400/30 text-amber-300 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Only Super Administrators can toggle feature modules. Current view is read-only.</span>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moduleDefinitions.map((mod) => (
          <div
            key={mod.key}
            className={`p-4 rounded-3xl border transition-all ${
              mod.status
                ? 'glass-obsidian-card border-amber-400/20'
                : 'bg-slate-900/40 border-slate-800/80 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block mb-0.5">
                  {mod.tag}
                </span>
                <h4 className="text-sm font-semibold text-white">{mod.title}</h4>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                disabled={!isSuperAdmin}
                onClick={() => toggleFeature(mod.key)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mod.status
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                } disabled:cursor-not-allowed`}
              >
                <span className={`w-2 h-2 rounded-full ${mod.status ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span>{mod.status ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{mod.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
