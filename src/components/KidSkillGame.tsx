import React, { useState, useEffect } from "react";
import {
  Volume2,
  Mic,
  ArrowRight,
  CheckCircle2,
  Type,
  Trophy,
  Star,
} from "lucide-react";

export function KidSkillGame({
  data,
  type,
  onComplete,
}: {
  data: any;
  type: string;
  onComplete: (stars: number, points: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isWin, setIsWin] = useState(false);
  const [misses, setMisses] = useState(0);
  const [writingInput, setWritingInput] = useState("");

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [recognitionInstance]);

  const toggleRecording = (targetText: string) => {
    if (isRecording) {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback("Trình duyệt không hỗ trợ thu âm (Hãy dùng Chrome).");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordedText("");
      setFeedback("Đang nghe... 🎤");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setRecordedText(transcript);
      checkPronunciation(transcript, targetText);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsRecording(false);
      if (event.error !== "aborted") {
        setFeedback("Lỗi thu âm. Vui lòng thử lại.");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (feedback === "Đang nghe... 🎤") {
        setFeedback("");
      }
    };

    setRecognitionInstance(recognition);
    recognition.start();
  };

  const checkPronunciation = (spoken: string, target: string) => {
    const normalizeWords = (s: string) =>
      s
        .toLowerCase()
        .replace(/[.,!?]/g, "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    const spokenWords = normalizeWords(spoken);
    const targetWords = normalizeWords(target);

    if (targetWords.length === 0) return;

    let matchCount = 0;
    targetWords.forEach((w) => {
      if (spokenWords.includes(w)) matchCount++;
    });

    const matchRate = matchCount / targetWords.length;
    // Require at least 70% of the words to be spoken, and match rate to be high
    const isLengthSufficient = spokenWords.length >= targetWords.length * 0.7;

    if (matchRate >= 0.7 && isLengthSufficient) {
      setFeedback("Tuyệt vời! Bé đọc rất chuẩn. 🌟");
      setIsCorrect(true);
    } else {
      setFeedback(
        `Gần đúng rồi! Bé thử nghe và đọc lại nhé. (Bé đọc: "${spoken}")`,
      );
      setIsCorrect(false);
      setMisses((m) => m + 1);
    }
  };

  const speakText = (text: string) => {
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.replace('_', '-').startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      utterance.rate = 0.9;
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed:", e);
    }
  };

  const handleWin = () => {
    setIsWin(true);
  };

  const checkAnswer = (answer: string, correctAnswers: string[]) => {
    setSelected(answer);
    if (correctAnswers.includes(answer)) {
      setIsCorrect(true);
      setTimeout(() => {
        setIsCorrect(null);
        setSelected(null);
        handleWin();
      }, 1500);
    } else {
      setIsCorrect(false);
      setMisses((m) => m + 1);
      setTimeout(() => {
        setIsCorrect(null);
        setSelected(null);
      }, 1000);
    }
  };

  if (isWin) {
    const stars =
      misses === 0
        ? 5
        : misses <= 1
          ? 4
          : misses <= 2
            ? 3
            : misses <= 3
              ? 2
              : 1;
    const points = stars * 50;

    return (
      <div className="text-center py-12 animate-in fade-in zoom-in bg-white rounded-3xl border-4 border-yellow-200 p-8 shadow-sm max-w-2xl mx-auto">
        <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
        <h2 className="text-3xl font-black text-yellow-600 mb-2">Quá giỏi!</h2>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-12 h-12 ${i <= stars ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"}`}
            />
          ))}
        </div>
        <p className="text-xl font-bold text-slate-600 mb-2">
          Bé đã hoàn thành xuất sắc thử thách này.
        </p>
        <p className="text-2xl font-black text-orange-500 mb-8">
          +{points} Điểm thưởng!
        </p>
        <button
          onClick={() => onComplete(stars, points)}
          className="px-6 py-3 bg-yellow-400 text-white rounded-full font-black text-xl shadow-sm hover:bg-yellow-500 transition-colors"
        >
          Nhận thưởng
        </button>
      </div>
    );
  }

  if (type === "kids_listening") {
    const q = data.questions?.[0];
    return (
      <div className="bg-white p-8 rounded-3xl border-4 border-indigo-200 shadow-sm max-w-2xl mx-auto text-center animate-in zoom-in">
        <h3 className="text-2xl font-black text-indigo-600 mb-6">
          {data.title}
        </h3>
        <button
          onClick={() => speakText(data.transcript[0]?.text || "")}
          className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 hover:bg-indigo-200 hover:scale-110 transition-all text-indigo-500 shadow-sm border-4 border-indigo-300"
        >
          <Volume2 className="w-12 h-12" />
        </button>
        {q && (
          <div>
            <p className="text-xl font-bold text-slate-800 mb-6">
              {q.question}
            </p>
            <div className="space-y-3">
              {q.options?.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => checkAnswer(opt, q.answers)}
                  className={`w-full p-4 rounded-2xl font-bold text-lg transition-all border-4 ${
                    selected === opt
                      ? isCorrect
                        ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                        : "bg-rose-100 border-rose-400 text-rose-700"
                      : "bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (type === "kids_speaking" || type === "kids_phonics") {
    const targetText = data.bulletPoints?.[step] || "";
    const isPhonics = type === "kids_phonics";
    const themeColor = isPhonics ? "pink" : "emerald";
    return (
      <div
        className={`bg-white p-8 rounded-3xl border-4 ${isPhonics ? "border-pink-200" : "border-emerald-200"} shadow-sm max-w-2xl mx-auto text-center animate-in zoom-in`}
      >
        <h3
          className={`text-2xl font-black ${isPhonics ? "text-pink-600" : "text-emerald-600"} mb-6`}
        >
          {data.title}
        </h3>
        <div
          className={`${isPhonics ? "bg-pink-50 border-pink-100" : "bg-emerald-50 border-emerald-100"} border-2 p-6 rounded-2xl mb-6`}
        >
          <p className="text-2xl font-bold text-slate-800 leading-relaxed">
            {targetText}
          </p>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => speakText(targetText)}
            className={`p-4 ${isPhonics ? "bg-pink-100 text-pink-600 border-pink-300 hover:bg-pink-200" : "bg-emerald-100 text-emerald-600 border-emerald-300 hover:bg-emerald-200"} rounded-full transition-colors border-2`}
          >
            <Volume2 className="w-8 h-8" />
          </button>
          <button
            onClick={() => toggleRecording(targetText)}
            className={`p-4 rounded-full transition-colors border-2 relative group ${
              isRecording
                ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                : "bg-rose-100 text-rose-600 hover:bg-rose-200 border-rose-300"
            }`}
          >
            <Mic className="w-8 h-8" />
            {!isRecording && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Nhấn để thu âm
              </span>
            )}
          </button>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-2xl mb-6 font-bold text-lg border-2 ${
              isCorrect
                ? isPhonics
                  ? "bg-pink-100 text-pink-700 border-pink-300"
                  : "bg-emerald-100 text-emerald-700 border-emerald-300"
                : isCorrect === false
                  ? "bg-amber-100 text-amber-700 border-amber-300"
                  : "bg-slate-100 text-slate-700 border-slate-300"
            }`}
          >
            {feedback}
          </div>
        )}

        <p
          className={`${isPhonics ? "text-pink-600" : "text-emerald-600"} font-medium mb-8`}
        >
          Mẹo: {data.tip}
        </p>
        <button
          onClick={() => {
            setFeedback("");
            setIsCorrect(null);
            setRecordedText("");
            if (step < (data.bulletPoints?.length || 0) - 1) {
              setStep((s) => s + 1);
            } else {
              handleWin();
            }
          }}
          disabled={isCorrect !== true}
          className={`w-full py-4 ${isPhonics ? "bg-pink-500 hover:bg-pink-600" : "bg-emerald-500 hover:bg-emerald-600"} text-white font-black text-xl rounded-2xl shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {step < (data.bulletPoints?.length || 0) - 1
            ? "Câu tiếp theo"
            : "Hoàn thành!"}
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    );
  }

  if (type === "kids_reading") {
    const q = data.questions?.[0];
    return (
      <div className="bg-white p-8 rounded-3xl border-4 border-amber-200 shadow-sm max-w-3xl mx-auto animate-in zoom-in">
        <h3 className="text-2xl font-black text-amber-600 mb-6 text-center">
          {data.title}
        </h3>
        <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-2xl mb-8">
          {data.paragraphs?.map((p: string, i: number) => (
            <p
              key={i}
              className="text-xl font-bold text-slate-800 leading-relaxed mb-4"
            >
              {p}
            </p>
          ))}
        </div>
        {q && (
          <div>
            <p className="text-xl font-bold text-slate-800 mb-6 text-center">
              {q.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {q.options?.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => checkAnswer(opt, q.answers)}
                  className={`p-4 rounded-2xl font-bold text-lg transition-all border-4 ${
                    selected === opt
                      ? isCorrect
                        ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                        : "bg-rose-100 border-rose-400 text-rose-700"
                      : "bg-slate-50 border-slate-200 hover:border-amber-300 text-slate-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (type === "kids_writing") {
    return (
      <div className="bg-white p-8 rounded-3xl border-4 border-rose-200 shadow-sm max-w-2xl mx-auto text-center animate-in zoom-in">
        <h3 className="text-2xl font-black text-rose-600 mb-6">{data.title}</h3>
        <div className="bg-rose-50 border-2 border-rose-100 p-6 rounded-2xl mb-8">
          <p className="text-xl font-bold text-slate-800 leading-relaxed">
            {data.question}
          </p>
        </div>
        <div className="relative max-w-md mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Type className="h-6 w-6 text-rose-300" />
          </div>
          <input
            type="text"
            value={writingInput}
            onChange={(e) => setWritingInput(e.target.value)}
            placeholder="Gõ đáp án của bé vào đây..."
            className={`w-full pl-12 pr-4 py-4 bg-white border-4 ${
              isCorrect === false
                ? "border-amber-400"
                : isCorrect === true
                  ? "border-emerald-400"
                  : "border-rose-200"
            } rounded-2xl font-bold text-xl text-slate-800 focus:outline-none focus:border-rose-400 placeholder:text-slate-300 transition-colors`}
          />
        </div>
        {isCorrect === false && (
          <p className="text-amber-600 font-bold mb-4 animate-bounce">
            Chưa chính xác rồi, bé thử lại nhé! 🤔
          </p>
        )}
        <p className="text-rose-600 font-medium mb-8">Mẹo: {data.tip}</p>
        <button
          onClick={() => {
            if (!data.answer) {
              handleWin();
              return;
            }
            // normalized comparison
            const correctStr = data.answer
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .trim();
            const inputStr = writingInput
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .trim();

            if (correctStr === inputStr) {
              setIsCorrect(true);
              setTimeout(() => {
                handleWin();
              }, 1000);
            } else {
              setIsCorrect(false);
              setMisses((m) => m + 1);
            }
          }}
          disabled={!writingInput.trim()}
          className="w-full py-4 bg-rose-500 text-white font-black text-xl rounded-2xl shadow-sm hover:bg-rose-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Nộp bài
          <CheckCircle2 className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return null;
}
