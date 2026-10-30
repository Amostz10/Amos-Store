import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, QrCode, Download, Printer, User, Sparkles } from 'lucide-react';
import { AMOS_EMBLEM_URL } from '../../data/mockData';

export const DigitalIdModal: React.FC = () => {
  const { showDigitalId, setShowDigitalId, currentUser } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!showDigitalId || !currentUser) return null;

  const profile = currentUser.profile;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Amos Store Verified Digital ID</h3>
          </div>
          <button
            onClick={() => setShowDigitalId(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col items-center">
          {/* Physical ID Card Replica */}
          <div
            ref={cardRef}
            className="w-full rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-amber-400/30 shadow-2xl relative overflow-hidden select-none"
          >
            {/* Background Holographic Ribbon */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar of the Card */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <img
                  src={AMOS_EMBLEM_URL}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover border border-amber-400/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">AMOS STORE</h4>
                  <p className="text-[9px] text-amber-400/90 font-mono tracking-wider">OFFICIAL DIGITAL IDENTITY</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
              </div>
            </div>

            {/* Main Identification Information */}
            <div className="flex items-start gap-4 mb-4">
              {/* Photo */}
              <div className="relative shrink-0">
                <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-400/60 shadow-lg bg-slate-950">
                  <img
                    src={profile.profilePhotoUrl}
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow">
                  ✓
                </div>
              </div>

              {/* Data fields */}
              <div className="flex-1 space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Full Name</span>
                  <p className="font-bold text-white text-sm leading-tight">{profile.fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Identifier</span>
                    <span className="font-mono text-amber-300 font-semibold">{currentUser.username}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Gender</span>
                    <span className="text-slate-200">{profile.gender}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">DOB</span>
                    <span className="font-mono text-slate-300">{profile.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Country</span>
                    <span className="text-slate-200 truncate">{profile.country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer: QR Code & Barcode */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 block uppercase">Vault Document ID</span>
                <span className="font-mono text-[10px] text-slate-300 font-semibold">{currentUser.id}</span>
                <p className="text-[8px] text-slate-400">Cryptographically signed & verified</p>
              </div>

              {/* Simulated QR Code SVG */}
              <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full text-slate-950 fill-current">
                  <path d="M2 2h7v7H2V2zm2 2v3h3V4H4zm9-2h7v7h-7V2zm2 2v3h3V4h-3zM2 13h7v7H2v-7zm2 2v3h3v-3H4zm11-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm2 4h2v2h-2v-2zm-6 0h2v2h-2v-2zm0-4h2v2h-2v-2z" />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center">
            This card serves as portable proof of registered identity and verified certificates within the Amos Store network.
          </p>
        </div>

        {/* Action buttons */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Card
          </button>
          <button
            onClick={() => setShowDigitalId(false)}
            className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-semibold text-slate-950 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
