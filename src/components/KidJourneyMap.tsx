import React, { useEffect, useRef } from "react";
import { Star, MapPin, Flag } from "lucide-react";
import { motion } from "motion/react";

interface JourneyMapProps {
  levels: { id: string; name: string; emoji: string }[];
  currentLevelIndex: number;
  levelStars: Record<string, number>;
  avatar: string;
  onSelectLevel: (levelId: string) => void;
}

export function KidJourneyMap({
  levels,
  currentLevelIndex,
  levelStars,
  avatar,
  onSelectLevel,
}: JourneyMapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentLevelIndex]);

  return (
    <div ref={scrollRef} className="w-full max-w-6xl mx-auto py-8 animate-in fade-in zoom-in duration-500 overflow-x-auto overflow-y-hidden custom-scrollbar">
      <div className="flex flex-row items-center w-max px-8 sm:px-16 min-h-[400px]">
        {/* Start Flag */}
        <div className="relative w-[120px] flex justify-center shrink-0">
          <div className="flex flex-col items-center -translate-y-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-300 shadow-sm mb-2 z-10">
              <Flag className="w-8 h-8 text-red-500" />
            </div>
            <span className="font-black text-red-500 bg-white px-3 py-1 rounded-full border-2 border-red-200">
              Xuất phát
            </span>
          </div>
        </div>

        {levels.map((lvl, index) => {
          const isUnlocked = index <= currentLevelIndex;
          const isActive = index === currentLevelIndex;
          const starsEarned = levelStars[lvl.id] || 0;
          
          // Start flag is "even" (-translate-y-16)
          // Level 0 is "odd" (+translate-y-16)
          const isLevelEven = (index + 1) % 2 === 0;

          return (
            <div
              key={lvl.id}
              data-active={isActive}
              className={`relative w-[200px] sm:w-[240px] flex justify-center shrink-0 transition-all duration-500 ${
                isUnlocked ? "opacity-100" : "opacity-50 grayscale"
              }`}
            >
              {/* Path from previous item */}
              <svg 
                className="absolute w-[200px] sm:w-[240px] h-[128px] left-[-100px] sm:left-[-120px] top-1/2 -translate-y-1/2 -z-10" 
                viewBox="0 0 240 128" 
                preserveAspectRatio="none"
              >
                 <path 
                   d={isLevelEven ? "M 0 128 C 120 128, 120 0, 240 0" : "M 0 0 C 120 0, 120 128, 240 128"} 
                   fill="none" 
                   stroke={isUnlocked ? "#fde047" : "#cbd5e1"} 
                   strokeWidth="8" 
                   strokeDasharray="16 12" 
                   strokeLinecap="round"
                   vectorEffect="non-scaling-stroke"
                 />
              </svg>

              <div className={`flex flex-col items-center relative ${isLevelEven ? '-translate-y-16' : 'translate-y-16'}`}>
                {isActive && (
                  <motion.div layoutId="avatar" className="absolute z-20 animate-bounce -top-16" transition={{ type: "spring", stiffness: 100, damping: 15 }}>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-orange-400">
                      {avatar}
                    </div>
                    <div className="w-4 h-4 bg-orange-400 rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 border-r-4 border-b-4 border-orange-500" />
                  </motion.div>
                )}

                <div className="flex gap-1 mb-2 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= starsEarned ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-300"}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => isUnlocked && onSelectLevel(lvl.id)}
                  disabled={!isUnlocked}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-3xl sm:text-4xl shadow-md border-8 transition-transform z-10 ${
                    isActive
                      ? "border-orange-400 scale-110 bg-orange-50"
                      : isUnlocked
                        ? "border-emerald-400 hover:scale-105 bg-emerald-50"
                        : "border-slate-300 bg-slate-100 cursor-not-allowed"
                  }`}
                >
                  {lvl.emoji}
                </button>

                <div
                  className={`font-black text-center px-4 py-2 rounded-2xl border-2 shadow-sm whitespace-nowrap min-w-[120px] mt-4 ${
                    isActive
                      ? "bg-orange-100 text-orange-600 border-orange-200"
                      : isUnlocked
                        ? "bg-emerald-100 text-emerald-600 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {lvl.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
