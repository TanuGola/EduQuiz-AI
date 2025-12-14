import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, selectedIndex, onSelect }) => {
  return (
    <div className="question-card">
      <h3>Question {questionNumber}</h3>
      <p className="question-text">{question.questionText}</p>
      <div className="options">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`option ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => onSelect(index)}
          >
            <span className="option-label">{String.fromCharCode(65 + index)}.</span>
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
