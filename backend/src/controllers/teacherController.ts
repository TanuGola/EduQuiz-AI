import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Question from '../models/Question';
import Quiz from '../models/Quiz';
import { extractTextFromFile } from '../utils/fileExtractor';
import { generateQuestionsFromText } from '../utils/aiService';
import path from 'path';

export const uploadPDF = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.file as any;
    const { category, questionCount } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'Only PDF, TXT, and DOCX files are allowed' });
    }

    const uploadPath = path.join(__dirname, '../../uploads', file.name);
    await file.mv(uploadPath);

    const text = await extractTextFromFile(uploadPath, file.mimetype);
    const count = parseInt(questionCount) || 10;
    const generatedQuestions = await generateQuestionsFromText(text, category, count);

    const questions = await Question.insertMany(
      generatedQuestions.map(q => ({
        teacherId: req.userId,
        source: file.name,
        category,
        questionText: q.questionText,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation
      }))
    );

    res.json({
      message: 'Questions generated successfully',
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process file' });
  }
};

export const generateQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const { text, category, questionCount } = req.body;

    if (!text || !category) {
      return res.status(400).json({ message: 'Text and category are required' });
    }

    const count = parseInt(questionCount) || 10;
    const generatedQuestions = await generateQuestionsFromText(text, category, count);

    const questions = await Question.insertMany(
      generatedQuestions.map(q => ({
        teacherId: req.userId,
        source: 'manual-text',
        category,
        questionText: q.questionText,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation
      }))
    );

    res.json({
      message: 'Questions generated successfully',
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate questions' });
  }
};

export const getTeacherQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const questions = await Question.find({ teacherId: req.userId }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findOne({ _id: id, teacherId: req.userId });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    Object.assign(question, req.body);
    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findOneAndDelete({ _id: id, teacherId: req.userId });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, questionIds, timeLimitSeconds, published } = req.body;

    if (!title || !category || !questionIds || !timeLimitSeconds) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const quiz = new Quiz({
      title,
      teacherId: req.userId,
      category,
      questionIds,
      timeLimitSeconds,
      published: published || false
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTeacherQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await Quiz.find({ teacherId: req.userId }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOne({ _id: id, teacherId: req.userId });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    Object.assign(quiz, req.body);
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOneAndDelete({ _id: id, teacherId: req.userId });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
