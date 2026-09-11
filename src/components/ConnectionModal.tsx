import React, { useState } from 'react';
import { ConnectionConfig } from '../types';
import { 
  X, 
  Globe, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Server, 
  Wifi, 
  Copy, 
  Check, 
  HelpCircle,
  Radio,
  Sliders,
  Download,
  Code2,
  FileText,
  ShieldAlert
} from 'lucide-react';

interface ConnectionModalProps {
  config: ConnectionConfig;
  onClose: () => void;
  onUpdateConfig: (newConfig: Partial<ConnectionConfig>) => void;
  onSyncNow: () => Promise<{ success: boolean; message: string; count?: number }>;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  config,
  onClose,
  onUpdateConfig,
  onSyncNow
}) => {
  const initialUrl = config.backendUrl.startsWith('http://catzhouse') 
    ? config.backendUrl.replace(/^http:\/\//i, 'https://') 
    : config.backendUrl || 'https://catzhouse.kesug.com/api.php';

  const [urlInput, setUrlInput] = useState(initialUrl);
  const [isSyncing, setIsSyncing] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [copiedDb, setCopiedDb] = useState(false);
  const [copiedPhp, setCopiedPhp] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'connect' | 'guide'>('connect');

  const handleTestSync = async () => {
    let cleanUrl = urlInput.trim();
    if (cleanUrl.startsWith('http://')) {
      cleanUrl = cleanUrl.replace(/^http:\/\//i, 'https://');
      setUrlInput(cleanUrl);
    }
    onUpdateConfig({ backendUrl: cleanUrl });
    setIsSyncing(true);
    setResultMsg(null);
    try {
      const res = await onSyncNow();
      setResultMsg({ success: res.success, text: res.message });
    } catch (e: any) {
      setResultMsg({ success: false, text: e.message || 'Sync failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const copyConfigDetails = () => {
    const text = `Host: ${config.dbHost}\nDatabase: ${config.dbName}\nUser: ${config.dbUser}\nWebsite URL: ${urlInput}`;
    navigator.clipboard.writeText(text);
    setCopiedDb(true);
    setTimeout(() => setCopiedDb(false), 2000);
  };

  const downloadApiPhp = () => {
    const link = document.createElement('a');
    link.href = '/api.php';
    link.download = 'api.php';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPhpCode = async () => {
    try {
      const resp = await fetch('/api.php');
      const phpContent = await resp.text();
      navigator.clipboard.writeText(phpContent);
      setCopiedPhp(true);
      setTimeout(() => setCopiedPhp(false), 2500);
    } catch (e) {
      alert('Could not copy PHP code. You can download api.php directly.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-xs">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              config.isConnected 
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400' 
                : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
            }`}>
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">InfinityFree Website & Database Sync</h3>
              <p className="text-[11px] text-slate-400">Connect this Guest App to your live website</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('connect')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
              activeSubTab === 'connect'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Connection Status
          </button>
          <button
            onClick={() => setActiveSubTab('guide')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
              activeSubTab === 'guide'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            InfinityFree Setup Guide
          </button>
        </div>

        {activeSubTab === 'connect' ? (
          <>
            {/* Live Status Badge */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between ${
              config.isConnected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  config.isConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                }`} />
                <div>
                  <span className="font-bold block text-xs">
                    {config.isConnected ? 'Connected to Live InfinityFree Site' : 'Local Guest Mode (Offline Ready)'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {config.lastSyncTimestamp 
                      ? `Last synced: ${new Date(config.lastSyncTimestamp).toLocaleTimeString()}`
                      : 'Using built-in resort catalog until website connects.'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleTestSync}
                disabled={isSyncing}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] transition shadow shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Testing...' : 'Test & Sync'}</span>
              </button>
            </div>

            {resultMsg && (
              <div className={`p-3 rounded-xl border flex items-start gap-2 ${
                resultMsg.success
                  ? 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
                  : 'bg-amber-950/50 border-amber-800 text-amber-200'
              }`}>
                {resultMsg.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span className="text-[11px] leading-relaxed">{resultMsg.text}</span>
              </div>
            )}

            {/* Website PHP Endpoint URL */}
            <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <label className="block text-[11px] font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  InfinityFree Website API URL:
                </span>
                <span className="text-[10px] text-slate-400 font-normal">HTTP or HTTPS</span>
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://yourdomain.infinityfreeapp.com/api.php"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-400">
                Enter your live domain URL with <code>/api.php</code> (or <code>/index.php</code>).
              </p>
            </div>

            {/* InfinityFree Database Credentials Summary */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  Your InfinityFree Database Credentials
                </span>
                <button
                  onClick={copyConfigDetails}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  {copiedDb ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDb ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[9px]">MySQL Host</span>
                  <span className="text-white truncate block">{config.dbHost}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[9px]">Database Name</span>
                  <span className="text-white truncate block">{config.dbName}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[9px]">Database User</span>
                  <span className="text-white truncate block">{config.dbUser}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500 block text-[9px]">vPanel Password</span>
                  <span className="text-cyan-300 block">Your Account Password</span>
                </div>
              </div>
            </div>

            {/* Quick Actions to Download / Copy PHP */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={downloadApiPhp}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download api.php</span>
              </button>
              <button
                onClick={copyPhpCode}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center justify-center gap-1.5 transition"
              >
                {copiedPhp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPhp ? 'Code Copied!' : 'Copy PHP Script'}</span>
              </button>
            </div>
          </>
        ) : (
          /* InfinityFree Setup Guide Tab */
          <div className="space-y-3 text-slate-300">
            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-2xl flex items-start gap-2.5 text-[11px] text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Why InfinityFree requires a PHP bridge:</strong>
                <p className="mt-0.5 text-amber-200/90">
                  InfinityFree free hosting blocks direct external MySQL connections (port 3306) from outside servers for security. However, PHP scripts running inside your InfinityFree domain have direct, unrestricted access to your MySQL database!
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Easy 3-Step Setup for InfinityFree:
              </h4>

              <div className="space-y-2.5 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-900 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <strong className="text-white">Get the PHP file:</strong> Click <button onClick={downloadApiPhp} className="text-cyan-400 underline font-semibold">Download api.php</button> or copy the ready-made script.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-900 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <strong className="text-white">Upload to InfinityFree:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Open your InfinityFree <strong>Control Panel (vPanel)</strong> &rarr; open <strong>File Manager</strong> (Monsta FTP) &rarr; navigate into the <strong>htdocs</strong> folder &rarr; click <strong>Upload</strong> and upload <code>api.php</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-900 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <strong className="text-white">Connect the Guest App:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Switch back to the <strong>Connection Status</strong> tab, enter your domain (e.g. <code>http://yourname.infinityfreeapp.com/api.php</code>), and tap <strong>Test & Sync</strong>!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={downloadApiPhp}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download api.php</span>
              </button>
              <button
                onClick={() => setActiveSubTab('connect')}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
              >
                Go to Connection URL
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
        >
          Save & Return to App
        </button>
      </div>
    </div>
  );
};
