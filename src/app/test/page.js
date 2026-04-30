"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FearEaterTest() {
  const [text, setText] = useState("");
  const [activeText, setActiveText] = useState("");
  const [consume, setConsume] = useState(false);

  const trigger = () => {
    if (!text.trim()) return;

    setActiveText(text);
    setText("");
    setConsume(false);

    setTimeout(() => setConsume(true), 250);
    setTimeout(() => {
      setActiveText("");
      setConsume(false);
    }, 1600);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
      
      {/* Input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type fear..."
          className="px-3 py-2 bg-transparent border border-gray-700 rounded"
        />
        <button
          onClick={trigger}
          className="px-4 py-2 bg-indigo-500 rounded"
        >
          Consume
        </button>
      </div>

      {/* Animation Area */}
      <div className="relative w-[400px] h-[320px] flex items-center justify-center overflow-hidden">

        {/* Creature */}
        <motion.div
          animate={{
            scale: consume ? 1.1 : 1,
            y: consume ? -8 : 0,
          }}
          transition={{ duration: 0.25 }}
          className="relative w-[220px] h-[220px]"
        >
          {/* Body */}
          <div className="absolute w-full h-full rounded-full bg-gradient-to-b from-gray-700 to-gray-900" />

          {/* Eyes */}
          <motion.div
            animate={{ scaleY: consume ? 0.4 : 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[70px] left-[55px] w-6 h-6 bg-white rounded-full"
          />
          <motion.div
            animate={{ scaleY: consume ? 0.4 : 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[70px] right-[55px] w-6 h-6 bg-white rounded-full"
          />

          {/* Pupils */}
          <motion.div
            animate={{ y: consume ? 2 : 0 }}
            className="absolute top-[75px] left-[60px] w-3 h-3 bg-black rounded-full"
          />
          <motion.div
            animate={{ y: consume ? 2 : 0 }}
            className="absolute top-[75px] right-[60px] w-3 h-3 bg-black rounded-full"
          />

          {/* Mouth (container) */}
          <motion.div
            animate={{
              scaleY: consume ? 1.8 : 0.6,
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-[50px] left-1/2 -translate-x-1/2 w-[90px] h-[50px] bg-black rounded-full origin-center overflow-hidden"
          >
            {/* Inner glow */}
            <motion.div
              animate={{
                opacity: consume ? 0.8 : 0.3,
              }}
              className="absolute inset-0 bg-indigo-500 blur-md"
            />
          </motion.div>
        </motion.div>

        {/* Text → pulled into mouth */}
        <AnimatePresence>
          {activeText && (
            <motion.div
              key={activeText}
              initial={{ opacity: 0, scale: 1, y: -120 }}
              animate={{
                opacity: consume ? 0 : 1,
                scale: consume ? 0.05 : 1,
                y: consume ? 60 : -120,
                filter: consume
                  ? "blur(10px) brightness(0.5)"
                  : "blur(0px)",
              }}
              transition={{ duration: 0.8 }}
              className="absolute text-center px-4 text-sm max-w-[260px]"
            >
              {activeText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Intake suction lines */}
        <AnimatePresence>
          {consume &&
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0.6,
                  y: -80,
                  scaleY: 0.5,
                }}
                animate={{
                  opacity: 0,
                  y: 40,
                  scaleY: 1.5,
                }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="absolute w-[2px] h-12 bg-indigo-400"
                style={{
                  left: `${180 + i * 8}px`,
                }}
              />
            ))}
        </AnimatePresence>

        {/* Impact pulse */}
        <AnimatePresence>
          {consume && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-[80px] w-20 h-20 rounded-full bg-indigo-500/30 blur-xl"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}