import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 md:mt-48 border-t border-zinc-900 px-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto pt-16 pb-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg 
                  viewBox="0 0 100 100" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
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
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="14" 
                    fill="#818cf8" 
                    className="drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-[0.2em] text-white uppercase">Probliq</span>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-light">
              A behavioral companion for offloading mental weight. 
              Built for those who value clarity over noise and action over hesitation.
            </p>
            
            <div className="flex space-x-6 text-zinc-600">
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="X">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Platform</h4>
            <ul className="text-sm text-zinc-600 space-y-2 font-light">
              <li className="hover:text-indigo-400 cursor-pointer transition">The Flow</li>
              <li className="hover:text-indigo-400 cursor-pointer transition">Worry Eater</li>
              <li className="hover:text-indigo-400 cursor-pointer transition">Local Cache</li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Philosophy</h4>
            <ul className="text-sm text-zinc-600 space-y-2 font-light">
              <li className="hover:text-indigo-400 cursor-pointer transition">Manifesto</li>
              <li className="hover:text-indigo-400 cursor-pointer transition">Privacy</li>
              <li className="hover:text-indigo-400 cursor-pointer transition">Open Source</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-700 tracking-[0.3em] uppercase font-bold gap-4">
          <p>© 2026 Probliq</p>
          <p className="text-zinc-800 opacity-50">Quiet Confidence</p>
        </div>
      </div>
    </footer>
  );
}