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
    <div className="min-h-screen relative flex flex-col overflow-x-hidden transition-colors duration-500 bg-[#fbfbfb] text-zinc-900 dark:bg-[#09090b] dark:text-[#fafafa]">

      {/* First Fold Container (Header + Hero Showcase) */}
      <div className="min-h-screen lg:h-screen lg:min-h-0 flex flex-col justify-between relative w-full">
        {/* Background ambient lighting */}
        <div className="gradient-blur -top-40 -left-40"></div>
        <div className="gradient-blur top-[50%] -right-40"></div>

        {/* Header Bar: Borderless & Airy */}
        <header className="w-full max-w-7xl mx-auto px-6 py-6 lg:py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src="/logo.png"
              alt="Connect Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl bg-black shadow-md"
            />
            <span className="font-display font-extrabold tracking-wider text-sm sm:text-lg uppercase text-zinc-900 dark:text-white">
              Connect
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <ThemeToggle />
            <a
              href="https://github.com/HammadNawaz519"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100/90 dark:bg-zinc-800/80 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 shadow-sm"
            >
              Developer
            </a>
          </div>
        </header>

        {/* Main Hero & Showcase Grid */}
        <main className="w-full max-w-7xl mx-auto px-6 pt-4 pb-12 lg:pt-4 lg:pb-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 flex-grow">

          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-7 lg:space-y-5 xl:space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Android APK &amp; iOS Web App
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl lg:text-[2.75rem] xl:text-[3.5rem] font-display font-extrabold leading-[1.06] tracking-tight text-zinc-900 dark:text-white">
                Simplicity Meets <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-700 via-zinc-950 to-zinc-500 dark:from-zinc-200 dark:via-white dark:to-zinc-400">
                  Premium Chatting.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl font-normal leading-relaxed">
                Connect directly with friends and family. Real-time messaging, encrypted calls, audio notes, and instant notifications.
              </p>
            </div>

            {/* Action Area */}
            <div className="flex flex-col gap-3 pt-1">

              {/* PWA Install Button — primary for supported browsers */}
              {isStandalone ? (
                <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-semibold text-sm shadow-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Connect is already installed on your device!
                </div>
              ) : deferredPrompt ? (
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
                <div className="flex flex-col gap-2.5 px-6 py-4 bg-white/90 dark:bg-zinc-900/80 rounded-3xl shadow-lg shadow-zinc-200/50 dark:shadow-black/50">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Install on iPhone / iPad
                  </p>
                  <ol className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 font-medium list-decimal list-inside">
                    <li>Open this page in <strong className="text-zinc-900 dark:text-white font-semibold">Safari</strong></li>
                    <li>Tap the <strong className="text-zinc-900 dark:text-white font-semibold">Share</strong> button (box with arrow ↑)</li>
                    <li>Select <strong className="text-zinc-900 dark:text-white font-semibold">"Add to Home Screen"</strong></li>
                    <li>Tap <strong className="text-zinc-900 dark:text-white font-semibold">Add</strong> — opens like a real native app!</li>
                  </ol>
                </div>
              ) : null}

              {/* Two secondary buttons row: Borderless & Organic */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* APK download */}
                <a
                  href="/connect.apk"
                  download="Connect.apk"
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-300 font-bold rounded-full text-sm shadow-lg shadow-emerald-600/25 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1.5c-.96 0-1.86.23-2.66.63L7.85.65c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 006 8h12a5.983 5.983 0 00-2.47-5.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                  </svg>
                  Download APK (11.5 MB)
                </a>

                {/* Web version */}
                <a
                  href="https://myconnectapp.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/90 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 font-semibold rounded-full text-sm shadow-md shadow-zinc-200/50 dark:shadow-black/50 active:scale-[0.98]"
                >
                  Open Web Version
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Feature Badges: Clean, Borderless Spacing */}
            <div className="pt-5 lg:pt-3 grid grid-cols-3 gap-6 lg:gap-4 max-w-lg">
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">APK Size</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">11.5 MB</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Version</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">v1.0.0</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Platform</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Android + iOS</p>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup with the exact Connect App Login UI */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end lg:pr-12 animate-fade-in-up [animation-delay:200ms]">
            <div className="relative w-64 sm:w-[270px] lg:w-[230px] xl:w-[260px] h-[515px] lg:h-[450px] xl:h-[490px] bg-[#141111] rounded-[2.7rem] lg:rounded-[2.3rem] xl:rounded-[2.6rem] shadow-[0_30px_70px_rgba(0,0,0,0.22)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden animate-float flex flex-col justify-between select-none">

              {/* Hardware Punch-hole Camera */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900/80"></span>
              </div>

              {/* 1. TOP DARK REGION: BRANDING & HEADLINE (Exact Match to Web/Frontend/app/page.tsx) */}
              <div className="w-full bg-[#141111] pt-3 px-4 pb-3 flex flex-col relative shrink-0">
                {/* Status Bar */}
                <div className="w-full flex justify-between items-center text-[9px] font-semibold text-white/90 select-none px-1 pt-0.5 mb-2">
                  <span>9:41</span>
                  <div className="flex items-center gap-1 text-white/80">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M2 22h20V2z" />
                    </svg>
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21l-12-18c0 0 4.5-3 12-3s12 3 12 3l-12 18z" />
                    </svg>
                    <div className="w-3.5 h-2 border border-current rounded-xs p-[0.5px] flex items-center">
                      <div className="h-full w-[85%] bg-current rounded-xs"></div>
                    </div>
                  </div>
                </div>

                {/* Navigation Back Chevron Row */}
                <div className="w-full flex items-center justify-between min-h-[18px] mb-1">
                  <div className="w-5 h-5 -ml-1 text-white/70 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <div className="w-5" />
                </div>

                {/* Exact App Headline: "Welcome Back" */}
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-[17px] lg:text-[15px] xl:text-[17px] font-black text-white tracking-tight leading-tight">
                    Welcome Back
                  </h2>
                  <p className="text-[10px] lg:text-[8.5px] xl:text-[10px] text-zinc-400 mt-0.5 max-w-[200px] font-normal leading-tight">
                    Sign in to continue chatting with your friends
                  </p>
                </div>
              </div>

              {/* 2. BOTTOM WHITE SHEET: Exact Match to Connect App Bottom Container */}
              <div className="w-full flex-1 bg-white rounded-t-[28px] px-4 pt-2.5 pb-2.5 flex flex-col justify-between shadow-[0_-12px_35px_rgba(0,0,0,0.2)] z-40 text-zinc-900">
                {/* Sheet Drag Handle */}
                <div className="w-9 h-1 bg-zinc-200 rounded-full mx-auto mb-1.5 shrink-0" />

                {/* Segmented Pill Tabs: Sign In / Create Account */}
                <div className="w-full bg-zinc-100 p-0.5 rounded-full flex items-center mb-2 shrink-0">
                  <div className="flex-1 py-1 rounded-full text-[9.5px] lg:text-[8.5px] xl:text-[9.5px] font-bold bg-white text-zinc-900 shadow-xs text-center cursor-pointer">
                    Sign In
                  </div>
                  <div className="flex-1 py-1 rounded-full text-[9.5px] lg:text-[8.5px] xl:text-[9.5px] font-semibold text-zinc-500 text-center cursor-pointer">
                    Create Account
                  </div>
                </div>

                {/* Form Inputs (Exact Pill Style from Connect App) */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  {/* Email Pill Input */}
                  <div className="w-full h-8 lg:h-7 xl:h-8 bg-zinc-50 border border-zinc-200/80 rounded-full px-3 flex items-center gap-2">
                    <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="text-[10px] lg:text-[8.5px] xl:text-[10px] text-zinc-400 font-normal truncate">Email address</span>
                  </div>

                  {/* Password Pill Input */}
                  <div className="w-full h-8 lg:h-7 xl:h-8 bg-zinc-50 border border-zinc-200/80 rounded-full px-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="text-[10px] lg:text-[8.5px] xl:text-[10px] text-zinc-400 font-normal tracking-widest">••••••••••••</span>
                    </div>
                    <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end pr-1">
                    <span className="text-[8.5px] text-zinc-400 font-medium hover:text-zinc-700 cursor-pointer">Forgot password?</span>
                  </div>

                  {/* Submit Button */}
                  <div className="w-full h-8 lg:h-7.5 xl:h-8 bg-[#141111] hover:bg-black text-white font-bold text-[10.5px] lg:text-[9.5px] xl:text-[10.5px] rounded-full shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                    <span>Sign In</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 text-zinc-400 text-[8px] my-1 shrink-0">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <span className="uppercase tracking-wider font-semibold">Or</span>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>

                {/* Google Pill Button */}
                <div className="w-full h-8 lg:h-7.5 xl:h-8 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-semibold rounded-full flex items-center justify-center gap-2 text-[10px] lg:text-[8.5px] xl:text-[10px] cursor-pointer transition-all shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </div>

                {/* Home Bar Indicator */}
                <div className="w-16 h-1 bg-zinc-300 rounded-full mx-auto mt-1 shrink-0" />
              </div>

            </div>
          </div>

        </main>
      </div>

      {/* "PICK YOUR PLATFORM": Pure Organic, Human-Centric UI — Completely Borderless */}
      <section className="w-full py-28 relative z-10 transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6">

          {/* Section Header: Human, Welcoming, Borderless */}
          <div className="mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Human &amp; Frictionless
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.1]">
              Pick your device, we'll handle the rest.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
              Connect works effortlessly across Android, iPhone, iPad, and desktop browsers. No confusing app stores, no tracking, and zero borders.
            </p>
          </div>

          {/* Platform Cards: Elevated Organic Glass Cards, 100% Borderless */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

            {/* Android Card */}
            <div className="group relative bg-white/95 dark:bg-zinc-900/90 backdrop-blur-3xl rounded-[2.6rem] p-8 sm:p-9 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col justify-between">
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1.5c-.96 0-1.86.23-2.66.63L7.85.65c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 006 8h12a5.983 5.983 0 00-2.47-5.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Android</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">Direct APK install · Fast sideload</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    11.5 MB
                  </span>
                </div>

                {/* Friendly Human Steps */}
                <div className="space-y-3 mb-8">
                  {[
                    { step: '1', title: 'Tap Download APK', desc: 'The download starts immediately (11.5 MB total).' },
                    { step: '2', title: 'Open the download', desc: 'Tap Connect.apk from your browser or notification bar.' },
                    { step: '3', title: 'Install & chat', desc: "Hit Install and you're ready — no Play Store sign-in needed." },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start gap-3.5 bg-zinc-100/70 dark:bg-zinc-800/40 p-3.5 rounded-2xl">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{step}</span>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white leading-tight">{title}</p>
                        <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href="/connect.apk"
                download="Connect.apk"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1.5c-.96 0-1.86.23-2.66.63L7.85.65c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 006 8h12a5.983 5.983 0 00-2.47-5.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                </svg>
                Download APK (11.5 MB)
              </a>
            </div>

            {/* iPhone / iPad / Web Card */}
            <div className="group relative bg-white/95 dark:bg-zinc-900/90 backdrop-blur-3xl rounded-[2.6rem] p-8 sm:p-9 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col justify-between">
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">iPhone &amp; Web</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">Safari &amp; Desktop · Zero install size</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold">
                    Zero Install
                  </span>
                </div>

                {/* Friendly Human Steps */}
                <div className="space-y-3 mb-8">
                  {[
                    { step: '1', title: 'Open in Safari or Browser', desc: 'Visit myconnectapp.vercel.app on any device.' },
                    { step: '2', title: 'Tap Share & Add to Home Screen', desc: 'On iOS, tap Share (↑) and select "Add to Home Screen".' },
                    { step: '3', title: 'Launch natively', desc: 'Opens in fullscreen like an app with zero disk footprint.' },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start gap-3.5 bg-zinc-100/70 dark:bg-zinc-800/40 p-3.5 rounded-2xl">
                      <span className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{step}</span>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white leading-tight">{title}</p>
                        <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href="https://myconnectapp.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-sm sm:text-base shadow-lg shadow-zinc-900/15 dark:shadow-white/15 active:scale-[0.98] transition-all"
              >
                Launch Web App
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

          </div>

          {/* Direct Sideloading Guidance: Soft, Reassuring, 100% Borderless */}
          <div className="pt-6">
            <div className="mb-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold tracking-wide mb-3">
                Android Sideloading Help
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
                New to installing APK files?
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg">
                Direct sideloading gives you faster updates and total privacy. Here is how simple it is:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  ),
                  title: '1. Download (11.5 MB)',
                  desc: 'Tap "Download APK" above. The file is lightweight (~11.5 MB) and finishes downloading in seconds.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" />
                    </svg>
                  ),
                  title: '2. Allow Installation',
                  desc: 'If Android prompts you, tap Settings and allow your browser or Files app to install unknown apps. This is completely standard.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: '3. Open & Sign In',
                  desc: "Tap Install, open Connect, and log in with your credentials or Google. All your chats will sync seamlessly.",
                },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} className="flex flex-col items-start gap-4 bg-white/95 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2rem] p-7 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all">
                  <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-xs">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Footer: Borderless, Soft, Minimalist */}
      <footer className="w-full py-12 relative z-10 bg-transparent transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Connect" className="w-5 h-5 rounded-md object-contain bg-black shadow-xs" />
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Connect &copy; 2026</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            <a href="https://github.com/HammadNawaz519" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">GitHub</a>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
