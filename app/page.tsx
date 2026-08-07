'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from './components/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';

export default function DownloadPage() {
  const { theme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installState, setInstallState] = useState<'idle' | 'installing' | 'installed'>('idle');
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Detect already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Capture the install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handlePWAInstall = async () => {
    if (!deferredPrompt) return;
    setInstallState('installing');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallState('installed');
      setDeferredPrompt(null);
    } else {
      setInstallState('idle');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden transition-colors duration-500 bg-zinc-50 text-zinc-900 dark:bg-[#09090b] dark:text-[#fafafa]">

      {/* First Fold Container (Header + Hero Showcase) */}
      <div className="min-h-screen lg:h-screen lg:min-h-0 flex flex-col justify-between relative w-full">
        {/* Background ambient lighting */}
        <div className="gradient-blur -top-40 -left-40"></div>
        <div className="gradient-blur top-[50%] -right-40"></div>

        {/* Header Bar */}
        <header className="w-full max-w-7xl mx-auto px-6 py-6 lg:py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.png"
              alt="Connect Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg sm:rounded-xl bg-black border border-zinc-800 shadow-md"
            />
            <span className="font-display font-extrabold tracking-wider text-sm sm:text-lg uppercase text-zinc-900 dark:text-white">
              Connect
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <a
              href="https://github.com/HammadNawaz519"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full transition-all duration-300 shadow-sm"
            >
              Developer
            </a>
          </div>
        </header>

        {/* Main Hero & Showcase Grid */}
        <main className="w-full max-w-7xl mx-auto px-6 pt-4 pb-12 lg:pt-4 lg:pb-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 flex-grow">

          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:space-y-5 xl:space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase w-fit shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Available on Android & iOS
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-[2.75rem] xl:text-[3.5rem] font-display font-extrabold leading-[1.05] tracking-tight text-zinc-900 dark:text-white">
                Simplicity Meets <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-700 via-zinc-950 to-zinc-500 dark:from-zinc-200 dark:via-white dark:to-zinc-400">
                  Premium Chatting.
                </span>
              </h1>
            </div>

            {/* Action Area */}
            <div className="flex flex-col gap-3">

              {/* PWA Install Button — primary for supported browsers */}
              {isStandalone ? (
                <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Connect is already installed on your device!
                </div>
              ) : deferredPrompt ? (
                /* Android/Chrome: native install prompt */
                <button
                  onClick={handlePWAInstall}
                  disabled={installState === 'installing' || installState === 'installed'}
                  className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all duration-300 font-bold rounded-full text-center text-sm shadow-xl active:scale-[0.98] overflow-hidden disabled:opacity-70"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  {installState === 'installed' ? (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Installed!
                    </>
                  ) : installState === 'installing' ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Installing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 flex-shrink-0 group-hover:translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Install Connect App
                    </>
                  )}
                </button>
              ) : isIOS ? (
                /* iOS: show instructions since no prompt API */
                <div className="flex flex-col gap-2 px-6 py-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <p className="text-sm font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Install on iPhone / iPad
                  </p>
                  <ol className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1 font-medium list-decimal list-inside">
                    <li>Open this page in <strong className="text-zinc-700 dark:text-zinc-300">Safari</strong></li>
                    <li>Tap the <strong className="text-zinc-700 dark:text-zinc-300">Share</strong> button (box with arrow ↑)</li>
                    <li>Select <strong className="text-zinc-700 dark:text-zinc-300">"Add to Home Screen"</strong></li>
                    <li>Tap <strong className="text-zinc-700 dark:text-zinc-300">Add</strong> — done!</li>
                  </ol>
                </div>
              ) : null}

              {/* Two secondary buttons row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* APK download */}
                <a
                  href="/connect.apk"
                  download="Connect.apk"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-zinc-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 font-semibold rounded-full text-sm shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1.5c-.96 0-1.86.23-2.66.63L7.85.65c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 006 8h12a5.983 5.983 0 00-2.47-5.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                  </svg>
                  Download APK (Android)
                </a>

                {/* Web version */}
                <a
                  href="https://myconnectapp.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-zinc-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 font-semibold rounded-full text-sm shadow-sm"
                >
                  Open Web Version
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="pt-6 lg:pt-4 border-t border-zinc-200 dark:border-zinc-900 grid grid-cols-3 gap-6 lg:gap-4 max-w-lg">
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">APK Size</p>
                <p className="text-sm font-bold text-zinc-800 dark:text-white">7.77 MB</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Version</p>
                <p className="text-sm font-bold text-zinc-800 dark:text-white">v1.0.0</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Platform</p>
                <p className="text-sm font-bold text-zinc-800 dark:text-white">Android + iOS</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end lg:pr-12 animate-fade-in-up [animation-delay:200ms]">
            <div className="relative w-64 sm:w-[270px] lg:w-[220px] xl:w-[250px] h-[500px] lg:h-[420px] xl:h-[460px] bg-zinc-950 border-[1.5px] border-zinc-950 dark:border-zinc-800 rounded-[2.6rem] lg:rounded-[2.2rem] xl:rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-float">

              {/* Inner Phone Screen Container */}
              <div className="w-full h-full bg-white relative flex flex-col justify-between pt-5 lg:pt-4">

                {/* Phone Hardware Punch-hole Camera */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900/60"></span>
                </div>

                {/* Status Bar */}
                <div className="w-full flex justify-between items-center px-4 pt-1 pb-1.5 lg:pb-1 text-[9px] font-semibold text-zinc-900 select-none z-35 mt-0.5 lg:mt-0">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M2 22h20V2z" />
                    </svg>
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21l-12-18c0 0 4.5-3 12-3s12 3 12 3l-12 18z" />
                    </svg>
                    <div className="w-4 h-2 border border-current rounded-xs p-[0.5px] flex items-center">
                      <div className="h-full w-[85%] bg-current rounded-xs"></div>
                    </div>
                  </div>
                </div>

                {/* Sign In Header Block */}
                <div className="text-left z-10 flex flex-col px-4 mt-3 lg:mt-1 xl:mt-2">
                  <h1 className="text-4xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight text-[#121214]">
                    Sign In
                  </h1>
                  <p className="text-[11px] lg:text-[9.5px] xl:text-[11px] text-zinc-500 font-medium tracking-wide mt-1.5 lg:mt-0.5 leading-relaxed max-w-[190px] lg:max-w-[160px] xl:max-w-[190px]">
                    Welcome back. Please enter your credentials to access dashboard
                  </p>
                </div>

                {/* Bottom Sheet */}
                <div className="w-full bg-[#121214] border-t border-[#1e1e21] rounded-t-[1.8rem] lg:rounded-t-[1.5rem] px-4 pt-4 lg:pt-3 pb-6 lg:pb-4 shadow-[0_-15px_40px_rgba(0,0,0,0.25)] z-40 mt-auto flex flex-col space-y-2 lg:space-y-1.5">
                  {/* Drag handle & back button */}
                  <div className="flex items-center justify-between mb-1.5 lg:mb-0.5">
                    <div className="w-7 h-7 lg:w-6 lg:h-6 rounded-full flex items-center justify-center bg-[#1c1c1e] border border-[#1e1e21] text-white">
                      <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </div>
                    <div className="w-10 h-0.5 bg-[#27272a] rounded-full" />
                    <div className="w-7 lg:w-6" />
                  </div>

                  {/* Form fields */}
                  <div className="space-y-2 lg:space-y-1.5">
                    <div className="w-full rounded-full bg-[#1c1c1e] border border-zinc-800 px-3.5 py-2 lg:py-1.5 flex items-center">
                      <span className="text-[11px] lg:text-[10px] text-zinc-500 font-medium">Email Address</span>
                    </div>
                    <div className="w-full rounded-full bg-[#1c1c1e] border border-zinc-800 px-3.5 py-2 lg:py-1.5 flex items-center justify-between">
                      <span className="text-[11px] lg:text-[10px] text-zinc-500 font-medium">Password</span>
                      <span className="text-[9px] lg:text-[8px] text-zinc-500 font-medium hover:text-white cursor-pointer transition-colors">Forgot?</span>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="w-full bg-white text-black rounded-full py-2 lg:py-1.5 font-bold text-center text-xs lg:text-[10px] shadow-md mt-1.5 lg:mt-1 hover:bg-zinc-200 transition-colors cursor-pointer">
                    Sign In
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-2 text-zinc-700 text-[9px] lg:text-[8px] my-1 lg:my-0.5">
                    <div className="h-[1px] flex-1 bg-zinc-800" />
                    <span>or</span>
                    <div className="h-[1px] flex-1 bg-zinc-800" />
                  </div>

                  {/* Google login button */}
                  <div className="w-full py-2 lg:py-1.5 bg-[#1c1c1e] border border-[#1e1e21] text-white rounded-full flex items-center justify-center gap-1.5 text-xs lg:text-[10px] hover:bg-zinc-850 transition-all cursor-pointer">
                    <svg className="h-3 w-3" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-[11px]">Continue with Google</span>
                  </div>
                </div>

                {/* Phone home handle bar */}
                <div className="w-full bg-[#121214] pb-2 lg:pb-1.5 flex justify-center z-40">
                  <div className="w-20 h-0.5 bg-zinc-700 rounded-full" />
                </div>

              </div>
            </div>
          </div>

        </main>
      </div>

      {/* How to Get It Section */}
      <section className="w-full border-t border-zinc-200 dark:border-zinc-900 py-20 relative z-10 transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6">

          {/* Section Header */}
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">Getting started</p>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
              Pick your platform, we'll handle the rest.
            </h2>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
              Connect runs natively on Android and iOS. Install it in under a minute — no account required to try it.
            </p>
          </div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">

            {/* Android Card */}
            <div className="group relative bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-950/60">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1.5c-.96 0-1.86.23-2.66.63L7.85.65c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 006 8h12a5.983 5.983 0 00-2.47-5.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Android</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Chrome · PWA install</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { step: '1', text: <>Open this page in <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Chrome</strong> on your Android phone</> },
                  { step: '2', text: <>Tap the <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Install Connect</strong> button above, or open Chrome's ⋮ menu and choose <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Add to Home Screen</strong></> },
                  { step: '3', text: <>Hit <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Install</strong> — that's it. Connect lives on your home screen now.</> },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{step}</span>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* iPhone Card */}
            <div className="group relative bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-950/60">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-sky-500/10 dark:bg-sky-500/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">iPhone / iPad</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Safari · Add to Home Screen</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { step: '1', text: <>Open this page in <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Safari</strong> — not Chrome or Firefox, it has to be Safari</> },
                  { step: '2', text: <>Tap the <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Share</strong> icon at the bottom of your screen (the box with an arrow pointing up)</> },
                  { step: '3', text: <>Scroll down the share sheet and tap <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Add to Home Screen</strong></> },
                  { step: '4', text: <>Tap <strong className="text-zinc-700 dark:text-zinc-200 font-semibold">Add</strong> in the top right. Done — Connect is on your iPhone.</> },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{step}</span>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* APK Section */}
          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-14">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Android only</p>
              <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
                Prefer the APK?
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                Skip the browser install — download the APK file directly and sideload it like any other app.
              </p>
            </div>

            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-5 left-[calc(16.666%-1px)] right-[calc(16.666%-1px)] h-px bg-zinc-200 dark:bg-zinc-800 z-0" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    ),
                    title: 'Download the APK',
                    desc: 'Tap "Download APK" on this page. The file is about 7.77 MB and downloads straight to your phone.',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" />
                      </svg>
                    ),
                    title: 'Allow unknown sources',
                    desc: 'When prompted, allow your browser or Files app to install apps from unknown sources. You can turn it off right after.',
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                      </svg>
                    ),
                    title: 'Open and sign in',
                    desc: "Tap the downloaded file, hit Install, and you're in. Sign in to start chatting.",
                  },
                ].map(({ icon, title, desc }, i) => (
                  <div key={i} className="flex flex-col items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shadow-sm">
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">{title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-900 py-10 relative z-10 bg-white dark:bg-black transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Connect" className="w-5 h-5 rounded-md object-contain bg-black border border-zinc-800" />
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Connect &copy; 2026</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-zinc-400 dark:text-zinc-500">
            <a href="https://github.com/HammadNawaz519" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">GitHub</a>
            <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
