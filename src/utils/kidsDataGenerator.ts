export const KIDS_CATEGORIES: Record<
  string,
  { word: string; vi: string; emoji: string }[]
> = {
  animals: [
    { word: "Cat", vi: "Con mèo", emoji: "🐱" },
    { word: "Dog", vi: "Con chó", emoji: "🐶" },
    { word: "Bird", vi: "Con chim", emoji: "🐦" },
    { word: "Fish", vi: "Con cá", emoji: "🐟" },
    { word: "Tiger", vi: "Con hổ", emoji: "🐯" },
    { word: "Lion", vi: "Con sư tử", emoji: "🦁" },
    { word: "Elephant", vi: "Con voi", emoji: "🐘" },
    { word: "Monkey", vi: "Con khỉ", emoji: "🐵" },
    { word: "Bear", vi: "Con gấu", emoji: "🐻" },
    { word: "Rabbit", vi: "Con thỏ", emoji: "🐰" },
    { word: "Pig", vi: "Con lợn", emoji: "🐷" },
    { word: "Cow", vi: "Con bò", emoji: "🐮" },
    { word: "Horse", vi: "Con ngựa", emoji: "🐴" },
    { word: "Sheep", vi: "Con cừu", emoji: "🐑" },
    { word: "Chicken", vi: "Con gà", emoji: "🐔" },
    { word: "Duck", vi: "Con vịt", emoji: "🦆" },
    { word: "Frog", vi: "Con ếch", emoji: "🐸" },
    { word: "Snake", vi: "Con rắn", emoji: "🐍" },
    { word: "Turtle", vi: "Con rùa", emoji: "🐢" },
    { word: "Dolphin", vi: "Cá heo", emoji: "🐬" },
    { word: "Whale", vi: "Cá voi", emoji: "🐳" },
    { word: "Shark", vi: "Cá mập", emoji: "🦈" },
  ],
  food: [
    { word: "Apple", vi: "Quả táo", emoji: "🍎" },
    { word: "Banana", vi: "Quả chuối", emoji: "🍌" },
    { word: "Water", vi: "Nước", emoji: "💧" },
    { word: "Milk", vi: "Sữa", emoji: "🥛" },
    { word: "Bread", vi: "Bánh mì", emoji: "🍞" },
    { word: "Egg", vi: "Quả trứng", emoji: "🥚" },
    { word: "Orange", vi: "Quả cam", emoji: "🍊" },
    { word: "Lemon", vi: "Quả chanh", emoji: "🍋" },
    { word: "Strawberry", vi: "Quả dâu tây", emoji: "🍓" },
    { word: "Grapes", vi: "Quả nho", emoji: "🍇" },
    { word: "Watermelon", vi: "Dưa hấu", emoji: "🍉" },
    { word: "Pineapple", vi: "Quả dứa", emoji: "🍍" },
    { word: "Mango", vi: "Quả xoài", emoji: "🥭" },
    { word: "Peach", vi: "Quả đào", emoji: "🍑" },
    { word: "Cherry", vi: "Quả anh đào", emoji: "🍒" },
    { word: "Pizza", vi: "Bánh pizza", emoji: "🍕" },
    { word: "Hamburger", vi: "Bánh kẹp thịt", emoji: "🍔" },
    { word: "Fries", vi: "Khoai tây chiên", emoji: "🍟" },
    { word: "Ice cream", vi: "Kem", emoji: "🍦" },
    { word: "Cake", vi: "Bánh ngọt", emoji: "🍰" },
  ],
  colors: [
    { word: "Red", vi: "Màu đỏ", emoji: "🔴" },
    { word: "Blue", vi: "Màu xanh dương", emoji: "🔵" },
    { word: "Green", vi: "Màu xanh lá", emoji: "🟢" },
    { word: "Yellow", vi: "Màu vàng", emoji: "🟡" },
    { word: "Orange", vi: "Màu cam", emoji: "🟠" },
    { word: "Purple", vi: "Màu tím", emoji: "🟣" },
    { word: "Black", vi: "Màu đen", emoji: "⚫" },
    { word: "White", vi: "Màu trắng", emoji: "⚪" },
    { word: "Brown", vi: "Màu nâu", emoji: "🟤" },
    { word: "Pink", vi: "Màu hồng", emoji: "🌸" },
  ],
  nature: [
    { word: "Sun", vi: "Mặt trời", emoji: "☀️" },
    { word: "Moon", vi: "Mặt trăng", emoji: "🌙" },
    { word: "Star", vi: "Ngôi sao", emoji: "⭐" },
    { word: "Tree", vi: "Cái cây", emoji: "🌳" },
    { word: "Flower", vi: "Bông hoa", emoji: "🌸" },
    { word: "Rain", vi: "Mưa", emoji: "🌧️" },
    { word: "Snow", vi: "Tuyết", emoji: "❄️" },
    { word: "Wind", vi: "Gió", emoji: "💨" },
    { word: "Fire", vi: "Lửa", emoji: "🔥" },
    { word: "Earth", vi: "Trái đất", emoji: "🌍" },
    { word: "Grass", vi: "Bãi cỏ", emoji: "🌿" },
    { word: "Leaf", vi: "Chiếc lá", emoji: "🍂" },
    { word: "Mountain", vi: "Ngọn núi", emoji: "⛰️" },
    { word: "River", vi: "Dòng sông", emoji: "🏞️" },
    { word: "Ocean", vi: "Đại dương", emoji: "🌊" },
    { word: "Beach", vi: "Bãi biển", emoji: "🏖️" },
    { word: "Sand", vi: "Cát", emoji: "🏜️" },
    { word: "Rock", vi: "Hòn đá", emoji: "🪨" },
    { word: "Cloud", vi: "Đám mây", emoji: "☁️" },
    { word: "Sky", vi: "Bầu trời", emoji: "🌌" },
  ],
  school: [
    { word: "Book", vi: "Quyển sách", emoji: "📖" },
    { word: "Pencil", vi: "Bút chì", emoji: "✏️" },
    { word: "Pen", vi: "Cái bút", emoji: "🖊️" },
    { word: "Eraser", vi: "Cục tẩy", emoji: "🧽" },
    { word: "Ruler", vi: "Cái thước", emoji: "📏" },
    { word: "School", vi: "Trường học", emoji: "🏫" },
    { word: "Teacher", vi: "Giáo viên", emoji: "👩‍🏫" },
    { word: "Student", vi: "Học sinh", emoji: "👨‍🎓" },
    { word: "Desk", vi: "Bàn học", emoji: "🪑" },
    { word: "Bag", vi: "Cặp sách", emoji: "🎒" },
  ],
  home: [
    { word: "House", vi: "Ngôi nhà", emoji: "🏠" },
    { word: "Door", vi: "Cửa ra vào", emoji: "🚪" },
    { word: "Window", vi: "Cửa sổ", emoji: "🪟" },
    { word: "Bed", vi: "Cái giường", emoji: "🛏️" },
    { word: "Chair", vi: "Cái ghế", emoji: "🪑" },
    { word: "Table", vi: "Cái bàn", emoji: "🪵" },
    { word: "Clock", vi: "Đồng hồ", emoji: "⏰" },
    { word: "Television", vi: "Tivi", emoji: "📺" },
    { word: "Sofa", vi: "Ghế sô pha", emoji: "🛋️" },
    { word: "Kitchen", vi: "Nhà bếp", emoji: "🍳" },
  ],
  clothes: [
    { word: "Hat", vi: "Cái mũ", emoji: "🧢" },
    { word: "Shoes", vi: "Đôi giày", emoji: "👟" },
    { word: "Shirt", vi: "Áo sơ mi", emoji: "👕" },
    { word: "Pants", vi: "Quần dài", emoji: "👖" },
    { word: "Dress", vi: "Váy", emoji: "👗" },
    { word: "Skirt", vi: "Chân váy", emoji: "🥻" },
    { word: "Socks", vi: "Tất", emoji: "🧦" },
    { word: "Jacket", vi: "Áo khoác", emoji: "🧥" },
    { word: "Glasses", vi: "Kính", emoji: "👓" },
    { word: "Watch", vi: "Đồng hồ đeo tay", emoji: "⌚" },
  ],
  transport: [
    { word: "Car", vi: "Ô tô", emoji: "🚗" },
    { word: "Train", vi: "Tàu hỏa", emoji: "🚂" },
    { word: "Plane", vi: "Máy bay", emoji: "✈️" },
    { word: "Boat", vi: "Con thuyền", emoji: "⛵" },
    { word: "Bus", vi: "Xe buýt", emoji: "🚌" },
    { word: "Bike", vi: "Xe đạp", emoji: "🚲" },
    { word: "Motorcycle", vi: "Xe máy", emoji: "🏍️" },
    { word: "Helicopter", vi: "Trực thăng", emoji: "🚁" },
    { word: "Ship", vi: "Tàu thủy", emoji: "🚢" },
    { word: "Truck", vi: "Xe tải", emoji: "🚛" },
  ],
  body: [
    { word: "Eye", vi: "Con mắt", emoji: "👁️" },
    { word: "Ear", vi: "Cái tai", emoji: "👂" },
    { word: "Nose", vi: "Cái mũi", emoji: "👃" },
    { word: "Mouth", vi: "Cái miệng", emoji: "👄" },
    { word: "Hand", vi: "Bàn tay", emoji: "✋" },
    { word: "Foot", vi: "Bàn chân", emoji: "🦶" },
    { word: "Hair", vi: "Mái tóc", emoji: "💇" },
    { word: "Face", vi: "Khuôn mặt", emoji: "😊" },
    { word: "Arm", vi: "Cánh tay", emoji: "💪" },
    { word: "Leg", vi: "Cái chân", emoji: "🦵" },
  ],
  toys: [
    { word: "Ball", vi: "Quả bóng", emoji: "⚽" },
    { word: "Doll", vi: "Búp bê", emoji: "🪆" },
    { word: "Kite", vi: "Cái diều", emoji: "🪁" },
    { word: "Robot", vi: "Người máy", emoji: "🤖" },
    { word: "Block", vi: "Khối xếp hình", emoji: "🧱" },
    { word: "Puzzle", vi: "Trò xếp hình", emoji: "🧩" },
    { word: "Game", vi: "Trò chơi", emoji: "🎮" },
    { word: "Teddy bear", vi: "Gấu bông", emoji: "🧸" },
    { word: "Toy car", vi: "Xe đồ chơi", emoji: "🏎️" },
    { word: "Balloon", vi: "Quả bóng bay", emoji: "🎈" },
  ],
};

