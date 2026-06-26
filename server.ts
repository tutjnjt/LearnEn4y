import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  let ai: GoogleGenAI | null = null;
  try {
    if (process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  } catch (e) {
    console.error("Failed to initialize Gemini:", e);
  }

  const generateWithRetry = async (
    aiClient: GoogleGenAI,
    prompt: string,
    type: string = "vocabulary",
    level: string = "General",
    retries = 3,
  ) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await aiClient.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.9,
          },
        });
        const text = response.text;
        if (!text) throw new Error("No text returned");
        return JSON.parse(text);
      } catch (error: any) {
        console.error("Gemini generation error:", error);
        if (i === retries - 1) {
          console.warn("Retries exhausted, using fallback data");
          return getFallbackData(type, level);
        }
        let waitTime = Math.pow(2, i) * 1000;
        if (error.message?.includes("429") || error.status === 429 || error.message?.includes("quota")) {
          // If rate limited, just fail immediately and use fallback instead of waiting long
          console.warn("Rate limited, using fallback data immediately");
          return getFallbackData(type, level);
        }
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  };

  const getFallbackData = (type: string, level: string) => {
    // Level mapping
    const isPre = level.includes("Pre-IELTS");
    const isFound = level.includes("Foundation");
    const isAdv = level.includes("Advanced");
    // Default to Intermediate

    if (type === "vocabulary" || type === "match") {
      if (isPre) {
        return {
          words: [
            {
              word: "Family",
              type: "n",
              meaning_vi: "Gia đình",
              example: "I live with my family.",
            },
            {
              word: "Happy",
              type: "adj",
              meaning_vi: "Hạnh phúc",
              example: "She is very happy today.",
            },
            {
              word: "School",
              type: "n",
              meaning_vi: "Trường học",
              example: "He goes to school by bus.",
            },
          ],
          pairs: [
            { en: "Family", vi: "Gia đình" },
            { en: "Happy", vi: "Hạnh phúc" },
            { en: "School", vi: "Trường học" },
            { en: "Teacher", vi: "Giáo viên" },
            { en: "Student", vi: "Học sinh" },
          ],
        };
      } else if (isFound) {
        return {
          words: [
            {
              word: "Environment",
              type: "n",
              meaning_vi: "Môi trường",
              example: "We must protect the environment.",
            },
            {
              word: "Transport",
              type: "n",
              meaning_vi: "Giao thông",
              example: "Public transport is cheap.",
            },
            {
              word: "Traditional",
              type: "adj",
              meaning_vi: "Truyền thống",
              example: "I like traditional food.",
            },
          ],
          pairs: [
            { en: "Environment", vi: "Môi trường" },
            { en: "Transport", vi: "Giao thông" },
            { en: "Traditional", vi: "Truyền thống" },
            { en: "Journey", vi: "Chuyến đi" },
            { en: "Culture", vi: "Văn hóa" },
          ],
        };
      } else if (isAdv) {
        return {
          words: [
            {
              word: "Ubiquitous",
              type: "adj",
              meaning_vi: "Có mặt khắp nơi",
              example: "Smartphones have become ubiquitous.",
            },
            {
              word: "Mitigate",
              type: "v",
              meaning_vi: "Giảm nhẹ",
              example: "We need to mitigate the effects of climate change.",
            },
            {
              word: "Pragmatic",
              type: "adj",
              meaning_vi: "Thực dụng",
              example: "They took a pragmatic approach to the problem.",
            },
          ],
          pairs: [
            { en: "Ubiquitous", vi: "Khắp nơi" },
            { en: "Mitigate", vi: "Giảm nhẹ" },
            { en: "Pragmatic", vi: "Thực dụng" },
            { en: "Ephemeral", vi: "Chóng vánh" },
            { en: "Paradigm", vi: "Mô hình" },
          ],
        };
      } else {
        return {
          words: [
            {
              word: "Resilience",
              type: "n",
              meaning_vi: "Sự kiên cường",
              example: "Her resilience helped her overcome the difficulties.",
            },
            {
              word: "Perspective",
              type: "n",
              meaning_vi: "Góc nhìn",
              example: "We need a different perspective.",
            },
            {
              word: "Implement",
              type: "v",
              meaning_vi: "Triển khai",
              example: "The government will implement new policies.",
            },
          ],
          pairs: [
            { en: "Resilience", vi: "Kiên cường" },
            { en: "Perspective", vi: "Góc nhìn" },
            { en: "Implement", vi: "Triển khai" },
            { en: "Determine", vi: "Xác định" },
            { en: "Significant", vi: "Đáng kể" },
          ],
        };
      }
    }

    if (type === "speaking") {
      if (isPre)
        return {
          title: "Describe a good friend.",
          bulletPoints: [
            "Who this person is",
            "How you met",
            "What you do together",
            "Explain why they are a good friend",
          ],
          tip: "Use basic adjectives like kind, funny, helpful.",
        };
      if (isFound)
        return {
          title: "Describe a trip you took recently.",
          bulletPoints: [
            "Where you went",
            "Who you went with",
            "What you did",
            "Explain how you felt about it",
          ],
          tip: "Use past tense accurately (went, saw, played).",
        };
      if (isAdv)
        return {
          title: "Describe an international environmental law.",
          bulletPoints: [
            "What the law is",
            "How it is enforced",
            "What effects it has had",
            "Explain why it is crucial for the future",
          ],
          tip: "Use advanced vocabulary and complex grammatical structures.",
        };
      return {
        title: "Describe a book that you enjoyed reading.",
        bulletPoints: [
          "What the book is",
          "What it is about",
          "Why you read it",
          "Explain why you enjoyed it",
        ],
        tip: "Focus on expressing your feelings and the impact.",
      };
    }

    if (type === "writing") {
      if (isPre)
        return {
          title: "Task 1: Email",
          question:
            "Write a letter to your friend inviting them to a birthday party.",
          tip: "Use informal language and clear information about time/place.",
        };
      if (isAdv)
        return {
          title: "Task 2: Essay",
          question:
            "To what extent does the globalization of culture lead to the loss of national identities?",
          tip: "Provide well-developed arguments with nuanced examples.",
        };
      return {
        title: "Task 2: Essay",
        question:
          "Some people think that the best way to increase road safety is to increase the minimum legal age for driving. Do you agree or disagree?",
        tip: "Structure your essay with clear paragraphs.",
      };
    }

    if (type === "listening") {
      if (isPre) {
        return {
          title: "Ordering Food",
          transcript: [
            {
              speaker: "Waiter",
              text: "Hello, what would you like to eat?",
              id: "t1",
            },
            {
              speaker: "Customer",
              text: "I would like a pizza and a cola, please.",
              id: "t2",
            },
          ],
          questions: [
            {
              type: "multiple_choice",
              question: "What did the customer order?",
              options: ["Pizza and water", "Pizza and cola", "Burger"],
              answers: ["Pizza and cola"],
            },
          ],
        };
      }
      return {
        title: "Library Registration",
        transcript: [
          {
            speaker: "Librarian",
            text: "Good morning! How can I help you today?",
            id: "t1",
          },
          {
            speaker: "Student",
            text: "Hi, I'd like to register for a library card.",
            id: "t2",
          },
          {
            speaker: "Librarian",
            text: "Certainly. I just need to see your student ID and proof of address.",
            id: "t3",
          },
        ],
        questions: [
          {
            type: "multiple_choice",
            question: "What does the student want to do?",
            options: ["Borrow a book", "Register for a card", "Return a book"],
            answers: ["Register for a card"],
          },
        ],
      };
    }

    if (type === "reading") {
      if (isPre) {
        return {
          title: "My Daily Routine",
          paragraphs: [
            "I wake up at 7 AM every day. Then I have breakfast with my family. I go to school at 8 AM.",
          ],
          questions: [
            {
              question: "What time does the person wake up?",
              options: ["6 AM", "7 AM", "8 AM"],
              answers: ["7 AM"],
            },
          ],
        };
      }
      return {
        title: "The Importance of Sleep",
        paragraphs: [
          "Sleep is a vital component of every person's overall health and well-being. Sleep enables the body to repair.",
          "Getting adequate rest may also help prevent excess weight gain and heart disease.",
        ],
        questions: [
          {
            question: "Why is sleep important?",
            options: ["To eat more", "To repair the body", "To stay awake"],
            answers: ["To repair the body"],
          },
        ],
      };
    }

    if (type === "kids_vocabulary") {
      const count = level === "Level 3" ? 10 : level === "Level 2" ? 8 : 6;
      return {
        flashcards: [
          { word: "Cat", meaning_vi: "Con mèo", emoji: "🐱" },
          { word: "Dog", meaning_vi: "Con chó", emoji: "🐶" },
          { word: "Bird", meaning_vi: "Con chim", emoji: "🐦" },
          { word: "Fish", meaning_vi: "Con cá", emoji: "🐟" },
          { word: "Apple", meaning_vi: "Quả táo", emoji: "🍎" },
          { word: "Banana", meaning_vi: "Quả chuối", emoji: "🍌" },
          { word: "Car", meaning_vi: "Ô tô", emoji: "🚗" },
          { word: "Sun", meaning_vi: "Mặt trời", emoji: "☀️" },
          { word: "Moon", meaning_vi: "Mặt trăng", emoji: "🌙" },
          { word: "Star", meaning_vi: "Ngôi sao", emoji: "⭐" },
        ].slice(0, count),
      };
    }

    if (type === "kids_listening") {
      return {
        title: "Listen and Choose",
        transcript: [
          { speaker: "Audio", text: "I have a red apple.", id: "t1" },
        ],
        questions: [
          {
            type: "multiple_choice",
            question: "What do I have?",
            options: ["A red apple", "A blue car", "A green leaf"],
            answers: ["A red apple"],
          },
        ],
      };
    }

    if (type === "kids_speaking") {
      return {
        title: "Let's Talk!",
        bulletPoints: ["Say: Hello, my name is...", "Say: I am happy today."],
        tip: "Nói thật to và rõ ràng nhé!",
      };
    }
    if (type === "kids_phonics") {
      return {
        title: "Phonics Fun!",
        bulletPoints: ["cat", "hat"],
        tip: "Âm /æ/ trong tiếng Anh nhé!",
      };
    }

    if (type === "kids_reading") {
      return {
        title: "The Little Cat",
        paragraphs: [
          "This is a little cat. The cat is yellow. It likes to play.",
        ],
        questions: [
          {
            question: "What color is the cat?",
            options: ["Yellow", "Red", "Blue"],
            answers: ["Yellow"],
          },
        ],
      };
    }

    if (type === "kids_writing") {
      return {
        title: "Make a Sentence",
        question: "Sắp xếp các từ sau thành câu đúng: likes / He / apples",
        answer: "He likes apples",
        tip: "Nhớ viết hoa chữ cái đầu tiên nhé.",
      };
    }

    if (type === "flashcards") {
      return {
        flashcards: [
          { word: "Cat", meaning_vi: "Con mèo", emoji: "🐱" },
          { word: "Dog", meaning_vi: "Con chó", emoji: "🐶" },
        ],
      };
    }
    if (type === "sentence") {
      return {
        sentences: [
          { en: "I like apples.", vi: "Tôi thích những quả táo." },
          { en: "The sky is blue.", vi: "Bầu trời màu xanh." },
        ],
      };
    }
    if (type === "translate") {
      return { translation: "Bản dịch (dữ liệu mẫu)" };
    }
    if (type === "evaluate_writing") {
      return {
        score: 6.0,
        feedback: "Bài viết khá tốt (dữ liệu mẫu do lỗi API)",
        criteria: {
          taskResponse: 6.0,
          coherence: 6.0,
          lexical: 6.0,
          grammar: 6.0,
        },
        improvements: ["Viết dài hơn"],
      };
    }
    if (type === "evaluate_speaking") {
      return {
        score: 6.0,
        feedback: "Nói rõ ràng (dữ liệu mẫu do lỗi API)",
        criteria: {
          taskResponse: 6.0,
          coherence: 6.0,
          lexical: 6.0,
          grammar: 6.0,
        },
        improvements: ["Phát âm chuẩn hơn"],
      };
    }
    return {};
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // IELTS Generation Endpoint for Mom
  app.post("/api/ielts/generate", async (req, res) => {
    try {
      if (!ai) {
        return res
          .status(500)
          .json({ error: "Gemini API key is not configured" });
      }
      const { type, level } = req.body; // 'speaking', 'writing', 'vocabulary'
      let prompt = "";

      const levelGuidelines: Record<string, string> = {
        "Pre-IELTS (Band 3.0 - 4.0)":
          "A1-A2 level. Very simple sentences, basic vocabulary, everyday topics (family, hobbies, daily routine). Length: very short.",
        "Foundation (Band 4.0 - 5.0)":
          "B1 level. Compound sentences, descriptive texts, general training contexts. Length: short.",
        "Intermediate (Band 5.0 - 6.0)":
          "B2 level. Academic contexts, complex sentences, discursive texts, academic vocabulary. Length: medium.",
        "Advanced (Band 6.5+)":
          "C1-C2 level. Dense academic texts, university lectures, abstract topics, advanced idioms, nuanced arguments. Length: long.",
      };

      const guideline = levelGuidelines[level] || "General IELTS level.";
      const isPre = level.includes("Pre-IELTS");
      const isFound = level.includes("Foundation");
      const isAdv = level.includes("Advanced");

      if (type === "speaking") {
        let taskDesc = isPre
          ? "Speaking Part 1 (2 simple questions about familiar topics)"
          : isFound
            ? "Speaking Part 1 (3 questions about familiar topics)"
            : isAdv
              ? "Speaking Part 3 (abstract, complex discussion questions related to a societal issue)"
              : "Speaking Part 2 (cue card)";
        prompt = `Generate a random IELTS ${taskDesc} suitable for ${level} (${guideline}). Include the main topic, 3 bullet points (or 3 specific questions for Part 1/3) to cover, and a brief tip for answering matching this exact level's capability. Return JSON in the format: { "title": "...", "bulletPoints": ["..."], "tip": "..." }`;
      } else if (type === "writing") {
        let taskDesc = isPre
          ? "Writing Task 1 (General Training - write a simple informal letter to a friend)"
          : isFound
            ? "Writing Task 1 (Academic - simple bar chart or pie chart description)"
            : isAdv
              ? 'Writing Task 2 (Complex double question or "To what extent" essay on abstract topics)'
              : "Writing Task 2 (Standard essay on a common topic)";
        prompt = `Generate a random IELTS ${taskDesc} suitable for ${level} (${guideline}). Include the question prompt and a brief tip on structure for a student at this exact level. Return JSON in the format: { "title": "...", "question": "...", "tip": "..." }`;
      } else if (type === "listening") {
        let lengthDesc = isPre
          ? "2-3 short basic dialogue turns (e.g. ordering food)"
          : isFound
            ? "4-5 dialogue turns (e.g. asking for directions/booking)"
            : isAdv
              ? "an excerpt from a university lecture (monologue, highly academic)"
              : "a short academic discussion between 2 students";
        let questionDesc = isPre
          ? "1 multiple choice question"
          : isFound
            ? "1 multiple choice and 1 fill in the blank"
            : isAdv
              ? "3 complex questions (multiple choice, matching, and fill in the blank)"
              : "2 questions (multiple choice and fill in the blank)";
        prompt = `Tạo một bài nghe IELTS ngắn gồm ${lengthDesc} trình độ ${level} (${guideline}). Trả về JSON: { "title": "...", "transcript": [{"speaker": "Speaker 1", "text": "câu tiếng Anh...", "id": "t1"}], "questions": [{"type": "multiple_choice", "question": "...", "options": ["...", "...", "..."], "answers": ["..."]}, {"type": "fill_in_blank", "question": "...", "answers": ["đáp án 1", "đáp án 2"]}] }. Đảm bảo bài nghe có đúng ${questionDesc}.`;
      } else if (type === "reading") {
        let lengthDesc = isPre
          ? "1 đoạn văn rất ngắn (khoảng 50 từ)"
          : isFound
            ? "2 đoạn văn ngắn (khoảng 100 từ)"
            : isAdv
              ? "3 đoạn văn học thuật phức tạp và dài (khoảng 250 từ)"
              : "2-3 đoạn văn học thuật (khoảng 150 từ)";
        let questionDesc = isPre
          ? "1 câu hỏi multiple choice siêu dễ"
          : isFound
            ? "2 câu hỏi (multiple choice và điền từ)"
            : isAdv
              ? "3 câu hỏi khó (True/False/Not Given, Matching, và Multiple Choice)"
              : "2 câu hỏi (Multiple Choice và True/False)";
        prompt = `Tạo một bài đọc IELTS học thuật gồm ${lengthDesc} trình độ ${level} (${guideline}). Trả về JSON: { "title": "...", "paragraphs": ["đoạn 1...", "đoạn 2..."], "questions": [{"question": "...", "options": ["...", "...", "..."], "answers": ["..."]}] }. Đảm bảo bài đọc có đúng ${questionDesc}.`;
      } else {
        prompt = `Provide 3 vocabulary words strictly suitable for IELTS (level ${level} - ${guideline}). For Pre-IELTS, use very basic A1-A2 words. For Advanced, use C1-C2 academic words. Include the word, meaning in Vietnamese, English example sentence, and part of speech. Return JSON in the format: { "words": [{ "word": "...", "type": "...", "meaning_vi": "...", "example": "..." }] }`;
      }

      const data = await generateWithRetry(ai, prompt, type, level);
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to generate content" });
    }
  });

  // Mom Game Endpoint
  app.post("/api/ielts/game", async (req, res) => {
    try {
      if (!ai) {
        return res
          .status(500)
          .json({ error: "Gemini API key is not configured" });
      }
      const { type, level } = req.body; // 'match', level e.g., 'Cơ bản', 'Trung cấp'
      let prompt = "";

      const levelGuidelines: Record<string, string> = {
        "Pre-IELTS (Band 3.0 - 4.0)":
          "A1-A2 level. Simple sentences, basic vocabulary, everyday topics (family, hobbies, shopping).",
        "Foundation (Band 4.0 - 5.0)":
          "B1 level. Compound sentences, descriptive texts, general training contexts.",
        "Intermediate (Band 5.0 - 6.0)":
          "B2 level. Academic contexts, complex sentences, discursive texts, academic vocabulary.",
        "Advanced (Band 6.5+)":
          "C1-C2 level. Dense academic texts, university lectures, abstract topics, advanced idioms and collocations.",
      };

      const guideline = levelGuidelines[level] || "General IELTS level.";

      if (type === "match") {
        prompt = `Tạo 5 từ vựng tiếng Anh học thuật IELTS trình độ ${level} (${guideline}). Trả về JSON format: { "pairs": [{ "en": "từ tiếng anh", "vi": "nghĩa tiếng việt ngắn gọn" }] }`;
      }

      const data = await generateWithRetry(ai, prompt, type, level);
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to generate game content" });
    }
  });

  // Translate Endpoint
  app.post("/api/ielts/translate", async (req, res) => {
    try {
      if (!ai) {
        return res
          .status(500)
          .json({ error: "Gemini API key is not configured" });
      }
      const { text } = req.body;
      const prompt = `Dịch từ hoặc cụm từ "${text}" sang tiếng Việt ngắn gọn, dễ hiểu nhất theo ngữ cảnh thông thường. Trả về JSON: { "translation": "..." }`;

      const data = await generateWithRetry(ai, prompt, "translate");
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to translate" });
    }
  });

  // Evaluate Endpoint
  app.post("/api/ielts/evaluate", async (req, res) => {
    try {
      if (!ai) {
        return res
          .status(500)
          .json({ error: "Gemini API key is not configured" });
      }
      const { type, topic, content } = req.body;
      let prompt = "";

      if (type === "writing") {
        prompt = `Đóng vai giám khảo IELTS. Đánh giá bài viết sau.\nĐề bài: ${topic}\nBài làm: ${content}\nĐưa ra điểm tổng (Band score) và điểm chi tiết cho 4 tiêu chí. Trả về JSON format: { "score": 6.5, "feedback": "nhận xét chung", "criteria": {"taskResponse": 6.5, "coherence": 6.0, "lexical": 6.5, "grammar": 6.0}, "improvements": ["điểm cần cải thiện 1", "điểm cần cải thiện 2"] }`;
      } else if (type === "speaking") {
        prompt = `Đóng vai giám khảo IELTS. Đánh giá câu trả lời Speaking sau (được chuyển từ giọng nói thành văn bản qua API).\nChủ đề: ${topic}\nTrích xuất văn bản: ${content}\nĐưa ra điểm tổng và chi tiết. Trả về JSON format: { "score": 6.0, "feedback": "nhận xét chung", "criteria": {"taskResponse": 6.0, "coherence": 6.0, "lexical": 6.0, "grammar": 6.0}, "improvements": ["điểm cần cải thiện 1", "điểm cần cải thiện 2"] }`;
      }

      const data = await generateWithRetry(
        ai,
        prompt,
        type === "writing" ? "evaluate_writing" : "evaluate_speaking",
      );
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to evaluate content" });
    }
  });

  // Kids Generation Endpoint
  app.post("/api/kids/generate", async (req, res) => {
    try {
      if (!ai) {
        return res
          .status(500)
          .json({ error: "Gemini API key is not configured" });
      }
      const { type, level = "Level 1", book, volume, topic } = req.body;
      let prompt = "";

      const count = level === "Level 3" ? 10 : level === "Level 2" ? 8 : 6;
      let complexity = "phù hợp với độ tuổi và năng lực";
      let grammarFocus = "";
      const unitMatch = level.match(/\d+/);
      const unitNum = unitMatch ? parseInt(unitMatch[0]) : 1;

      let unitProgression = `Đây là Bài học số ${unitNum}. `;
      if (unitNum > 15)
        unitProgression +=
          "Mức độ cực khó, đòi hỏi kết hợp nhiều chủ đề và thì ngữ pháp phức tạp.";
      else if (unitNum > 10)
        unitProgression +=
          "Hãy tăng độ khó lên mức cao nhất của tập này (câu dài hơn, câu hỏi suy luận).";
      else if (unitNum > 5)
        unitProgression +=
          "Hãy tăng độ khó ở mức trung bình (kết hợp các từ vựng bài trước, câu hỏi đa dạng hơn).";
      else
        unitProgression +=
          "Đây là những bài đầu, giữ độ khó cơ bản, hỏi trực tiếp.";

      if (book === "Global Success") {
        complexity =
          "cho trẻ lớp 4 (khoảng 9-10 tuổi), câu ghép, đoạn văn hội thoại cơ bản";
        if (volume === 1) {
          grammarFocus =
            "Sử dụng: Hỏi/Đáp về thời gian, ngày tháng, khả năng (can), thời khóa biểu, môn học, ngày hội trường.";
        } else if (volume === 2) {
          grammarFocus =
            "Sử dụng: Thì Hiện tại đơn, Thì Hiện tại tiếp diễn, Động từ khuyết thiếu, Giới từ, Tính từ sở hữu, từ vựng mở rộng về nghề nghiệp, động vật, quần áo.";
        }
      } else if (book === "Family and Friends") {
        complexity = "cho trẻ tiểu học";
        if (volume === 1) {
          grammarFocus =
            "Sử dụng cấu trúc cơ bản: What's this?, It's a..., Where is...?, I like..., He/She is...";
        } else if (volume === 2) {
          grammarFocus =
            "Sử dụng: What's the weather like?, Put on/Don't put on. Would you like...?, What's the time?, May I...?, quá khứ với Was/Were (He was short).";
        } else if (volume === 3) {
          grammarFocus =
            "Sử dụng: Hiện tại đơn, Hiện tại tiếp diễn, Quá khứ đơn, Tương lai gần (be going to), Can/Could, Must/Mustn't, So sánh hơn/nhất.";
        } else if (volume === 4) {
          grammarFocus =
            "Sử dụng: Hiện tại đơn, Hiện tại tiếp diễn, Quá khứ đơn, Danh từ đếm được/không đếm được, Some/Any/A lot of, Tương lai (going to).";
        } else if (volume === 5) {
          grammarFocus =
            "Sử dụng: Các thì Hiện tại/Quá khứ/Tương lai đơn, Câu điều kiện, Lời khuyên (should), So sánh nhất.";
        }
      } else if (book === "Starters") {
        complexity =
          "dành cho trẻ thi chứng chỉ Cambridge Starters (khoảng 7-9 tuổi)";
        if (volume === 1) {
          grammarFocus =
            "Thì Hiện tại tiếp diễn, Hiện tại đơn. Đại từ nhân xưng, tính từ sở hữu. Giới từ (in, on, under, by, next to). Câu hỏi Where, What, How many, Who, What colour. Luyện phản xạ cơ bản.";
        } else if (volume === 2) {
          grammarFocus =
            "Thì Hiện tại đơn, Hiện tại tiếp diễn. Các từ hỏi Who, What, Where, How old, How many. Tính từ đối lập, Have got/Has got. Ngữ cảnh tương tác vui nhộn, hình ảnh sinh động. Các dạng bài: Luyện nghe (chọn màu/đồ vật), Đọc hiểu (Đúng/Sai), Nói (Mô tả tranh) - Bám sát cấu trúc thi Fun for Starters.";
        }
      } else {
        complexity =
          level === "Level 3"
            ? "cho trẻ 8-10 tuổi (Lớp 3-5), câu dài, từ vựng phong phú hơn"
            : level === "Level 2"
              ? "cho trẻ 6-8 tuổi (Lớp 1-2), câu ngắn, từ vựng cơ bản"
              : "cho trẻ mầm non 4-6 tuổi, siêu đơn giản, chỉ 1-2 từ hoặc câu cực ngắn";
      }

      const bookContext = book
        ? `BẮT BUỘC dùng TỪ VỰNG và NGỮ PHÁP chính xác của bộ sách "${book}"${volume ? ` Tập ${volume}` : ""}`
        : "";
      const topicContext = topic
        ? `. TRỌNG TÂM TUYỆT ĐỐI VÀO CHỦ ĐỀ CỦA BÀI HỌC NÀY: "${topic}". Mọi câu, từ vựng, đoạn văn, câu hỏi đều phải xoay quanh chủ đề này để phân biệt rõ ràng với các bài học khác. ${grammarFocus}`
        : ". (Tạo nội dung ngẫu nhiên, sáng tạo)";
      const randomSeed = Math.floor(Math.random() * 10000);
      const fullContext = `${bookContext}${topicContext}. Độ khó chung: ${complexity}. ${unitProgression} YÊU CẦU QUAN TRỌNG: NỘI DUNG PHẢI ĐA DẠNG! Thay đổi nhân vật, bối cảnh, và tình huống trong bài để đảm bảo KHÔNG BAO GIỜ bị trùng lặp với các unit khác (Seed: ${randomSeed}).`;

      if (type === "kids_vocabulary") {
        prompt = `Tạo ${count} từ vựng tiếng Anh ${fullContext}. CÁC TỪ VỰNG TRONG DANH SÁCH PHẢI HOÀN TOÀN KHÁC NHAU (KHÔNG ĐƯỢC TRÙNG LẶP). Trả về JSON format: { "flashcards": [{ "word": "từ tiếng Anh", "meaning_vi": "nghĩa tiếng Việt", "emoji": "(một emoji minh họa duy nhất)" }] }`;
      } else if (type === "kids_listening") {
        prompt = `Tạo một bài nghe tiếng Anh (chỉ text để chuyển thành giọng nói sau) ${fullContext}. Nội dung bài nghe PHẢI bám sát chủ đề "${topic}". Trả về JSON format: { "title": "Tiêu đề (liên quan chủ đề)", "transcript": [{"speaker": "Audio", "text": "câu tiếng Anh...", "id": "t1"}], "questions": [{"type": "multiple_choice", "question": "Câu hỏi (bằng tiếng Việt để bé dễ hiểu)?", "options": ["...", "...", "..."], "answers": ["..."]}] }`;
      } else if (type === "kids_speaking") {
        prompt = `Tạo bài luyện nói tiếng Anh ${fullContext}. Nội dung nói PHẢI bám sát chủ đề "${topic}". Gồm 2 câu hoặc đoạn hội thoại siêu ngắn để bé tập đọc theo đúng ngữ pháp tập này. Trả về JSON format: { "title": "...", "bulletPoints": ["Câu 1...", "Câu 2..."], "tip": "Một lời khuyên ngắn gọn bằng tiếng Việt để bé nói tốt hơn." }`;
      } else if (type === "kids_phonics") {
        prompt = `Tạo bài luyện ngữ âm (Phonics) ${fullContext}. Liên quan đến chủ đề "${topic}" nếu có thể. Chọn 2 từ chứa cùng một âm vần (ví dụ: cat, hat). Trả về JSON format: { "title": "Luyện phát âm", "bulletPoints": ["Từ 1: ...", "Từ 2: ..."], "tip": "Đọc to các từ để luyện âm này nhé." }`;
      } else if (type === "kids_reading") {
        prompt = `Tạo một bài đọc tiếng Anh (đoạn văn) ${fullContext}. Nội dung ĐẶC SẮC và bám sát chủ đề "${topic}". Trả về JSON format: { "title": "...", "paragraphs": ["đoạn văn..."], "questions": [{"question": "Câu hỏi (tiếng Việt)?", "options": ["...", "...", "..."], "answers": ["..."]}] }`;
      } else if (type === "kids_writing") {
        prompt = `Tạo một bài tập viết/sắp xếp từ tiếng Anh ${fullContext}. Câu văn PHẢI liên quan đến chủ đề "${topic}". Ví dụ sắp xếp từ thành câu đúng với ngữ pháp, hoặc điền từ vào chỗ trống. Trả về JSON format: { "title": "Bài tập viết", "question": "Đề bài (bằng tiếng Việt)", "answer": "đáp án đúng", "tip": "Hướng dẫn làm bài" }`;
      }

      const data = await generateWithRetry(ai, prompt, type, level);
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to generate content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
