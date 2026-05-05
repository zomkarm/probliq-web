import React from 'react';
import { Shield, ListTree, PenLine, ArrowRight, Sparkles, Box, Trash2 } from 'lucide-react';
import Header from "@/components/ui/guest/blocks/Header";
import Footer from "@/components/ui/guest/blocks/Footer";

export default function ProbliqHome() {
  return (
    // Added overflow-x-hidden to prevent the "half-screen" white space issue
    <div className="relative min-h-screen bg-[#09090b] selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Background glow: Changed w-[1000px] to max-w-full/dynamic for mobile safety */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <Header />

      <main className="relative z-10 px-6 md:px-8 pt-12 md:pt-20 mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          
          <div className="flex items-center justify-center space-x-3 text-indigo-400 mb-6 md:mb-8 bg-indigo-400/5 px-4 py-2 rounded-full border border-indigo-400/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Exhale the noise</span>
          </div>
          
          {/* Adjusted mobile text size from 6xl to 4xl/5xl to prevent overflow */}
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-bold text-white tracking-tighter mb-8 md:mb-10 leading-[0.9] text-center">
            Make the dread <br />
            <span className="text-zinc-600 italic font-light text-3xl sm:text-5xl md:text-8xl">feel finite again.</span>
          </h1>
          
          <p className="text-base md:text-xl text-zinc-400 leading-relaxed mb-10 md:mb-12 max-w-2xl font-light mx-auto">
            When life feels like an overwhelming wave, your brain freezes. 
            Probliq helps you offload the weight—breaking big fears into small, 
            manageable pieces until you can breathe again.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 w-full sm:w-auto">
            <a href="/signup" className="group flex items-center justify-center px-10 py-4 md:px-12 md:py-5 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all rounded-2xl shadow-xl shadow-white/5">
             Get Started <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="mt-32 md:mt-48 space-y-24 md:space-y-40">

          {/* THE FLOW */}
          <div className="relative border border-zinc-800 rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-900/40 to-transparent">
            <div className="p-10 md:p-20 text-center max-w-3xl mx-auto space-y-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-indigo-400/70">The Gentle Path</p>
              <h2 className="text-2xl md:text-5xl text-white font-light leading-tight tracking-tight">
                One step at a time, <br /> without the pressure to be perfect.
              </h2>
            </div>

            {/* Mobile-friendly grid: stacked on small, 2x2 on medium, 4 on large */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
              {[
                {
                  icon: PenLine,
                  title: 'Raw Dump',
                  desc: 'Write down everything that feels heavy. Get it out of your head.'
                },
                {
                  icon: ListTree,
                  title: 'Decompose',
                  desc: 'Break big worries into tiny pieces. Smaller than your fear.'
                },
                {
                  icon: Box,
                  title: 'The Stack',
                  desc: 'Pick just one thing. We hide the rest so you don’t feel crowded.'
                },
                {
                  icon: Trash2,
                  title: 'Fear Eater',
                  desc: 'Is something stopping you? Name it, watch it disappear.'
                }
              ].map((item, i) => (
                <div key={i} className="group bg-[#09090b] p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                  <item.icon className="text-indigo-400 w-6 h-6 mb-6" />
                  <h3 className="text-white text-lg tracking-wide mb-2">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* THE PRINCIPLES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {[
              { title: 'Private Space', desc: 'Your thoughts stay on your device. No cloud, no judgment.' },
              { title: 'Friction First', desc: 'The goal isn’t to do more, it’s to feel less resistance.' },
              { title: 'Focus Tunnel', desc: 'We show you only what you need to see right now.' },
              { title: 'Dumb by Design', desc: 'Simple structure to help you find your own way.' }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 rounded-3xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 blur-xl transition duration-700" />
                <div className="relative border border-zinc-800 rounded-3xl p-8 md:p-10 bg-zinc-950/40 backdrop-blur-xl h-full">
                  <h3 className="text-lg md:text-xl text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FINAL PHILOSOPHY */}
          <div className="text-center max-w-2xl mx-auto space-y-8 pb-20">
            <h3 className="text-xl md:text-3xl text-white font-light tracking-tight">
              A planner for your burdens,<br />not your goals.
            </h3>
            <div className="flex flex-wrap justify-center gap-3 text-[10px] uppercase tracking-widest">
              <span className="px-4 py-2 border border-zinc-800 rounded-full text-zinc-500">Local Privacy</span>
              <span className="px-4 py-2 border border-zinc-800 rounded-full text-zinc-500">Zero Pressure</span>
            </div>
          </div>

        </section>

        <Footer />
      </main>
    </div>
  );
}