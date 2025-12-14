import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getUserHistory, getLeaderboard } from '../controllers/quizController';

const router = Router();

router.get('/me/history', authenticate, getUserHistory);
router.get('/leaderboard', authenticate, getLeaderboard);

export default router;
