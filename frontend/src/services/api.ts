import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

export const quizAPI = {
  getCategories: () => api.get('/quizzes/categories'),
  getAvailable: () => api.get('/quizzes/available'),
  getById: (id: string) => api.get(`/quizzes/${id}`),
  start: (id: string) => api.post(`/quizzes/${id}/start`),
  submit: (id: string, answers: any) => api.post(`/quizzes/${id}/submit`, { answers }),
};

export const userAPI = {
  getHistory: () => api.get('/users/me/history'),
  getLeaderboard: (category?: string) => api.get(`/users/leaderboard${category ? `?category=${category}` : ''}`),
};

export const teacherAPI = {
  uploadPDF: (formData: FormData) => api.post('/teacher/upload-pdf', formData),
  generateQuestions: (data: any) => api.post('/teacher/generate-questions', data),
  getQuestions: () => api.get('/teacher/questions'),
  updateQuestion: (id: string, data: any) => api.put(`/teacher/questions/${id}`, data),
  deleteQuestion: (id: string) => api.delete(`/teacher/questions/${id}`),
  createQuiz: (data: any) => api.post('/teacher/create-quiz', data),
  getQuizzes: () => api.get('/teacher/quizzes'),
  updateQuiz: (id: string, data: any) => api.put(`/teacher/quizzes/${id}`, data),
  deleteQuiz: (id: string) => api.delete(`/teacher/quizzes/${id}`),
};

export default api;
