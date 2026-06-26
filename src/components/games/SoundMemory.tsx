import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Volume2 } from "lucide-react";

interface Flashcard {
  word: string;
  meaning_vi: string;
  emoji: string;
}

interface SoundMemoryProps {
  cards: Flashcard[];
  onWin: () => void;
}

type Card = {
  id: string;
  type: "sound" | "text";
  text: string;
  cardId: number;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function SoundMemory({ cards, onWin }: SoundMemoryProps) {
  const [grid, setGrid] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let newGrid: Card[] = [];
    cards.slice(0, 6).forEach((card, idx) => {
      newGrid.push({
        id: `sound-${idx}`,
        type: "sound",
        text: card.word,
        cardId: idx,
        isFlipped: false,
        isMatched: false,
      });
      newGrid.push({
        id: `text-${idx}`,
        type: "text",
        text: card.word,
        cardId: idx,
        isFlipped: false,
        isMatched: false,
      });
    });
    setGrid(newGrid.sort(() => Math.random() - 0.5));
  }, [cards]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleCardClick = (card: Card) => {
    if (isProcessing || card.isFlipped || card.isMatched) return;

    if (card.type === "sound") {
      speak(card.text);
    }

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    setGrid((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c)),
    );

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const card1 = grid.find((c) => c.id === newFlipped[0])!;
      const card2 = card; // newly flipped

      if (card1.cardId === card2.cardId) {
        // Match
        setTimeout(() => {
          setGrid((prev) =>
            prev.map((c) =>
              c.cardId === card1.cardId ? { ...c, isMatched: true } : c,
            ),
          );
          setFlippedIds([]);
          setIsProcessing(false);

          // Check win
          if (grid.filter((c) => !c.isMatched).length === 2) {
            onWin();
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setGrid((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c,
            ),
          );
          setFlippedIds([]);
          setIsProcessing(false);
        }, 1500);
      }
    }
  };

  return (
    <div className="w-full bg-amber-50 rounded-3xl border-4 border-amber-200 p-8 flex flex-col items-center">
      <h3 className="text-2xl font-black text-amber-800 mb-8 flex items-center gap-2">
        <Volume2 className="w-8 h-8" /> Thẻ Nhớ Âm Thanh
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-3xl w-full">
        {grid.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(card)}
            className={`aspect-square relative cursor-pointer flex items-center justify-center rounded-2xl border-4 transition-all duration-300 transform-gpu preserve-3d ${
              card.isMatched
                ? "opacity-0 scale-90 pointer-events-none"
                : card.isFlipped
                  ? "border-amber-400 bg-white shadow-md rotate-y-180"
                  : "border-amber-300 bg-amber-200 shadow-sm hover:shadow-md"
            }`}
          >
            {card.isFlipped && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {card.type === "sound" ? (
                  <Volume2 className="w-12 h-12 text-amber-500 animate-pulse" />
                ) : (
                  <span className="font-bold text-lg text-slate-700 text-center">
                    {card.text}
                  </span>
                )}
              </div>
            )}
            {!card.isFlipped && (
              <div className="text-4xl font-black text-amber-400/50">?</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
