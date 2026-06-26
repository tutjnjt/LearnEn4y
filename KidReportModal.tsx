import React from "react";
import { generateKidsData } from "../utils/kidsDataGenerator";
import { X, Printer, Trophy, Star } from "lucide-react";

export function KidReportModal({
  book,
  volume,
  topic,
  level,
  stars,
  onClose,
}: {
  book: string;
  volume: number;
  topic: string;
  level: { id: string; name: string; emoji: string };
  stars: number;
  onClose: () => void;
}) {
  // Generate data to show what was learned
  const vocabData = generateKidsData("kids_vocabulary", level.id, book, volume, topic);
  const flashcards = vocabData.flashcards || [];

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 sm:p-8 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full mx-auto shadow-2xl relative flex flex-col animate-in zoom-in-95 max-h-[90vh]">
        {/* Header - hide on print */}
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-100 print:hidden">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Báo cáo học tập
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200 transition-colors"
            >
              <Printer className="w-5 h-5" /> In báo cáo
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible flex-1 report-content">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{level.emoji}</div>
            <h1 className="text-4xl font-black text-slate-800 mb-2">Báo Cáo Hoàn Thành</h1>
            <p className="text-xl font-bold text-orange-500 mb-4">{book} - Tập {volume} - {level.name}</p>
            
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${i <= stars ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"}`}
                />
              ))}
            </div>

            <div className="inline-block bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-left mx-auto">
              <p className="font-bold text-slate-600 mb-2">
                <span className="text-slate-400 w-32 inline-block">Thời gian:</span> 
                {today}
              </p>
              <p className="font-bold text-slate-600 mb-2">
                <span className="text-slate-400 w-32 inline-block">Kết quả:</span> 
                Đạt {stars}/5 sao
              </p>
              <p className="font-bold text-slate-600">
                <span className="text-slate-400 w-32 inline-block">Đánh giá:</span> 
                {stars >= 4 ? "Xuất sắc! Bé học rất nhanh và nhớ từ tốt." : stars >= 3 ? "Khá tốt! Bé cần luyện tập thêm một chút nhé." : "Bé hãy cố gắng hơn ở các chặng sau nhé!"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-6 border-b-2 border-slate-100 pb-2">
              Nội dung bé đã hoàn thành
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {flashcards.map((fc: any, i: number) => (
                <div key={i} className="bg-indigo-50 rounded-2xl p-4 text-center border-2 border-indigo-100">
                  <span className="text-4xl block mb-2">{fc.emoji}</span>
                  <span className="font-black text-lg text-indigo-900 block">{fc.word}</span>
                  <span className="font-bold text-sm text-indigo-500 block">{fc.meaning_vi}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-orange-50 rounded-2xl p-6 border-2 border-orange-100">
              <h4 className="font-black text-lg text-orange-800 mb-2">Kỹ năng đã luyện tập:</h4>
              <ul className="list-disc list-inside font-bold text-orange-700 space-y-1">
                <li>Ghi nhớ từ vựng (Memory Matrix, Word Match)</li>
                <li>Luyện nghe (Nghe và chọn đáp án)</li>
                <li>Luyện phát âm (Đọc to từ vựng)</li>
                <li>Luyện đọc hiểu (Câu chuyện ngắn)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .report-content, .report-content * {
              visibility: visible;
            }
            .report-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}} />
      </div>
    </div>
  );
}
