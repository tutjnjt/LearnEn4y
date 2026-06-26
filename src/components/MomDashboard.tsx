import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Mic,
  PenTool,
  Loader2,
  Map,
  Gamepad2,
  Target,
  Brain,
  ArrowRight,
  CheckCircle2,
  Trophy,
  ArrowLeftRight,
  Send,
  Square,
  Play,
  Headphones,
  FileText,
  Volume2,
  StopCircle,
  Languages,
  Flame,
  Star,
  BarChart2,
  Library,
  Plus,
  GraduationCap,
  Layers,
  Clock,
} from "lucide-react";
import {
  IeltsVocabulary,
  IeltsSpeaking,
  IeltsWriting,
  IeltsMatchPair,
  IeltsEvaluation,
  IeltsListening,
  IeltsReading,
  SavedWord,
  UserStats,
} from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

type Tab = "roadmap" | "practice" | "games" | "flashcards" | "analytics";
type Level =
  | "Pre-IELTS (Band 3.0 - 4.0)"
  | "Foundation (Band 4.0 - 5.0)"
  | "Intermediate (Band 5.0 - 6.0)"
  | "Advanced (Band 6.5+)";

export function MomDashboard({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("roadmap");
  const [currentLevel, setCurrentLevel] = useState<Level>(
    "Pre-IELTS (Band 3.0 - 4.0)",
  );

  // Mock Gamification state
  const [stats, setStats] = useState<UserStats>({
    streak: 12,
    points: 1250,
    lastStudyDate: new Date().toISOString(),
  });
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              Lộ Trình IELTS Cho Mẹ
            </h1>
            <p className="text-slate-500 font-medium">
              Học thông minh, chinh phục mục tiêu 🚀
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 shrink-0">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
            <div>
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Streak
              </div>
              <div className="text-lg font-black text-orange-700 leading-none">
                {stats.streak} ngày
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100 shrink-0">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <div>
              <div className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
                Điểm thưởng
              </div>
              <div className="text-lg font-black text-yellow-700 leading-none">
                {stats.points} XP
              </div>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-5 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors shrink-0"
          >
            Đổi hồ sơ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("roadmap")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "roadmap" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
        >
          <Map className="w-5 h-5" />
          Lộ trình
        </button>
        <button
          onClick={() => setActiveTab("practice")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "practice" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
        >
          <BookOpen className="w-5 h-5" />
          Thực hành
        </button>
        <button
          onClick={() => setActiveTab("games")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "games" ? "bg-white text-rose-600 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
        >
          <Gamepad2 className="w-5 h-5" />
          Trò chơi ôn tập
        </button>
        <button
          onClick={() => setActiveTab("flashcards")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "flashcards" ? "bg-white text-amber-600 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
        >
          <Library className="w-5 h-5" />
          Kho từ vựng
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "analytics" ? "bg-white text-purple-600 shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"}`}
        >
          <BarChart2 className="w-5 h-5" />
          Tiến độ
        </button>
      </div>

      <div className="min-h-[500px]">
        {activeTab === "roadmap" && <MomRoadmap setActiveTab={setActiveTab} />}
        {activeTab === "practice" && (
          <MomPractice
            level={currentLevel}
            savedWords={savedWords}
            setSavedWords={setSavedWords}
          />
        )}
        {activeTab === "games" && <MomGame level={currentLevel} />}
        {activeTab === "flashcards" && (
          <Flashcards words={savedWords} setWords={setSavedWords} />
        )}
        {activeTab === "analytics" && <AnalyticsDashboard />}
      </div>
    </div>
  );
}

// --- WRITING TIMER COMPONENT ---
function WritingTimer({ initialMinutes }: { initialMinutes: number }) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`font-mono font-black text-xl px-3 py-1 rounded-xl border-2 ${timeLeft < 300 ? "text-rose-600 border-rose-200 bg-rose-50" : "text-slate-700 border-slate-200 bg-slate-50"}`}
      >
        {formatTime(timeLeft)}
      </div>
      <button
        onClick={toggleTimer}
        className={`p-2 rounded-xl transition-colors ${isActive ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"}`}
      >
        {isActive ? (
          <StopCircle className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

import { MomDiagnosticTest } from "./MomDiagnosticTest";

import { MomBeginnerReadingRoadmap } from "./MomBeginnerReadingRoadmap";

// --- ROADMAP COMPONENT ---
function MomRoadmap({ setActiveTab }: { setActiveTab: (tab: Tab) => void }) {
  const [showTest, setShowTest] = useState(false);

  if (showTest) {
    return <MomDiagnosticTest onBack={() => setShowTest(false)} />;
  }

  const roadmapSteps = [
    {
      step: "Bước 1",
      title: "Đánh giá năng lực và chọn thời gian biểu",
      time: "Trước khi bắt đầu",
      icon: <Target className="w-6 h-6 text-indigo-500" />,
      color: "border-indigo-200 bg-indigo-50 text-indigo-700",
      content: (
        <div className="mt-4">
          <p className="text-sm text-slate-600 mb-4">
            Hướng dẫn kiểm tra đầu vào và tư vấn chọn các kế hoạch học tập linh
            hoạt (2, 3, 4 hoặc 6 tuần) cùng lịch học gợi ý 6 buổi/tuần.
          </p>
          <button
            onClick={() => setShowTest(true)}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
          >
            <Target className="w-4 h-4" /> Làm Bài Đánh Giá Năng Lực
          </button>
        </div>
      ),
    },
    {
      step: "Bước 2",
      title: "Xây dựng nền tảng và Kỹ năng cơ bản",
      time: "Tuần 1",
      icon: <Map className="w-6 h-6 text-emerald-500" />,
      color: "border-emerald-200 bg-emerald-50 text-emerald-700",
      content: (
        <div className="mt-4 text-sm text-slate-600">
          Hệ thống hóa kiến thức trọng tâm cho cả 4 kỹ năng (Reading, Listening,
          Speaking, Writing) trong tuần đầu tiên.
        </div>
      ),
    },
    {
      step: "Bước 3",
      title: "Giải quyết chuyên sâu từng dạng bài",
      time: "Tuần 2 & Tuần 3",
      icon: <Layers className="w-6 h-6 text-amber-500" />,
      color: "border-amber-200 bg-amber-50 text-amber-700",
      content: (
        <div className="mt-4 text-sm text-slate-600">
          Tập trung nghiên cứu chiến thuật làm bài cho từng dạng câu hỏi cụ thể
          và áp dụng bài tập thực hành hàng ngày.
        </div>
      ),
    },
    {
      step: "Bước 4",
      title: "Luyện đề thực chiến và Rút kinh nghiệm",
      time: "Tuần 4",
      icon: <Trophy className="w-6 h-6 text-rose-500" />,
      color: "border-rose-200 bg-rose-50 text-rose-700",
      content: (
        <div className="mt-4 text-sm text-slate-600">
          Luyện tập các bài thi mô phỏng, giải Actual Test và cực kỳ chú trọng
          vào việc phân tích lỗi sai cũng như paraphrase.
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <GraduationCap className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/20">
            <Star className="w-4 h-4 text-yellow-300" /> Trình độ Beginner (Band
            3.5 - 4.5)
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">
            Lộ trình IELTS Đặc Biệt
          </h2>
          <p className="text-indigo-100 max-w-2xl text-lg leading-relaxed">
            Lộ trình này được thiết kế có tính hệ thống cao, giúp người tự học
            từ chỗ chưa biết gì có thể định hình được cách làm bài và đạt được
            mục tiêu điểm số.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Vertical Timeline */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-8 border-b pb-4">
              Chi tiết Lộ trình
            </h3>
            <div className="relative border-l-4 border-slate-100 ml-6 space-y-10 pb-4">
              {roadmapSteps.map((step, index) => (
                <div key={index} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[22px] top-0 w-10 h-10 rounded-full bg-white border-4 flex items-center justify-center shadow-sm ${step.color.split(" ")[0]}`}
                  >
                    {step.icon}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`p-6 rounded-2xl border ${step.color.replace("bg-", "bg-opacity-50 bg-")} transition-all hover:shadow-md`}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${step.color}`}
                      >
                        {step.step}
                      </span>
                      <span className="text-slate-500 font-medium text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {step.time}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mt-2">
                      {step.title}
                    </h4>
                    {step.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel & Additional Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center sticky top-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Sẵn sàng học?
            </h3>
            <p className="text-slate-500 mb-6">
              Bắt đầu bài học hôm nay bằng cách chọn phần thực hành bên dưới.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => setActiveTab("practice")}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <BookOpen className="w-5 h-5" />
                Thực hành ngay
              </button>
              <button
                onClick={() => setActiveTab("games")}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Gamepad2 className="w-5 h-5" />
                Vào Trò chơi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PRACTICE COMPONENT ---
function MomPractice({
  level,
  savedWords,
  setSavedWords,
}: {
  level: string;
  savedWords: SavedWord[];
  setSavedWords: (
    words: SavedWord[] | ((prev: SavedWord[]) => SavedWord[]),
  ) => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [vocab, setVocab] = useState<IeltsVocabulary[]>([]);
  const [speaking, setSpeaking] = useState<IeltsSpeaking | null>(null);
  const [writing, setWriting] = useState<IeltsWriting | null>(null);
  const [listening, setListening] = useState<IeltsListening | null>(null);
  const [reading, setReading] = useState<IeltsReading | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Evaluation States
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [evalSpeaking, setEvalSpeaking] = useState<IeltsEvaluation | null>(
    null,
  );
  const [isEvaluatingSpeaking, setIsEvaluatingSpeaking] = useState(false);

  const [essay, setEssay] = useState("");
  const [evalWriting, setEvalWriting] = useState<IeltsEvaluation | null>(null);
  const [isEvaluatingWriting, setIsEvaluatingWriting] = useState(false);

  const [listeningSpeed, setListeningSpeed] = useState<number>(1.0);

  const recognitionRef = useRef<any>(null);

  const fetchContent = async (
    type: "vocabulary" | "speaking" | "writing" | "listening" | "reading",
  ) => {
    setLoading(type);
    setError(null);
    setTranscript("");
    setEssay("");
    setEvalSpeaking(null);
    setEvalWriting(null);
    setListening(null);
    setReading(null);
    setVocab([]);
    setSpeaking(null);
    setWriting(null);
    try {
      const res = await fetch("/api/ielts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, level }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch");
      }
      const data = await res.json();
      if (type === "vocabulary") setVocab(data.words || []);
      if (type === "speaking") setSpeaking(data);
      if (type === "writing") setWriting(data);
      if (type === "listening") setListening(data);
      if (type === "reading") setReading(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = listeningSpeed;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      if (
        !("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)
      ) {
        setError(
          "Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome.",
        );
        return;
      }
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (currentTranscript) {
          setTranscript((prev) => prev + currentTranscript);
        }
      };

      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const evaluateContent = async (type: "speaking" | "writing") => {
    if (type === "speaking") setIsEvaluatingSpeaking(true);
    else setIsEvaluatingWriting(true);
    setError(null);

    try {
      const topic = type === "speaking" ? speaking?.title : writing?.question;
      const content = type === "speaking" ? transcript : essay;

      const res = await fetch("/api/ielts/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, topic, content }),
      });

      if (!res.ok) throw new Error("Chấm điểm thất bại");
      const data = await res.json();

      if (type === "speaking") setEvalSpeaking(data);
      else setEvalWriting(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      if (type === "speaking") setIsEvaluatingSpeaking(false);
      else setIsEvaluatingWriting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <PracticeCard
          icon={<Headphones />}
          color="indigo"
          title="Listening"
          desc="Nghe & chép chính tả"
          loading={loading === "listening"}
          onClick={() => fetchContent("listening")}
        />
        <PracticeCard
          icon={<FileText />}
          color="emerald"
          title="Reading"
          desc="Đọc hiểu & từ vựng"
          loading={loading === "reading"}
          onClick={() => fetchContent("reading")}
        />
        <PracticeCard
          icon={<PenTool />}
          color="rose"
          title="Writing"
          desc="Viết essay & chấm điểm"
          loading={loading === "writing"}
          onClick={() => fetchContent("writing")}
        />
        <PracticeCard
          icon={<Mic />}
          color="amber"
          title="Speaking"
          desc="Ghi âm & đánh giá"
          loading={loading === "speaking"}
          onClick={() => fetchContent("speaking")}
        />
        <PracticeCard
          icon={<BookOpen />}
          color="purple"
          title="Từ vựng"
          desc={`Từ vựng ${level.split(" (")[0]}`}
          loading={loading === "vocabulary"}
          onClick={() => fetchContent("vocabulary")}
        />
      </div>

      <div className="space-y-6">
        {listening && (
          <div className="bg-white p-6 md:p-8 border border-slate-100 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
                <Headphones className="w-6 h-6 text-indigo-500" />
                Listening Practice: {listening.title}
              </h2>
              <div className="flex items-center gap-3">
                <select
                  value={listeningSpeed}
                  onChange={(e) => setListeningSpeed(Number(e.target.value))}
                  className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-3 py-2 rounded-xl focus:outline-none"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1.0}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                </select>
                <button
                  onClick={() =>
                    speakText(listening.transcript.map((t) => t.text).join(" "))
                  }
                  className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={stopSpeaking}
                  className="p-2 bg-rose-100 text-rose-600 rounded-full hover:bg-rose-200"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl mb-8 h-64 overflow-y-auto border border-slate-200">
              <div className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Languages className="w-4 h-4" /> Bấm vào từ bất kỳ để tra từ
                điển. Bấm vào icon loa để nghe lại câu.
              </div>
              <div className="space-y-4">
                {listening.transcript.map((t, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <button
                      onClick={() => speakText(t.text)}
                      className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="font-bold text-indigo-900 mr-2">
                        {t.speaker}:
                      </span>
                      <span className="text-slate-700 text-lg leading-relaxed">
                        <TapToTranslateText text={t.text} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <QuizSection questions={listening.questions} color="indigo" />
          </div>
        )}

        {reading && (
          <div className="space-y-6">
            {level === "Pre-IELTS (Band 3.0 - 4.0)" && (
              <MomBeginnerReadingRoadmap />
            )}
            <div className="bg-white p-6 md:p-8 border border-slate-100 rounded-3xl shadow-sm">
              <h2 className="text-xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-500" />
                Reading Practice: {reading.title}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-emerald-50/30 p-6 rounded-2xl h-[600px] overflow-y-auto border border-emerald-100 shadow-inner">
                  <div className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2 sticky top-0 bg-emerald-50/90 py-2 backdrop-blur-sm z-10">
                    <Languages className="w-4 h-4" /> Bấm vào từ bất kỳ để tra
                    từ điển
                  </div>
                  <div className="space-y-4">
                    {reading.paragraphs.map((p, idx) => (
                      <p
                        key={idx}
                        className="text-slate-800 text-lg leading-relaxed font-serif"
                      >
                        <TapToTranslateText text={p} />
                      </p>
                    ))}
                  </div>
                </div>

                <div className="h-[600px] overflow-y-auto pr-2">
                  <QuizSection questions={reading.questions} color="emerald" />
                </div>
              </div>
            </div>
          </div>
        )}

        {vocab.length > 0 && (
          <div className="bg-white p-6 md:p-8 border border-slate-100 rounded-3xl shadow-sm">
            <h2 className="text-xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" />
              Từ vựng hôm nay
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vocab.map((v, i) => {
                const isSaved = savedWords.some((sw) => sw.word === v.word);
                return (
                  <div
                    key={i}
                    className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 hover:bg-indigo-50 transition-colors relative group"
                  >
                    <button
                      onClick={() => {
                        if (!isSaved) {
                          setSavedWords((prev) => [
                            ...prev,
                            {
                              ...v,
                              id: Date.now().toString() + i,
                              nextReview: Date.now(),
                              interval: 0,
                              repetition: 0,
                              easeFactor: 2.5,
                            },
                          ]);
                        }
                      }}
                      disabled={isSaved}
                      className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${isSaved ? "text-emerald-500 bg-emerald-100 cursor-default" : "text-slate-400 bg-white hover:bg-indigo-100 hover:text-indigo-600 shadow-sm"}`}
                    >
                      {isSaved ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex flex-col gap-1 mb-3 pr-8">
                      <span className="text-xl font-black text-indigo-900">
                        {v.word}
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-500 px-2 py-0.5 bg-indigo-100 rounded-md w-fit">
                        {v.type}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-3">
                      {v.meaning_vi}
                    </p>
                    <p className="text-sm text-slate-600 italic">
                      "{v.example}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {speaking && (
          <div className="bg-white p-6 md:p-8 border border-slate-100 rounded-3xl shadow-sm">
            <h2 className="text-xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Mic className="w-6 h-6 text-emerald-500" />
              Speaking Practice
            </h2>
            <div className="bg-emerald-50/50 p-6 rounded-2xl mb-6">
              <h3 className="font-bold text-lg text-emerald-950 mb-4">
                {speaking.title}
              </h3>
              <ul className="space-y-3">
                {speaking.bulletPoints.map((bp, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-emerald-900 font-medium"
                  >
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 text-slate-700 p-5 rounded-2xl font-medium flex gap-3 items-start border border-slate-100">
              <div className="font-black text-emerald-600 shrink-0">
                💡 Gợi ý:
              </div>
              <div>{speaking.tip}</div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                Thực hành nói
              </h4>
              <div className="flex flex-col gap-4">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Bấm nút ghi âm để bắt đầu nói, hoặc bạn có thể gõ trực tiếp câu trả lời vào đây..."
                  className="w-full h-32 p-4 rounded-xl border-2 border-slate-200 focus:border-emerald-400 focus:outline-none resize-none font-medium text-slate-700"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={toggleRecording}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${isRecording ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-5 h-5" /> Dừng ghi âm
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" /> Bắt đầu ghi âm
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => evaluateContent("speaking")}
                    disabled={isEvaluatingSpeaking || !transcript.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 disabled:opacity-50 transition-all"
                  >
                    {isEvaluatingSpeaking ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Chấm điểm
                      </>
                    )}
                  </button>
                </div>

                {evalSpeaking && (
                  <EvaluationResult evaluation={evalSpeaking} color="emerald" />
                )}
              </div>
            </div>
          </div>
        )}

        {writing && (
          <div className="bg-white p-6 md:p-8 border border-slate-100 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
                <PenTool className="w-6 h-6 text-rose-500" />
                Writing Practice
              </h2>
              {writing.title.includes("Task 1") ? (
                <WritingTimer initialMinutes={20} />
              ) : (
                <WritingTimer initialMinutes={40} />
              )}
            </div>
            <div className="bg-rose-50/50 p-6 rounded-2xl mb-6">
              <span className="inline-block px-3 py-1 bg-white text-rose-700 text-xs font-black rounded-full shadow-sm mb-4">
                {writing.title}
              </span>
              <p className="text-lg text-rose-950 font-medium leading-relaxed">
                {writing.question}
              </p>
            </div>
            <div className="bg-slate-50 text-slate-700 p-5 rounded-2xl font-medium flex gap-3 items-start border border-slate-100">
              <div className="font-black text-rose-600 shrink-0">
                💡 Hướng dẫn:
              </div>
              <div>{writing.tip}</div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  Thực hành viết
                </h4>
                <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {essay.trim() === "" ? 0 : essay.trim().split(/\s+/).length}{" "}
                  từ
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <textarea
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  placeholder="Nhập bài essay của bạn vào đây... (Tính năng Copy/Paste đã bị khóa để mô phỏng thi thật)"
                  className="w-full h-64 p-4 rounded-xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none resize-none font-medium text-slate-700"
                />
                <button
                  onClick={() => evaluateContent("writing")}
                  disabled={isEvaluatingWriting || !essay.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 disabled:opacity-50 transition-all"
                >
                  {isEvaluatingWriting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Chấm điểm
                    </>
                  )}
                </button>

                {evalWriting && (
                  <EvaluationResult evaluation={evalWriting} color="rose" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeCard({
  icon,
  color,
  title,
  desc,
  loading,
  onClick,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  loading: boolean;
  onClick: () => void;
}) {
  const colors: Record<string, string> = {
    indigo:
      "text-indigo-600 bg-indigo-50 border-indigo-200 hover:border-indigo-400 group-hover:bg-indigo-100",
    emerald:
      "text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400 group-hover:bg-emerald-100",
    rose: "text-rose-600 bg-rose-50 border-rose-200 hover:border-rose-400 group-hover:bg-rose-100",
    amber:
      "text-amber-600 bg-amber-50 border-amber-200 hover:border-amber-400 group-hover:bg-amber-100",
    purple:
      "text-purple-600 bg-purple-50 border-purple-200 hover:border-purple-400 group-hover:bg-purple-100",
  };
  const theme = colors[color] || colors.indigo;

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex flex-col items-start p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 text-left group ${theme.split(" ")[2]}`}
    >
      <div
        className={`p-4 rounded-2xl mb-4 transition-colors ${theme.split(" ")[1]} ${theme.split(" ")[0]} ${theme.split(" ")[4]}`}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-7 h-7",
        })}
      </div>
      <h3 className="font-bold text-slate-900 mb-1 text-lg">{title}</h3>
      <p className="text-sm text-slate-500 font-medium">{desc}</p>
      {loading && (
        <Loader2
          className={`w-5 h-5 mt-4 animate-spin ${theme.split(" ")[0]}`}
        />
      )}
    </button>
  );
}

function TapToTranslateText({ text }: { text: string }) {
  const [translation, setTranslation] = useState<{
    word: string;
    vi: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async (word: string) => {
    const cleanWord = word.replace(/[.,!?()"']/g, "");
    if (!cleanWord) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ielts/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanWord }),
      });
      const data = await res.json();
      setTranslation({ word: cleanWord, vi: data.translation });

      setTimeout(() => setTranslation(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="relative inline-block">
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          onClick={() => handleTranslate(word)}
          className="cursor-pointer hover:bg-yellow-200 hover:text-yellow-900 transition-colors rounded px-0.5 relative"
        >
          {word}{" "}
          {translation?.word === word.replace(/[.,!?()"']/g, "") && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap z-10 animate-in fade-in slide-in-from-bottom-2">
              {loading && translation.vi === "" ? "..." : translation.vi}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

function QuizSection({
  questions,
  color = "indigo",
}: {
  questions: any[];
  color?: string;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx: number, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  let score = 0;
  if (submitted) {
    score = questions.filter((q, i) => {
      if (q.type === "fill_in_blank") {
        return q.answers.some(
          (a: string) =>
            answers[i]?.toLowerCase().trim() === a.toLowerCase().trim(),
        );
      }
      return answers[i] === q.answers[0];
    }).length;
  }

  const themeColors: Record<string, any> = {
    indigo: {
      btnBg: "bg-indigo-500",
      btnHover: "hover:bg-indigo-600",
      activeBg: "bg-indigo-50",
      activeBorder: "border-indigo-400",
      activeText: "text-indigo-800",
    },
    emerald: {
      btnBg: "bg-emerald-500",
      btnHover: "hover:bg-emerald-600",
      activeBg: "bg-emerald-50",
      activeBorder: "border-emerald-400",
      activeText: "text-emerald-800",
    },
  };
  const theme = themeColors[color] || themeColors.indigo;

  if (!questions || questions.length === 0) return null;

  return (
    <div className="border-t border-slate-100 pt-8 mt-4">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Target className="w-5 h-5" /> Bài tập trắc nghiệm
      </h3>
      <div className="space-y-8">
        {questions.map((q, qIdx) => (
          <div key={qIdx}>
            <p className="font-bold text-slate-800 mb-3">
              {qIdx + 1}. {q.question}
            </p>
            {q.type === "fill_in_blank" ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={answers[qIdx] || ""}
                  onChange={(e) => {
                    if (!submitted)
                      setAnswers((prev) => ({
                        ...prev,
                        [qIdx]: e.target.value,
                      }));
                  }}
                  disabled={submitted}
                  className={`w-full p-3 rounded-xl border-2 transition-all font-medium focus:outline-none ${submitted ? (q.answers.some((a: string) => answers[qIdx]?.toLowerCase().trim() === a.toLowerCase().trim()) ? "bg-emerald-50 border-emerald-400 text-emerald-800" : "bg-rose-50 border-rose-400 text-rose-800") : "border-slate-200 focus:border-indigo-400"}`}
                  placeholder="Nhập câu trả lời..."
                />
                {submitted &&
                  !q.answers.some(
                    (a: string) =>
                      answers[qIdx]?.toLowerCase().trim() ===
                      a.toLowerCase().trim(),
                  ) && (
                    <p className="text-sm text-emerald-600 font-bold mt-2">
                      Đáp án đúng: {q.answers.join(" hoặc ")}
                    </p>
                  )}
              </div>
            ) : (
              <div className="space-y-2">
                {q.options?.map((opt: string, oIdx: number) => {
                  const isSelected = answers[qIdx] === opt;
                  const isCorrect = submitted && opt === q.answers[0];
                  const isWrong = submitted && isSelected && !isCorrect;

                  let btnClass =
                    "w-full text-left p-3 rounded-xl border-2 transition-all font-medium ";
                  if (submitted) {
                    if (isCorrect)
                      btnClass +=
                        "bg-emerald-50 border-emerald-400 text-emerald-800";
                    else if (isWrong)
                      btnClass += "bg-rose-50 border-rose-400 text-rose-800";
                    else
                      btnClass +=
                        "bg-slate-50 border-slate-200 text-slate-500 opacity-50";
                  } else {
                    btnClass += isSelected
                      ? `${theme.activeBg} ${theme.activeBorder} ${theme.activeText} shadow-sm`
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, opt)}
                      className={btnClass}
                      disabled={submitted}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length !== questions.length}
          className={`mt-8 px-6 py-3 ${theme.btnBg} text-white font-bold rounded-xl ${theme.btnHover} disabled:opacity-50 w-full md:w-auto transition-colors`}
        >
          Nộp bài
        </button>
      ) : (
        <div
          className={`mt-8 p-4 bg-emerald-50 text-emerald-800 rounded-xl font-bold flex items-center gap-3 border border-emerald-200`}
        >
          <CheckCircle2 className="w-6 h-6" />
          Bạn trả lời đúng {score}/{questions.length} câu!
        </div>
      )}
    </div>
  );
}

function EvaluationResult({
  evaluation,
  color,
}: {
  evaluation: IeltsEvaluation;
  color: string;
}) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-200",
    rose: "text-rose-700 bg-rose-50 border-rose-200",
  };
  const theme = colors[color] || colors.emerald;

  return (
    <div
      className={`mt-6 p-6 rounded-2xl border-2 animate-in fade-in zoom-in-95 ${theme}`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 text-center sm:text-left">
        <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-sm border-4 border-current shrink-0">
          <span className="text-3xl font-black">{evaluation.score}</span>
          <span className="text-xs font-bold uppercase tracking-wider">
            Band
          </span>
        </div>
        <div>
          <h4 className="text-xl font-black mb-2">Kết quả đánh giá</h4>
          <p className="font-medium opacity-90 text-sm leading-relaxed mb-4">
            {evaluation.feedback}
          </p>
          {evaluation.criteria && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/50 p-2 rounded-lg text-xs font-bold flex justify-between items-center">
                <span className="opacity-70">Task Response</span>{" "}
                <span className="text-sm">
                  {evaluation.criteria.taskResponse}
                </span>
              </div>
              <div className="bg-white/50 p-2 rounded-lg text-xs font-bold flex justify-between items-center">
                <span className="opacity-70">Coherence</span>{" "}
                <span className="text-sm">{evaluation.criteria.coherence}</span>
              </div>
              <div className="bg-white/50 p-2 rounded-lg text-xs font-bold flex justify-between items-center">
                <span className="opacity-70">Lexical Resource</span>{" "}
                <span className="text-sm">{evaluation.criteria.lexical}</span>
              </div>
              <div className="bg-white/50 p-2 rounded-lg text-xs font-bold flex justify-between items-center">
                <span className="opacity-70">Grammar</span>{" "}
                <span className="text-sm">{evaluation.criteria.grammar}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white/60 p-5 rounded-xl border border-current/10">
        <h5 className="font-bold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" /> Điểm cần cải thiện:
        </h5>
        <ul className="space-y-3">
          {evaluation.improvements.map((imp, idx) => (
            <li
              key={idx}
              className="flex gap-2 text-sm font-medium items-start"
            >
              <span className="opacity-60 mt-0.5 shrink-0">•</span>
              <span>{imp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- GAME COMPONENT ---
function MomGame({ level }: { level: string }) {
  const [pairs, setPairs] = useState<IeltsMatchPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const startGame = async () => {
    setLoading(true);
    setPairs([]);
    setMatched([]);
    setScore(0);
    try {
      const res = await fetch("/api/ielts/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "match", level }),
      });
      const data = await res.json();
      setPairs(data.pairs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViClick = (vi: string) => {
    if (!selectedEn) return;
    const pair = pairs.find((p) => p.en === selectedEn && p.vi === vi);
    if (pair) {
      setMatched([...matched, selectedEn]);
      setScore((s) => s + 10);
    }
    setSelectedEn(null);
  };

  // Shuffle display arrays
  const enWords = pairs.map((p) => p.en);
  const viWords = [...pairs.map((p) => p.vi)].sort((a, b) =>
    a.localeCompare(b),
  ); // simple sort instead of strict shuffle for stable render

  const allMatched = pairs.length > 0 && matched.length === pairs.length;

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto mb-10">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
          Word Match: IELTS
        </h2>
        <p className="text-slate-500 font-medium mb-6">
          Nối từ vựng tiếng Anh với nghĩa tiếng Việt tương ứng. Tăng cường khả
          năng phản xạ!
        </p>

        {!pairs.length && (
          <button
            onClick={startGame}
            disabled={loading}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Bắt đầu chơi"
            )}
          </button>
        )}
      </div>

      {pairs.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="font-bold text-slate-700">
              Điểm: <span className="text-rose-600 text-xl">{score}</span>
            </div>
            <div className="font-bold text-slate-700">
              Trình độ:{" "}
              <span className="text-indigo-600">{level.split(" (")[0]}</span>
            </div>
          </div>

          {allMatched ? (
            <div className="text-center py-12 bg-emerald-50 rounded-3xl border-2 border-emerald-100 animate-in zoom-in">
              <Trophy className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-3xl font-black text-emerald-700 mb-2">
                Tuyệt vời!
              </h3>
              <p className="text-emerald-600 font-medium mb-6">
                Mẹ đã hoàn thành xuất sắc thử thách.
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors"
              >
                Chơi ván mới
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {/* English Column */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-sm mb-4">
                  Tiếng Anh
                </h4>
                {enWords.map((word) => {
                  const isMatched = matched.includes(word);
                  const isSelected = selectedEn === word;
                  return (
                    <button
                      key={word}
                      disabled={isMatched}
                      onClick={() => setSelectedEn(word)}
                      className={`w-full p-4 rounded-2xl font-bold text-left transition-all border-2
                        ${
                          isMatched
                            ? "bg-emerald-50 border-emerald-200 text-emerald-400 opacity-50"
                            : isSelected
                              ? "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-md scale-105"
                              : "bg-white border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-slate-50"
                        }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {/* Vietnamese Column */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-sm mb-4">
                  Tiếng Việt
                </h4>
                {viWords.map((word) => {
                  // check if this vi word is part of a matched pair
                  const matchingEn = pairs.find((p) => p.vi === word)?.en;
                  const isMatched = matchingEn
                    ? matched.includes(matchingEn)
                    : false;

                  return (
                    <button
                      key={word}
                      disabled={isMatched || !selectedEn}
                      onClick={() => handleViClick(word)}
                      className={`w-full p-4 rounded-2xl font-medium text-left transition-all border-2
                        ${
                          isMatched
                            ? "bg-emerald-50 border-emerald-200 text-emerald-400 opacity-50"
                            : !selectedEn
                              ? "bg-white border-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50 shadow-sm"
                        }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- FLASHCARDS COMPONENT ---
function Flashcards({
  words,
  setWords,
}: {
  words: SavedWord[];
  setWords: (words: SavedWord[] | ((prev: SavedWord[]) => SavedWord[])) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFront, setShowFront] = useState(true);

  const dueWords = words.filter((w) => w.nextReview <= Date.now());

  const handleReview = (quality: number) => {
    const currentWord = dueWords[currentIndex];
    let newRepetition = currentWord.repetition;
    let newInterval = currentWord.interval;
    let newEaseFactor = currentWord.easeFactor;

    if (quality >= 3) {
      if (newRepetition === 0) {
        newInterval = 1;
      } else if (newRepetition === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(newInterval * newEaseFactor);
      }
      newRepetition += 1;
    } else {
      newRepetition = 0;
      newInterval = 1;
    }

    newEaseFactor =
      newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    const nextReview = Date.now() + newInterval * 24 * 60 * 60 * 1000;

    setWords((prev) =>
      prev.map((w) =>
        w.id === currentWord.id
          ? {
              ...w,
              interval: newInterval,
              repetition: newRepetition,
              easeFactor: newEaseFactor,
              nextReview,
            }
          : w,
      ),
    );

    setShowFront(true);
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  if (words.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center animate-in fade-in">
        <Library className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">
          Kho từ vựng trống
        </h3>
        <p className="text-slate-500">
          Hãy chuyển sang tab Thực hành và thêm từ vựng mới vào kho nhé!
        </p>
      </div>
    );
  }

  if (dueWords.length === 0) {
    return (
      <div className="bg-emerald-50 p-12 rounded-3xl border border-emerald-100 text-center animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">
          Hoàn thành xuất sắc!
        </h3>
        <p className="text-emerald-700">
          Bạn đã ôn tập xong tất cả từ vựng cho hôm nay. Hãy quay lại vào ngày
          mai nhé.
        </p>
      </div>
    );
  }

  const word = dueWords[currentIndex];

  return (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-bold text-slate-800">
          Ôn tập từ vựng
        </h2>
        <span className="font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full text-sm">
          Còn lại: {dueWords.length}
        </span>
      </div>

      <div
        className="bg-white p-10 rounded-3xl shadow-sm border-2 border-slate-200 cursor-pointer min-h-[300px] flex flex-col items-center justify-center text-center relative group hover:border-amber-400 transition-colors"
        onClick={() => setShowFront(!showFront)}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-5 transition-opacity">
          <ArrowLeftRight className="w-24 h-24" />
        </div>
        {showFront ? (
          <>
            <h3 className="text-4xl font-black text-slate-800 mb-4">
              {word.word}
            </h3>
            <span className="text-sm font-mono font-bold text-amber-600 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg">
              {word.type}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakText(word.word);
              }}
              className="mt-6 p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95">
            <h3 className="text-3xl font-bold text-slate-800">
              {word.meaning_vi}
            </h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-lg text-slate-600 italic">"{word.example}"</p>
            </div>
          </div>
        )}
      </div>

      {!showFront && (
        <div className="grid grid-cols-4 gap-3 mt-6 animate-in slide-in-from-bottom-2">
          <button
            onClick={() => handleReview(0)}
            className="py-3 rounded-xl font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 transition-colors"
          >
            Quên (Lại)
          </button>
          <button
            onClick={() => handleReview(3)}
            className="py-3 rounded-xl font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 transition-colors"
          >
            Khó
          </button>
          <button
            onClick={() => handleReview(4)}
            className="py-3 rounded-xl font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors"
          >
            Tốt
          </button>
          <button
            onClick={() => handleReview(5)}
            className="py-3 rounded-xl font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
          >
            Dễ
          </button>
        </div>
      )}

      {showFront && (
        <p className="text-center text-slate-400 font-medium mt-6">
          Chạm vào thẻ để lật
        </p>
      )}
    </div>
  );
}

// --- ANALYTICS COMPONENT ---
function AnalyticsDashboard() {
  const timeData = [
    { day: "T2", time: 30 },
    { day: "T3", time: 45 },
    { day: "T4", time: 20 },
    { day: "T5", time: 60 },
    { day: "T6", time: 40 },
    { day: "T7", time: 90 },
    { day: "CN", time: 15 },
  ];

  const skillData = [
    { name: "Listening", score: 6.5, fill: "#6366f1" },
    { name: "Reading", score: 6.0, fill: "#10b981" },
    { name: "Writing", score: 5.5, fill: "#f43f5e" },
    { name: "Speaking", score: 5.0, fill: "#f59e0b" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase">
            Tổng thời gian
          </p>
          <p className="text-3xl font-black text-slate-800">5h 30m</p>
          <p className="text-sm font-bold text-emerald-500 mt-2">
            +12% so với tuần trước
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase">
            Band điểm dự kiến
          </p>
          <p className="text-3xl font-black text-slate-800">5.5 - 6.0</p>
          <p className="text-sm font-bold text-emerald-500 mt-2">
            Đang đi đúng lộ trình
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
            <Flame className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase">
            Chuỗi ngày học
          </p>
          <p className="text-3xl font-black text-slate-800">12 ngày</p>
          <p className="text-sm font-bold text-amber-500 mt-2">
            Cố gắng lên nhé!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" /> Thời gian học
            (Phút)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontWeight: "bold" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontWeight: "bold" }}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#6366f1"
                  strokeWidth={4}
                  dot={{ strokeWidth: 4, r: 4, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" /> Kỹ năng (Band Score)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skillData}
                layout="vertical"
                margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  type="number"
                  domain={[0, 9]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontWeight: "bold" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontWeight: "bold" }}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                  {skillData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Bảng xếp hạng tuần
        </h3>
        <div className="space-y-4">
          {[
            { rank: 1, name: "Mẹ Bơ", points: 2450, isMe: false },
            { rank: 2, name: "Bạn (Mẹ Sữa)", points: 1250, isMe: true },
            { rank: 3, name: "Mẹ Khoai", points: 1120, isMe: false },
          ].map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-4 rounded-2xl ${user.isMe ? "bg-amber-50 border border-amber-200" : "bg-slate-50 border border-slate-100"}`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`font-black text-xl w-6 text-center ${user.rank === 1 ? "text-amber-500" : user.rank === 2 ? "text-slate-400" : "text-orange-400"}`}
                >
                  #{user.rank}
                </span>
                <span
                  className={`font-bold ${user.isMe ? "text-amber-900" : "text-slate-700"}`}
                >
                  {user.name}
                </span>
              </div>
              <span className="font-bold text-amber-600 bg-amber-100/50 px-3 py-1 rounded-full text-sm">
                {user.points} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
