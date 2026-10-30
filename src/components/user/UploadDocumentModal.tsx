import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { DocumentCategory } from '../../types';
import { CERTIFICATE_SAMPLE_URL } from '../../data/mockData';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: DocumentCategory;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'education'
}) => {
  const { currentUser, uploadDocument, settings } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<DocumentCategory>(defaultCategory);
  const [documentName, setDocumentName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeKb: number;
    type: string;
    previewUrl: string;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !currentUser) return null;

  const categoryLabels: Record<DocumentCategory, string> = {
    education: 'Education Certificate',
    personal: 'Personal Document',
    professional: 'Professional Certificate',
    training: 'Training Certificate',
    other: 'Other Permitted Document'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size against system limit
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > settings.maxUploadSizeMb) {
      setErrorMessage(`File exceeds maximum limit of ${settings.maxUploadSizeMb} MB.`);
      return;
    }

    setErrorMessage('');
    const objectUrl = URL.createObjectURL(file);
    setSelectedFile({
      name: file.name,
      sizeKb: Math.round(file.size / 1024),
      type: file.type || 'image/jpeg',
      previewUrl: objectUrl
    });

    // Auto-fill document name if empty
    if (!documentName) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setDocumentName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleUseSampleCertificate = () => {
    setSelectedFile({
      name: 'degree_certificate_sample.jpg',
      sizeKb: 1420,
      type: 'image/jpeg',
      previewUrl: CERTIFICATE_SAMPLE_URL
    });
    if (!documentName) {
      setDocumentName('Bachelor Degree Certificate');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentName.trim()) {
      setErrorMessage('Please specify the Document Name.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Please upload or select a document file.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      uploadDocument({
        userId: currentUser.id,
        userFullName: currentUser.profile.fullName,
        category,
        categoryLabel: categoryLabels[category],
        documentName: documentName.trim(),
        documentNumber: documentNumber.trim() || undefined,
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
        description: description.trim() || undefined,
        fileUrl: selectedFile.previewUrl,
        fileType: selectedFile.type,
        fileSizeKb: selectedFile.sizeKb
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Upload Certificate or Document</h3>
              <p className="text-xs text-slate-400">Secure digital archive for {currentUser.profile.fullName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Document Category <span className="text-amber-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="education">Education Certificates (Degree, Diploma, Secondary)</option>
              <option value="personal">Personal Documents (Birth Cert, ID, Passport, Driver License)</option>
              <option value="professional">Professional Certificates (Cisco, AWS, Bar, Medical)</option>
              <option value="training">Training & Workshop Certificates</option>
              <option value="other">Other Permitted Documents</option>
            </select>
          </div>

          {/* Document Name & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Document Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g. Bachelor of Science Diploma"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Document Number (Optional)
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. DOC-2026-9812"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Issue Date & Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Expiry Date (Where applicable)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">Description / Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, issuing institution, or details for the reviewer..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Upload File <span className="text-amber-400">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-xl p-5 text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Click or tap to browse file</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Formats: {settings.allowedFileFormats.join(', ')} · Max {settings.maxUploadSizeMb} MB
                  </p>
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseSampleCertificate();
                    }}
                    className="text-[11px] px-3 py-1 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 rounded-md border border-amber-400/30 transition-colors"
                  >
                    Or load verified sample diploma
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                    <img
                      src={selectedFile.previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-white truncate text-xs">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {(selectedFile.sizeKb / 1024).toFixed(2)} MB · {selectedFile.type}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading to Vault...' : 'Submit Document'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
