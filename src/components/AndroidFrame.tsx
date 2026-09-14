import React from 'react';
import { 
  Compass, 
  Calendar, 
  Tag, 
  Info
} from 'lucide-react';
import { ConnectionConfig } from '../types';

export type GuestTab = 'explore' | 'bookings' | 'deals' | 'guide';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: GuestTab;
  onTabChange: (tab: GuestTab) => void;
  connection: ConnectionConfig;
  activeBookingCount?: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  activeBookingCount = 0
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 md:py-6 md:px-4 selection:bg-cyan-500 selection:text-white">
      {/* Main Guest Mobile App Shell */}
      <div className="w-full max-w-md h-[100dvh] md:h-[844px] md:max-h-[92vh] flex flex-col bg-slate-950 md:rounded-3xl md:border md:border-slate-800/80 shadow-2xl relative overflow-hidden">
        
        {/* TOP GUEST APP BAR */}
        <header className="bg-slate-900/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-800/80 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-700 p-1.5 shadow-md flex items-center justify-center">
              <img src="/icon.svg" alt="Grand Horizon Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white tracking-tight leading-none">
                Grand Horizon
              </h1>
              <p className="text-[11px] text-cyan-400 font-medium mt-1 leading-none">
                Resort & Guest Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300 font-medium text-[11px] tracking-wide">
              Guest Portal
            </span>
          </div>
        </header>

        {/* SCROLLABLE APP VIEWPORT */}
        <main className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {children}
        </main>

        {/* GUEST BOTTOM NAVIGATION BAR */}
        <nav className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around z-20 shrink-0 select-none">
          {/* 1. Explore */}
          <button
            onClick={() => onTabChange('explore')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'explore'
                ? 'text-cyan-400 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition ${
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
            <div className={`p-1.5 rounded-xl transition relative ${
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
            <div className={`p-1.5 rounded-xl transition ${
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
            <div className={`p-1.5 rounded-xl transition relative ${
              activeTab === 'guide' ? 'bg-cyan-500/20 text-cyan-300' : ''
            }`}>
              <Info className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Guide</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
