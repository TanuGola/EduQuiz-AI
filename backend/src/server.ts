import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import authRoutes from './routes/authRoutes';
import quizRoutes from './routes/quizRoutes';
import userRoutes from './routes/userRoutes';
import teacherRoutes from './routes/teacherRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teacher', teacherRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
