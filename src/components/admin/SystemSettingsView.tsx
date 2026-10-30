import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Database,
  Download,
  UploadCloud,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportBackup,
    importBackup,
    resetToDefaults,
    currentUser
  } = useApp();

  const [form, setForm] = useState({
    systemName: settings.systemName,
    systemTagline: settings.systemTagline,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    maxUploadSizeMb: settings.maxUploadSizeMb,
    allowedFormats: settings.allowedFileFormats.join(', '),
    maintenanceMode: settings.maintenanceMode,
    allowPublicRegistration: settings.allowPublicRegistration
  });

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formatsArray = form.allowedFormats
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    updateSettings({
      systemName: form.systemName,
      systemTagline: form.systemTagline,
      supportEmail: form.supportEmail,
      supportPhone: form.supportPhone,
      maxUploadSizeMb: Number(form.maxUploadSizeMb) || 10,
      allowedFileFormats: formatsArray.length > 0 ? formatsArray : ['PDF', 'JPG', 'PNG'],
      maintenanceMode: form.maintenanceMode,
      allowPublicRegistration: form.allowPublicRegistration
    });

    setNotice({ type: 'success', text: 'System settings successfully saved and applied.' });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amos_store_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice({ type: 'success', text: 'Full database snapshot downloaded successfully.' });
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackup(content);
      if (res.success) {
        setNotice({ type: 'success', text: res.message });
      } else {
        setNotice({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 pb-24 text-slate-100">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">System Settings & Data Vault Backup</h2>
        <p className="text-xs text-slate-400">
          Configure operational thresholds, file upload limits, and cryptographic database archives
        </p>
      </div>

      {notice && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
            notice.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-800 text-rose-300'
          }`}
        >
          {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div className="p-5 rounded-3xl glass-obsidian-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-white font-semibold text-xs">
            <Settings className="w-4 h-4 text-amber-400" />
            <span>General Platform Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-slate-300 font-medium block mb-1">System Name</label>
              <input
                type="text"
                value={form.systemName}
                onChange={(e) => setForm({ ...form, systemName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Platform Tagline</label>
              <input
                type="text"
                value={form.systemTagline}
                onChange={(e) => setForm({ ...form, systemTagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Support Contact Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Support Phone Helpline</label>
              <input
                type="tel"
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Upload Limits & File Security */}
        <div className="p-5 rounded-3xl glass-obsidian-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-white font-semibold text-xs">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>Document Upload Policies & Storage Limits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Max Document Size Limit (MB per file)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={form.maxUploadSizeMb}
                onChange={(e) => setForm({ ...form, maxUploadSizeMb: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Allowed File Formats (Comma Separated)
              </label>
              <input
                type="text"
                value={form.allowedFormats}
                onChange={(e) => setForm({ ...form, allowedFormats: e.target.value })}
                placeholder="PDF, JPG, JPEG, PNG, WEBP"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white uppercase font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-amber-400 focus:ring-0"
              />
              <span className="text-slate-300">System Maintenance Mode (Block non-admin logins)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.allowPublicRegistration}
                onChange={(e) => setForm({ ...form, allowPublicRegistration: e.target.checked })}
                className="rounded bg-slate-900 border-slate-700 text-amber-400 focus:ring-0"
              />
              <span className="text-slate-300">Allow Public Account Registration</span>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      </form>

      {/* Section 35: Backup & Restore System */}
      <div className="p-5 rounded-3xl glass-obsidian-card border border-white/10 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-white font-semibold text-xs">
          <Database className="w-4 h-4 text-purple-400" />
          <span>Section 35: Database Backup & Recovery Engine</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Amos Store provides complete database backups containing all user records, profile attributes, document metadata, security rules, and chronological activity logs.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Export JSON */}
          <button
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Database Snapshot (JSON)</span>
          </button>

          {/* Import JSON */}
          <input
            type="file"
            ref={backupInputRef}
            onChange={handleRestoreFile}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => backupInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Restore From File</span>
          </button>

          {/* Reset To Defaults */}
          <button
            onClick={() => {
              if (confirm('Reset system to factory default records and clear local test modifications?')) {
                resetToDefaults();
                setNotice({ type: 'success', text: 'System reset to default state.' });
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Factory Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
