import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Monitor, RotateCcw, ShieldCheck, UserCheck, KeyRound, QrCode } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const {
    isMobileFrameView,
    setIsMobileFrameView,
    triggerSplash,
    currentUser,
    loginAs,
    setShowDigitalId
  } = useApp();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Demo & Testing Bar (Compact on mobile) */}
      <header className="w-full bg-slate-900 border-b border-slate-800 px-3 py-2 z-40 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-white tracking-tight text-xs">Amos Store</span>
          </div>

          {/* Quick Demo Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => loginAs('usr_amos_01')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentUser?.id === 'usr_amos_01'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Amos
            </button>
            <button
              onClick={() => loginAs('usr_admin_sarah')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentUser?.id === 'usr_admin_sarah'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => loginAs('usr_super_admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentUser?.id === 'usr_super_admin'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Super
            </button>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowDigitalId(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-amber-300"
              title="Digital ID"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={triggerSplash}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300"
              title="Replay Splash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMobileFrameView((prev) => !prev)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs"
            >
              {isMobileFrameView ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
              <span>{isMobileFrameView ? 'Full Canvas' : 'Mock Frame'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Presentation Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0 md:p-6 overflow-x-hidden">
        {isMobileFrameView ? (
          /* Realistic Smartphone Device Mockup */
          <div className="relative mx-auto my-auto transition-all duration-300">
            {/* Phone Outer Chassis / Bezel */}
            <div className="w-[390px] sm:w-[412px] h-[844px] max-h-[92vh] bg-slate-900 rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1),0_0_0_10px_#1e293b] flex flex-col relative overflow-hidden">
              
              {/* Hardware buttons simulation */}
              <div className="absolute -left-[14px] top-28 w-[3px] h-8 bg-slate-700 rounded-l" />
              <div className="absolute -left-[14px] top-40 w-[3px] h-12 bg-slate-700 rounded-l" />
              <div className="absolute -left-[14px] top-56 w-[3px] h-12 bg-slate-700 rounded-l" />
              <div className="absolute -right-[14px] top-36 w-[3px] h-16 bg-slate-700 rounded-r" />

              {/* Screen Glass Area */}
              <div className="relative w-full h-full bg-slate-950 rounded-[44px] overflow-hidden flex flex-col border border-white/5">
                
                {/* Mobile Status Bar (Dynamic Island & System Icons) */}
                <div className="h-11 w-full bg-slate-950/90 backdrop-blur-md px-7 flex items-center justify-between text-[13px] font-semibold text-slate-200 shrink-0 z-50 select-none">
                  {/* Left: Time */}
                  <span className="font-mono text-xs">{currentTime || '08:25'}</span>

                  {/* Center: Dynamic Island */}
                  <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center px-2 shadow-inner border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
                  </div>

                  {/* Right: Network & Battery */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
                    <span>5G</span>
                    <div className="w-5 h-2.5 border border-slate-400 rounded-[3px] p-[1px] flex items-center">
                      <div className="h-full w-4 bg-emerald-400 rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Mobile App Viewport Content */}
                <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col bg-slate-950">
                  {children}
                </div>

                {/* Mobile Gesture Navigation Home Bar */}
                <div className="h-4 w-full bg-slate-950 shrink-0 flex items-center justify-center z-50">
                  <div className="w-32 h-1 bg-slate-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Native Fullscreen View for Real Mobile Devices and Tablets */
          <div className="w-full min-h-screen bg-slate-950 flex flex-col overflow-hidden">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
