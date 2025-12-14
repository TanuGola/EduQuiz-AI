import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizHistory {
  quizId: mongoose.Types.ObjectId;
  score: number;
  correct: number;
  wrong: number;
  total: number;
  date: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'teacher';
  history: IQuizHistory[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  history: [{
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    correct: Number,
    wrong: Number,
    total: Number,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
