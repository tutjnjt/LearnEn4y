import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Target,
} from "lucide-react";

const QUESTIONS: Record<
  number,
  {
    text: string;
    yes: number | string;
    no: number | string;
    yesLabel?: string;
    noLabel?: string;
  }
> = {
  1: {
    text: "Bạn đã nắm được các dạng bài có trong phần thi IELTS Reading chưa?",
    yes: 2,
    no: 5,
    yesLabel: "Rồi",
    noLabel: "Chưa",
  },
  2: {
    text: "Khi gặp một từ vựng lạ trong bài, bạn có thể bình tĩnh đoán được ý nghĩa của nó nhờ quan sát ngữ cảnh xung quanh không?",
    yes: 3,
    no: 7,
    yesLabel: "Có",
    noLabel: "Không",
  },
  3: {
    text: 'Bạn có thể tự chuyển câu tiếng Anh dưới đây sang một cách diễn đạt khác (paraphrase) không? "Not all of the benefits of diversity in the workplace are guaranteed."',
    yes: 4,
    no: 8,
    yesLabel: "Có",
    noLabel: "Không",
  },
  4: {
    text: "Khi đọc một bài báo hoặc tạp chí bằng tiếng Anh, bạn có dễ dàng hiểu được chủ đề tác giả đang nhắc tới không?",
    yes: "D",
    no: "A",
    yesLabel: "Có",
    noLabel: "Không",
  },
  5: {
    text: "Trước đây, bạn đã từng đọc các bài viết tiếng Anh nào dài hơn 4 đoạn chưa?",
    yes: 6,
    no: "C",
    yesLabel: "Đã từng",
    noLabel: "Chưa từng",
  },
  6: {
    text: "Bạn có biết nghĩa của 4 từ trở lên trong 5 từ vựng sau không: evident, significance, ancient, extent, categorise?",
    yes: 7,
    no: 9,
    yesLabel: "Có",
    noLabel: "Không",
  },
  7: {
    text: 'Bạn có khả năng phân biệt được đâu là "mệnh đề chính" và đâu là "mệnh đề bổ sung" khi đọc một câu tiếng Anh dài không?',
    yes: 8,
    no: 9,
    yesLabel: "Có",
    noLabel: "Không",
  },
  8: {
    text: "Bạn có thể hiểu được nội dung chính của một bài đọc ngay cả khi chủ đề đó rất lạ và không hề quen thuộc với bạn không?",
    yes: "A",
    no: "B",
    yesLabel: "Có",
    noLabel: "Không",
  },
  9: {
    text: "Ở mức độ ngữ pháp cơ bản, bạn có thể tìm và xác định chính xác Chủ ngữ và Vị ngữ của một câu không?",
    yes: "B",
    no: "C",
    yesLabel: "Có",
    noLabel: "Không",
  },
};

const RESULTS: Record<
  string,
  { title: string; subtitle: string; desc: string }
> = {
  A: {
    title: "KIỂU A - Kế hoạch 4 tuần",
    subtitle: "Cần củng cố kỹ năng đọc hiểu",
    desc: "Bạn đã có vốn từ và ngữ pháp nhất định nhưng chưa biết cách phân tích sâu. Lộ trình của bạn nên trải đều 4 tuần, tập trung dịch nghĩa chính xác các bài đọc, học thuộc các cụm từ quan trọng trong bài để không còn bị lúng túng khi gặp bài có chủ đề lạ.",
  },
  B: {
    title: "KIỂU B - Kế hoạch 3 tuần",
    subtitle: "Cần nâng cao khả năng trả lời câu hỏi",
    desc: "Bạn có nền tảng đọc căn bản tốt nhưng thiếu kỹ năng xử lý các dạng câu hỏi IELTS. Bạn có thể đẩy nhanh phần nền tảng để tập trung nghiên cứu thật kỹ chiến thuật của từng dạng bài (Multiple Choice, True/False/Not Given...).",
  },
  C: {
    title: "KIỂU C - Kế hoạch 6 tuần",
    subtitle: "Cần xây dựng nền tảng từ con số 0",
    desc: "Bạn chưa quen với tiếng Anh học thuật nên việc vội vàng giải đề lúc này là vô ích. Hãy dùng 2 tuần đầu tiên chỉ để ôn luyện từ vựng, tập tìm chủ ngữ/vị ngữ và học kỹ năng đọc lướt. Sau đó mới chuyển sang làm quen với các dạng đề thi.",
  },
  D: {
    title: "KIỂU D - Kế hoạch 2 tuần",
    subtitle: "Luyện cảm giác làm bài thực tế",
    desc: "Chúc mừng, bạn đã khá thành thạo kỹ năng đọc hiểu! Bạn chỉ cần đọc lướt qua các chiến thuật trong sách để ôn lại hệ thống, sau đó dành 2 tuần tập trung làm các đề thi thực tế (Actual Test) có bấm giờ để làm quen với áp lực phòng thi.",
  },
};

export function MomDiagnosticTest({ onBack }: { onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (answer: "yes" | "no") => {
    const q = QUESTIONS[currentQuestion];
    const next = answer === "yes" ? q.yes : q.no;

    if (typeof next === "string") {
      setResult(next);
    } else {
      setCurrentQuestion(next);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(1);
    setResult(null);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in zoom-in max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold mb-8"
      >
        <ArrowLeft className="w-5 h-5" /> Trở lại Lộ trình
      </button>

      {result ? (
        <div className="text-center animate-in slide-in-from-bottom-4">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-indigo-600 mb-2">
            {RESULTS[result].title}
          </h2>
          <h3 className="text-xl font-bold text-slate-700 mb-6">
            {RESULTS[result].subtitle}
          </h3>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-left mb-8">
            <p className="text-lg text-slate-700 leading-relaxed">
              {RESULTS[result].desc}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 w-full sm:w-auto mx-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            <RefreshCcw className="w-5 h-5" /> Làm lại bài test
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800">
              Bài Đánh Giá Năng Lực
            </h2>
            <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm">
              Câu {currentQuestion}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 mb-8 min-h-[160px] flex items-center justify-center text-center shadow-sm">
            <p className="text-xl font-bold text-slate-800 leading-relaxed">
              {QUESTIONS[currentQuestion].text}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer("yes")}
              className="flex items-center justify-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 text-emerald-700 font-bold rounded-2xl transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-6 h-6" />
              {QUESTIONS[currentQuestion].yesLabel || "Có"}
            </button>
            <button
              onClick={() => handleAnswer("no")}
              className="flex items-center justify-center gap-3 p-4 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 text-rose-700 font-bold rounded-2xl transition-all hover:scale-[1.02]"
            >
              <XCircle className="w-6 h-6" />
              {QUESTIONS[currentQuestion].noLabel || "Không"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
