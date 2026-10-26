import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Compass, Bookmark, MessageSquare, Users, User, Download, Sparkles } from 'lucide-react';
import type { Page } from '@/types/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onPageChange: (page: Page) => void;
  onBackPress?: () => boolean;
  pendingRequestsCount?: number;
  isAuthenticated: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activePage,
  onPageChange,
  onBackPress,
  pendingRequestsCount = 0,
  isAuthenticated,
}) => {
  const isNative = Capacitor.isNativePlatform();

  // Capacitor native platform listeners
  useEffect(() => {
    if (isNative) {
      try {
        SplashScreen.hide();
        StatusBar.setStyle({ style: Style.Light });
        if (Capacitor.getPlatform() === 'android') {
          StatusBar.setBackgroundColor({ color: '#F8FAFC' });
        }
      } catch (e) {
        console.warn('Capacitor error:', e);
      }

      const backHandler = CapApp.addListener('backButton', ({ canGoBack }) => {
        if (onBackPress) {
          const handled = onBackPress();
          if (handled) return;
        }
        if (canGoBack) {
          window.history.back();
        } else {
          CapApp.exitApp();
        }
      });

      return () => {
        backHandler.then((listener) => listener.remove());
      };
    }
  }, [isNative, onBackPress]);

  const navItems: { id: Page; label: string; Icon: typeof Compass; badge?: number }[] = [
    { id: 'discover', label: 'Discover', Icon: Compass },
    { id: 'saved', label: 'Saved', Icon: Bookmark },
    { id: 'connections', label: 'Connections', Icon: MessageSquare, badge: pendingRequestsCount },
    { id: 'groups', label: 'Groups', Icon: Users },
    { id: 'profile', label: 'Profile', Icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* ── DESKTOP & LAPTOP TOP NAVBAR ── */}
      {isAuthenticated && (
        <header className="hidden md:block sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => onPageChange('discover')}
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Liv<span className="text-indigo-600">Sync</span>
                </span>
                <span className="hidden lg:inline-block ml-2 text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Roommate Discovery
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              {navItems.map(({ id, label, Icon, badge }) => {
                const isActive = activePage === id;
                return (
                  <button
                    key={id}
                    onClick={() => onPageChange(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{label}</span>
                    {badge !== undefined && badge > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Direct Android APK Download Button */}
            <div className="flex items-center gap-3">
              <a
                href="/livsync.apk"
                download="LivSync.apk"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                title="Download compiled Android APK (12.2 MB)"
              >
                <Download size={14} />
                <span>Download APK</span>
              </a>
            </div>
          </div>
        </header>
      )}

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col relative pb-20 md:pb-8 px-0 sm:px-4">
        {children}
      </main>

      {/* ── MOBILE BOTTOM NAVBAR ── */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-md mx-auto flex items-stretch px-2 pb-[env(safe-area-inset-bottom,0px)]">
            {navItems.map(({ id, label, Icon, badge }) => {
              const isActive = activePage === id;
              return (
                <button
                  key={id}
                  onClick={() => onPageChange(id)}
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all duration-150 relative
                    ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <div className="relative">
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={isActive ? 'scale-105' : ''}
                    />
                    {badge !== undefined && badge > 0 && (
                      <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                        {badge > 9 ? '9+' : badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] tracking-tight ${
                      isActive ? 'font-semibold text-indigo-600' : 'font-medium text-slate-500'
                    }`}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
