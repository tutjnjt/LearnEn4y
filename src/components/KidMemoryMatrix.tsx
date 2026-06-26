import React, { useState, useEffect } from "react";
import { KidFlashcard } from "../types";
import { Trophy, Star, Clock } from "lucide-react";

type Card = {
  id: string;
  type: "word" | "emoji";
  value: string;
  matchId: string; // The word itself is the matchId
  isMatched: boolean;
};

export function KidMemoryMatrix({
  cards,
  onWin,
}: {
  cards: KidFlashcard[];
  onWin: (stars: number, points: number) => void;
}) {
  const [grid, setGrid] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [misses, setMisses] = useState(0);

  // Time calculation: e.g. 10s per pair base + 30% as requested
  const baseTime = cards.length * 10;
  const initialTime = Math.floor(baseTime * 1.3);

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Generate grid
    let newGrid: Card[] = [];
    cards.forEach((c, idx) => {
      newGrid.push({
        id: `w-${idx}`,
        type: "word",
        value: c.word,
        matchId: c.word,
        isMatched: false,
      });
      newGrid.push({
        id: `e-${idx}`,
        type: "emoji",
        value: c.emoji,
        matchId: c.word,
        isMatched: false,
      });
    });
    // Shuffle
    newGrid = newGrid.sort(() => Math.random() - 0.5);
    setGrid(newGrid);
    setSelectedCards([]);
    setMisses(0);
    setTimeLeft(initialTime);
    setIsActive(true);
  }, [cards, initialTime]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const isWin = grid.length > 0 && grid.every((c) => c.isMatched);
  const isTimeOut = timeLeft === 0 && !isWin;

  useEffect(() => {
    if (isWin) {
      setIsActive(false);
    }
  }, [isWin]);

  const handleCardClick = (index: number) => {
    if (isChecking || grid[index].isMatched || selectedCards.includes(index) || isTimeOut || !isActive)
      return;

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsChecking(true);
      const [firstIdx, secondIdx] = newSelected;
      const firstCard = grid[firstIdx];
      const secondCard = grid[secondIdx];

      if (
        firstCard.matchId === secondCard.matchId &&
        firstCard.type !== secondCard.type
      ) {
        // Match!
        setTimeout(() => {
          setGrid((prev) => {
            const next = [...prev];
            next[firstIdx].isMatched = true;
            next[secondIdx].isMatched = true;
            return next;
          });
          setSelectedCards([]);
          setIsChecking(false);
        }, 600);
      } else {
        // No match
        setMisses((m) => m + 1);
        setTimeout(() => {
          setSelectedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  if (isWin || isTimeOut) {
    let stars = 1;
    if (isWin) {
      const timeUsed = initialTime - timeLeft;
      // Fast finish <= 40% time -> 5 stars
      // Finish <= 60% time -> 4 stars
      // Finish <= 80% time -> 3 stars
      // Finish > 80% time -> 2 stars
      if (timeUsed <= initialTime * 0.4) stars = 5;
      else if (timeUsed <= initialTime * 0.6) stars = 4;
      else if (timeUsed <= initialTime * 0.8) stars = 3;
      else stars = 2;

      // Penalize for misses too
      if (misses > cards.length) stars = Math.max(1, stars - 1);
    } else {
      stars = 1;
    }

    const points = stars * 100 + (isWin ? cards.length * 10 : 0);

    return (
      <div className="text-center py-12 animate-in fade-in zoom-in">
        {isWin ? (
          <>
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-yellow-600 mb-2">Tuyệt vời!</h2>
          </>
        ) : (
          <>
            <Clock className="w-24 h-24 text-red-400 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-red-600 mb-2">Hết giờ rồi!</h2>
          </>
        )}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-12 h-12 ${i <= stars ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"}`}
            />
          ))}
        </div>
        <p className="text-xl font-bold text-slate-600 mb-2">
          {isWin ? "Bé đã lật mở thành công tất cả thẻ." : "Bé hãy thử lại cho nhanh hơn nhé!"}
        </p>
        <p className="text-2xl font-black text-orange-500 mb-8">
          +{points} Điểm thưởng!
        </p>
        <button
          onClick={() => onWin(stars, points)}
          className="px-6 py-3 bg-yellow-400 text-white rounded-full font-black text-xl shadow-sm hover:bg-yellow-500 transition-colors"
        >
          {isWin ? "Nhận thưởng và chơi tiếp" : "Tiếp tục chơi"}
        </button>
      </div>
    );
  }

  // Define grid cols based on card count
  const cols =
    grid.length > 12
      ? "grid-cols-4 sm:grid-cols-5"
      : "grid-cols-3 sm:grid-cols-4";

  return (
    <div className="animate-in fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Clock className={`w-8 h-8 ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-blue-400"}`} />
        <span className={`text-3xl font-black ${timeLeft <= 10 ? "text-red-500" : "text-blue-600"}`}>
          {timeLeft}s
        </span>
      </div>
      
      <div className={`grid ${cols} gap-3 sm:gap-4`}>
        {grid.map((card, idx) => {
          const isSelected = selectedCards.includes(idx);
          const isMatched = card.isMatched;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-2xl cursor-pointer transition-all duration-300 transform perspective-1000 ${isMatched ? "opacity-0 pointer-events-none scale-50" : "opacity-100"}`}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isSelected ? "rotate-y-180" : ""}`}
              >
                {/* Back of card */}
                <div className="absolute inset-0 bg-blue-100 border-4 border-blue-300 rounded-2xl backface-hidden flex items-center justify-center hover:bg-blue-200">
                  <div className="w-8 h-8 rounded-full border-4 border-blue-300/50" />
                </div>

                {/* Front of card */}
                <div className="absolute inset-0 bg-white border-4 border-blue-400 rounded-2xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-2 shadow-sm text-center">
                  {card.type === "emoji" ? (
                    <span className="text-4xl sm:text-5xl">{card.value}</span>
                  ) : (
                    <span className="font-black text-lg sm:text-xl text-slate-800 break-words w-full leading-tight">
                      {card.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
