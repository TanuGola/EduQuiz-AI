import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Quiz from '../models/Quiz';
import Question from '../models/Question';
import Attempt from '../models/Attempt';
import User from '../models/User';

export const getAvailableQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await Quiz.find({ published: true })
      .populate('teacherId', 'name')
      .select('-questionIds');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizById = async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('teacherId', 'name')
      .select('-questionIds');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const startQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || !quiz.published) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const questions = await Question.find({ _id: { $in: quiz.questionIds } })
      .select('-correctIndex -explanation');

    // Randomize questions
    const shuffled = questions.sort(() => Math.random() - 0.5);

    res.json({
      quizId: quiz._id,
      title: quiz.title,
      category: quiz.category,
      timeLimitSeconds: quiz.timeLimitSeconds,
      questions: shuffled.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { answers } = req.body; // { questionId: string, selectedIndex: number }[]
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const questions = await Question.find({ _id: { $in: quiz.questionIds } });
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    let correct = 0;
    let wrong = 0;
    const detailedAnswers = answers.map((ans: any) => {
      const question = questionMap.get(ans.questionId);
      if (!question) return null;

      const isCorrect = ans.selectedIndex === question.correctIndex;
      if (isCorrect) correct++;
      else wrong++;

      return {
        questionId: ans.questionId,
        selectedIndex: ans.selectedIndex,
        correctIndex: question.correctIndex
      };
    }).filter(Boolean);

    const total = correct + wrong;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    const attempt = new Attempt({
      studentId: req.userId,
      quizId: quiz._id,
      answers: detailedAnswers,
      score,
      correct,
      wrong,
      startedAt: new Date(),
      completedAt: new Date()
    });
    await attempt.save();

    // Update user history
    await User.findByIdAndUpdate(req.userId, {
      $push: {
        history: {
          quizId: quiz._id,
          score,
          correct,
          wrong,
          total,
          date: new Date()
        }
      }
    });

    res.json({
      attemptId: attempt._id,
      score,
      correct,
      wrong,
      total,
      percentage: score
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserHistory = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).populate('history.quizId', 'title category');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = {};
    
    if (category) {
      const quizzes = await Quiz.find({ category, published: true }).select('_id');
      const quizIds = quizzes.map(q => q._id);
      filter.quizId = { $in: quizIds };
    }

    const attempts = await Attempt.find(filter)
      .populate('studentId', 'name email')
      .populate('quizId', 'title category')
      .sort({ score: -1 })
      .limit(10);

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Quiz.distinct('category', { published: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
