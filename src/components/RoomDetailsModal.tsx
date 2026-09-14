import React, { useState } from 'react';
import { Room } from '../types';
import { resolveResortImageUrl } from '../services/apiBridge';
import { 
  X, 
  Users, 
  Maximize, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
  onBookNow: (room: Room) => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  room,
  onClose,
  onBookNow
}) => {
  if (!room) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = room.images && room.images.length > 0 
    ? room.images.map(img => resolveResortImageUrl(img, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'))
    : ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Carousel Header */}
        <div className="relative h-64 bg-slate-950 w-full shrink-0">
          <img
            src={images[activeImageIndex]}
            alt={room.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';
            }}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/50" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white/90 hover:text-white backdrop-blur-sm z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category Chip */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
              {room.category}
            </span>
          </div>

          {/* Carousel Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImageIndex === i ? 'bg-cyan-400 w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Body */}
        <div className="px-5 pb-5 space-y-4 overflow-y-auto text-xs flex-1">
          <div>
            <h3 className="text-lg font-bold text-white leading-snug">
              {room.title}
            </h3>
            <div className="flex items-center gap-3 text-slate-400 mt-1">
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
              <span className="text-emerald-400 font-semibold">
                {room.available_units} units available
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">
              Included Amenities & Highlights
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {room.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Rate</div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-amber-300">₱{room.price.toLocaleString()}</span>
                <span className="text-slate-400 text-[11px]">
                  {room.category === 'Beach Entrance' ? '/ person' : '/ night'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookNow(room);
              }}
              disabled={room.is_full}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/30 disabled:opacity-50"
            >
              {room.is_full ? 'Sold Out' : 'Proceed to Reserve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
