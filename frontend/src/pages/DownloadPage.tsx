import React, { useState } from 'react';
import {
  Download,
  Globe,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Lock,
  Users,
  Check
} from 'lucide-react';

interface DownloadPageProps {
  onOpenWebApp?: () => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onOpenWebApp }) => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/livsync.apk';
    link.setAttribute('download', 'LivSync.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      setDownloadStarted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      {/* Light Navbar */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenWebApp}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none text-slate-900">
                Liv<span className="text-indigo-600">Sync</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
                Roommate Compatibility Network
              </span>
            </div>
          </div>

          {/* Open Web App Action Button */}
          <button
            onClick={onOpenWebApp}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 border border-slate-200 transition-all active:scale-95"
          >
            <Globe className="h-4 w-4 text-indigo-600" />
            <span>Open Web App</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 md:py-14 flex flex-col items-center justify-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
          </span>
          Official Android Release • Build v1.0.0
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Download <span className="text-indigo-600">LivSync</span> for Android
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Find roommates who share your schedule, cleanliness, and lifestyle standards with deterministic compatibility scoring.
          </p>
        </div>

        {/* Central Card */}
        <div className="w-full max-w-3xl mt-10 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column (7 cols) */}
            <div className="md:col-span-7 space-y-5 text-center md:text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4" /> Verified Native APK (Build v1.0)
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Choose How to Run LivSync
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Install the standalone native APK on any Android phone or tablet, or open the fast browser web application.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-3">
                {/* Download APK Button */}
                <button
                  onClick={handleDownload}
                  className="flex-1 group inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all duration-200 active:scale-[0.98]"
                >
                  <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 shrink-0" />
                  <div className="flex flex-col items-start leading-tight">
                    <span>{downloadStarted ? 'Downloading...' : 'Download APK'}</span>
                    <span className="text-[11px] text-indigo-100 font-normal">
                      Direct APK File (Official)
                    </span>
                  </div>
                </button>

                {/* View on Web Button */}
                <button
                  onClick={onOpenWebApp}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 font-bold text-sm transition-all duration-200 active:scale-[0.98]"
                >
                  <Globe className="h-5 w-5 text-indigo-600 shrink-0" />
                  <div className="flex flex-col items-start leading-tight">
                    <span>Open Web App</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Runs in Any Browser
                    </span>
                  </div>
                </button>
              </div>

              {/* Verified Badges */}
              <div className="pt-2 flex items-center justify-center md:justify-start gap-4 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Android 7.0+
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> No Google Play Login Required
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Safe & Verified
                </span>
              </div>
            </div>

            {/* Right Column: QR Code Card (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center space-y-3 w-full max-w-[240px]">
                {/* QR Code Container */}
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200/80 relative flex items-center justify-center">
                  <div className="w-36 h-36 flex items-center justify-center bg-white rounded-lg p-1 relative">
                    <svg viewBox="0 0 120 120" className="w-full h-full text-slate-900" fill="currentColor">
                      <rect x="0" y="0" width="35" height="35" rx="6" fill="#0F172A" />
                      <rect x="5" y="5" width="25" height="25" rx="3" fill="white" />
                      <rect x="10" y="10" width="15" height="15" rx="2" fill="#4F46E5" />
                      
                      <rect x="85" y="0" width="35" height="35" rx="6" fill="#0F172A" />
                      <rect x="90" y="5" width="25" height="25" rx="3" fill="white" />
                      <rect x="95" y="10" width="15" height="15" rx="2" fill="#4F46E5" />
                      
                      <rect x="0" y="85" width="35" height="35" rx="6" fill="#0F172A" />
                      <rect x="5" y="90" width="25" height="25" rx="3" fill="white" />
                      <rect x="10" y="95" width="15" height="15" rx="2" fill="#4F46E5" />

                      <rect x="45" y="5" width="8" height="8" rx="1.5" fill="#0F172A" />
                      <rect x="60" y="5" width="15" height="8" rx="1.5" fill="#0F172A" />
                      <rect x="45" y="20" width="20" height="8" rx="1.5" fill="#4F46E5" />
                      <rect x="70" y="20" width="8" height="8" rx="1.5" fill="#0F172A" />
                      <rect x="45" y="35" width="8" height="12" rx="1.5" fill="#0F172A" />

                      <rect x="10" y="45" width="25" height="8" rx="1.5" fill="#0F172A" />
                      <rect x="5" y="60" width="10" height="8" rx="1.5" fill="#4F46E5" />
                      <rect x="22" y="60" width="18" height="8" rx="1.5" fill="#0F172A" />

                      <circle cx="60" cy="60" r="16" fill="#4F46E5" />
                      <circle cx="60" cy="60" r="13" fill="#FFFFFF" />
                      <path d="M55 58 A 5 5 0 0 1 65 58 V 65 H 55 Z" fill="#4F46E5" />
                      <circle cx="60" cy="54" r="2.5" fill="#0F172A" />

                      <rect x="80" y="45" width="12" height="8" rx="1.5" fill="#0F172A" />
                      <rect x="100" y="45" width="15" height="8" rx="1.5" fill="#4F46E5" />
                      <rect x="85" y="60" width="28" height="8" rx="1.5" fill="#0F172A" />

                      <rect x="45" y="80" width="25" height="8" rx="1.5" fill="#0F172A" />
                      <rect x="45" y="95" width="10" height="15" rx="1.5" fill="#4F46E5" />
                      <rect x="62" y="95" width="18" height="8" rx="1.5" fill="#0F172A" />
                      <rect x="85" y="85" width="8" height="8" rx="1.5" fill="#0F172A" />
                      <rect x="100" y="95" width="15" height="15" rx="1.5" fill="#0F172A" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-indigo-600" /> Scan with Phone
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Point camera at QR code to download directly to your mobile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Steps Installation Guide */}
        <section className="w-full max-w-3xl mt-10 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
            How to Install on Android in 3 Simple Steps
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <Download className="h-4 w-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Download APK</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Click Download APK above. When browser shows file security prompt, select <strong>Download anyway</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Allow Installation</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Open downloaded file. If Android settings prompt appears, enable <strong>Allow from this source</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="h-6 w-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h4 className="font-bold text-xs text-slate-900">Launch & Discover</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tap <strong>Install</strong>, open LivSync, and start exploring genuine, verified roommates in your city!
              </p>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="w-full max-w-3xl mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-lg font-black text-slate-900">100%</div>
            <div className="text-[11px] text-slate-500">Deterministic Scoring</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-lg font-black text-emerald-600">Zero</div>
            <div className="text-[11px] text-slate-500">Public Phone Leaks</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-lg font-black text-indigo-600">~12.2 MB</div>
            <div className="text-[11px] text-slate-500">Lightweight APK</div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-lg font-black text-amber-600">7.0+</div>
            <div className="text-[11px] text-slate-500">Android Supported</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 LivSync Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <a href="#" className="hover:text-indigo-600 transition">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 transition">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 transition">
              Security
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
