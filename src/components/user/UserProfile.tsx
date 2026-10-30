import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera, CheckCircle2, User, Phone, MapPin, Briefcase, GraduationCap, Heart, AlertCircle, Save } from 'lucide-react';
import { AMOS_AVATAR_URL } from '../../data/mockData';

export const UserProfile: React.FC = () => {
  const { currentUser, updateUserProfile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const [formData, setFormData] = useState({
    fullName: currentUser.profile.fullName || '',
    username: currentUser.profile.username || '',
    email: currentUser.profile.email || '',
    phone: currentUser.profile.phone || '',
    altPhone: currentUser.profile.altPhone || '',
    gender: currentUser.profile.gender || 'Male',
    dateOfBirth: currentUser.profile.dateOfBirth || '',
    address: currentUser.profile.address || '',
    region: currentUser.profile.region || '',
    district: currentUser.profile.district || '',
    country: currentUser.profile.country || 'United States',
    occupation: currentUser.profile.occupation || '',
    educationLevel: currentUser.profile.educationLevel || '',
    institution: currentUser.profile.institution || '',
    emergencyName: currentUser.profile.emergencyContact?.name || '',
    emergencyRelationship: currentUser.profile.emergencyContact?.relationship || 'Spouse',
    emergencyPhone: currentUser.profile.emergencyContact?.phone || '',
    profilePhotoUrl: currentUser.profile.profilePhotoUrl || AMOS_AVATAR_URL,
    bio: currentUser.profile.bio || ''
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, profilePhotoUrl: objectUrl }));
    updateUserProfile(currentUser.id, { profilePhotoUrl: objectUrl });
    setStatusMessage('Profile photograph updated successfully.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('');

    setTimeout(() => {
      updateUserProfile(currentUser.id, {
        fullName: formData.fullName,
        phone: formData.phone,
        altPhone: formData.altPhone,
        gender: formData.gender as any,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        region: formData.region,
        district: formData.district,
        country: formData.country,
        occupation: formData.occupation,
        educationLevel: formData.educationLevel,
        institution: formData.institution,
        emergencyContact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRelationship,
          phone: formData.emergencyPhone
        },
        profilePhotoUrl: formData.profilePhotoUrl,
        bio: formData.bio
      });

      setIsSaving(false);
      setStatusMessage('Personal profile updated successfully.');
      setTimeout(() => setStatusMessage(''), 4000);
    }, 300);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Personal Profile</h2>
          <p className="text-xs text-slate-400">Manage your verified credentials and identity details</p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Profile Photo Management */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-md bg-slate-950">
              <img
                src={formData.profilePhotoUrl}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md transition-colors cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="font-semibold text-white text-sm">{formData.fullName}</h3>
            <p className="text-slate-400 text-xs font-mono">@{formData.username} · {formData.email}</p>
            <p className="text-[11px] text-slate-500">
              Supported formats: JPG, JPEG, PNG, WEBP (Maximum size: 5 MB)
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            Upload Photo
          </button>
        </div>

        {/* 1. Personal Information */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-white font-semibold text-xs">
            <User className="w-4 h-4 text-amber-400" />
            <span>1. Personal Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Nationality / Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-white font-semibold text-xs">
            <Phone className="w-4 h-4 text-cyan-400" />
            <span>2. Contact Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Primary Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Alternative Phone Number</label>
              <input
                type="tel"
                value={formData.altPhone}
                onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-300 font-medium block mb-1">Physical Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Region / State</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">District / City</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* 3. Professional & Education Information */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-white font-semibold text-xs">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>3. Professional & Educational Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Occupation / Job Title</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Highest Education Level</label>
              <input
                type="text"
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                placeholder="e.g. Bachelor of Science"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-300 font-medium block mb-1">Institution / University</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* 4. Emergency Contact */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-white font-semibold text-xs">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>4. Emergency Contact</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Contact Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                placeholder="Contact full name"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Relationship</label>
              <input
                type="text"
                value={formData.emergencyRelationship}
                onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                placeholder="e.g. Spouse / Parent / Sibling"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
