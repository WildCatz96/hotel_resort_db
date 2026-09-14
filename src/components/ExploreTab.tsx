import React, { useState } from 'react';
import { Room } from '../types';
import { resolveResortImageUrl } from '../services/apiBridge';
import { 
  Users, 
  Maximize, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Search, 
  Flame, 
  Compass, 
  ChevronRight, 
  Image as ImageIcon,
  Waves,
  Coffee,
  Tv,
  Eye
} from 'lucide-react';

interface ExploreTabProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onViewDetails: (room: Room) => void;
  onOpenInstructions?: () => void;
}

const CATEGORIES = [
  'All Accommodations',
  'Villa',
  'Suite',
  'Deluxe',
  'Cottage',
  'Cabana',
  'Day Table',
  'Beach Entrance'
];

export const ExploreTab: React.FC<ExploreTabProps> = ({ 
  rooms, 
  onSelectRoom, 
  onViewDetails,
  onOpenInstructions 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Accommodations');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = rooms.filter(room => {
    const matchesCat = selectedCategory === 'All Accommodations' || room.category === selectedCategory;
    const matchesSearch = 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Villa': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Suite': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Deluxe': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Cottage': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Cabana': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Resort Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900 via-sky-900 to-slate-900 p-4 shadow-lg border border-cyan-800/40">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold tracking-wide uppercase mb-1 border border-amber-400/30">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Grand Horizon Resort & Beach Spa</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Luxury Oceanfront Stays</h2>
          <p className="text-xs text-sky-200/90 mt-1 max-w-xs">
            Direct plunge pool villas, airconditioned videoke family cottages, and beach infinity passes.
          </p>
          
          <div className="mt-3 flex items-center gap-2 text-[11px] text-sky-300 bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 w-fit">
            <Waves className="w-3.5 h-3.5 text-cyan-300" />
            <span>Beach Entrance: <strong>₱150</strong> | Cottages from <strong>₱1,500</strong></span>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Android Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search villas, plunge pool, videoke, cottages..."
          className="w-full bg-slate-900/90 text-white placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-500 transition shadow-inner"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick How-to-Use Guide Card */}
      {onOpenInstructions && (
        <button
          onClick={onOpenInstructions}
          className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-800/50 hover:border-cyan-500/60 transition flex items-center justify-between gap-3 shadow-sm group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">How to Book & Use this App</h4>
              <p className="text-[11px] text-slate-400">Guide for room selection, GCash downpayment & private stays</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition shrink-0" />
        </button>
      )}

      {/* Horizontal Category Chips (Android Material 3 Style) */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30 scale-[1.02]'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Catalog Grid / List */}
      <div className="space-y-4">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
            <Compass className="w-10 h-10 text-slate-600 mx-auto mb-2 animate-spin-slow" />
            <p className="text-slate-300 font-medium text-sm">No accommodations match your filter</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category or search keywords</p>
            <button 
              onClick={() => { setSelectedCategory('All Accommodations'); setSearchQuery(''); }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-medium hover:bg-cyan-500"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const isFull = room.is_full || room.available_units <= 0;
            const mainImg = room.images && room.images.length > 0 
              ? resolveResortImageUrl(room.images[0], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80')
              : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';

            return (
              <div
                key={room.id}
                className="group overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-md hover:border-slate-700 transition-all duration-200"
              >
                {/* Room Image with Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={mainImg}
                    alt={room.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md ${getCategoryBadgeColor(room.category)}`}>
                      {room.category}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3">
                    {isFull ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                        Fully Booked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {room.available_units} of {room.units_count} {room.units_count === 1 ? 'unit' : 'units'} left
                      </span>
                    )}
                  </div>

                  {/* Photo count indicator */}
                  {room.images && room.images.length > 1 && (
                    <button 
                      onClick={() => onViewDetails(room)}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[10px] text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 hover:bg-black/80"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>{room.images.length} Photos</span>
                    </button>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white text-base leading-tight group-hover:text-cyan-300 transition">
                        {room.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {room.capacity}
                        </span>
                        {room.size && (
                          <span className="flex items-center gap-1">
                            <Maximize className="w-3.5 h-3.5 text-slate-400" />
                            {room.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.features.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50"
                      >
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{feat}</span>
                      </span>
                    ))}
                    {room.features.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{room.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Rate</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-amber-300">
                          ₱{room.price.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {room.category === 'Beach Entrance' ? '/ person' : room.category === 'Day Table' ? '/ day-use' : '/ night'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(room)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                        title="View details & photos"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectRoom(room)}
                        disabled={isFull}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs tracking-wide transition shadow-sm ${
                          isFull
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                      >
                        <span>{isFull ? 'Sold Out' : 'Book Now'}</span>
                        {!isFull && <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
