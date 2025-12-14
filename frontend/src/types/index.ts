export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Question {
  _id: string;
  questionText: string;
  options: string[];
  correctIndex?: number;
  explanation?: string;
  category?: string;
  source?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  category: string;
  timeLimitSeconds: number;
  published: boolean;
  teacherId?: any;
  questionIds?: string[];
  createdAt?: string;
}

export interface QuizSession {
  quizId: string;
  title: string;
  category: string;
  timeLimitSeconds: number;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  selectedIndex: number;
}

export interface QuizResult {
  attemptId: string;
  score: number;
  correct: number;
  wrong: number;
  total: number;
  percentage: number;
}

export interface HistoryItem {
  quizId: any;
  score: number;
  correct: number;
  wrong: number;
  total: number;
  date: string;
}

export interface LeaderboardEntry {
  _id: string;
  studentId: { name: string; email: string };
  quizId: { title: string; category: string };
  score: number;
  correct: number;
  wrong: number;
}
