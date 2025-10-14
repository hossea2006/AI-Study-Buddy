# AI Study Buddy 🤖📚

An AI-powered learning platform that helps students study more effectively through automated flashcard generation, quiz creation, concept explanations, and progress tracking.

## 🌟 Features

### Core Features
- **Study Material Upload**: Upload PDFs, notes, or paste content
- **AI Flashcard Generator**: Automatically generate flashcards from study materials
- **Quiz Generator**: Create practice quizzes with AI
- **Concept Explainer**: Get simple explanations for complex topics
- **Practice Problem Generator**: Generate practice problems for any subject
- **Essay Feedback**: Get AI feedback on your essays
- **Progress Tracking**: Track study time, quiz scores, and flashcard reviews
- **Spaced Repetition**: Smart flashcard review system (SuperMemo algorithm)
- **Study Sessions**: Track and log study sessions
- **Analytics Dashboard**: Visualize your learning progress

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Recharts** - Data Visualization
- **React Hook Form** - Form Handling
- **Hosting**: Vercel (FREE)

### Backend
- **Express.js** - Server Framework
- **TypeScript** - Type Safety
- **Prisma** - ORM
- **PostgreSQL** - Database (Supabase)
- **JWT** - Authentication
- **OpenAI API** - AI Features
- **Multer** - File Upload
- **Hosting**: Railway.app or Render.com (FREE)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (we'll use Supabase free tier)
- OpenAI API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hossea2006/AI-Study-Buddy.git
cd AI-Study-Buddy
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database (Get from Supabase)
DATABASE_URL="postgresql://user:password@db.xxx.supabase.co:5432/postgres"

# JWT Secret (Generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# OpenAI API Key (Get from platform.openai.com)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Server
PORT=5000
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

#### Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

#### Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📦 Project Structure

```
AI-Study-Buddy/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── routes/                # API routes
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/            # Auth, validation, error handling
│   │   ├── services/              # Business logic & OpenAI integration
│   │   ├── utils/                 # Helper functions
│   │   ├── types/                 # TypeScript types
│   │   └── server.ts              # Express server entry
│   ├── .env                       # Environment variables
│   ├── tsconfig.json              # TypeScript config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API calls
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── context/               # React Context for state
│   │   ├── types/                 # TypeScript types
│   │   └── App.tsx                # Main App component
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

## 🗄️ Database Schema

### Models:
- **User**: User accounts with authentication
- **StudyMaterial**: Uploaded study content
- **Flashcard**: AI-generated flashcards
- **FlashcardReview**: Spaced repetition tracking
- **Quiz**: Generated quizzes
- **QuizQuestion**: Quiz questions with options
- **QuizAttempt**: Quiz completion records
- **QuizAnswer**: Individual answers
- **StudySession**: Study time tracking
- **Progress**: Daily progress metrics

## 🔑 API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Study Materials
- `POST /api/materials` - Upload study material
- `GET /api/materials` - Get all materials
- `GET /api/materials/:id` - Get single material
- `DELETE /api/materials/:id` - Delete material

### Flashcards
- `POST /api/flashcards/generate` - AI generate flashcards
- `GET /api/flashcards` - Get all flashcards
- `POST /api/flashcards/:id/review` - Submit review (spaced repetition)
- `GET /api/flashcards/due` - Get due flashcards

### Quizzes
- `POST /api/quizzes/generate` - AI generate quiz
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes/:id/attempt` - Submit quiz attempt

### AI Features
- `POST /api/ai/explain` - Explain concept
- `POST /api/ai/practice-problems` - Generate practice problems
- `POST /api/ai/essay-feedback` - Get essay feedback

### Progress
- `GET /api/progress` - Get progress stats
- `GET /api/progress/analytics` - Get detailed analytics

## 🔐 Authentication Flow

1. User registers with email/password
2. Password hashed with bcrypt
3. JWT token issued on login
4. Token sent in Authorization header: `Bearer <token>`
5. Protected routes verify token with middleware

## 🤖 OpenAI Integration

### API Models Used:
- **GPT-4o-mini**: Cost-effective for most requests ($0.15 per 1M input tokens)
- **GPT-4o**: More powerful for complex tasks

### Estimated Costs:
- Flashcard generation: ~$0.001-0.005 per request
- Quiz generation: ~$0.002-0.01 per request
- Concept explanation: ~$0.001-0.003 per request
- **Monthly estimate**: $5-15 for personal use

## 📊 Spaced Repetition Algorithm

Implements SuperMemo SM-2 algorithm:
- Quality rating: 0-5
- Interval calculation based on performance
- Optimal review scheduling
- Tracks ease factor for each card

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables
5. Deploy!

### Backend (Railway.app)
1. Create account on Railway.app
2. New Project → Deploy from GitHub
3. Select backend folder
4. Add environment variables
5. Deploy!

### Database (Supabase)
1. Create free Supabase account
2. Create new project
3. Copy DATABASE_URL from settings
4. Run migrations

## 📝 Environment Setup Checklist

- [ ] Node.js installed
- [ ] PostgreSQL database created (Supabase)
- [ ] OpenAI API key obtained
- [ ] Backend `.env` configured
- [ ] Database migrated
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can create user account
- [ ] Can upload study material
- [ ] AI features working

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## 📄 License

MIT License

## 👤 Author

**Ashfaque (Ash) Hossein**
- GitHub: [@hossea2006](https://github.com/hossea2006)
- Email: ahossein8199@gmail.com

---

Built with ❤️ using React, TypeScript, Express.js, PostgreSQL, and OpenAI
