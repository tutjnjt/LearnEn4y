import React, { useState, useRef, useEffect } from "react";
import {
  Gamepad2,
  Loader2,
  Star,
  Link2,
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  ChevronDown,
  Map,
  ArrowLeft,
  Plus,
  Volume2,
  Puzzle,
  Clock,
  FileText,
  Sparkles,
  Play,
} from "lucide-react";
import { KidFlashcard } from "../types";
import { KidMemoryMatrix } from "./KidMemoryMatrix";
import { KidWordMatch } from "./KidWordMatch";
import { KidSkillGame } from "./KidSkillGame";
import { KidJourneyMap } from "./KidJourneyMap";
import { KidReportModal } from "./KidReportModal";
import BalloonMatch from "./games/BalloonMatch";
import SoundMemory from "./games/SoundMemory";
import MagicColoring from "./games/MagicColoring";
import { generateKidsData } from "../utils/kidsDataGenerator";
import { speak } from "../utils/audio";

export function KidDashboard({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [view, setView] = useState<"home" | "ipa_map" | "ipa_menu" | "books" | "volumes" | "map" | "menu">("home");
  const [ipaLevel, setIpaLevel] = useState("ipa_week_1_2");

  const ipaLevels = [
    { id: "ipa_week_1_2", name: "Nguyên âm ngắn & dài", emoji: "👄" },
    { id: "ipa_week_3_4", name: "Nguyên âm đôi", emoji: "🗣️" },
    { id: "ipa_week_5_6", name: "Phụ âm", emoji: "🦷" },
    { id: "ipa_week_7_8", name: "Ghép vần & Đọc từ", emoji: "📖" },
  ];

  const speakWord = (word: string) => {
    speak(word);
  };

  const [level, setLevel] = useState("Level 1");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [showReportForLevel, setShowReportForLevel] = useState<string | null>(null);
  const [customBooks, setCustomBooks] = useState<
    { id: string; name: string; color: string }[]
  >([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBookName, setNewBookName] = useState("");

  const defaultBooks = [
    {
      id: "family_friends",
      name: "Family and Friends",
      color: "bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-50",
    },
    {
      id: "global_success",
      name: "Global Success",
      color:
        "bg-emerald-100 text-emerald-600 border-emerald-300 hover:bg-emerald-50",
    },
    {
      id: "starters",
      name: "Starters",
      color: "bg-amber-100 text-amber-600 border-amber-300 hover:bg-amber-50",
    },
  ];

  const allBooks = [...defaultBooks, ...customBooks];

  const handleAddBook = () => {
    if (newBookName.trim()) {
      const colors = [
        "bg-purple-100 text-purple-600 border-purple-300 hover:bg-purple-50",
        "bg-rose-100 text-rose-600 border-rose-300 hover:bg-rose-50",
        "bg-cyan-100 text-cyan-600 border-cyan-300 hover:bg-cyan-50",
      ];
      const randomColor = colors[customBooks.length % colors.length];

      setCustomBooks([
        ...customBooks,
        {
          id: `custom_${Date.now()}`,
          name: newBookName.trim(),
          color: randomColor,
        },
      ]);
      setNewBookName("");
      setShowAddBook(false);
    }
  };

  const [completedLevels, setCompletedLevels] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('kid_completedLevels') || '{}'); } catch { return {}; }
  });
  const [gameStars, setGameStars] = useState<Record<string, Record<string, number>>>(() => {
    try { return JSON.parse(localStorage.getItem('kid_gameStars') || '{}'); } catch { return {}; }
  });
  const [avatar, setAvatar] = useState(() => localStorage.getItem('kid_avatar') || '🦊');
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);
  const avatars = ["👧", "👦", "🦊", "🐶", "🐱", "🐼", "🐯", "🐰", "🐻", "🐸"];
  const [flashcards, setFlashcards] = useState<KidFlashcard[]>([]);
  const [skillData, setSkillData] = useState<any>(null);
  const [gameMode, setGameMode] = useState<string | null>(null); // 'matrix', 'match', 'kids_listening', etc.
  const [error, setError] = useState<string | null>(null);
  const [stars, setStars] = useState(() => parseInt(localStorage.getItem('kid_stars') || '0', 10));
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem('kid_points') || '0', 10));
  const [playTime, setPlayTime] = useState(() => parseInt(localStorage.getItem('kid_playTime') || '0', 10));

  useEffect(() => { localStorage.setItem('kid_completedLevels', JSON.stringify(completedLevels)); }, [completedLevels]);
  useEffect(() => { localStorage.setItem('kid_gameStars', JSON.stringify(gameStars)); }, [gameStars]);
  useEffect(() => { localStorage.setItem('kid_avatar', avatar); }, [avatar]);
  useEffect(() => { localStorage.setItem('kid_stars', stars.toString()); }, [stars]);
  useEffect(() => { localStorage.setItem('kid_points', points.toString()); }, [points]);
  useEffect(() => { localStorage.setItem('kid_playTime', playTime.toString()); }, [playTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlayTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [winOverlay, setWinOverlay] = useState<{
    stars: number;
    points: number;
    message: string;
  } | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({ view, gameMode, winOverlay, showReportForLevel, ipaLevel });
  
  useEffect(() => {
    stateRef.current = { view, gameMode, winOverlay, showReportForLevel, ipaLevel };
  }, [view, gameMode, winOverlay, showReportForLevel, ipaLevel]);

  useEffect(() => {
    // Push an initial state when entering KidDashboard
    window.history.pushState({ isAppletLayer: true, depth: 0 }, "");

    const handlePopState = (e: PopStateEvent) => {
      const s = stateRef.current;
      if (s.winOverlay) {
        setWinOverlay(null);
        window.history.pushState({ isAppletLayer: true, depth: 1 }, "");
      } else if (s.showReportForLevel) {
        setShowReportForLevel(null);
        window.history.pushState({ isAppletLayer: true, depth: 1 }, "");
      } else if (s.gameMode) {
        setGameMode(null);
        window.history.pushState({ isAppletLayer: true, depth: 1 }, "");
      } else if (s.view === "menu") {
        setView("map");
        window.history.pushState({ isAppletLayer: true, depth: 1 }, "");
      } else if (s.view === "map") {
        setView("volumes");
        window.history.pushState({ isAppletLayer: true, depth: 1 }, "");
      } else if (s.view === "volumes") {
        setView("books");
        window.history.pushState({ isAppletLayer: true, depth: 1 }, "");
      } else if (s.view === "books" || s.view === "ipa_map") {
        setView("home");
        window.history.pushState({ isAppletLayer: true, depth: 1 }, "");
      } else if (s.view === "ipa_menu") {
        setView("ipa_map");
        window.history.pushState({ isAppletLayer: true, depth: 1 }, "");
      } else {
        onBack();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [onBack]);

  useEffect(() => {
    if (gameMode && gameAreaRef.current) {
      setTimeout(() => {
        gameAreaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [gameMode]);

  const ALL_GAMES =
    selectedBook === "starters" && selectedVolume === 2
      ? ["match", "kids_listening", "kids_speaking", "kids_reading"]
      : [
          "matrix",
          "match",
          "kids_listening",
          "kids_speaking",
          "kids_phonics",
          "kids_reading",
          "kids_writing",
        ];
  const isLevelComplete = ALL_GAMES.every(
    (g) => (gameStars[level]?.[g] || 0) > 0,
  );

  const handleNextLevel = () => {
    setCompletedLevels((prev) => ({
      ...prev,
      [level]: true,
    }));
    const currentIndex = levels.findIndex((l) => l.id === level);
    if (currentIndex < levels.length - 1) {
      setLevel(levels[currentIndex + 1].id);
    }
    setView("map");
  };

  const renderStars = (gameId: string) => {
    const s = gameStars[level]?.[gameId] || 0;
    if (s === 0) return null;
    return (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-white px-3 py-1 rounded-full border-2 border-yellow-300 shadow-sm z-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i <= s ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"}`}
          />
        ))}
      </div>
    );
  };

  const fetchGame = async (type: string, mode: string) => {
    setLoading(mode);
    setError(null);
    setFlashcards([]);
    setSkillData(null);
    setGameMode(null);
    try {
      let bookName = "IPA";
      let topic = "";
      let currentLevelId = level;
      
      if (view === "ipa_menu") {
        currentLevelId = ipaLevel;
        topic = ipaLevels.find((l) => l.id === ipaLevel)?.name || "";
      } else {
        bookName = allBooks.find((b) => b.id === selectedBook)?.name || selectedBook || "";
        const currentLevelObj = levels.find((l) => l.id === level);
        topic = (currentLevelObj as any)?.topic || currentLevelObj?.name || "";
      }

      const cacheKey = `kids_game_v6_${bookName}_${selectedVolume}_${currentLevelId}_${type}_${mode}`;
      const cachedData = localStorage.getItem(cacheKey);

      let data;
      if (cachedData) {
        data = JSON.parse(cachedData);
      } else {
        // Use offline generator directly instead of API for kids dashboard
        // to prevent lag, timeouts, or errors.
        data = generateKidsData(type, currentLevelId, bookName, selectedVolume || 1, topic);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (storageError) {
          console.warn("Could not save to localStorage.", storageError);
        }
      }

      if (
        type === "kids_vocabulary" ||
        type === "ipa_match" ||
        type === "ipa_opposites"
      ) {
        setFlashcards(data.flashcards || []);
      } else {
        setSkillData(data);
      }
      setGameMode(mode);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  const handleWin = (earnedStars: number = 5, earnedPoints: number = 50) => {
    setStars((prev) => prev + earnedStars);
    setPoints((prev) => prev + earnedPoints);
    if (gameMode) {
      const targetLevelId = view === "ipa_menu" ? ipaLevel : level;
      setGameStars((prev) => {
        const currentLevelStars = prev[targetLevelId] || {};
        const newStars = Math.max(
          currentLevelStars[gameMode] || 0,
          earnedStars,
        );
        return {
          ...prev,
          [targetLevelId]: { ...currentLevelStars, [gameMode]: newStars },
        };
      });
    }

    const messages = [
      "Tuyệt vời!",
      "Xuất sắc!",
      "Bé giỏi quá!",
      "Làm tốt lắm!",
      "Đỉnh quá đi!",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    setWinOverlay({
      stars: earnedStars,
      points: earnedPoints,
      message: randomMessage,
    });
  };

  const closeWinOverlay = () => {
    setWinOverlay(null);
    setGameMode(null);
    setFlashcards([]);
    setSkillData(null);
  };

  const FAF1_UNITS = [
    {
      id: "Unit 1",
      name: "Unit 1",
      topic: "What's this? (Đồ dùng học tập)",
      emoji: "🎒",
    },
    { id: "Unit 2", name: "Unit 2", topic: "Playtime! (Đồ chơi)", emoji: "🧸" },
    {
      id: "Unit 3",
      name: "Unit 3",
      topic: "This is my nose! (Bộ phận cơ thể)",
      emoji: "👃",
    },
    {
      id: "Unit 4",
      name: "Unit 4",
      topic: "He's a hero! (Nghề nghiệp)",
      emoji: "🦸‍♂️",
    },
    {
      id: "Unit 5",
      name: "Unit 5",
      topic: "Where's the ball? (Vị trí, Công viên)",
      emoji: "⚽",
    },
    {
      id: "Unit 6",
      name: "Unit 6",
      topic: "Billy's teddy! (Gia đình)",
      emoji: "👨‍👩‍👧‍👦",
    },
    {
      id: "Unit 7",
      name: "Unit 7",
      topic: "Are these his trousers? (Quần áo)",
      emoji: "👕",
    },
    {
      id: "Unit 8",
      name: "Unit 8",
      topic: "Where's Grandma? (Phòng trong nhà)",
      emoji: "🏠",
    },
    {
      id: "Unit 9",
      name: "Unit 9",
      topic: "Lunchtime! (Đồ ăn trưa)",
      emoji: "🍱",
    },
    {
      id: "Unit 10",
      name: "Unit 10",
      topic: "A new friend! (Miêu tả ngoại hình)",
      emoji: "👱‍♀️",
    },
    {
      id: "Unit 11",
      name: "Unit 11",
      topic: "I like monkeys! (Động vật)",
      emoji: "🐒",
    },
    {
      id: "Unit 12",
      name: "Unit 12",
      topic: "Dinnertime! (Bữa tối)",
      emoji: "🍽️",
    },
    {
      id: "Unit 13",
      name: "Unit 13",
      topic: "Tidy up! (Phòng ngủ)",
      emoji: "🛏️",
    },
    {
      id: "Unit 14",
      name: "Unit 14",
      topic: "Action boy can run! (Khả năng)",
      emoji: "🏃‍♂️",
    },
    {
      id: "Unit 15",
      name: "Unit 15",
      topic: "Let's play ball! (Hoạt động bãi biển)",
      emoji: "🏖️",
    },
  ];

  const FAF2_UNITS = [
    {
      id: "Unit 1",
      name: "Unit 1",
      topic: "Our new things (Đồ dùng học tập)",
      emoji: "📚",
    },
    {
      id: "Unit 2",
      name: "Unit 2",
      topic: "They're happy now! (Cảm xúc & Cơ thể)",
      emoji: "😊",
    },
    {
      id: "Unit 3",
      name: "Unit 3",
      topic: "I can ride a bike! (Khả năng & Đồ chơi)",
      emoji: "🚲",
    },
    {
      id: "Unit 4",
      name: "Unit 4",
      topic: "Have you got a milkshake? (Đồ ăn thức uống)",
      emoji: "🥤",
    },
    {
      id: "Unit 5",
      name: "Unit 5",
      topic: "We've got English (Môn học)",
      emoji: "🏫",
    },
    {
      id: "Unit 6",
      name: "Unit 6",
      topic: "Let's play after school! (Hoạt động hàng ngày)",
      emoji: "⚽",
    },
    {
      id: "Unit 7",
      name: "Unit 7",
      topic: "It isn't cold today! (Thời tiết & Quần áo)",
      emoji: "☀️",
    },
    {
      id: "Unit 8",
      name: "Unit 8",
      topic: "Let's buy presents! (Quà tặng & Tiệc sinh nhật)",
      emoji: "🎁",
    },
    {
      id: "Unit 9",
      name: "Unit 9",
      topic: "What's the time? (Thời gian & Sinh hoạt)",
      emoji: "⏰",
    },
    {
      id: "Unit 10",
      name: "Unit 10",
      topic: "May I take a photo? (Vui chơi giải trí)",
      emoji: "📸",
    },
    {
      id: "Unit 11",
      name: "Unit 11",
      topic: "In the playground (Sân chơi & Quy định)",
      emoji: "🛝",
    },
    {
      id: "Unit 12",
      name: "Unit 12",
      topic: "A clever baby! (Miêu tả con người, Quá khứ)",
      emoji: "👶",
    },
    {
      id: "Unit 13",
      name: "Unit 13",
      topic: "Look at all the animals! (Động vật trang trại)",
      emoji: "🐄",
    },
    {
      id: "Unit 14",
      name: "Unit 14",
      topic: "Look at the photos! (Gia đình trong quá khứ)",
      emoji: "📸",
    },
    {
      id: "Unit 15",
      name: "Unit 15",
      topic: "Well done! (Tổng kết)",
      emoji: "🏆",
    },
  ];

  const FAF3_UNITS = [
    {
      id: "Unit 1",
      name: "Unit 1",
      topic: "They're from Australia! (Quốc gia)",
      emoji: "🌍",
    },
    {
      id: "Unit 2",
      name: "Unit 2",
      topic: "My weekend (Hoạt động cuối tuần)",
      emoji: "📅",
    },
    {
      id: "Unit 3",
      name: "Unit 3",
      topic: "My things (Sở hữu đồ vật)",
      emoji: "🎮",
    },
    {
      id: "Unit 4",
      name: "Unit 4",
      topic: "We're having fun at the beach! (Bãi biển)",
      emoji: "🏖️",
    },
    {
      id: "Unit 5",
      name: "Unit 5",
      topic: "A naughty monkey! (Động vật sở thú)",
      emoji: "🐒",
    },
    {
      id: "Unit 6",
      name: "Unit 6",
      topic: "Jim's day (Hoạt động hàng ngày)",
      emoji: "🌅",
    },
    {
      id: "Unit 7",
      name: "Unit 7",
      topic: "Places to go! (Địa điểm trong thị trấn)",
      emoji: "🏙️",
    },
    {
      id: "Unit 8",
      name: "Unit 8",
      topic: "I'd like a melon! (Thức ăn & Đồ uống)",
      emoji: "🍉",
    },
    {
      id: "Unit 9",
      name: "Unit 9",
      topic: "What's the fastest animal? (So sánh động vật)",
      emoji: "🐆",
    },
    {
      id: "Unit 10",
      name: "Unit 10",
      topic: "In the park (Quy định trong công viên)",
      emoji: "🏞️",
    },
    {
      id: "Unit 11",
      name: "Unit 11",
      topic: "In the museum (Phương tiện giao thông quá khứ)",
      emoji: "🏛️",
    },
    {
      id: "Unit 12",
      name: "Unit 12",
      topic: "A clever baby! (Mô tả người trong quá khứ)",
      emoji: "👶",
    },
    {
      id: "Unit 13",
      name: "Unit 13",
      topic: "The Ancient Egyptians (Lịch sử)",
      emoji: "🏺",
    },
    {
      id: "Unit 14",
      name: "Unit 14",
      topic: "Did you have a good day? (Sự việc đã qua)",
      emoji: "✅",
    },
    {
      id: "Unit 15",
      name: "Unit 15",
      topic: "Our holiday (Dự định kỳ nghỉ tương lai)",
      emoji: "✈️",
    },
  ];

  const FAF4_UNITS = [
    {
      id: "Unit 1",
      name: "Unit 1",
      topic: "The food here is great! (Nhà hàng & Thức ăn)",
      emoji: "🍲",
    },
    {
      id: "Unit 2",
      name: "Unit 2",
      topic: "We had a concert (Buổi biểu diễn)",
      emoji: "🎸",
    },
    {
      id: "Unit 3",
      name: "Unit 3",
      topic: "The dinosaur museum (Bảo tàng khủng long)",
      emoji: "🦖",
    },
    {
      id: "Unit 4",
      name: "Unit 4",
      topic: "Whose jacket is this? (Sở hữu)",
      emoji: "🧥",
    },
    {
      id: "Unit 5",
      name: "Unit 5",
      topic: "Go back to the roundabout (Chỉ đường)",
      emoji: "🗺️",
    },
    {
      id: "Unit 6",
      name: "Unit 6",
      topic: "The best bed! (So sánh đồ vật)",
      emoji: "🛏️",
    },
    {
      id: "Unit 7",
      name: "Unit 7",
      topic: "Will it really happen? (Tương lai & Không gian)",
      emoji: "🚀",
    },
    {
      id: "Unit 8",
      name: "Unit 8",
      topic: "How much time have we got? (Sân bay & Hành lý)",
      emoji: "✈️",
    },
    {
      id: "Unit 9",
      name: "Unit 9",
      topic: "Something new to watch! (Truyền hình & Sở thích)",
      emoji: "📺",
    },
    {
      id: "Unit 10",
      name: "Unit 10",
      topic: "I've printed my document (Máy tính)",
      emoji: "💻",
    },
    {
      id: "Unit 11",
      name: "Unit 11",
      topic: "Have you ever been... (Trải nghiệm)",
      emoji: "🏔️",
    },
    {
      id: "Unit 12",
      name: "Unit 12",
      topic: "What's the matter? (Sức khỏe)",
      emoji: "🤒",
    },
    {
      id: "Unit 13",
      name: "Unit 13",
      topic: "Can you help me? (Giúp đỡ)",
      emoji: "🤝",
    },
    {
      id: "Unit 14",
      name: "Unit 14",
      topic: "We were fishing (Hành động quá khứ)",
      emoji: "🎣",
    },
    {
      id: "Unit 15",
      name: "Unit 15",
      topic: "Good news, bad news (Thiên nhiên & Tin tức)",
      emoji: "📰",
    },
  ];

  const FAF5_UNITS = [
    {
      id: "Unit 1",
      name: "Unit 1",
      topic: "Jim's day! (Các hoạt động thường ngày)",
      emoji: "🌅",
    },
    {
      id: "Unit 2",
      name: "Unit 2",
      topic: "Places to go! (Các địa điểm vui chơi)",
      emoji: "🎡",
    },
    {
      id: "Unit 3",
      name: "Unit 3",
      topic: "Could you give me a melon, please? (Thực phẩm)",
      emoji: "🍈",
    },
    {
      id: "Unit 4",
      name: "Unit 4",
      topic: "Getting around (Phương tiện giao thông)",
      emoji: "🚌",
    },
    {
      id: "Unit 5",
      name: "Unit 5",
      topic: "They had a long trip (Kỳ nghỉ)",
      emoji: "🧳",
    },
    {
      id: "Unit 6",
      name: "Unit 6",
      topic: "The Ancient Mayans (Lịch sử)",
      emoji: "🗿",
    },
    {
      id: "Unit 7",
      name: "Unit 7",
      topic: "The dinosaur museum (Khủng long)",
      emoji: "🦕",
    },
    {
      id: "Unit 8",
      name: "Unit 8",
      topic: "Mountains high, oceans deep (Địa lý thế giới)",
      emoji: "⛰️",
    },
    {
      id: "Unit 9",
      name: "Unit 9",
      topic: "In the park (Các hoạt động ngoài trời)",
      emoji: "🌳",
    },
    {
      id: "Unit 10",
      name: "Unit 10",
      topic: "What's the matter? (Triệu chứng bệnh tật)",
      emoji: "🤧",
    },
    {
      id: "Unit 11",
      name: "Unit 11",
      topic: "Will it really happen? (Dự đoán về tương lai)",
      emoji: "🔮",
    },
    {
      id: "Unit 12",
      name: "Unit 12",
      topic: "Something new to watch! (Chương trình truyền hình)",
      emoji: "🎬",
    },
  ];

  const GS1_UNITS = [
    { id: "Unit 1", name: "Unit 1", topic: "My friends (Bạn bè)", emoji: "👋" },
    {
      id: "Unit 2",
      name: "Unit 2",
      topic: "Time and daily routines (Thời gian và các hoạt động hàng ngày)",
      emoji: "⏰",
    },
    {
      id: "Unit 3",
      name: "Unit 3",
      topic: "My week (Lịch học trong tuần)",
      emoji: "📅",
    },
    {
      id: "Unit 4",
      name: "Unit 4",
      topic: "My birthday party (Tiệc sinh nhật)",
      emoji: "🎂",
    },
    {
      id: "Unit 5",
      name: "Unit 5",
      topic: "Things we can do (Những việc chúng ta có thể làm)",
      emoji: "🏃",
    },
    {
      id: "Unit 6",
      name: "Unit 6",
      topic: "Our school facilities (Cơ sở vật chất trường học)",
      emoji: "🏫",
    },
    {
      id: "Unit 7",
      name: "Unit 7",
      topic: "Our timetables (Thời khóa biểu của chúng tôi)",
      emoji: "📋",
    },
    {
      id: "Unit 8",
      name: "Unit 8",
      topic: "My favourite subjects (Môn học yêu thích)",
      emoji: "📚",
    },
    {
      id: "Unit 9",
      name: "Unit 9",
      topic: "Our sports day (Ngày hội thể thao của trường)",
      emoji: "🏅",
    },
    {
      id: "Unit 10",
      name: "Unit 10",
      topic: "Our summer holidays (Kỳ nghỉ hè)",
      emoji: "🏖️",
    },
  ];

  const GS2_UNITS = [
    {
      id: "Unit 11",
      name: "Unit 11",
      topic: "My home (Ngôi nhà của tôi)",
      emoji: "🏠",
    },
    {
      id: "Unit 12",
      name: "Unit 12",
      topic: "Jobs (Nghề nghiệp)",
      emoji: "👷",
    },
    {
      id: "Unit 13",
      name: "Unit 13",
      topic: "Appearance (Ngoại hình)",
      emoji: "👱‍♀️",
    },
    {
      id: "Unit 14",
      name: "Unit 14",
      topic: "Daily activities (Các hoạt động thường ngày)",
      emoji: "🌅",
    },
    {
      id: "Unit 15",
      name: "Unit 15",
      topic: "Let's go to the zoo! (Đi sở thú)",
      emoji: "🦁",
    },
    {
      id: "Unit 16",
      name: "Unit 16",
      topic: "Our clothes (Quần áo của chúng ta)",
      emoji: "👕",
    },
    {
      id: "Unit 17",
      name: "Unit 17",
      topic: "Our pets (Thú cưng)",
      emoji: "🐶",
    },
    {
      id: "Unit 18",
      name: "Unit 18",
      topic: "At the food and drink stall (Tại quầy đồ ăn thức uống)",
      emoji: "🍔",
    },
    {
      id: "Unit 19",
      name: "Unit 19",
      topic: "What animal is it? (Đó là con gì?)",
      emoji: "🐘",
    },
    {
      id: "Unit 20",
      name: "Unit 20",
      topic: "The explorer (Nhà thám hiểm)",
      emoji: "🧭",
    },
  ];

  const STARTERS1_UNITS = Array.from({ length: 15 }, (_, i) => {
    const topics = [
      "Hello & Family (Chào hỏi & Gia đình)",
      "My Body & Appearance (Cơ thể & Ngoại hình)",
      "Colours & Numbers (Màu sắc & Số đếm)",
      "My House & Rooms (Nhà & Các phòng)",
      "Pets & Animals (Thú cưng & Động vật)",
      "Food & Drink (Thức ăn & Đồ uống)",
      "My Clothes (Quần áo của tôi)",
      "School & Classroom (Trường & Lớp học)",
      "My Hobbies (Sở thích của tôi)",
      "Toys & Games (Đồ chơi & Trò chơi)",
      "At the park (Ở công viên)",
      "My town (Thị trấn của tôi)",
      "Weather & Seasons (Thời tiết & Mùa)",
      "Sports (Thể thao)",
      "Transport (Phương tiện giao thông)",
    ];
    return {
      id: `Unit ${i + 1}`,
      name: `Unit ${i + 1}`,
      topic: topics[i],
      emoji: [
        "👋",
        "👁️",
        "🎨",
        "🏠",
        "🐶",
        "🍔",
        "👕",
        "🏫",
        "🎨",
        "🧸",
        "🌳",
        "🏙️",
        "☀️",
        "⚽",
        "🚗",
      ][i],
    };
  });

  const STARTERS2_UNITS = Array.from({ length: 45 }, (_, i) => {
    const specificTopics: Record<number, { t: string; e: string }> = {
      1: { t: "Say Hello", e: "👋" },
      2: { t: "Numbers, numbers", e: "🔢" },
      3: { t: "What's your name?", e: "❓" },
      4: { t: "Red, blue and yellow animals", e: "🎨" },
      6: { t: "Animals and aliens", e: "👽" },
      7: { t: "Look, listen, smile and draw", e: "✏️" },
      9: { t: "Funny monster", e: "👾" },
      10: { t: "Our family", e: "👨‍👩‍👧‍👦" },
      16: { t: "What's your favourite fruit?", e: "🍎" },
      17: { t: "What's on the menu?", e: "📝" },
      18: { t: "A colourful house", e: "🏠" },
      19: { t: "What's in your bedroom", e: "🛏️" },
      25: { t: "School and the classroom", e: "🏫" },
    };
    const item = specificTopics[i + 1] || { t: `Fun topic ${i + 1}`, e: "✨" };
    return {
      id: `Unit ${i + 1}`,
      name: `Unit ${i + 1}`,
      topic: item.t,
      emoji: item.e,
    };
  });

  const defaultLevels = [
    { id: "Level 1", name: "Mầm non (4-6T)", emoji: "🐣" },
    { id: "Level 2", name: "Lớp 1-2 (6-8T)", emoji: "🚀" },
    { id: "Level 3", name: "Lớp 3-5 (8-10T)", emoji: "⭐" },
  ];

  let levels = defaultLevels;
  if (selectedBook && selectedVolume) {
    const generateUnits = (
      prefix: string,
      count: number,
      baseTopics: string[] = [],
    ) => {
      return Array.from({ length: count }, (_, i) => {
        const topic = baseTopics[i] || `${prefix} Topic ${i + 1}`;
        return {
          id: `Unit ${i + 1}`,
          name: `Unit ${i + 1}`,
          topic,
          emoji: ["📚", "🌟", "🎈", "🎨", "🚀", "🐶", "🍎", "🚗", "🧸", "⚽"][
            i % 10
          ],
        };
      });
    };

    if (selectedBook === "family_friends") {
      if (selectedVolume === 1) levels = FAF1_UNITS;
      else if (selectedVolume === 2) levels = FAF2_UNITS;
      else if (selectedVolume === 3) levels = FAF3_UNITS;
      else if (selectedVolume === 4) levels = FAF4_UNITS;
      else if (selectedVolume === 5) levels = FAF5_UNITS;
    } else if (selectedBook === "global_success") {
      if (selectedVolume === 1) levels = GS1_UNITS;
      else if (selectedVolume === 2) levels = GS2_UNITS;
      else if (selectedVolume === 3)
        levels = generateUnits("Global Success 3", 20, [
          "Hello",
          "Our names",
          "Our friends",
          "Our bodies",
          "My hobbies",
          "Our school",
          "Classroom instructions",
          "My school things",
          "Colours",
          "Break time activities",
          "My family",
          "Jobs",
          "My house",
          "My bedroom",
          "At the dining table",
          "My pets",
          "Our toys",
          "Playing outside",
          "Outdoor activities",
          "At the summer camp",
        ]);
      else if (selectedVolume === 4)
        levels = generateUnits("Global Success 4", 20, [
          "My friends",
          "Time and daily routines",
          "My week",
          "My birthday party",
          "Things we can do",
          "Our school facilities",
          "Our timetables",
          "My favourite subjects",
          "Our sports day",
          "Our summer holidays",
          "My home",
          "Jobs",
          "Appearance",
          "Daily activities",
          "My family's weekends",
          "Weather",
          "In the city",
          "At the shopping centre",
          "The animal world",
          "Our summer camp",
        ]);
      else if (selectedVolume === 5)
        levels = generateUnits("Global Success 5", 20, [
          "All about me",
          "Our new friends",
          "Our town",
          "Our free time activities",
          "Our summer holidays",
          "At school",
          "Our favourite subjects",
          "Our school events",
          "Our outdoor activities",
          "Our school trips",
          "Family time",
          "Jobs",
          "At the restaurant",
          "Shopping",
          "Special days",
          "Weather and seasons",
          "In the countryside",
          "At the beach",
          "Animals in the wild",
          "Protecting the environment",
        ]);
      else levels = generateUnits("Global Success", 20);
    } else if (selectedBook === "starters") {
      if (selectedVolume === 1) levels = STARTERS1_UNITS;
      else if (selectedVolume === 2) levels = STARTERS2_UNITS;
    } else {
      levels = Array.from({ length: 15 }, (_, i) => ({
        id: `Stage ${i + 1}`,
        name: `Chặng ${i + 1}`,
        topic: `Bài học số ${i + 1}`,
        emoji: [
          "🐣",
          "🚀",
          "⭐",
          "🎈",
          "🦊",
          "🐯",
          "🐼",
          "🦁",
          "🐰",
          "🐶",
          "🐱",
          "🐻",
          "🦄",
          "🌈",
          "🏆",
        ][i % 15],
      }));
    }
  }

  // Calculate unlocked level index (unlock next level if current is not completed)
  const currentLevelIndex = levels.findIndex(
    (l) => !completedLevels[l.id]
  );
  const activeLevelIndex =
    currentLevelIndex === -1 ? levels.length - 1 : currentLevelIndex;

  // Compute actual stars per level (out of 5 max)
  const computedLevelStars: Record<string, number> = {};
  levels.forEach(l => {
    const starsObj = gameStars[l.id] || {};
    let totalEarned = 0;
    for (const key in starsObj) {
      totalEarned += starsObj[key];
    }
    const maxPossible = ALL_GAMES.length * 5;
    computedLevelStars[l.id] = maxPossible > 0 ? Math.round((totalEarned / maxPossible) * 5) : 0;
  });

  const computedIpaLevelStars: Record<string, number> = {};
  ipaLevels.forEach(l => {
    const starsObj = gameStars[l.id] || {};
    let totalEarned = 0;
    const ipaGames = ["ipa_symbol_reading", "ipa_visual", "ipa_quiz_1", "ipa_quiz_2", "matrix", "balloon_match"];
    for (const key of ipaGames) {
      totalEarned += starsObj[key] || 0;
    }
    const maxPossible = ipaGames.length * 5;
    computedIpaLevelStars[l.id] = maxPossible > 0 ? Math.round((totalEarned / maxPossible) * 5) : 0;
  });

  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 animate-in fade-in zoom-in duration-500 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl shadow-sm border-4 border-yellow-200 relative z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowAvatarSelect(!showAvatarSelect)}
              className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-3xl hover:bg-yellow-200 hover:scale-105 transition-all border-2 border-yellow-300"
            >
              {avatar}
            </button>
            {showAvatarSelect && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border-4 border-yellow-200 rounded-2xl shadow-xl p-3 grid grid-cols-5 gap-2 z-50">
                {avatars.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setAvatar(a);
                      setShowAvatarSelect(false);
                    }}
                    className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-yellow-50 rounded-xl transition-colors"
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-orange-500">
              Khu vui chơi tiếng Anh!
            </h1>
            {selectedBook &&
              selectedVolume &&
              (view === "menu" || view === "map") && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-sm font-bold text-slate-500">
                    {allBooks.find((b) => b.id === selectedBook)?.name ||
                      selectedBook}{" "}
                    - Tập {selectedVolume}
                  </span>
                  {view === "menu" && (
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-bold bg-orange-50 px-3 py-1 rounded-full border-2 border-orange-200">
                        Đang luyện: {levels.find((l) => l.id === level)?.emoji}{" "}
                        {levels.find((l) => l.id === level)?.name}
                      </span>
                      <button
                        onClick={() => setView("map")}
                        className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors"
                      >
                        <Map className="w-4 h-4" /> Bản đồ
                      </button>
                    </div>
                  )}
                  {view === "map" && (
                    <p className="text-orange-400 font-bold">
                      Khám phá hành trình học tập!
                    </p>
                  )}
                </div>
              )}
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-emerald-100 px-4 py-2 rounded-full font-bold text-emerald-600 border-2 border-emerald-200 shadow-sm" title="Tiến độ hoàn thành">
              <span className="text-xl">🏆 {levels.length > 0 ? Math.round((levels.filter(l => completedLevels[l.id]).length / levels.length) * 100) : 0}%</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-100 px-4 py-2 rounded-full font-bold text-blue-600 border-2 border-blue-200 shadow-sm" title="Thời gian học">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-xl">{formatTime(playTime)}</span>
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 px-4 py-2 rounded-full font-bold text-yellow-600 border-2 border-yellow-200 shadow-sm">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-xl">{stars}</span>
            </div>
            <div className="flex items-center gap-1 bg-orange-100 px-4 py-2 rounded-full font-bold text-orange-600 border-2 border-orange-200 shadow-sm">
              <span className="text-xl">🎯 {points}</span>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-5 py-2.5 text-sm font-black text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-full transition-colors border-2 border-orange-200 shadow-sm whitespace-nowrap"
          >
            Về trang chủ
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6 font-bold text-center border-2 border-red-200">
          Oops! Có lỗi xảy ra: {error}
        </div>
      )}

      {/* Home View */}
      {view === "home" && !gameMode && (
        <div className="bg-white rounded-3xl border-4 border-slate-100 shadow-sm p-8 mt-12 relative animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-black text-center text-slate-800 mb-2">
            Hôm nay bé muốn học gì nào?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <button
              onClick={() => setView("ipa_map")}
              className="flex flex-col items-center justify-center p-8 bg-purple-50 border-4 border-purple-200 rounded-3xl shadow-sm hover:border-purple-400 hover:-translate-y-2 transition-all group"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform shadow-sm border-4 border-purple-100">
                🗣️
              </div>
              <h3 className="text-2xl font-black text-purple-700 mb-2">Học Phát Âm IPA</h3>
              <p className="text-purple-600 font-medium text-center">
                Luyện phát âm chuẩn xác với 44 âm cơ bản!
              </p>
            </button>
            <button
              onClick={() => setView("books")}
              className="flex flex-col items-center justify-center p-8 bg-blue-50 border-4 border-blue-200 rounded-3xl shadow-sm hover:border-blue-400 hover:-translate-y-2 transition-all group"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform shadow-sm border-4 border-blue-100">
                📚
              </div>
              <h3 className="text-2xl font-black text-blue-700 mb-2">Học Theo Sách</h3>
              <p className="text-blue-600 font-medium text-center">
                Ôn tập từ vựng theo chương trình trên lớp!
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Books View */}
      {view === "books" && !gameMode && (
        <div className="bg-white rounded-3xl border-4 border-slate-100 shadow-sm p-8 mt-12 relative animate-in fade-in slide-in-from-bottom-4">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => setView("home")}
              className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors bg-slate-50 px-3 py-2 rounded-xl border-2 border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" /> Quay Lại
            </button>
          </div>
          <h2 className="text-3xl font-black text-center text-slate-800 mb-2 mt-4">
            Chọn Bộ Sách Của Bé
          </h2>
          <p className="text-center font-bold text-slate-500 mb-8">
            Bé đang học bộ sách nào nhỉ? Hãy chọn để bắt đầu khám phá nha!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {allBooks.map((book) => (
              <button
                key={book.id}
                onClick={() => {
                  setSelectedBook(book.id);
                  setView("volumes");
                }}
                className={`p-6 rounded-3xl border-4 transition-all shadow-sm hover:shadow-md flex flex-col items-center justify-center text-center gap-4 group ${book.color}`}
              >
                <div className="bg-white/50 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black">{book.name}</h3>
              </button>
            ))}

            <button
              onClick={() => setShowAddBook(true)}
              className="p-6 rounded-3xl border-4 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-all flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="bg-white p-4 rounded-full shadow-sm">
                <Plus className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold">Thêm Bộ Sách Khác</h3>
            </button>
          </div>

          {showAddBook && (
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 animate-in zoom-in-95">
              <h4 className="text-lg font-bold text-slate-800 mb-4">
                Tên bộ sách mới:
              </h4>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newBookName}
                  onChange={(e) => setNewBookName(e.target.value)}
                  placeholder="Nhập tên bộ sách..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-blue-400 font-bold"
                  autoFocus
                />
                <button
                  onClick={handleAddBook}
                  disabled={!newBookName.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddBook(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Volumes View */}
      {view === "volumes" && !gameMode && (
        <div className="bg-white rounded-3xl border-4 border-slate-100 shadow-sm p-8 mt-12 relative animate-in fade-in slide-in-from-bottom-4">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => setView("books")}
              className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors bg-slate-50 px-3 py-2 rounded-xl border-2 border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
          </div>
          <h2 className="text-3xl font-black text-center text-slate-800 mb-2 mt-4 sm:mt-0">
            Chọn Tập Sách
          </h2>
          <p className="text-center font-bold text-slate-500 mb-8">
            Bé đang học tới tập mấy rồi nhỉ?
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(selectedBook === "starters" ? [1, 2] : [1, 2, 3, 4, 5]).map(
              (vol) => (
                <button
                  key={vol}
                  onClick={() => {
                    setSelectedVolume(vol);
                    if (
                      selectedBook === "family_friends" ||
                      selectedBook === "global_success" ||
                      selectedBook === "starters"
                    ) {
                      setLevel(
                        selectedBook === "global_success" && vol === 2
                          ? "Unit 11"
                          : "Unit 1",
                      );
                    } else {
                      setLevel("Stage 1");
                    }
                    setView("map");
                  }}
                  className={`p-6 rounded-3xl border-4 transition-all shadow-sm hover:shadow-md flex flex-col items-center justify-center text-center gap-3 ${
                    selectedVolume === vol
                      ? "bg-orange-100 text-orange-600 border-orange-400"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  <div className="text-4xl font-black">{vol}</div>
                  <div className="font-bold">
                    {selectedBook === "starters"
                      ? vol === 1
                        ? "Get ready"
                        : "Fun for Starters"
                      : `Tập ${vol}`}
                  </div>
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* IPA Map View */}
      {view === "ipa_map" && !gameMode && (
        <div className="bg-white rounded-3xl border-4 border-slate-100 shadow-sm p-8 mt-12 relative">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => setView("home")}
              className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-purple-500 transition-colors bg-slate-50 px-3 py-2 rounded-xl border-2 border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" /> Về Trang Chủ
            </button>
          </div>
          <h2 className="text-3xl font-black text-center text-slate-800 mb-2 mt-4 sm:mt-0">
            Hành Trình Chinh Phục IPA
          </h2>
          <p className="text-center font-bold text-slate-500 mb-12">
            Cùng học 44 âm cơ bản để nói tiếng Anh thật chuẩn nhé!
          </p>

          <KidJourneyMap
            levels={ipaLevels}
            currentLevelIndex={ipaLevels.length - 1}
            levelStars={computedIpaLevelStars}
            avatar={avatar}
            onSelectLevel={(id) => {
              setIpaLevel(id);
              setView("ipa_menu");
            }}
          />
        </div>
      )}

      {/* Map View */}
      {view === "map" && !gameMode && (
        <div className="bg-white rounded-3xl border-4 border-slate-100 shadow-sm p-8 mt-12 relative">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => setView("books")}
              className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors bg-slate-50 px-3 py-2 rounded-xl border-2 border-slate-200"
            >
              <BookOpen className="w-4 h-4" /> Chọn Sách Khác
            </button>
          </div>
          <h2 className="text-3xl font-black text-center text-slate-800 mb-2 mt-4 sm:mt-0">
            Hành Trình Của Bé
          </h2>
          <p className="text-center font-bold text-slate-500 mb-12">
            Hoàn thành các trò chơi để mở khóa chặng tiếp theo nhé!
          </p>

          <KidJourneyMap
            levels={levels}
            currentLevelIndex={activeLevelIndex}
            levelStars={computedLevelStars}
            avatar={avatar}
            onSelectLevel={(id) => {
              setLevel(id);
              setView("menu");
            }}
          />
        </div>
      )}

      {/* IPA Menu View */}
      {view === "ipa_menu" && !gameMode && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setView("ipa_map")}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-500 transition-colors bg-white px-4 py-3 rounded-2xl border-4 border-slate-100 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" /> Trở Lại Lộ Trình
            </button>
            <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-xl font-bold border-2 border-purple-200">
              {ipaLevels.find((l) => l.id === ipaLevel)?.emoji}{" "}
              {ipaLevels.find((l) => l.id === ipaLevel)?.name}
            </div>
          </div>

          {/* Theory Section */}
          {ipaLevel === "ipa_week_1_2" && (
            <div className="bg-blue-50 border-4 border-blue-200 rounded-3xl p-8 mb-8 shadow-sm">
              <h3 className="text-2xl font-black text-blue-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-8 h-8" /> Lý Thuyết: Nguyên Âm Đơn (Monophthongs)
              </h3>
              <p className="text-blue-900 font-medium mb-6 text-lg">Là các nguyên âm không thay đổi độ cao và vị trí trong khi phát âm. Hãy nghe và quan sát khẩu hình miệng:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-blue-600">/i:/ (i dài)</span>
                    <button onClick={() => speakWord("sheep")} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Môi bè ra hai bên như đang mỉm cười, miệng mở hẹp.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> sheep /ʃi:p/, see /si:/</p>
                </div>
                
                <div className="bg-white rounded-2xl p-4 border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-blue-600">/ɪ/ (i ngắn)</span>
                    <button onClick={() => speakWord("sit")} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Giống /i:/ nhưng mở miệng rộng hơn một chút, âm phát ra ngắn.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> sit /sɪt/, it /ɪt/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-blue-600">/ʊ/ (u ngắn)</span>
                    <button onClick={() => speakWord("book")} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Môi hơi tròn và mở hẹp, lưỡi đưa về phía sau.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> book /bʊk/, put /pʊt/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-blue-600">/u:/ (u dài)</span>
                    <button onClick={() => speakWord("food")} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Môi chu tròn ra phía trước, lưỡi nâng cao ở phía sau.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> food /fu:d/, school /sku:l/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-blue-600">/e/ (e ngắn)</span>
                    <button onClick={() => speakWord("bed")} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Mở miệng vừa phải, lưỡi đặt thấp hơn âm /ɪ/.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> bed /bed/, ten /ten/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-blue-600">/æ/ (e bẹt)</span>
                    <button onClick={() => speakWord("cat")} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Miệng mở rộng hết cỡ (nửa a nửa e), lưỡi đặt thấp.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> cat /kæt/, bad /bæd/</p>
                </div>
              </div>
            </div>
          )}

          {ipaLevel === "ipa_week_3_4" && (
            <div className="bg-purple-50 border-4 border-purple-200 rounded-3xl p-8 mb-8 shadow-sm">
              <h3 className="text-2xl font-black text-purple-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-8 h-8" /> Lý Thuyết: Nguyên Âm Đôi (Diphthongs)
              </h3>
              <p className="text-purple-900 font-medium mb-6 text-lg">Là kết hợp của 2 nguyên âm đơn. Môi và lưỡi sẽ di chuyển mượt mà từ âm thứ nhất sang âm thứ hai.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border-2 border-purple-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-purple-600">/eɪ/</span>
                    <button onClick={() => speakWord("face")} className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Cách đọc:</strong> Bắt đầu bằng âm /e/, sau đó trượt nhanh môi sang âm /ɪ/.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> face /feɪs/, train /treɪn/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-purple-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-purple-600">/aɪ/</span>
                    <button onClick={() => speakWord("bike")} className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Cách đọc:</strong> Mở rộng miệng phát âm /a/, trượt nhanh sang /ɪ/.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> bike /baɪk/, time /taɪm/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-purple-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-purple-600">/ɔɪ/</span>
                    <button onClick={() => speakWord("boy")} className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Cách đọc:</strong> Bắt đầu bằng môi tròn /ɔ/, kéo dài và mỉm cười nhẹ sang /ɪ/.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> boy /bɔɪ/, coin /kɔɪn/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-purple-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-purple-600">/aʊ/</span>
                    <button onClick={() => speakWord("house")} className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Cách đọc:</strong> Bắt đầu bằng âm /a/ mở rộng miệng, sau đó chu tròn môi sang /ʊ/.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> house /haʊs/, cow /kaʊ/</p>
                </div>
              </div>
            </div>
          )}

          {ipaLevel === "ipa_week_5_6" && (
            <div className="bg-emerald-50 border-4 border-emerald-200 rounded-3xl p-8 mb-8 shadow-sm">
              <h3 className="text-2xl font-black text-emerald-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-8 h-8" /> Lý Thuyết: Phụ Âm (Consonants)
              </h3>
              <p className="text-emerald-900 font-medium mb-6 text-lg">Âm thanh phát ra bị cản trở bởi môi, răng, lưỡi. Hãy chú ý những âm đặc trưng:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border-2 border-emerald-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-emerald-600">/θ/ (Vô thanh)</span>
                    <button onClick={() => speakWord("three")} className="p-2 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Đặt lưỡi giữa hai hàm răng, thổi luồng hơi ra, cổ họng không rung.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> three /θri:/, thumb /θʌm/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-emerald-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-emerald-600">/ð/ (Hữu thanh)</span>
                    <button onClick={() => speakWord("that")} className="p-2 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Đặt lưỡi giữa hai hàm răng, phát âm và rung mạnh ở cổ họng.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> that /ðæt/, this /ðɪs/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-emerald-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-emerald-600">/ʃ/ (Vô thanh)</span>
                    <button onClick={() => speakWord("shoe")} className="p-2 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Môi chu tròn ra phía trước, thổi hơi mạnh (như đang suỵt).</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> shoe /ʃu:/, fish /fɪʃ/</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-emerald-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-black text-emerald-600">/tʃ/ (Vô thanh)</span>
                    <button onClick={() => speakWord("chair")} className="p-2 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200"><Volume2 className="w-5 h-5"/></button>
                  </div>
                  <p className="text-slate-600 text-sm mb-1"><strong>Khẩu hình:</strong> Môi chu ra, bật hơi mạnh giống chữ 'ch' trong tiếng Việt nhưng bật hơi.</p>
                  <p className="text-slate-500 text-sm"><strong>Ví dụ:</strong> chair /tʃeə/, watch /wɒtʃ/</p>
                </div>
              </div>
            </div>
          )}

          {ipaLevel === "ipa_week_7_8" && (
            <div className="bg-orange-50 border-4 border-orange-200 rounded-3xl p-8 mb-8 shadow-sm">
              <h3 className="text-2xl font-black text-orange-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-8 h-8" /> Lý Thuyết: Ghép Vần & Đọc Từ
              </h3>
              <p className="text-orange-900 font-medium mb-6 text-lg">
                Khi đã nắm vững các âm, bé có thể nhìn phiên âm để tự ghép vần và đọc mọi từ tiếng Anh.
              </p>
              <div className="bg-white rounded-2xl p-6 border-2 border-orange-100 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
                    <Volume2 className="w-6 h-6"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-800 text-xl flex items-center gap-2">
                      Cách đánh vần IPA <button onClick={() => speakWord("apple")} className="text-sm bg-orange-100 px-3 py-1 rounded-full hover:bg-orange-200">Nghe "apple"</button>
                    </h4>
                    <p className="text-slate-600 mt-2">
                      Ví dụ từ <strong>apple</strong> có phiên âm là <strong>/ˈæpl/</strong>.
                      Đọc âm /æ/ mạnh hơn (vì có dấu ' nhấn trọng âm), sau đó đọc nối âm /p/ và /l/ lại với nhau.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-3xl font-black text-purple-600 mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8" />
              Luyện Tập Phát Âm
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => fetchGame("ipa_symbol_reading", "ipa_symbol_reading")}
                disabled={loading !== null}
                className="relative flex flex-col items-center justify-center p-6 bg-orange-50 border-4 border-orange-200 rounded-3xl shadow-sm hover:border-orange-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
              >
                {renderStars("ipa_symbol_reading")}
                <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-orange-100 text-orange-500">
                  <Mic className="w-8 h-8" />
                </div>
                <h3 className="font-black text-orange-800 text-center">Đọc Ký Hiệu IPA</h3>
                {loading === "ipa_symbol_reading" && <Loader2 className="w-5 h-5 text-orange-500 mt-2 animate-spin" />}
              </button>

              <button
                onClick={() => fetchGame("ipa_visual", "ipa_visual")}
                disabled={loading !== null}
                className="relative flex flex-col items-center justify-center p-6 bg-pink-50 border-4 border-pink-200 rounded-3xl shadow-sm hover:border-pink-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
              >
                {renderStars("ipa_visual")}
                <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-pink-100 text-pink-500">
                  <Play className="w-8 h-8" />
                </div>
                <h3 className="font-black text-pink-800 text-center">Khẩu Hình & Âm Thanh</h3>
                {loading === "ipa_visual" && <Loader2 className="w-5 h-5 text-pink-500 mt-2 animate-spin" />}
              </button>

              <button
                onClick={() => fetchGame("ipa_match", "matrix")}
                disabled={loading !== null}
                className="relative flex flex-col items-center justify-center p-6 bg-blue-50 border-4 border-blue-200 rounded-3xl shadow-sm hover:border-blue-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
              >
                {renderStars("matrix")}
                <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-blue-100 text-blue-500">
                  <Puzzle className="w-8 h-8" />
                </div>
                <h3 className="font-black text-blue-800 text-center">Ghép Âm Nối Chữ</h3>
                {loading === "matrix" && <Loader2 className="w-5 h-5 text-blue-500 mt-2 animate-spin" />}
              </button>
            </div>

            <h2 className="text-3xl font-black text-purple-600 mb-6 flex items-center justify-center gap-2 mt-12">
              <FileText className="w-8 h-8" />
              Bài Tập Thực Hành
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <button
                onClick={() => fetchGame("ipa_opposites", "balloon_match")}
                disabled={loading !== null}
                className="relative flex flex-col items-center justify-center p-6 bg-amber-50 border-4 border-amber-200 rounded-3xl shadow-sm hover:border-amber-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
              >
                {renderStars("balloon_match")}
                <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-amber-100 text-amber-500">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="font-black text-amber-800 text-center">Ghép Từ và IPA</h3>
                {loading === "balloon_match" && <Loader2 className="w-5 h-5 text-amber-500 mt-2 animate-spin" />}
              </button>

              <button
                onClick={() => fetchGame("ipa_quiz_1", "ipa_quiz_1")}
                disabled={loading !== null}
                className="relative flex flex-col items-center justify-center p-6 bg-purple-50 border-4 border-purple-200 rounded-3xl shadow-sm hover:border-purple-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
              >
                {renderStars("ipa_quiz_1")}
                <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-purple-100 text-purple-500">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-black text-purple-800 text-center">Trắc Nghiệm IPA</h3>
                {loading === "ipa_quiz_1" && <Loader2 className="w-5 h-5 text-purple-500 mt-2 animate-spin" />}
              </button>

              <button
                onClick={() => fetchGame("ipa_quiz_2", "ipa_quiz_2")}
                disabled={loading !== null}
                className="relative flex flex-col items-center justify-center p-6 bg-rose-50 border-4 border-rose-200 rounded-3xl shadow-sm hover:border-rose-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
              >
                {renderStars("ipa_quiz_2")}
                <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-rose-100 text-rose-500">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-black text-rose-800 text-center">Thử Thách Viết IPA</h3>
                {loading === "ipa_quiz_2" && <Loader2 className="w-5 h-5 text-rose-500 mt-2 animate-spin" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Menu (Games for selected level) */}
      {view === "menu" && !gameMode && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          {selectedBook === "starters" && selectedVolume === 2 ? (
            <div>
              <h2 className="text-3xl font-black text-amber-500 mb-6 flex items-center justify-center gap-2">
                <Star className="w-10 h-10 fill-amber-400 text-amber-400" />
                Cambridge YLE Starters
              </h2>
              <p className="text-center font-bold text-slate-500 mb-8 text-lg">
                Thử sức với các dạng bài thi Cambridge Starters nhé!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                  onClick={() => fetchGame("kids_listening", "kids_listening")}
                  disabled={loading !== null}
                  className="relative flex flex-col items-center justify-center p-8 bg-indigo-50 border-4 border-indigo-200 rounded-3xl shadow-sm hover:border-indigo-400 hover:-translate-y-2 transition-all group disabled:opacity-50"
                >
                  {renderStars("kids_listening")}
                  <div className="p-5 bg-white rounded-2xl mb-4 group-hover:scale-110 transition-transform border-4 border-indigo-100 text-indigo-500 shadow-sm group-hover:rotate-6">
                    <Headphones className="w-10 h-10" />
                  </div>
                  <h3 className="font-black text-xl text-indigo-800 mb-2">
                    Listening
                  </h3>
                  <p className="text-sm font-bold text-indigo-600/80 text-center">
                    Nghe và Chọn màu
                  </p>
                  {loading === "kids_listening" && (
                    <Loader2 className="w-6 h-6 text-indigo-500 mt-4 animate-spin" />
                  )}
                </button>
                <button
                  onClick={() => fetchGame("kids_reading", "kids_reading")}
                  disabled={loading !== null}
                  className="relative flex flex-col items-center justify-center p-8 bg-amber-50 border-4 border-amber-200 rounded-3xl shadow-sm hover:border-amber-400 hover:-translate-y-2 transition-all group disabled:opacity-50"
                >
                  {renderStars("kids_reading")}
                  <div className="p-5 bg-white rounded-2xl mb-4 group-hover:scale-110 transition-transform border-4 border-amber-100 text-amber-500 shadow-sm group-hover:-rotate-6">
                    <BookOpen className="w-10 h-10" />
                  </div>
                  <h3 className="font-black text-xl text-amber-800 mb-2">
                    Reading
                  </h3>
                  <p className="text-sm font-bold text-amber-600/80 text-center">
                    Đọc hiểu Đúng/Sai
                  </p>
                  {loading === "kids_reading" && (
                    <Loader2 className="w-6 h-6 text-amber-500 mt-4 animate-spin" />
                  )}
                </button>
                <button
                  onClick={() => fetchGame("kids_speaking", "kids_speaking")}
                  disabled={loading !== null}
                  className="relative flex flex-col items-center justify-center p-8 bg-emerald-50 border-4 border-emerald-200 rounded-3xl shadow-sm hover:border-emerald-400 hover:-translate-y-2 transition-all group disabled:opacity-50"
                >
                  {renderStars("kids_speaking")}
                  <div className="p-5 bg-white rounded-2xl mb-4 group-hover:scale-110 transition-transform border-4 border-emerald-100 text-emerald-500 shadow-sm group-hover:rotate-6">
                    <Mic className="w-10 h-10" />
                  </div>
                  <h3 className="font-black text-xl text-emerald-800 mb-2">
                    Speaking
                  </h3>
                  <p className="text-sm font-bold text-emerald-600/80 text-center">
                    Mô tả tranh tương tác
                  </p>
                  {loading === "kids_speaking" && (
                    <Loader2 className="w-6 h-6 text-emerald-500 mt-4 animate-spin" />
                  )}
                </button>
                <button
                  onClick={() => fetchGame("kids_vocabulary", "match")}
                  disabled={loading !== null}
                  className="relative flex flex-col items-center justify-center p-8 bg-rose-50 border-4 border-rose-200 rounded-3xl shadow-sm hover:border-rose-400 hover:-translate-y-2 transition-all group disabled:opacity-50"
                >
                  {renderStars("match")}
                  <div className="p-5 bg-white rounded-2xl mb-4 group-hover:scale-110 transition-transform border-4 border-rose-100 text-rose-500 shadow-sm group-hover:-rotate-6">
                    <Puzzle className="w-10 h-10" />
                  </div>
                  <h3 className="font-black text-xl text-rose-800 mb-2">
                    Vocabulary
                  </h3>
                  <p className="text-sm font-bold text-rose-600/80 text-center">
                    Ghép từ và hình
                  </p>
                  {loading === "match" && (
                    <Loader2 className="w-6 h-6 text-rose-500 mt-4 animate-spin" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Vocabulary Games */}
              <div>
                <h2 className="text-2xl font-black text-blue-500 mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-8 h-8" />
                  Trò Chơi Từ Vựng
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <button
                    onClick={() => fetchGame("kids_vocabulary", "matrix")}
                    disabled={loading !== null}
                    className="relative flex items-center gap-6 p-6 bg-white border-4 border-blue-200 rounded-3xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all group disabled:opacity-50"
                  >
                    {renderStars("matrix")}
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-6 border-2 border-blue-200">
                      <Gamepad2 className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-black text-slate-800 mb-1">
                        Ma Trận Trí Nhớ
                      </h3>
                      <p className="font-bold text-slate-500 text-sm">
                        Tìm và ghép hình với từ tiếng Anh tương ứng.
                      </p>
                    </div>
                    {loading === "matrix" && (
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    )}
                  </button>

                  <button
                    onClick={() => fetchGame("kids_vocabulary", "match")}
                    disabled={loading !== null}
                    className="relative flex items-center gap-6 p-6 bg-white border-4 border-purple-200 rounded-3xl shadow-sm hover:border-purple-400 hover:shadow-md transition-all group disabled:opacity-50"
                  >
                    {renderStars("match")}
                    <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:-rotate-6 border-2 border-purple-200">
                      <Link2 className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-black text-slate-800 mb-1">
                        Nối Từ Siêu Tốc
                      </h3>
                      <p className="font-bold text-slate-500 text-sm">
                        Nối từ tiếng Anh với nghĩa tiếng Việt cho đúng.
                      </p>
                    </div>
                    {loading === "match" && (
                      <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                    )}
                  </button>
                </div>
              </div>

              {/* Creative Games */}
              <div>
                <h2 className="text-2xl font-black text-rose-500 mb-4 flex items-center gap-2">
                  <Star className="w-8 h-8" />
                  Trò Chơi Sáng Tạo
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button
                    onClick={() =>
                      fetchGame("kids_vocabulary", "balloon_match")
                    }
                    disabled={loading !== null}
                    className="relative flex items-center gap-6 p-6 bg-white border-4 border-pink-200 rounded-3xl shadow-sm hover:border-pink-400 hover:shadow-md transition-all group disabled:opacity-50"
                  >
                    {renderStars("balloon_match")}
                    <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:-rotate-6 border-2 border-pink-200">
                      <div className="w-8 h-8 border-4 border-pink-400 rounded-full" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-black text-slate-800 mb-1">
                        Ghép Bóng Đôi
                      </h3>
                      <p className="font-bold text-slate-500 text-sm">
                        Ghép bóng chữ cái thành các cặp đôi.
                      </p>
                    </div>
                    {loading === "balloon_match" && (
                      <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
                    )}
                  </button>

                  <button
                    onClick={() => fetchGame("kids_vocabulary", "sound_memory")}
                    disabled={loading !== null}
                    className="relative flex items-center gap-6 p-6 bg-white border-4 border-amber-200 rounded-3xl shadow-sm hover:border-amber-400 hover:shadow-md transition-all group disabled:opacity-50"
                  >
                    {renderStars("sound_memory")}
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-6 border-2 border-amber-200">
                      <Volume2 className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-black text-slate-800 mb-1">
                        Thẻ Nhớ Âm Thanh
                      </h3>
                      <p className="font-bold text-slate-500 text-sm">
                        Lắng nghe và tìm cặp thẻ chữ.
                      </p>
                    </div>
                    {loading === "sound_memory" && (
                      <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      fetchGame("kids_vocabulary", "magic_coloring")
                    }
                    disabled={loading !== null}
                    className="relative flex items-center gap-6 p-6 bg-white border-4 border-emerald-200 rounded-3xl shadow-sm hover:border-emerald-400 hover:shadow-md transition-all group disabled:opacity-50"
                  >
                    {renderStars("magic_coloring")}
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:-rotate-6 border-2 border-emerald-200">
                      <PenTool className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-black text-slate-800 mb-1">
                        Tô Màu Biến Hình
                      </h3>
                      <p className="font-bold text-slate-500 text-sm">
                        Tìm chữ đúng để hô biến màu sắc.
                      </p>
                    </div>
                    {loading === "magic_coloring" && (
                      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                    )}
                  </button>
                </div>
              </div>

              {/* 4 Skills Training */}
              <div>
                <h2 className="text-2xl font-black text-emerald-500 mb-4 flex items-center gap-2">
                  <Star className="w-8 h-8" />
                  Phát Triển Kỹ Năng
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() =>
                      fetchGame("kids_listening", "kids_listening")
                    }
                    disabled={loading !== null}
                    className="relative flex flex-col items-center justify-center p-6 bg-indigo-50 border-4 border-indigo-200 rounded-3xl shadow-sm hover:border-indigo-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
                  >
                    {renderStars("kids_listening")}
                    <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-indigo-100 text-indigo-500">
                      <Headphones className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-indigo-800">Luyện Nghe</h3>
                    {loading === "kids_listening" && (
                      <Loader2 className="w-5 h-5 text-indigo-500 mt-2 animate-spin" />
                    )}
                  </button>

                  <button
                    onClick={() => fetchGame("kids_phonics", "kids_phonics")}
                    disabled={loading !== null}
                    className="relative flex flex-col items-center justify-center p-6 bg-pink-50 border-4 border-pink-200 rounded-3xl shadow-sm hover:border-pink-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
                  >
                    {renderStars("kids_phonics")}
                    <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-pink-100 text-pink-500">
                      <Volume2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-pink-800">Phát Âm</h3>
                    {loading === "kids_phonics" && (
                      <Loader2 className="w-5 h-5 text-pink-500 mt-2 animate-spin" />
                    )}
                  </button>

                  <button
                    onClick={() => fetchGame("kids_speaking", "kids_speaking")}
                    disabled={loading !== null}
                    className="relative flex flex-col items-center justify-center p-6 bg-emerald-50 border-4 border-emerald-200 rounded-3xl shadow-sm hover:border-emerald-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
                  >
                    {renderStars("kids_speaking")}
                    <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-emerald-100 text-emerald-500">
                      <Mic className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-emerald-800">Luyện Nói</h3>
                    {loading === "kids_speaking" && (
                      <Loader2 className="w-5 h-5 text-emerald-500 mt-2 animate-spin" />
                    )}
                  </button>

                  <button
                    onClick={() => fetchGame("kids_reading", "kids_reading")}
                    disabled={loading !== null}
                    className="relative flex flex-col items-center justify-center p-6 bg-amber-50 border-4 border-amber-200 rounded-3xl shadow-sm hover:border-amber-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
                  >
                    {renderStars("kids_reading")}
                    <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-amber-100 text-amber-500">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-amber-800">Luyện Đọc</h3>
                    {loading === "kids_reading" && (
                      <Loader2 className="w-5 h-5 text-amber-500 mt-2 animate-spin" />
                    )}
                  </button>

                  <button
                    onClick={() => fetchGame("kids_writing", "kids_writing")}
                    disabled={loading !== null}
                    className="relative flex flex-col items-center justify-center p-6 bg-rose-50 border-4 border-rose-200 rounded-3xl shadow-sm hover:border-rose-400 hover:-translate-y-1 transition-all group disabled:opacity-50"
                  >
                    {renderStars("kids_writing")}
                    <div className="p-4 bg-white rounded-2xl mb-3 group-hover:scale-110 transition-transform border-2 border-rose-100 text-rose-500">
                      <PenTool className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-rose-800">Luyện Viết</h3>
                    {loading === "kids_writing" && (
                      <Loader2 className="w-5 h-5 text-rose-500 mt-2 animate-spin" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Next Level Button */}
          <div className="flex justify-center gap-4 mt-8 animate-in fade-in zoom-in flex-wrap">
            {isLevelComplete && !completedLevels[level] && (
              <button
                onClick={handleNextLevel}
                className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-full font-black text-xl hover:bg-orange-600 hover:scale-105 transition-all shadow-lg border-4 border-orange-300"
              >
                Tiếp tục cuộc hành trình{" "}
                <ChevronDown className="w-6 h-6 -rotate-90" />
              </button>
            )}
            {completedLevels[level] && (
              <button
                onClick={() => setShowReportForLevel(level)}
                className="flex items-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-full font-black text-xl hover:bg-blue-600 hover:scale-105 transition-all shadow-lg border-4 border-blue-300"
              >
                <FileText className="w-6 h-6" /> Xem Báo Cáo Chặng Này
              </button>
            )}
            {/* TEMPORARY TEST BUTTON */}
            <button
              onClick={handleNextLevel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-600 rounded-full font-bold text-sm hover:bg-slate-300 transition-all border-2 border-slate-300"
            >
              [Test] Chuyển Unit
            </button>
          </div>
        </div>
      )}

      {/* Game Views */}
      <div className="space-y-8" ref={gameAreaRef}>
        {gameMode === "matrix" && flashcards.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-blue-600 drop-shadow-sm">
                🧠 Ma Trận Trí Nhớ 🧠
              </h2>
              <button
                onClick={() => setGameMode(null)}
                className="px-5 py-2 font-bold text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 border-2 border-slate-200"
              >
                Bỏ cuộc
              </button>
            </div>
            <KidMemoryMatrix cards={flashcards} onWin={handleWin} />
          </div>
        )}

        {gameMode === "match" && flashcards.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-purple-600 drop-shadow-sm">
                🧩 Trò chơi Nối từ 🧩
              </h2>
              <button
                onClick={() => setGameMode(null)}
                className="px-5 py-2 font-bold text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 border-2 border-slate-200"
              >
                Bỏ cuộc
              </button>
            </div>
            <KidWordMatch
              cards={flashcards}
              onWin={handleWin}
              volume={selectedVolume || 1}
              level={level}
            />
          </div>
        )}

        {gameMode === "balloon_match" && flashcards.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-pink-600 drop-shadow-sm">
                🫧 Ghép Bóng Đôi 🫧
              </h2>
              <button
                onClick={() => setGameMode(null)}
                className="px-5 py-2 font-bold text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 border-2 border-slate-200"
              >
                Bỏ cuộc
              </button>
            </div>
            <BalloonMatch cards={flashcards} onWin={handleWin} />
          </div>
        )}

        {gameMode === "sound_memory" && flashcards.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-amber-600 drop-shadow-sm">
                🎵 Thẻ Nhớ Âm Thanh 🎵
              </h2>
              <button
                onClick={() => setGameMode(null)}
                className="px-5 py-2 font-bold text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 border-2 border-slate-200"
              >
                Bỏ cuộc
              </button>
            </div>
            <SoundMemory cards={flashcards} onWin={handleWin} />
          </div>
        )}

        {gameMode === "magic_coloring" && flashcards.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-emerald-600 drop-shadow-sm">
                🎨 Tô Màu Biến Hình 🎨
              </h2>
              <button
                onClick={() => setGameMode(null)}
                className="px-5 py-2 font-bold text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 border-2 border-slate-200"
              >
                Bỏ cuộc
              </button>
            </div>
            <MagicColoring cards={flashcards} onWin={handleWin} />
          </div>
        )}

        {[
          "kids_listening",
          "kids_speaking",
          "kids_phonics",
          "kids_reading",
          "kids_writing",
          "ipa_symbol_reading",
          "ipa_visual",
          "ipa_speaking",
          "ipa_quiz_1",
          "ipa_quiz_2",
        ].includes(gameMode || "") &&
          skillData && (
            <div className="animate-in fade-in slide-in-from-bottom-8">
              <div className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-black text-slate-800 drop-shadow-sm flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  Thử thách Kỹ Năng
                </h2>
                <button
                  onClick={() => setGameMode(null)}
                  className="px-5 py-2 font-bold text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 border-2 border-slate-200"
                >
                  Quay lại
                </button>
              </div>
              <KidSkillGame
                data={skillData}
                type={gameMode!}
                onComplete={handleWin}
              />
            </div>
          )}
      </div>

      {winOverlay && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-8 border-yellow-300 text-center animate-in zoom-in spin-in-3">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-4xl font-black text-amber-500 mb-2 drop-shadow-sm">
              {winOverlay.message}
            </h2>
            <div className="flex justify-center items-center gap-4 my-6">
              <div className="bg-yellow-100 px-6 py-4 rounded-2xl flex items-center gap-2 border-2 border-yellow-200">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-pulse" />
                <span className="text-2xl font-black text-yellow-700">
                  +{winOverlay.stars}
                </span>
              </div>
            </div>
            <p className="text-lg font-bold text-slate-500 mb-8">
              Bé được cộng thêm {winOverlay.points} điểm!
            </p>
            <button
              onClick={closeWinOverlay}
              className="w-full py-4 bg-emerald-400 hover:bg-emerald-500 text-white text-xl font-black rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-b-4 border-emerald-600 active:translate-y-0 active:border-b-0"
            >
              Tiếp Tục Chơi!
            </button>
          </div>
        </div>
      )}
      {showReportForLevel && selectedBook && selectedVolume && (
        <KidReportModal
          book={allBooks.find((b) => b.id === selectedBook)?.name || selectedBook}
          volume={selectedVolume}
          topic={levels.find((l) => l.id === showReportForLevel)?.name || ""}
          level={levels.find((l) => l.id === showReportForLevel) || { id: "Level 1", name: "Level 1", emoji: "⭐" }}
          stars={computedLevelStars[showReportForLevel] || 5}
          onClose={() => setShowReportForLevel(null)}
        />
      )}
    </div>
  );
}
