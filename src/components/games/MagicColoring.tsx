import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Paintbrush } from "lucide-react";

interface Flashcard {
  word: string;
  meaning_vi: string;
  emoji: string;
}

interface MagicColoringProps {
  cards: Flashcard[];
  onWin: () => void;
}

export default function MagicColoring({ cards, onWin }: MagicColoringProps) {
  const [targetIndex, setTargetIndex] = useState(0);
  const [blocks, setBlocks] = useState<
    {
      id: number;
      word: string;
      meaning: string;
      emoji: string;
      isColored: boolean;
    }[]
  >([]);
  const colors = [
    "bg-rose-400",
    "bg-blue-400",
    "bg-emerald-400",
    "bg-amber-400",
    "bg-purple-400",
    "bg-indigo-400",
  ];

  useEffect(() => {
    // Generate blocks from cards
    const newBlocks = cards.map((c, i) => ({
      id: i,
      word: c.word,
      meaning: c.meaning_vi,
      emoji: c.emoji,
      isColored: false,
    }));
    setBlocks(newBlocks.sort(() => Math.random() - 0.5));
  }, [cards]);

  const handleBlockClick = (blockId: number, blockWord: string) => {
    if (blockWord === cards[targetIndex].word) {
      setBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, isColored: true } : b)),
      );
      if (targetIndex + 1 < cards.length) {
        setTargetIndex((t) => t + 1);
      } else {
        setTimeout(onWin, 1500);
      }
    }
  };

  return (
    <div className="w-full bg-pink-50 rounded-3xl border-4 border-pink-200 p-8 flex flex-col items-center">
      <h3 className="text-2xl font-black text-pink-800 mb-6 flex items-center gap-2">
        <Paintbrush className="w-8 h-8" /> Tô Màu Biến Hình
      </h3>

      {targetIndex < cards.length && (
        <div className="bg-white px-6 py-3 rounded-full border-2 border-pink-300 shadow-sm mb-8 text-xl font-bold text-slate-700">
          Hãy tô màu ô chữ:{" "}
          <span className="text-pink-600 uppercase">
            {cards[targetIndex].meaning_vi}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg w-full bg-white p-2 rounded-2xl border-4 border-slate-200 shadow-inner">
        {blocks.map((block, idx) => (
          <motion.div
            key={block.id}
            whileHover={{ scale: block.isColored ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBlockClick(block.id, block.word)}
            className={`aspect-square relative cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-500 overflow-hidden ${
              block.isColored
                ? `${colors[idx % colors.length]} border-transparent`
                : "bg-slate-100 border-dashed border-slate-300 hover:border-pink-300 hover:bg-pink-50"
            }`}
          >
            {block.isColored ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-6xl"
              >
                {block.emoji}
              </motion.div>
            ) : (
              <span className="font-bold text-lg text-slate-500 text-center px-2">
                {block.word}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
