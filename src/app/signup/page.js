"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateSignup } from '@/lib/validations/validateUser'
import { useGlobalStore } from '@/store/globalStore'
import { Sparkles, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const router = useRouter()
  const showLoader = useGlobalStore(s => s.showLoader)
  const hideLoader = useGlobalStore(s => s.hideLoader)

  async function handleSubmit(e) {
    e.preventDefault()
    showLoader("Creating your account…")
    const errs = validateSignup(form)
    if (Object.keys(errs).length) return setErrors(errs)

    const res = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) router.push('/user/home')
    else {
      hideLoader()
      setErrors({ general: 'Signup failed. Please try again.' })
    }
  }

  return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor matching dashboard style */}
      <div className="aura-overlay opacity-40 fixed inset-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-7"
        >
          {/* Header Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-teal-500/80 mb-4 justify-center">
              <Sparkles size={16} />
              <span className="text-sm font-bold tracking-[0.3em] uppercase">Probliq</span>
            </div>
            <h2 className="text-2xl font-light italic text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 font-medium">
              Join the Journey
            </p>
          </div>

          {errors.general && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 text-center">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                <User size={12} className="text-teal-500/70" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={`w-full bg-zinc-950/50 border ${
                  errors.name ? "border-red-500/50" : "border-zinc-800"
                } px-4 py-3 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-teal-500/50 transition-all hover:border-zinc-700`}
                placeholder="Identity"
                required
              />
              {errors.name && <p className="text-[10px] text-red-400 mt-1 ml-1">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                <Mail size={12} className="text-teal-500/70" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={`w-full bg-zinc-950/50 border ${
                  errors.email ? "border-red-500/50" : "border-zinc-800"
                } px-4 py-3 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-teal-500/50 transition-all hover:border-zinc-700`}
                placeholder="name@example.com"
                required
              />
              {errors.email && <p className="text-[10px] text-red-400 mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                <Lock size={12} className="text-teal-500/70" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className={`w-full bg-zinc-950/50 border ${
                  errors.password ? "border-red-500/50" : "border-zinc-800"
                } px-4 py-3 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-teal-500/50 transition-all hover:border-zinc-700`}
                placeholder="••••••••"
                required
              />
              {errors.password && <p className="text-[10px] text-red-400 mt-1 ml-1">{errors.password}</p>}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="group w-full py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-teal-400 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            Create Account
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-zinc-500 font-light">
              Already Registered?{" "}
              <a href="/signin" className="text-teal-500 font-bold hover:underline ml-1">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
