import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { QuizSession, Answer } from '../types';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      const response = await quizAPI.start(id!);
      setSession(response.data);
      setAnswers(response.data.questions.map((q: any) => ({ questionId: q._id, selectedIndex: -1 })));
    } catch (error) {
      console.error('Failed to load quiz', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex].selectedIndex = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < session!.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit?')) return;
    
    try {
      const validAnswers = answers.filter(a => a.selectedIndex !== -1);
      const response = await quizAPI.submit(id!, validAnswers);
      navigate(`/result/${response.data.attemptId}`, { state: { result: response.data } });
    } catch (error) {
      console.error('Failed to submit quiz', error);
    }
  };

  const handleTimeExpire = () => {
    alert('Time is up!');
    handleSubmit();
  };

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (!session) return <div>Quiz not found</div>;

  const currentQuestion = session.questions[currentIndex];
  const currentAnswer = answers[currentIndex];

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1>{session.title}</h1>
        <Timer seconds={session.timeLimitSeconds} onExpire={handleTimeExpire} />
      </div>

      <div className="quiz-progress">
        Question {currentIndex + 1} of {session.questions.length}
      </div>

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        selectedIndex={currentAnswer.selectedIndex}
        onSelect={handleSelectOption}
      />

      <div className="quiz-navigation">
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          Previous
        </button>
        {currentIndex < session.questions.length - 1 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit} className="submit-btn">Submit Quiz</button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
