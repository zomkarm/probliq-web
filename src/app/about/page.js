"use client";

import React from 'react';
import Header from "@/components/ui/guest/blocks/Header";
import Footer from "@/components/ui/guest/blocks/Footer";
import { ShieldCheck, Target, Coffee, Eye, Sparkles, Database, Quote } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] selection:bg-teal-500/30">
      <div className="aura-overlay" />

      <Header />

      <main className="relative z-10 px-8 pt-8 mx-auto max-w-7xl">
        
        {/* --- Hero Section: The Objective Perspective --- */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800/50 shadow-2xl">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" />
          
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center px-6 sm:px-10 py-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                System Logic
              </div>
              <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-white leading-[0.95]">
                Observation <br />
                <span className="italic text-teal-500 font-serif">over Outcome.</span>
              </h1>

              <div className="mt-10 space-y-6 text-lg text-zinc-400 leading-relaxed font-light max-w-xl">
                <p>
                  Probliq is a <span className="text-white font-normal">behavioral sandbox</span> designed to decouple social anxiety from reality. We build tools that treat confidence as a byproduct of accurate observation, not a personality trait.
                </p>
                <p className="text-base text-zinc-500">
                  By utilizing structured reflection loops and objective tasking, we help you transition from being overwhelmed by the environment to documenting it with clarity.
                </p>
              </div>
            </div>

            {/* Creator Card */}
            <div className="md:col-span-5 relative">
               <div className="bg-zinc-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-zinc-800 shadow-2xl relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="relative">
                       <img src="/profile.jpg" alt="Omkar M. Zende" className="w-16 h-16 rounded-2xl object-cover grayscale opacity-80" />
                       <div className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-1.5 rounded-lg">
                          <Target size={14} />
                       </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white tracking-tight">Omkar M. Zende</h3>
                      <p className="text-[10px] font-bold text-teal-500 uppercase tracking-[0.2em]">Product Architect</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-4 -left-4 text-zinc-800 w-8 h-8 -z-10" />
                    <p className="text-zinc-400 text-sm leading-relaxed italic font-light">
                      "I designed Probliq to be the tool I needed—a way to turn the chaos of social hesitation into a series of logical, manageable data points."
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-between items-center text-[10px] font-bold uppercase text-zinc-600 tracking-widest">
                     <span>Full-Stack Engineering</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-teal-900" />
                     <span>Pune, IN</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* --- Mission Section: Integrated & Dark --- */}
        <section className="mt-8 relative overflow-hidden rounded-[2.5rem] border border-zinc-800/50 bg-gradient-to-b from-zinc-900/10 to-transparent px-8 py-20 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-500 mb-8">
            <Sparkles size={20} />
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-white tracking-tighter mb-6">
            The Mission
          </h2>
          <p className="max-w-3xl mx-auto text-zinc-400 leading-relaxed text-lg font-light">
            To bridge the gap between <span className="text-zinc-200">internal hesitation</span> and <span className="text-zinc-200">external action</span> through deterministic utilities. We aim to replace the "fake it till you make it" mantra with a systematic approach to emotional safety.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4 text-teal-500/60 font-serif italic text-xl">
            <span className="h-[1px] w-12 bg-zinc-800" />
            "Logic is the antidote to anxiety"
            <span className="h-[1px] w-12 bg-zinc-800" />
          </div>
        </section>

        {/* --- Philosophy Grid --- */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pb-6">
          
          {/* Methodology */}
          <div className="bg-zinc-900/10 rounded-[2.5rem] p-12 border border-zinc-800/50 hover:bg-zinc-900/30 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-teal-500 mb-8 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all">
               <Eye size={22} />
            </div>
            <h3 className="text-2xl font-medium text-white mb-4">The Witness Loop</h3>
            <p className="text-zinc-500 leading-relaxed font-light text-sm">
              Our core methodology involves shifting the user’s role from a "self-conscious participant" to an "objective witness." By documenting environmental facts, the nervous system naturally finds safety in the present moment.
            </p>
          </div>

          {/* Privacy/Tech */}
          <div className="bg-zinc-900/10 rounded-[2.5rem] p-12 border border-zinc-800/50 hover:bg-zinc-900/30 transition-all duration-500 group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-teal-500 mb-8 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all">
               <Database size={22} />
            </div>
            <h3 className="text-2xl font-medium text-white mb-4">Local-First Integrity</h3>
            <p className="text-zinc-500 leading-relaxed font-light text-sm">
              Social practice requires absolute vulnerability. Probliq is built as a local-first PWA, meaning your reflections and growth data never leave your device. No tracking, no cloud—just your progress.
            </p>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}