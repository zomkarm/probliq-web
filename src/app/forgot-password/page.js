"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalStore } from '@/store/globalStore'
import { Sparkles, Mail, ArrowRight } from 'lucide-react';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetUrl,setResetUrl] = useState(null)
  const router = useRouter();
  const showLoader = useGlobalStore(s => s.showLoader)
  const hideLoader = useGlobalStore(s => s.hideLoader)

  async function handleSubmit(e) {
    e.preventDefault();
    showLoader("Sending Reset Link...")
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.resetUrl) {
          setResetUrl(json.resetUrl);
          //console.log("Test reset URL:", json.resetUrl);
        }
        setMessage("If this email exists, a reset link has been sent.");
      } else {
        setError("Something went wrong. Please try again.");
      }

    } catch (err) {
      setError("Server error. Please try again later.");
    }
    hideLoader()
  }

return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor matching dashboard style */}
      <div className="aura-overlay opacity-40 fixed inset-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-8"
        >
          {/* Header Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-teal-500/80 mb-4 justify-center">
              <Sparkles size={16} />
              <span className="text-sm font-bold tracking-[0.3em] uppercase tracking-widest">Probliq</span>
            </div>
            <h2 className="text-2xl font-light italic text-white tracking-tight">
              Reset your password
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 font-medium">
              Enter your email address and we’ll send you a link to reset your password.
            </p>
          </div>

          {/* Feedback Messages */}
          {message && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-emerald-400 text-center">{message}</p>
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 text-center">{error}</p>
            </div>
          )}
          {resetUrl && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-2">Test Mode Active</p>
              <a href={resetUrl} className="text-xs text-amber-200 underline break-all opacity-80 hover:opacity-100">
                {resetUrl}
              </a>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
              <Mail size={12} className="text-teal-500/70" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 px-4 py-3 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-teal-500/50 transition-all hover:border-zinc-700"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="group w-full py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-teal-400 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            Send Reset Link
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Navigation Links */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-zinc-500 font-light">
              Remembered your password?{" "}
              <a href="/signin" className="text-teal-500 font-bold hover:underline ml-1">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
