"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimate, AnimatePresence } from "framer-motion";
import { ThumbsUp, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * AVATAR CONFIGURATIONS
 * Each avatar defines its colors, specific paths, and the "Gulp" morph.
 */
const AVATARS = {
  bear: {
    name: "Barnaby Bear",
    primary: "#795548",
    secondary: "#8D6E63",
    accent: "#D7CCC8",
    dark: "#4E342E",
    // Normal body path vs Gulp body path
    pathNormal: "M60,160 C30,160 30,280 120,285 C210,280 210,160 180,160 L60,160 Z",
    pathGulp: "M40,160 C40,160 10,245 120,260 C230,245 200,160 200,160 Z",
    ears: (
      <>
        <circle cx="65" cy="65" r="28" fill="#5D4037" />
        <circle cx="175" cy="65" r="28" fill="#5D4037" />
      </>
    ),
  },
  frog: {
    name: "Fearless Finn",
    primary: "#4CAF50",
    secondary: "#81C784",
    accent: "#DCEDC8",
    dark: "#2E7D32",
    pathNormal: "M50,160 C20,160 20,280 120,285 C220,280 220,160 190,160 L50,160 Z",
    pathGulp: "M30,160 C30,160 0,240 120,250 C240,240 210,160 210,160 Z",
    ears: (
      <>
        <ellipse cx="75" cy="60" rx="30" ry="20" fill="#2E7D32" />
        <ellipse cx="165" cy="60" rx="30" ry="20" fill="#2E7D32" />
      </>
    ),
  },
  cat: {
    name: "Cosmic Chloe",
    primary: "#673AB7",
    secondary: "#9575CD",
    accent: "#D1C4E9",
    dark: "#311B92",
    pathNormal: "M60,160 C30,160 30,280 120,285 C210,280 210,160 180,160 L60,160 Z",
    pathGulp: "M45,160 C45,160 15,250 120,265 C225,250 195,160 195,160 Z",
    ears: (
      <>
        <path d="M40,80 L70,40 L100,90 Z" fill="#311B92" />
        <path d="M140,90 L170,40 L200,80 Z" fill="#311B92" />
      </>
    ),
  },
};

const WorryNote = ({ text, id, style }) => (
  <motion.div
    id={id}
    style={style}
    className="z-30 p-5 bg-[#fdf6e3] shadow-2xl text-slate-800 text-sm font-serif leading-relaxed w-64 h-auto min-h-[140px] origin-center border-l-4 border-amber-200"
  >
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none p-4 border-b border-slate-900" style={{ backgroundSize: '100% 1.5rem', backgroundImage: 'linear-gradient(transparent 95%, #334155 95%)' }} />
    <p className="relative z-10 break-words">{text}</p>
  </motion.div>
);

function WorryEaterSequenceWrapper({ initialText, onComplete }) {
  const [text, setText] = useState(initialText || "");
  const [start, setStart] = useState(false);

  return (
    <>
      {!start && (
        <div className="space-y-4">
          <div className="text-sm text-slate-300">
            What is stopping you?
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[200px] bg-transparent border border-slate-800 rounded-lg p-3 text-sm text-slate-200"
          />

          <button
            onClick={() => setStart(true)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-indigo-500"
          >
            Release It
          </button>
        </div>
      )}

      {start && (
        <WorryEaterSequence
          externalText={text}
          onDone={onComplete}
        />
      )}
    </>
  );
}

export default function WorryEaterSequence({ externalText, onDone }) {
  const [text, setText] = useState("");
  const [activeNote, setActiveNote] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [avatarKey, setAvatarKey] = useState("bear");
  const [scope, animate] = useAnimate();

  const current = AVATARS[avatarKey];

  const cycleAvatar = () => {
    const keys = Object.keys(AVATARS);
    const nextIndex = (keys.indexOf(avatarKey) + 1) % keys.length;
    setAvatarKey(keys[nextIndex]);
  };

  const startSequence = async () => {
    const input = externalText ?? text;
    if (!input.trim() || isRunning) return;
    setActiveNote(input);
    
    setIsRunning(true);
    setActiveNote(text);
    setText("");

    // Selectors
    const note = "#worry-note";
    const character = "#char-container";
    const body = "#char-body";
    const mouth = "#char-mouth";
    const arm = "#char-arm-r";
    const eyes = "#eye-l, #eye-r";
    const success = "#success-box";

    // 1. ENTRANCE (Waddle)
    await animate(character, { x: [-400, 0], y: [100, 80, 100], rotate: [-5, 5, 0], opacity: 1 }, { duration: 1.2, ease: "easeOut" });
    
    // 2. SHOW NOTE
    await animate(note, { opacity: 1, y: [-50, 0], scale: [0.8, 1] }, { duration: 0.5 });
    
    // 3. CRUMPLE NOTE
    await animate(note, { 
      scale: 0.1, 
      rotate: 1080, 
      borderRadius: "100%", 
      backgroundColor: "#d1d5db",
      color: "transparent"
    }, { duration: 0.8, ease: "backIn" });

    // 4. THE CHEW & EAT
    await animate(mouth, { scaleY: 6, fill: "#000" }, { duration: 0.2 });
    await animate(note, { y: 160, opacity: 0 }, { duration: 0.3, ease: "anticipate" });
    
    // Chew cycle
    for(let i=0; i<3; i++) {
        await animate(mouth, { scaleY: [6, 2, 6] }, { duration: 0.2 });
    }
    
    await animate(mouth, { scaleY: 1, fill: current.dark }, { duration: 0.2 });

    // 5. THE BIG GULP (Morphing)
    await Promise.all([
        animate(body, { d: current.pathGulp }, { duration: 0.3 }),
        animate(eyes, { scaleY: 0.2 }, { duration: 0.1 }),
    ]);
    
    await new Promise(r => setTimeout(r, 200));
    
    await Promise.all([
        animate(body, { d: current.pathNormal }, { duration: 0.6, type: "spring" }),
        animate(eyes, { scaleY: 1 }, { duration: 0.2 }),
    ]);

    // 6. SUCCESS REACTION
    await Promise.all([
        animate(arm, { rotate: -150, x: -10 }, { type: "spring" }),
        animate(success, { opacity: 1, scale: 1, y: -220 }, { duration: 0.5, ease: "backOut" })
    ]);

    await new Promise(r => setTimeout(r, 2500));

    // 7. EXIT
    await Promise.all([
        animate(success, { opacity: 0, scale: 0.5 }),
        animate(character, { x: 500, opacity: 0, rotate: 10 }, { duration: 0.8, ease: "anticipate" }),
        animate(arm, { rotate: 0 }, { duration: 0.2 })
    ]);

    setIsRunning(false);
    setActiveNote(null);
    onDone && onDone();
  };

  return (
    <div ref={scope} className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#0a0c10] overflow-hidden p-6 font-sans">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* INPUT UI */}
      <AnimatePresence>
        {!isRunning && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="z-50 flex flex-col items-center w-full max-w-md"
          >
            <div className="flex items-center gap-4 mb-8">
                <button onClick={cycleAvatar} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors">
                    <ChevronLeft />
                </button>
                <div className="text-center">
                    <h2 className="text-white text-2xl font-bold">{current.name}</h2>
                    <p className="text-slate-400 text-sm">Ready to eat your worries</p>
                </div>
                <button onClick={cycleAvatar} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors">
                    <ChevronRight />
                </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's bothering you? Write it here..."
              className="w-full h-40 p-6 bg-slate-900/50 border-2 border-slate-800 rounded-3xl text-slate-100 focus:border-blue-500/50 outline-none transition-all resize-none shadow-2xl backdrop-blur-sm mb-6"
            />
            
            <button
              onClick={startSequence}
              disabled={!text.trim()}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                RELEASE TO THE {avatarKey.toUpperCase()}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANIMATION STAGE */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* Success Popup */}
        <div id="success-box" className="absolute z-50 bg-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 opacity-0 scale-50 border-b-4 border-slate-200">
          <div className="flex flex-col">
            <span className="text-slate-900 font-black text-lg leading-tight">YUM!</span>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Worry Handled</span>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
        </div>

        {/* The Worry Note */}
        <WorryNote id="worry-note" text={activeNote} style={{ position: "absolute", top: "30%", opacity: 0 }} />

        {/* The Character */}
        <motion.div id="char-container" className="relative opacity-0" style={{ transform: 'translateY(100px)' }}>
            <svg width="240" height="300" viewBox="0 0 240 300" fill="none">
                {/* Feet */}
                <ellipse cx="80" cy="275" rx="35" ry="20" fill={current.dark} />
                <ellipse cx="160" cy="275" rx="35" ry="20" fill={current.dark} />

                {/* Body Morphing Path */}
                <motion.path
                    id="char-body"
                    d={current.pathNormal}
                    fill={current.primary}
                />

                {/* Belly */}
                <ellipse cx="120" cy="225" rx="50" ry="35" fill={current.accent} opacity="0.3" />

                {/* Head Group */}
                <g id="char-head">
                    {current.ears}
                    <ellipse cx="120" cy="115" rx="80" ry="70" fill={current.secondary} />
                    <ellipse cx="120" cy="140" rx="35" ry="25" fill="#fff" opacity="0.9" />
                    
                    {/* Eyes */}
                    <ellipse id="eye-l" cx="90" cy="110" rx="8" ry="10" fill="#1a1a1a" style={{ transformOrigin: "90px 110px" }} />
                    <ellipse id="eye-r" cx="150" cy="110" rx="8" ry="10" fill="#1a1a1a" style={{ transformOrigin: "150px 110px" }} />
                    
                    {/* Nose/Mouth */}
                    <circle cx="120" cy="135" r="4" fill="#1a1a1a" />
                    <ellipse id="char-mouth" cx="120" cy="155" rx="15" ry="3" fill={current.dark} style={{ transformOrigin: "120px 155px" }} />
                </g>

                {/* Arms */}
                <ellipse cx="50" cy="180" rx="15" ry="25" fill={current.dark} transform="rotate(15 50 180)" />
                <g id="char-arm-r" style={{ transformOrigin: "190px 180px" }}>
                    <ellipse cx="190" cy="180" rx="15" ry="25" fill={current.dark} transform="rotate(-15 190 180)" />
                    <circle cx="190" cy="165" r="8" fill={current.accent} opacity="0.4" />
                </g>
            </svg>
        </motion.div>
      </div>
    </div>
  );
}