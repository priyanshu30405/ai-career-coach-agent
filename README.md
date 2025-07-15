# 🚀 AI Career Coach Agent - Your Personal Career Development Assistant

> **Transform your career journey with AI-powered guidance, resume analysis, and personalized roadmaps**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌟 What is AI Career Coach Agent?

AI Career Coach Agent is a comprehensive, full-stack application that leverages artificial intelligence to provide personalized career guidance, resume analysis, and learning roadmaps. Built with modern web technologies, it offers an intuitive interface for career development and professional growth.

### ✨ Key Features

- 🤖 **AI Career Q&A Chat** - Get instant answers to career questions
- 📄 **AI Resume Analyzer** - Upload and analyze your resume for improvements
- 🗺️ **Career Roadmap Generator** - Create personalized learning paths
- ✉️ **Cover Letter Generator** - Generate professional cover letters
- 🔐 **User Authentication** - Secure Clerk integration
- 📊 **Usage Analytics** - Track your career development progress
- ⚡ **Real-time Processing** - Instant AI-powered responses
- 💾 **History Management** - Save and review your career sessions

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Services
- **Next.js API Routes** - Server-side API endpoints
- **Clerk** - Authentication & user management
- **Google Gemini AI** - Advanced AI processing
- **PostgreSQL** - Primary database (NeonDB)
- **Inngest** - Background job processing
- **Drizzle ORM** - Type-safe database queries

### Development Tools
- **Drizzle Kit** - Database migrations
- **ESLint** - Code quality & consistency
- **Prettier** - Code formatting
- **Vercel** - Deployment platform

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database
- Google Gemini AI API key
- Clerk account

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/priyanshu30405/ai-career-coach-agent.git
   cd ai-career-coach-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:
   ```env
   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret

   # Database
   POSTGRES_URL=your_postgres_connection_string

   # AI Services
   GEMINI_API_KEY=your_gemini_api_key

   # Background Jobs
   INNGEST_EVENT_KEY=your_inngest_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   ```

4. **Database Setup**
   ```bash
   npx drizzle-kit migrate
   ```

5. **Start Development Server**
```bash
npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 Usage Guide

### Getting Started with Career Development

1. **Sign Up/Login** - Create an account or sign in
2. **Choose Your Tool** - Select from available AI career tools
3. **Get Personalized Guidance** - Receive AI-powered career advice
4. **Track Progress** - Monitor your career development journey

### Available AI Tools

| Tool | Description | Best For |
|------|-------------|----------|
| **AI Career Q&A Chat** | Interactive career guidance | General career questions, advice |
| **AI Resume Analyzer** | Resume optimization and feedback | Job applications, career transitions |
| **Career Roadmap Generator** | Personalized learning paths | Skill development, career planning |
| **Cover Letter Generator** | Professional cover letters | Job applications, networking |

### AI Career Q&A Chat

Ask any career-related question and get instant, professional guidance:

- **Interview Preparation** - Tips and strategies
- **Career Transitions** - Guidance for changing fields
- **Skill Development** - Recommendations for growth
- **Industry Trends** - Stay updated with market insights

### AI Resume Analyzer

Upload your resume and receive comprehensive feedback:

- **Content Analysis** - Identify strengths and weaknesses
- **ATS Optimization** - Ensure compatibility with applicant tracking systems
- **Keyword Suggestions** - Improve searchability
- **Format Recommendations** - Professional presentation tips

### Career Roadmap Generator

Create personalized learning paths based on your goals:

- **Custom Prompts** - Specify your career objectives
- **Experience Levels** - Beginner to advanced paths
- **Goal-Oriented** - Aligned with your career aspirations
- **Structured Learning** - Step-by-step progression

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐            ┌────▼────┐            ┌────▼────┐
    │  Clerk  │            │Database │            │ Gemini  │
    │   Auth  │            │(PostgreSQL)│         │   AI    │
    └─────────┘            └─────────┘            └─────────┘
                                  │                       │
                                  │                       │
                            ┌────▼────┐            ┌────▼────┐
                            │ Inngest │            │PDF Parse│
                            │(Background)│         │  Service│
                            └─────────┘            └─────────┘
```

---

## 🔧 API Reference

### Career Chat Endpoint

```typescript
POST /api/ai-career-chat-agent

{
  "userInput": "string"
}
```

### Resume Analysis Endpoint

```typescript
POST /api/ai-resume-agent

FormData:
- resumeFile: File
- recordId: string
```

### Roadmap Generation Endpoint

```typescript
POST /api/ai-roadmap-agent

{
  "recordId": "string",
  "customPrompt": "string",
  "userExperience": "string",
  "userGoals": "string"
}
```

### Cover Letter Generation Endpoint

```typescript
POST /api/cover-letter

{
  "jobTitle": "string",
  "companyName": "string",
  "jobDescription": "string",
  "profileText": "string"
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Configure environment variables
   - Deploy automatically

2. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Ensure database connection is configured

3. **Custom Domain** (Optional)
   - Configure your custom domain
   - Set up SSL certificates

### Other Platforms

- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **Render** - Container-based deployment

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed

---

## 📊 Performance Metrics

- **Page Load Time**: < 2 seconds
- **AI Response Time**: < 5 seconds
- **Resume Analysis**: < 10 seconds
- **Roadmap Generation**: < 15 seconds
- **Uptime**: 99.9%

---

## 🔒 Security

- **Authentication**: Secure Clerk integration
- **File Upload**: Secure PDF processing
- **Data Encryption**: End-to-end encryption
- **API Security**: Rate limiting and validation

---

## 📈 Roadmap

### Phase 1 (Current)
- ✅ AI career chat functionality
- ✅ Resume analysis and optimization
- ✅ Career roadmap generation
- ✅ Cover letter creation
- ✅ User authentication and history

### Phase 2 (Q2 2025)
- 🔄 Interview preparation tools
- 🔄 Networking guidance
- 🔄 Salary negotiation assistance
- 🔄 Job search optimization

### Phase 3 (Q3 2025)
- 📋 Career coaching marketplace
- 📋 Mentorship matching
- 📋 Skill assessment tools
- 📋 Advanced analytics dashboard

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Priyanshu Raj**

- 💼 **LinkedIn**: [Priyanshu Raj](https://www.linkedin.com/in/priyanshu-raj-0b4a9624b/)
- 🐙 **GitHub**: [@priyanshu30405](https://github.com/priyanshu30405)

---

<div align="center">

**Made with ❤️ by Priyanshu Raj**

</div> 
