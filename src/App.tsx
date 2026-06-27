/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { KidDashboard } from "./components/KidDashboard";
import { Profile } from "./types";
import { Play, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";
import { initAudio } from "./utils/audio";

export default function App() {
  const [profile, setProfile] = useState<Profile>(null);

  if (profile === "kid") {
    return (
      <div className="min-h-screen bg-sky-50 text-slate-900 font-sans p-4">
        <KidDashboard onBack={() => setProfile(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sky-300 via-indigo-300 to-purple-400 flex items-center justify-center p-4">
      {/* Playful Background Elements */}
      <div className="absolute top-10 left-10 text-white/30 animate-pulse">
        <Star className="w-24 h-24" />
      </div>
      <div className="absolute bottom-20 right-20 text-white/30 animate-bounce">
        <Sparkles className="w-32 h-32" />
      </div>
      <div className="absolute top-1/4 right-10 text-white/20 animate-spin-slow">
        <Star className="w-16 h-16" />
      </div>
      <div className="absolute bottom-1/3 left-10 text-white/20 animate-pulse">
        <Star className="w-20 h-20" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
        className="max-w-xl w-full bg-white/90 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl border-8 border-white/50 text-center relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-8"
        >
          <SmileIcon className="w-20 h-20 text-white" />
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4 drop-shadow-sm">
          Tiếng Anh Vui Nhộn
        </h1>
        <p className="text-xl text-slate-600 font-bold mb-12">
          Học mà chơi, chơi mà học!
        </p>

        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            initAudio();
            setProfile("kid");
          }}
          className="w-full flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-500/30 text-white group"
        >
          <span className="text-3xl font-black tracking-wider uppercase drop-shadow-md">
            Bắt Đầu Chơi!
          </span>
          <div className="w-12 h-12 bg-white text-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}

function SmileIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}
