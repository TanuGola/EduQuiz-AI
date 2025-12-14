import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  uploadPDF,
  generateQuestions,
  getTeacherQuestions,
  updateQuestion,
  deleteQuestion,
  createQuiz,
  getTeacherQuizzes,
  updateQuiz,
  deleteQuiz
} from '../controllers/teacherController';

const router = Router();

router.use(authenticate);
router.use(requireRole('teacher'));

router.post('/upload-pdf', uploadPDF);
router.post('/generate-questions', generateQuestions);
router.get('/questions', getTeacherQuestions);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.post('/create-quiz', createQuiz);
router.get('/quizzes', getTeacherQuizzes);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

export default router;
