import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";

interface Flashcard {
  word: string;
  meaning_vi: string;
  emoji: string;
}

interface BalloonMatchProps {
  cards: Flashcard[];
  onWin: () => void;
}

type Bubble = {
  id: string;
  text: string;
  type: "en" | "vi";
  cardId: number;
  color: string;
  popped: boolean;
};

export default function BalloonMatch({ cards, onWin }: BalloonMatchProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const colors = [
    "bg-rose-400",
    "bg-blue-400",
    "bg-emerald-400",
    "bg-amber-400",
    "bg-purple-400",
    "bg-indigo-400",
  ];

  useEffect(() => {
    let newBubbles: Bubble[] = [];
    cards.forEach((card, idx) => {
      newBubbles.push({
        id: `en-${idx}`,
        text: card.word,
        type: "en",
        cardId: idx,
        color: colors[Math.floor(Math.random() * colors.length)],
        popped: false,
      });
      newBubbles.push({
        id: `vi-${idx}`,
        text: card.meaning_vi,
        type: "vi",
        cardId: idx,
        color: colors[Math.floor(Math.random() * colors.length)],
        popped: false,
      });
    });
    setBubbles(newBubbles.sort(() => Math.random() - 0.5));
  }, [cards]);

  const handleSelect = (bubble: Bubble) => {
    if (selectedId === bubble.id) {
      setSelectedId(null);
      return;
    }

    if (selectedId) {
      const selectedBubble = bubbles.find((b) => b.id === selectedId);
      if (
        selectedBubble &&
        selectedBubble.cardId === bubble.cardId &&
        selectedBubble.type !== bubble.type
      ) {
        // Match!
        setBubbles((prev) =>
          prev.map((b) =>
            b.cardId === bubble.cardId ? { ...b, popped: true } : b,
          ),
        );
        setSelectedId(null);

        // Check win
        const remaining = bubbles.filter(
          (b) => b.cardId !== bubble.cardId && !b.popped,
        );
        if (remaining.length === 0) {
          setTimeout(onWin, 1000);
        }
      } else {
        // Wrong match
        setSelectedId(null);
      }
    } else {
      setSelectedId(bubble.id);
    }
  };

  return (
    <div className="w-full bg-violet-100 rounded-3xl border-4 border-violet-300 p-8 flex flex-col items-center min-h-[400px]">
      <h3 className="text-2xl font-black text-violet-800 mb-8">
        Ghép bóng chữ cái!
      </h3>

      <div className="flex flex-wrap justify-center gap-6 max-w-2xl">
        <AnimatePresence>
          {bubbles.map(
            (b) =>
              !b.popped && (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => handleSelect(b)}
                  className={`relative cursor-pointer flex flex-col items-center justify-center w-28 h-28 rounded-full shadow-lg border-4 transition-all ${
                    selectedId === b.id
                      ? "border-yellow-400 scale-110 shadow-yellow-200/50"
                      : "border-white hover:scale-105"
                  } ${b.color}`}
                >
                  <div className="absolute top-2 left-3 w-4 h-6 bg-white/30 rounded-full rotate-45"></div>
                  <span className="font-bold text-white text-center px-2 drop-shadow-md z-10 leading-tight">
                    {b.text}
                  </span>
                </motion.div>
              ),
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