const ALL_WORDS = Object.values(KIDS_CATEGORIES)
  .flat()
  .map((i) => ({ word: i.word, meaning_vi: i.vi, emoji: i.emoji }));

class PRNG {
  private seed: number;
  constructor(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    this.seed = (hash + 2147483647) % 2147483647;
    if (this.seed === 0) this.seed = 1;
  }
  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }
}

export function generateKidsData(
  type: string,
  level: string,
  book: string,
  volume: number,
  topic: string,
) {
  const seedStr = `${book}_${volume}_${level}_${topic}`;
  const prng = new PRNG(seedStr);

  const determineCategory = (topicStr: string) => {
    const t = topicStr.toLowerCase();
    if (
      t.includes("animal") ||
      t.includes("pet") ||
      t.includes("zoo") ||
      t.includes("farm")
    )
      return "animals";
    if (
      t.includes("food") ||
      t.includes("drink") ||
      t.includes("menu") ||
      t.includes("meal") ||
      t.includes("hungry") ||
      t.includes("lunch") ||
      t.includes("dinner")
    )
      return "food";
    if (t.includes("color")) return "colors";
    if (
      t.includes("school") ||
      t.includes("class") ||
      t.includes("study") ||
      t.includes("subject") ||
      t.includes("teacher")
    )
      return "school";
    if (
      t.includes("home") ||
      t.includes("house") ||
      t.includes("room") ||
      t.includes("living") ||
      t.includes("bedroom")
    )
      return "home";
    if (
      t.includes("clothes") ||
      t.includes("wear") ||
      t.includes("dress") ||
      t.includes("shirt")
    )
      return "clothes";
    if (
      t.includes("transport") ||
      t.includes("vehicle") ||
      t.includes("car") ||
      t.includes("drive")
    )
      return "transport";
    if (
      t.includes("body") ||
      t.includes("face") ||
      t.includes("head") ||
      t.includes("hair") ||
      t.includes("appearance")
    )
      return "body";
    if (
      t.includes("toy") ||
      t.includes("play") ||
      t.includes("game") ||
      t.includes("hobby") ||
      t.includes("hobbies") ||
      t.includes("free time")
    )
      return "toys";
    if (
      t.includes("nature") ||
      t.includes("weather") ||
      t.includes("season") ||
      t.includes("summer") ||
      t.includes("holiday") ||
      t.includes("park") ||
      t.includes("camp") ||
      t.includes("outside")
    )
      return "nature";
    return null;
  };

  const getWords = (count: number) => {
    let pool = ALL_WORDS;
    const matchedCategory = determineCategory(topic);
    if (matchedCategory) {
      pool = KIDS_CATEGORIES[matchedCategory].map((i) => ({
        word: i.word,
        meaning_vi: i.vi,
        emoji: i.emoji,
      }));
      if (pool.length < count) {
        const remaining = ALL_WORDS.filter(
          (w) => !pool.find((p) => p.word === w.word),
        );
        pool = [
          ...pool,
          ...remaining
            .sort(() => prng.next() - 0.5)
            .slice(0, count - pool.length),
        ];
      }
    }
    const shuffled = [...pool].sort(() => prng.next() - 0.5);
    return shuffled.slice(0, count);
  };

  const wordCount =
    level.includes("3") || volume >= 3
      ? 12
      : level.includes("2") || volume === 2
        ? 10
        : 8;
  const selectedWords = getWords(wordCount);

  if (type === "kids_vocabulary" || type === "matrix" || type === "match") {
    return { flashcards: selectedWords };
  }

  if (type === "kids_listening") {
    const questions = [];
    const transcripts = [];
    for (let i = 0; i < 3; i++) {
      const targetWord = selectedWords[i % selectedWords.length];
      const options = [targetWord.word];
      while (options.length < 3) {
        const extra = ALL_WORDS[Math.floor(prng.next() * ALL_WORDS.length)].word;
        if (!options.includes(extra)) options.push(extra);
      }
      transcripts.push({
        speaker: "Audio",
        text: `I have a ${targetWord.word.toLowerCase()}.`,
        id: `t${i}`,
      });
      questions.push({
        type: "multiple_choice",
        question: `What do I have? (Câu ${i + 1}/3)`,
        options: options.sort(() => prng.next() - 0.5),
        answers: [targetWord.word],
      });
    }

    return {
      title: "Listen and Choose",
      transcript: transcripts,
      questions: questions,
    };
  }

  if (type === "kids_speaking") {
    const bullets = [];
    for (let i = 0; i < 3; i++) {
      const w = selectedWords[i % selectedWords.length];
      bullets.push(`I see a ${w.word.toLowerCase()}`);
    }
    return {
      title: "Let's Talk!",
      bulletPoints: bullets,
      tip: "Nói thật to và rõ ràng nhé!",
    };
  }

  if (type === "kids_phonics") {
    const bullets = [];
    for (let i = 0; i < 3; i++) {
      const word = selectedWords[i % selectedWords.length].word;
      bullets.push(word);
    }
    const firstLetter = bullets[0].charAt(0).toUpperCase();
    return {
      title: "Phonics Fun!",
      bulletPoints: bullets,
      tip: `Âm /${firstLetter}/ trong tiếng Anh nhé!`,
    };
  }

  if (type === "kids_reading") {
    const questions = [];
    const paragraphs = [];
    for (let i = 0; i < 5; i++) {
      const w1 = selectedWords[(i * 2) % selectedWords.length];
      const w2 = selectedWords[(i * 2 + 1) % selectedWords.length];
      paragraphs.push(`This is a ${w1.word.toLowerCase()} ${w1.emoji}. It likes the ${w2.word.toLowerCase()} ${w2.emoji}.`);
      questions.push({
        question: `What does the ${w1.word.toLowerCase()} like? (Câu ${i + 1}/5)`,
        options: [w2.word, selectedWords[(i+2)%selectedWords.length].word, selectedWords[(i+3)%selectedWords.length].word].sort(
          () => prng.next() - 0.5,
        ),
        answers: [w2.word],
      });
    }
    return {
      title: `Reading Practice`,
      paragraphs: paragraphs,
      questions: questions,
    };
  }

  if (type === "kids_writing") {
    const writingData = [];
    for (let i = 0; i < 3; i++) {
      const w = selectedWords[i % selectedWords.length];
      writingData.push({
        question: `Sắp xếp thành câu: is / a / This / ${w.word.toLowerCase()} (Câu ${i + 1}/3)`,
        answer: `This is a ${w.word.toLowerCase()}`,
      });
    }
    return {
      title: "Make a Sentence",
      items: writingData,
      tip: "Nhớ viết hoa chữ cái đầu tiên nhé.",
    };
  }

  return { flashcards: selectedWords };
}
