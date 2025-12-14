import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  teacherId: mongoose.Types.ObjectId;
  source: string;
  category: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  createdAt: Date;
}

const QuestionSchema: Schema = new Schema({
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  category: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IQuestion>('Question', QuestionSchema);
