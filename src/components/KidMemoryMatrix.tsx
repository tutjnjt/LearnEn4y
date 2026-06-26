import React, { useState, useEffect } from "react";
import { KidFlashcard } from "../types";
import { Trophy, Star } from "lucide-react";

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
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (isChecking || grid[index].isMatched || selectedCards.includes(index))
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

  const isWin = grid.length > 0 && grid.every((c) => c.isMatched);

  if (isWin) {
    const stars = misses === 0 ? 5 : misses <= 2 ? 4 : misses <= 4 ? 3 : misses <= 6 ? 2 : 1;
    const points = stars * 100 + cards.length * 10;

    return (
      <div className="text-center py-12 animate-in fade-in zoom-in">
        <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
        <h2 className="text-3xl font-black text-yellow-600 mb-2">Tuyệt vời!</h2>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-12 h-12 ${i <= stars ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"}`}
            />
          ))}
        </div>
        <p className="text-xl font-bold text-slate-600 mb-2">
          Bé đã lật mở thành công tất cả thẻ.
        </p>
        <p className="text-2xl font-black text-orange-500 mb-8">
          +{points} Điểm thưởng!
        </p>
        <button
          onClick={() => onWin(stars, points)}
          className="px-6 py-3 bg-yellow-400 text-white rounded-full font-black text-xl shadow-sm hover:bg-yellow-500 transition-colors"
        >
          Nhận thưởng và chơi tiếp
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
    <div
      className={`grid ${cols} gap-3 sm:gap-4 max-w-3xl mx-auto animate-in fade-in`}
    >
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
  );
}
