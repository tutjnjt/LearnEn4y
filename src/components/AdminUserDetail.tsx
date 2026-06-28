import React, { useState } from "react";
import { Users, Star, Trophy, Clock, LogOut, ArrowLeft, BookOpen, CheckCircle, FileText } from "lucide-react";
import { KidReportModal } from "./KidReportModal";
import { generateKidsData } from "../utils/kidsDataGenerator";

const ALL_BOOKS = [
  { id: "starters", name: "Starters", color: "sky" },
  { id: "movers", name: "Movers", color: "indigo" },
  { id: "flyers", name: "Flyers", color: "amber" },
  { id: "ket", name: "KET", color: "rose" },
  { id: "pet", name: "PET", color: "emerald" },
];

export function AdminUserDetail({ user, onBack }: { user: any; onBack: () => void }) {
  const [selectedReport, setSelectedReport] = useState<{
    bookId: string;
    bookName: string;
    volume: number;
    levelId: string;
    levelName: string;
    stars: number;
  } | null>(null);

  const formatTime = (seconds: number) => {
    if (!seconds) return "0p 0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}p ${s}s`;
  };

  // Helper to parse completed levels and extract their info
  const completedLevels = user.completedLevels || {};
  const gameStars = user.gameStars || {};
  
  const parsedLevels: any[] = [];
  
  Object.keys(completedLevels).forEach((levelId) => {
    if (completedLevels[levelId]) {
      // In this simple implementation, we can just guess the book and volume from standard levels
      // Realistically we'd need a lookup table, but for now we mock it or extract it
      let bookName = "Starters";
      let bookId = "starters";
      let volume = 1;
      let levelName = levelId;
      
      const starsObj = gameStars[levelId] || {};
      let totalEarned = 0;
      for (const key in starsObj) {
        totalEarned += starsObj[key];
      }
      const maxPossible = 7 * 5; // roughly 7 games per level
      const stars = maxPossible > 0 ? Math.round((totalEarned / maxPossible) * 5) : 0;
      
      parsedLevels.push({
        levelId,
        levelName,
        bookId,
        bookName,
        volume,
        stars: stars > 0 ? stars : 5 // fallback
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white border-2 border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl border-2 border-slate-200">
              {user.avatar || "👤"}
            </div>
            Chi tiết tiến trình: {user.email}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border-4 border-yellow-100 flex flex-col items-center justify-center shadow-sm">
          <Star className="w-12 h-12 text-yellow-500 mb-2" />
          <div className="text-3xl font-black text-slate-800">{user.stars || 0}</div>
          <div className="text-slate-500 font-bold">Tổng số Sao</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border-4 border-emerald-100 flex flex-col items-center justify-center shadow-sm">
          <Trophy className="w-12 h-12 text-emerald-500 mb-2" />
          <div className="text-3xl font-black text-slate-800">{user.points || 0}</div>
          <div className="text-slate-500 font-bold">Tổng số Điểm</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border-4 border-blue-100 flex flex-col items-center justify-center shadow-sm">
          <Clock className="w-12 h-12 text-blue-500 mb-2" />
          <div className="text-3xl font-black text-slate-800">{formatTime(user.playTime)}</div>
          <div className="text-slate-500 font-bold">Thời gian học</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-4 border-slate-100 p-8 shadow-sm">
        <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <CheckCircle className="w-7 h-7 text-emerald-500" /> Các chặng đã hoàn thành
        </h3>
        
        {parsedLevels.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-medium">
            Người chơi này chưa hoàn thành chặng nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parsedLevels.map((lvl, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-slate-800 text-lg">{lvl.levelName}</h4>
                    <p className="text-sm font-bold text-slate-500">{lvl.bookName} - Tập {lvl.volume}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-yellow-700">{lvl.stars}</span>
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => setSelectedReport(lvl)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                  >
                    <FileText className="w-5 h-5" /> Xem Báo Cáo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedReport && (
        <KidReportModal
          book={selectedReport.bookName}
          volume={selectedReport.volume}
          topic={selectedReport.levelName}
          level={{ id: selectedReport.levelId, name: selectedReport.levelName, emoji: "⭐" }}
          stars={selectedReport.stars}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
