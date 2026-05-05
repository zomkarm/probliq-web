'use client'

import React,{ useState,useRef, useEffect } from 'react'
import { ClipboardList, Calendar, ArrowRight, Sparkles, History, TrendingUp } from 'lucide-react';
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [view, setView] = useState('home')

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const router = useRouter()


  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const logout = async () => {
    try{
      await fetch('/api/logout', { method: 'POST' })
      router.push('/signin')
    } catch(err){
      console.error('Error at Logout:', err)
    }
  }

  const navigateTo = (page) => {
    if(page === 'pq'){
      router.push('/user/pq')
    }else if(page === 'pq_view'){
      router.push('/user/home/pq-view')
    }else if(page === 'public_feed'){
      router.push('/user/home/public-feed')
    }
  }

  return (
    <div className="min-h-screen bg-bg-base text-zinc-300 relative">
      {/* Absolute overlay so it doesn't push content */}
      <div className="aura-overlay opacity-50 fixed inset-0 pointer-events-none" />

      {/* Global Return Button */}
      {view !== 'home' && (
        <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-start pointer-events-none">
          <button
            onClick={() => setView('home')}
            className="pointer-events-auto group flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-teal-500/30 transition-all animate-in fade-in slide-in-from-top-2 duration-500  cursor-pointer"
          >
            <ArrowRight size={14} className="rotate-180 text-zinc-500 group-hover:text-teal-500 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-200 group-hover:text-zinc-500">
              Return Home
            </span>
          </button>
        </div>
      )}

      {view === 'home' && (
        <header className="absolute top-0 left-0 right-0 z-[100] p-4 md:p-6 flex justify-between items-start pointer-events-none">

          {/* RIGHT SIDE: IDENTITY & MODAL */}
          <div className="flex items-center gap-2 md:gap-3 pointer-events-auto ml-auto">
            
            
            {/* AUTH STATUS CHIP (Guest / Signin) */}
            <div className="pointer-events-auto px-3 py-2 rounded-full border border-zinc-800 bg-zinc-950/40 backdrop-blur-xl flex flex-col items-center leading-tight">
              <span className="text-[10px] font-bold tracking-wider text-teal-500">
                Active
              </span>
            </div>

            {/* PROFILE DROPDOWN GROUP */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center gap-1 rounded-xl bg-zinc-950/40 backdrop-blur-xl border transition-all duration-500 animate-in fade-in slide-in-from-top-4 cursor-pointer ${isProfileOpen ? 'border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.2)]' : 'border-zinc-900 hover:border-zinc-700'}`}
                >
                  <div className={`w-4 h-0.5 transition-all ${isProfileOpen ? 'bg-teal-500 rotate-45 translate-y-1.5' : 'bg-zinc-500'}`} />
                  <div className={`w-4 h-0.5 transition-all ${isProfileOpen ? 'opacity-0' : 'bg-zinc-500'}`} />
                  <div className={`w-4 h-0.5 transition-all ${isProfileOpen ? 'bg-teal-500 -rotate-45 -translate-y-1.5' : 'bg-zinc-500'}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-56 origin-top-right rounded-2xl bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-200">
                    <div className="p-3 mb-1 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-zinc-900 border border-teal-500/20 flex items-center justify-center text-xs font-black text-teal-500">
                        OP
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">Problem Solver</span>
                        <span className="text-[9px] text-zinc-500 uppercase font-medium">Session: Active</span>
                      </div>
                    </div>

                    <div className="h-px bg-zinc-900 mx-2 my-1" />

                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                      <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase">Account Settings</span>
                      <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                    </button>

                    <button onClick={logout} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-500/10 transition-colors group cursor-pointer">
                      <span className="text-[10px] font-bold text-red-500/80 group-hover:text-red-500 uppercase">Logout</span>
                      <svg className="w-3 h-3 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                  </div>
                )}
              </div>

          </div>
        </header>
      )}

      <div className={`relative z-10 w-full ${view === 'home' ? 'min-h-screen flex items-center justify-center px-6' : 'p-0'}`}>
        
        {/* ================= HOME VIEW ================= */}
        {view === 'home' && (
          <div className="w-full max-w-lg my-20 space-y-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-teal-500/80 mb-4 justify-center">
                <Sparkles size={14} />
                <span className="text-md font-bold tracking-[0.3em] uppercase">Probliq</span>
              </div>
              <p className="text-zinc-500 text-sm mt-3 font-light">
                Break it down. Move forward.
              </p>
            </div>

            {/* Action Grid */}
            <div className="grid gap-px bg-zinc-800/50 border border-zinc-800/50 rounded-xl overflow-hidden shadow-2xl">
              <button
                onClick={() => navigateTo('pq')}
                className="group w-full text-left p-8 bg-bg-base hover:bg-zinc-900/50 transition-all flex items-center justify-between outline-none"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-teal-500/30 transition-colors">
                    <ClipboardList size={20} strokeWidth={1.5} className="text-zinc-400 group-hover:text-teal-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white tracking-wide">Problem Breakdown Engine</div>
                    <div className="text-xs text-zinc-500 mt-1 font-light">Break down what’s bothering you into clear, structured problems</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => navigateTo('pq_view')}
                className="group w-full text-left p-8 bg-bg-base hover:bg-zinc-900/50 transition-all flex items-center justify-between outline-none"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-teal-500/30 transition-colors">
                    <Calendar size={20} strokeWidth={1.5} className="text-zinc-400 group-hover:text-teal-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white tracking-wide">Problem Sets</div>
                    <div className="text-xs text-zinc-500 mt-1 font-light">Work through your problems and take action step by step</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => navigateTo('public_feed')}
                className="group w-full text-left p-8 bg-bg-base hover:bg-zinc-900/50 transition-all flex items-center justify-between outline-none"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-teal-500/30 transition-colors">
                    <Calendar size={20} strokeWidth={1.5} className="text-zinc-400 group-hover:text-teal-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white tracking-wide">Shared Space</div>
                    <div className="text-xs text-zinc-500 mt-1 font-light">Explore how others structure and approach their problems</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>


            </div>

            {/* Help / Science Shortcut */}
            <div className="flex justify-center pb-2">
              <a 
                href="/guide"
                className="group flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800/50 hover:border-teal-500/30 transition-all"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50 group-hover:bg-teal-500 animate-pulse" />
                <span className="text-[11px] font-medium text-zinc-500 group-hover:text-zinc-300 tracking-wide">
                  How does this work?
                </span>
              </a>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-zinc-600 tracking-wider font-light">
                Your data is private and stays on this device.
              </p>
            </div>
          </div>
        )}

        {/* ================= SUB-MODULES ================= */}
        {/* We remove the max-w-lg wrapper here so the components can handle their own width/padding */}
        {view === 'add' && (
          {/*<AddMissions onBack={() => setView('home')} />*/}
        )}


      </div>
    </div>
  )
}