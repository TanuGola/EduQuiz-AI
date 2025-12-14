import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
  title: string;
  teacherId: mongoose.Types.ObjectId;
  category: string;
  questionIds: mongoose.Types.ObjectId[];
  timeLimitSeconds: number;
  published: boolean;
  createdAt: Date;
}

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  timeLimitSeconds: { type: Number, required: true },
  published: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
