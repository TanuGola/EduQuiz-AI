# EduQuiz-AI - Full-Stack Quiz Practice System

A complete AI-powered quiz platform with separate Teacher and Student portals. Teachers can upload PDFs to automatically generate quiz questions using Google's Gemini AI, while students can take quizzes, track their progress, and compete on leaderboards.

## Features

### Student Portal
- **Dashboard**: Browse quizzes by category
- **Quiz Taking**: Interactive quiz interface with countdown timer
- **Results**: Detailed score breakdown with charts
- **History**: Track all past quiz attempts
- **Leaderboard**: View top performers globally or by category

### Teacher Portal
- **Dashboard**: Overview of created quizzes and questions
- **PDF Upload**: Upload PDFs to auto-generate questions using AI
- **Question Management**: View, edit, and delete generated questions
- **Quiz Creation**: Build quizzes from question bank
- **Leaderboard Access**: Monitor student performance

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **Authentication**: JWT-based with role-based access control
- **AI**: Google Gemini API for question generation
- **Charts**: Chart.js for data visualization

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

## Installation & Setup

### Step 1: Clone/Extract the Project

Navigate to the project directory:
```bash
cd EduQuiz-AI
```

### Step 2: Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Open `backend/.env` and update:
```env
PORT=5000
MONGODB_URI=mongodb+srv://tanugola09_db_user:tanugola@1234@cluster0.nbcuynx.mongodb.net/eduquiz-ai?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
```

**Important**: Replace `your-gemini-api-key-here` with your actual Gemini API key.

To get a Gemini API key:
- Visit: https://makersuite.google.com/app/apikey
- Sign in with your Google account
- Click "Create API Key"
- Copy the key and paste it in the `.env` file

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Step 4: Access the Application

Open your browser and go to: `http://localhost:3000`

## Usage Guide

### For Students

1. **Sign Up**:
   - Click "Sign up" on the login page
   - Enter your name, email, password
   - Select "Student" as role
   - Click "Sign Up"

2. **Take a Quiz**:
   - Browse available quizzes on the dashboard
   - Click on a quiz to start
   - Answer questions one by one
   - Watch the countdown timer
   - Submit when done or time expires

3. **View Results**:
   - See your score, correct/wrong answers
   - View pie chart breakdown
   - Check detailed answer explanations

4. **Track Progress**:
   - Go to "History" to see all past attempts
   - View "Leaderboard" to see rankings

### For Teachers

1. **Sign Up**:
   - Click "Sign up" on the login page
   - Enter your name, email, password
   - Select "Teacher" as role
   - Click "Sign Up"

2. **Upload PDF to Generate Questions**:
   - Click "Upload PDF" in navigation
   - Select a PDF file
   - Enter a category (e.g., "Mathematics", "Science")
   - Set number of questions to generate (1-50)
   - Click "Generate Questions"
   - Wait for AI to process (may take 30-60 seconds)

3. **Manage Questions**:
   - Click "Questions" to view all generated questions
   - Edit question text, options, or correct answer
   - Delete unwanted questions

4. **Create a Quiz**:
   - Click "Create Quiz"
   - Enter quiz title and category
   - Set time limit in minutes
   - Select questions from your question bank
   - Check "Publish immediately" to make it available to students
   - Click "Create Quiz"

5. **View Student Performance**:
   - Click "Leaderboard" to see top performers
   - Filter by category to see specific quiz results

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Student Endpoints
- `GET /api/quizzes/categories` - Get all categories
- `GET /api/quizzes/available` - Get published quizzes
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes/:id/start` - Start quiz session
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/users/me/history` - Get user quiz history
- `GET /api/users/leaderboard` - Get leaderboard

### Teacher Endpoints (Protected)
- `POST /api/teacher/upload-pdf` - Upload PDF and generate questions
- `POST /api/teacher/generate-questions` - Generate questions from text
- `GET /api/teacher/questions` - Get all teacher's questions
- `PUT /api/teacher/questions/:id` - Update question
- `DELETE /api/teacher/questions/:id` - Delete question
- `POST /api/teacher/create-quiz` - Create new quiz
- `GET /api/teacher/quizzes` - Get all teacher's quizzes
- `PUT /api/teacher/quizzes/:id` - Update quiz
- `DELETE /api/teacher/quizzes/:id` - Delete quiz

