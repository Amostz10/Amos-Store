import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, User, Shield, Phone, MapPin, Globe, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { AMOS_EMBLEM_URL } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithCredentials, registerNewUser, loginAs, features, users } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [identifier, setIdentifier] = useState('amos');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Registration state
  const [regForm, setRegForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    dateOfBirth: '1998-05-14',
    address: '',
    region: '',
    district: '',
    country: 'United States',
    occupation: 'Professional'
  });

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = loginWithCredentials(identifier, password);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      if (onClose) onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (regForm.password !== regForm.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = registerNewUser(regForm);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      if (onClose) onClose();
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(`If an account exists with this address, temporary recovery instructions have been dispatched.`);
    setTimeout(() => {
      setMode('login');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 my-8">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 border border-amber-400/30 p-1 bg-slate-950">
            <img
              src={AMOS_EMBLEM_URL}
              alt="Amos Store"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">AMOS STORE</h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Personal Information, Document & User Management'
              : mode === 'register'
              ? 'Create Your Secure Digital Archive Account'
              : 'Account Access Recovery'}
          </p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-6 text-xs">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'login' ? 'bg-amber-400 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'register' ? 'bg-amber-400 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Username or Email Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. amos or amos@amosstore.io"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-amber-400 hover:underline text-[11px]"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              Sign In to Portal <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Instant Access */}
            <div className="pt-4 mt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block text-center mb-2">Or quick-start demo account:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginAs('usr_amos_01');
                    if (onClose) onClose();
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-center cursor-pointer transition-colors"
                >
                  <p className="font-semibold text-white">Amos</p>
                  <p className="text-[10px] text-amber-400">User Portal</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAs('usr_admin_sarah');
                    if (onClose) onClose();
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-center cursor-pointer transition-colors"
                >
                  <p className="font-semibold text-white">Sarah</p>
                  <p className="text-[10px] text-cyan-400">Admin Portal</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAs('usr_super_admin');
                    if (onClose) onClose();
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-center cursor-pointer transition-colors"
                >
                  <p className="font-semibold text-white">Dr. James</p>
                  <p className="text-[10px] text-emerald-400">Super Admin</p>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Register Form (Full Section 6 fields) */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Full Name *</label>
              <input
                type="text"
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                placeholder="e.g. Amos Tungaraza"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Username *</label>
                <input
                  type="text"
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                  placeholder="e.g. amos"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="amos@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Gender *</label>
                <select
                  value={regForm.gender}
                  onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={regForm.dateOfBirth}
                  onChange={(e) => setRegForm({ ...regForm, dateOfBirth: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Country *</label>
                <input
                  type="text"
                  value={regForm.country}
                  onChange={(e) => setRegForm({ ...regForm, country: e.target.value })}
                  placeholder="e.g. United States"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Physical Address *</label>
              <input
                type="text"
                value={regForm.address}
                onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                placeholder="Street address, apartment or box"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Region *</label>
                <input
                  type="text"
                  value={regForm.region}
                  onChange={(e) => setRegForm({ ...regForm, region: e.target.value })}
                  placeholder="e.g. Central"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">District *</label>
                <input
                  type="text"
                  value={regForm.district}
                  onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                  placeholder="e.g. Metro"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Password *</label>
                <input
                  type="password"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Confirm Password *</label>
                <input
                  type="password"
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Forgot Password */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <p className="text-slate-300">
              Enter your registered username or email address and our security engine will reset your credential access.
            </p>
            <input
              type="text"
              placeholder="Username or Email"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              required
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Dispatch Recovery
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-slate-400 hover:text-white text-xs underline"
              >
                Back to sign in
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
