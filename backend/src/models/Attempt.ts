import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedIndex: number;
  correctIndex: number;
}

export interface IAttempt extends Document {
  studentId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  correct: number;
  wrong: number;
  startedAt: Date;
  completedAt: Date;
}

const AttemptSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    selectedIndex: Number,
    correctIndex: Number
  }],
  score: { type: Number, required: true },
  correct: { type: Number, required: true },
  wrong: { type: Number, required: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAttempt>('Attempt', AttemptSchema);
