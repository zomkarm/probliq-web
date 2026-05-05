"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateLogin } from '@/lib/validations/validateUser'
import { useGlobalStore } from '@/store/globalStore'
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const router = useRouter()
  const showLoader = useGlobalStore(s => s.showLoader)
  const hideLoader = useGlobalStore(s => s.hideLoader)

  async function handleSubmit(e) {
    e.preventDefault()
    showLoader("Signing in…")
    const errs = validateLogin(form)
    if (Object.keys(errs).length) return setErrors(errs)

    const res = await fetch('/api/signin', {
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
      setErrors({ general: 'Login failed. Please check your credentials.' })
    }
  }

return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor matching Home UI */}
      <div className="aura-overlay opacity-50 fixed inset-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-8"
        >
          {/* Header Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-teal-500/80 mb-4 justify-center">
              <Sparkles size={16} />
              <span className="text-sm font-bold tracking-[0.3em] uppercase">Probliq</span>
            </div>
            <h2 className="text-2xl font-light italic text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 font-medium">
              Continue your journey
            </p>
          </div>

          {errors.general && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 text-center">{errors.general}</p>
            </div>
          )}

          <div className="space-y-5">
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            className="group w-full py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-teal-400 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            Sign In
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-4 pt-2">
            <a href="/forgot-password" size={16} className="text-[10px] text-zinc-600 hover:text-teal-500 transition-colors uppercase tracking-widest font-medium">
              Forgot Password ?
            </a>
            
            <div className="h-[1px] w-12 bg-zinc-800" />
            
            <p className="text-[11px] text-zinc-500 font-light">
              New user?{" "}
              <a href="/signup" className="text-teal-500 font-bold hover:underline ml-1">
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
