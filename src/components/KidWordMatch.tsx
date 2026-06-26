import React, { useState, useEffect } from "react";
import { KidFlashcard } from "../types";
import { Trophy, Star, Clock } from "lucide-react";

export function KidWordMatch({
  cards,
  onWin,
  volume = 1,
  level = "Unit 1",
}: {
  cards: KidFlashcard[];
  onWin: (stars: number, points: number) => void;
  volume?: number;
  level?: string;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [leftCol, setLeftCol] = useState<{ id: string; display: string }[]>([]);
  const [rightCol, setRightCol] = useState<{ id: string; display: string }[]>([]);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const unitMatch = level.match(/\d+/);
  const unitNum = unitMatch ? parseInt(unitMatch[0]) : 1;

  useEffect(() => {
    // Determine displays based on volume
    let leftItems = cards.map(c => ({ id: c.word, display: "" }));
    let rightItems = cards.map(c => ({ id: c.word, display: "" }));

    if (volume === 1) {
      // Very visual: Emoji -> Word
      leftItems = cards.map(c => ({ id: c.word, display: c.emoji || "❓" }));
      rightItems = cards.map(c => ({ id: c.word, display: c.word }));
    } else if (volume === 2) {
      // Word -> Meaning + Emoji
      leftItems = cards.map(c => ({ id: c.word, display: c.word }));
      rightItems = cards.map(c => ({ id: c.word, display: `${c.emoji || ""} ${c.meaning_vi}`.trim() }));
    } else {
      // Word -> Meaning (Harder)
      leftItems = cards.map(c => ({ id: c.word, display: c.word }));
      rightItems = cards.map(c => ({ id: c.word, display: c.meaning_vi }));
    }

    setLeftCol(leftItems.sort(() => Math.random() - 0.5));
    setRightCol(rightItems.sort(() => Math.random() - 0.5));
    setMisses(0);
    setMatched([]);
    setSelectedLeft(null);

    // Setup timer for Volume 4 & 5
    if (volume >= 4) {
      const baseTime = volume === 4 ? 40 : 30; // Harder for vol 5
      // Decrease time based on unitNum (Unit 15 has 14s less time)
      const timeToReduce = Math.min((unitNum - 1), 15);
      setTimeLeft(baseTime - timeToReduce);
    } else {
      setTimeLeft(null);
    }
  }, [cards, volume, unitNum]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || matched.length === cards.length) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, matched.length, cards.length]);

  // Periodic shuffle for Volume 3
  useEffect(() => {
    if (volume !== 3) return;
    if (matched.length === cards.length) return;

    // Shuffle faster as unit increases
    const shuffleInterval = 5000 - Math.min((unitNum - 1) * 200, 3000);
    
    const interval = setInterval(() => {
      setLeftCol(prev => [...prev].sort(() => Math.random() - 0.5));
      setRightCol(prev => [...prev].sort(() => Math.random() - 0.5));
      setSelectedLeft(null); // Reset selection on shuffle to make it harder
    }, shuffleInterval);

    return () => clearInterval(interval);
  }, [volume, unitNum, matched.length, cards.length]);

  const handleLeftClick = (id: string) => {
    if (matched.includes(id)) return;
    setSelectedLeft(id === selectedLeft ? null : id);
  };

  const handleRightClick = (id: string) => {
    if (matched.includes(id)) return;
    if (selectedLeft === id) {
      setMatched(prev => [...prev, id]);
      setSelectedLeft(null);
    } else {
      setSelectedLeft(null);
      if (selectedLeft) {
        setMisses(m => m + 1);
      }
    }
  };

  const isComplete = matched.length === cards.length && cards.length > 0;
  const isTimeOut = volume >= 4 && timeLeft === 0;

  if (isComplete || isTimeOut) {
    let stars = 1;
    if (isComplete) {
       stars = misses === 0 ? 5 : misses <= 1 ? 4 : misses <= 3 ? 3 : 2;
    }
    const points = stars * 100 + matched.length * 10;

    return (
      <div className="text-center py-12 animate-in fade-in zoom-in">
        <Trophy className={`w-24 h-24 mx-auto mb-6 ${isComplete ? "text-yellow-400" : "text-slate-400"}`} />
        <h2 className={`text-3xl font-black mb-2 ${isComplete ? "text-yellow-600" : "text-slate-600"}`}>
          {isComplete ? "Chúc mừng bé!" : "Hết giờ rồi!"}
        </h2>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-12 h-12 ${i <= stars ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"}`}
            />
          ))}
        </div>
        <p className="text-xl font-bold text-slate-600 mb-2">
          {isComplete ? "Bé đã hoàn thành xuất sắc!" : `Bé đã nối được ${matched.length}/${cards.length} từ.`}
        </p>
        <p className="text-2xl font-black text-orange-500 mb-8">
          +{points} Điểm thưởng!
        </p>
        <button
          onClick={() => onWin(stars, points)}
          className="px-6 py-3 bg-yellow-400 text-white rounded-full font-black text-xl shadow-sm hover:bg-yellow-500 transition-colors"
        >
          Nhận thưởng và {isComplete ? "chơi tiếp" : "thử lại"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in">
      {timeLeft !== null && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock className={`w-8 h-8 ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-slate-400"}`} />
          <span className={`text-3xl font-black ${timeLeft <= 5 ? "text-red-500" : "text-slate-600"}`}>
            {timeLeft}s
          </span>
        </div>
      )}

      {volume === 3 && (
        <div className="text-center mb-6 text-sm font-bold text-orange-500 bg-orange-50 py-2 rounded-full border-2 border-orange-200">
          Cẩn thận nhé, các thẻ bài sẽ tự đổi chỗ đấy! 🌪️
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-4">
          {leftCol.map((item, i) => {
            const isMatched = matched.includes(item.id);
            const isSelected = selectedLeft === item.id;
            return (
              <button
                key={`${item.id}-${i}`}
                onClick={() => handleLeftClick(item.id)}
                disabled={isMatched || timeLeft === 0}
                className={`w-full p-4 rounded-2xl font-black transition-all border-4 ${
                  volume === 1 ? "text-4xl" : "text-xl"
                } ${
                  isMatched
                    ? "bg-slate-100 text-slate-300 border-slate-200"
                    : isSelected
                      ? "bg-amber-100 text-amber-600 border-amber-400 scale-105"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm hover:scale-105"
                }`}
              >
                {item.display}
              </button>
            );
          })}
        </div>
        <div className="space-y-4">
          {rightCol.map((item, i) => {
            const isMatched = matched.includes(item.id);
            return (
              <button
                key={`${item.id}-${i}`}
                onClick={() => handleRightClick(item.id)}
                disabled={isMatched || timeLeft === 0}
                className={`w-full p-4 rounded-2xl font-black text-xl transition-all border-4 ${
                  isMatched
                    ? "bg-slate-100 text-slate-300 border-slate-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300 shadow-sm hover:scale-105"
                }`}
              >
                {item.display}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