## Database Schemas

### User
```typescript
{
  name: string
  email: string (unique)
  passwordHash: string
  role: 'student' | 'teacher'
  history: [{
    quizId: ObjectId
    score: number
    correct: number
    wrong: number
    total: number
    date: Date
  }]
}
```

### Question
```typescript
{
  teacherId: ObjectId
  source: string
  category: string
  questionText: string
  options: [string, string, string, string]
  correctIndex: number (0-3)
  explanation: string
}
```

### Quiz
```typescript
{
  title: string
  teacherId: ObjectId
  category: string
  questionIds: [ObjectId]
  timeLimitSeconds: number
  published: boolean
}
```

### Attempt
```typescript
{
  studentId: ObjectId
  quizId: ObjectId
  answers: [{
    questionId: ObjectId
    selectedIndex: number
    correctIndex: number
  }]
  score: number
  correct: number
  wrong: number
  startedAt: Date
  completedAt: Date
}
```

## AI Question Generation

The system uses Google's Gemini AI to generate quiz questions from uploaded PDFs. The AI prompt is designed to:

1. Extract key concepts from the text
2. Generate multiple-choice questions with 4 options each
3. Ensure one correct answer and three plausible distractors
4. Provide brief explanations (max 30 words)
5. Return structured JSON data

Example AI prompt structure:
```
Generate exactly N multiple-choice questions from the provided text.
Each question must have:
- Clear question text
- 4 options (1 correct, 3 incorrect but plausible)
- Brief explanation for the correct answer
```

## Project Structure

```
EduQuiz-AI/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── quizController.ts
│   │   │   └── teacherController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Question.ts
│   │   │   ├── Quiz.ts
│   │   │   └── Attempt.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── quizRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── teacherRoutes.ts
│   │   ├── utils/
│   │   │   ├── aiService.ts
│   │   │   └── pdfExtractor.ts
│   │   └── server.ts
│   ├── uploads/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── LeaderboardTable.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── ResultSummary.tsx
│   │   │   └── Timer.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── CreateQuiz.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── ManageQuestions.tsx
│   │   │   ├── QuizPage.tsx
│   │   │   ├── ResultPage.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   └── UploadPDF.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
└── README.md
```

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**:
- Verify your MongoDB connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Check if MongoDB service is running (if using local MongoDB)

**Port Already in Use**:
- Change the PORT in `backend/.env` to another port (e.g., 5001)
- Update the API_URL in `frontend/src/services/api.ts` accordingly

**Gemini API Error**:
- Verify your API key is correct
- Check if you have API quota remaining
- Ensure you're using the correct model name ('gemini-pro')

### Frontend Issues

**Cannot Connect to Backend**:
- Ensure backend is running on port 5000
- Check if API_URL in `frontend/src/services/api.ts` matches backend URL
- Verify CORS is enabled in backend

**Build Errors**:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### PDF Upload Issues

**PDF Text Extraction Fails**:
- Ensure PDF is text-based (not scanned images)
- Try a different PDF file
- Check if `pdf-parse` package is installed correctly

**AI Generation Takes Too Long**:
- Reduce the number of questions to generate
- Check your internet connection
- Verify Gemini API is responding

## Security Notes

- Change `JWT_SECRET` in production to a strong random string
- Never commit `.env` files to version control
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs
- Use environment-specific configurations

## Production Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

1. Set environment variables on your hosting platform
2. Build TypeScript: `npm run build`
3. Start with: `npm start`

### Frontend Deployment (e.g., Vercel, Netlify)

1. Build the app: `npm run build`
2. Deploy the `dist` folder
3. Update API_URL to point to your backend URL

## License

This project is created for educational purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check console logs for detailed error messages

## Credits

- Built with React, Node.js, Express, MongoDB
- AI powered by Google Gemini
- Charts by Chart.js
- Icons and styling: Custom CSS

---

**Happy Learning with EduQuiz-AI! 🎓✨**
