import React from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';

interface AndroidInstallModalProps {
  onClose: () => void;
  isInstallable: boolean;
  onInstall: () => Promise<boolean>;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  onClose,
  isInstallable,
  onInstall
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-xs animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Install Android Mobile App</h3>
              <p className="text-[11px] text-slate-400">Grand Horizon Luxury Resort</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* App Logo & Preview */}
        <div className="text-center py-2 space-y-2">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-800 to-sky-950 p-2 shadow-lg border border-cyan-700/50 flex items-center justify-center">
            <img src="/icon.svg" alt="App Icon" className="w-16 h-16 object-contain" />
          </div>
          <h4 className="font-bold text-white text-sm">Grand Horizon Resort</h4>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Install on your Android smartphone for instant bookings, real-time push alerts, offline voucher pass, and front desk speed check-in.
          </p>
        </div>

        {/* Instant Install Button */}
        {isInstallable ? (
          <button
            onClick={async () => {
              const res = await onInstall();
              if (res) onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Install on Android (1-Tap)</span>
          </button>
        ) : (
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-2xl text-[11px] text-cyan-200 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Progressive Web App Ready
            </div>
            <p>
              To add this app to your Android home screen:
            </p>
            <ol className="list-decimal list-inside space-y-1 pt-1 text-slate-300">
              <li>Open this page in <strong>Google Chrome</strong> on Android.</li>
              <li>Tap the three dots <strong>⋮</strong> in the top right corner.</li>
              <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
            </ol>
          </div>
        )}

        {/* APK Conversion Info */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-[10px] text-slate-400">
          <div className="font-semibold text-slate-200 text-[11px] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Want a Standalone .APK File?
          </div>
          <p>
            Because this application includes a compliant <code>manifest.json</code> and service worker, you can convert it into a signed <code>.apk</code> in seconds using:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300">
            <li><strong>PWABuilder.com</strong> (Free APK & Google Play package)</li>
            <li><strong>Bubblewrap CLI</strong> (Official Google TWA tool)</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
