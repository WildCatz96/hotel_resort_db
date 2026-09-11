import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Smartphone, 
  Monitor, 
  Globe, 
  Radio, 
  Download, 
  Compass, 
  Calendar, 
  Tag, 
  Info,
  ChevronLeft,
  Circle,
  Square
} from 'lucide-react';
import { ConnectionConfig } from '../types';

export type GuestTab = 'explore' | 'bookings' | 'deals' | 'guide';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: GuestTab;
  onTabChange: (tab: GuestTab) => void;
  connection: ConnectionConfig;
  onOpenConnectionModal: () => void;
  onOpenInstallModal: () => void;
  isInstallable: boolean;
  activeBookingCount?: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  connection,
  onOpenConnectionModal,
  onOpenInstallModal,
  isInstallable,
  activeBookingCount = 0
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [viewMode, setViewMode] = useState<'device' | 'fullscreen'>('device');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 md:p-4 selection:bg-cyan-500 selection:text-white">
      
      {/* Top Floating Control Bar (Desktop Only) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-xl mb-3 px-3 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Grand Horizon Resort • Guest App</span>
          <span className="text-[10px] text-slate-500">•</span>
          <span className="text-[11px] text-cyan-400">
            {connection.isConnected ? 'InfinityFree Live Connected' : 'Guest Mode Ready'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode Switcher */}
          <button
            onClick={() => setViewMode(viewMode === 'device' ? 'fullscreen' : 'device')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px]"
            title="Toggle Device Frame"
          >
            {viewMode === 'device' ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{viewMode === 'device' ? 'Full View' : 'Phone Frame'}</span>
          </button>

          {/* Connection Settings */}
          <button
            onClick={onOpenConnectionModal}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
              connection.isConnected
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>{connection.isConnected ? 'PHP Live' : 'InfinityFree Sync'}</span>
          </button>
        </div>
      </div>

      {/* Main Container - Phone Mockup or Responsive Canvas */}
      <div
        className={`w-full transition-all duration-300 flex flex-col bg-slate-950 overflow-hidden ${
          viewMode === 'device'
            ? 'max-w-md h-[100dvh] md:h-[844px] md:max-h-[92vh] md:rounded-[44px] md:border-[10px] md:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-700/50 relative'
            : 'max-w-3xl min-h-screen md:min-h-[90vh] md:rounded-3xl md:border border-slate-800 shadow-2xl relative'
        }`}
      >
        {/* ANDROID STATUS BAR */}
        <div className="w-full bg-slate-950/95 backdrop-blur-md px-5 pt-3 pb-1.5 flex items-center justify-between z-30 shrink-0 text-slate-300 text-xs font-semibold select-none border-b border-white/5">
          {/* Time */}
          <span className="font-mono text-xs text-white">{currentTime || '09:41'}</span>

          {/* Android Punch Hole Camera Notch (Shown in phone frame) */}
          {viewMode === 'device' && (
            <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800/80 shadow-inner flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-cyan-950/60" />
            </div>
          )}

          {/* System Indicators: Signal, 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] font-bold text-slate-400">5G</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">98%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* ANDROID TOP APP BAR */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80 z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-700 p-1 shadow flex items-center justify-center">
              <img src="/icon.svg" alt="Resort Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm text-white tracking-tight leading-none">
                  Grand Horizon
                </h1>
                {/* PHP Connection indicator pill */}
                <button
                  onClick={onOpenConnectionModal}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold border transition ${
                    connection.isConnected
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                      : 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
                  }`}
                  title="Configure InfinityFree connection"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    connection.isConnected ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'
                  }`} />
                  <span>{connection.isConnected ? 'Website Live' : 'InfinityFree Sync'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
                Guest Booking & Experience App
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Install PWA Button */}
            <button
              onClick={onOpenInstallModal}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition shadow-sm"
              title="Install Android App"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Backend connection button */}
            <button
              onClick={onOpenConnectionModal}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shadow-sm"
              title="Website & Database Settings"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE APP VIEWPORT */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {children}
        </div>

        {/* ANDROID MATERIAL 3 GUEST BOTTOM NAVIGATION BAR */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-1.5 flex items-center justify-around z-20 shrink-0 select-none">
          {/* 1. Explore */}
          <button
            onClick={() => onTabChange('explore')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'explore'
                ? 'text-cyan-400 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${
              activeTab === 'explore' ? 'bg-cyan-500/20 text-cyan-300' : ''
            }`}>
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Explore</span>
          </button>

          {/* 2. My Bookings / Track */}
          <button
            onClick={() => onTabChange('bookings')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'bookings'
                ? 'text-cyan-400 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition relative ${
              activeTab === 'bookings' ? 'bg-cyan-500/20 text-cyan-300' : ''
            }`}>
              <Calendar className="w-5 h-5" />
              {activeBookingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-bold">Stays</span>
          </button>

          {/* 3. Deals */}
          <button
            onClick={() => onTabChange('deals')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'deals'
                ? 'text-cyan-400 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition ${
              activeTab === 'deals' ? 'bg-cyan-500/20 text-cyan-300' : ''
            }`}>
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Deals</span>
          </button>

          {/* 4. Guest Services & Guide */}
          <button
            onClick={() => onTabChange('guide')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'guide'
                ? 'text-cyan-400 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-xl transition relative ${
              activeTab === 'guide' ? 'bg-cyan-500/20 text-cyan-300' : ''
            }`}>
              <Info className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Guide</span>
          </button>
        </div>

        {/* ANDROID SYSTEM 3-BUTTON NAVIGATION BAR */}
        <div className="bg-slate-950 py-1 px-12 flex items-center justify-around text-slate-500 shrink-0 z-20 border-t border-white/5">
          <button
            onClick={() => onTabChange('explore')}
            className="p-1 hover:text-white transition"
            title="Android Back Button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTabChange('explore')}
            className="p-1 hover:text-white transition"
            title="Android Home Button"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onTabChange('guide')}
            className="p-1 hover:text-white transition"
            title="Android Recents Button"
          >
            <Square className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
