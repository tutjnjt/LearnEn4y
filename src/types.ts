export type Profile = 'mom' | 'kid' | null;

export interface IeltsVocabulary {
  word: string;
  type: string;
  meaning_vi: string;
  example: string;
}

export interface IeltsSpeaking {
  title: string;
  bulletPoints: string[];
  tip: string;
}

export interface IeltsWriting {
  title: string;
  question: string;
  tip: string;
}

export interface KidFlashcard {
  word: string;
  meaning_vi: string;
  emoji: string;
}

export interface KidSentence {
  en: string;
  vi: string;
}

export interface IeltsEvaluation {
  score: number;
  feedback: string;
  criteria?: {
    taskResponse: number;
    coherence: number;
    lexical: number;
    grammar: number;
  };
  improvements: string[];
}

export interface SavedWord extends IeltsVocabulary {
  id: string;
  nextReview: number;
  interval: number;
  repetition: number;
  easeFactor: number;
}

export interface UserStats {
  streak: number;
  points: number;
  lastStudyDate: string;
}

export interface IeltsListening {
  title: string;
  transcript: Array<{ speaker: string; text: string; id?: string }>;
  questions: Array<{ type?: 'multiple_choice' | 'fill_in_blank', question: string; options?: string[]; answers: string[] }>;
}

export interface IeltsReading {
  title: string;
  paragraphs: string[];
  questions: Array<{ question: string; options: string[]; answer: string }>;
}

export interface IeltsMatchPair {
  en: string;
  vi: string;
}
