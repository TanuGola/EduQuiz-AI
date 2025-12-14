import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAvailableQuizzes,
  getQuizById,
  startQuiz,
  submitQuiz,
  getUserHistory,
  getLeaderboard,
  getCategories
} from '../controllers/quizController';

const router = Router();

router.get('/categories', authenticate, getCategories);
router.get('/available', authenticate, getAvailableQuizzes);
router.get('/:id', authenticate, getQuizById);
router.post('/:id/start', authenticate, startQuiz);
router.post('/:id/submit', authenticate, submitQuiz);

export default router;
