"use client";

import { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Signin', href: '/signin' },
  ];

  return (
    <header className="relative z-50 flex items-center justify-between px-8 py-10 mx-auto max-w-7xl">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Soft Brackets - Zinc-500 */}
            <path 
              d="M35 25H25V35" 
              stroke="#71717a" 
              strokeWidth="6" 
              strokeLinecap="round"
            />
            <path 
              d="M65 75H75V65" 
              stroke="#71717a" 
              strokeWidth="6" 
              strokeLinecap="round"
            />
            
            {/* The Clarity Dot - Indigo-400 */}
            <circle 
              cx="50" 
              cy="50" 
              r="14" 
              fill="#818cf8" 
              className="drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]"
            />
          </svg>
        </div>
        <Link href="/">
          <span className="text-base font-bold tracking-[0.3em] text-white uppercase">Probliq</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 text-[11px] font-bold tracking-widest uppercase text-zinc-500">
        {navLinks.map((link) => (
          <Link 
            key={link.name}
            href={link.href} 
            className="px-6 py-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all rounded-full"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleMenu}
        className="md:hidden p-2 text-zinc-400 hover:text-indigo-400 transition-colors z-[60]"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Drawer */}
      <div className={`
        fixed inset-0 z-50 bg-[#09090b]/98 backdrop-blur-2xl md:hidden transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        <div className="flex items-center justify-between px-8 py-10">
          <div className="flex items-center space-x-3 opacity-50">
            <Sparkles className="text-indigo-400 w-4 h-4" />
            <span className="text-xs font-bold tracking-[0.3em] text-white uppercase">Guide</span>
          </div>
          
          <button 
            onClick={toggleMenu}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close Menu"
          >
            <X size={28} />
          </button>
        </div>

        {/* Mobile Links */}
        <nav className="flex flex-col items-start px-12 mt-20 space-y-10 text-2xl font-light tracking-[0.2em] uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-indigo-400 transition-all hover:translate-x-2"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}