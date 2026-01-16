# SchoolApp AI

A modern, full-featured learning management system (LMS) built with Next.js, Supabase, and AI capabilities. SchoolApp AI provides educators and students with an intuitive platform to manage courses, collaborate on projects, and assess learning through interactive quizzes powered by Google Gemini AI.

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#documentation"><strong>Documentation</strong></a> ·
  <a href="#authentication"><strong>Authentication</strong></a>
</p>

---

## ✨ Features

### Core Functionality

- **Course Management** - Create, browse, and enroll in courses with rich content support
- **Project Collaboration** - Build team projects with participant management and progress tracking
- **Quiz System** - Create and take assessments with instant feedback and AI-generated content
- **User Settings** - Manage profile information and API keys
- **Admin Panel** - Comprehensive dashboard for educators and administrators
- **Course Announcements** - Share updates and important information with students

### Advanced Features

- **AI-Powered Quiz Generation** - Generate quizzes from course content using Google Gemini AI
- **AI-Powered Content Analysis** - Extract and analyze content with intelligent processing
- **PDF Support** - Extract and process PDF content for course materials
- **Real-time Notifications** - Using Sonner toast notifications
- **Markdown Support** - Rich text content rendering with markdown
- **Progress Tracking** - Monitor project progress with timestamped updates
- **Dark Mode** - Beautiful theme switching with next-themes
- **User Authentication** - Secure email/password authentication with session management

### User Roles

- **Teachers/Instructors** - Create courses and quizzes, manage student progress, create announcements
- **Students** - Enroll in courses, participate in projects, take quizzes, submit progress updates
- **Administrators** - System-wide management and oversight

---

## 🛠 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router and server components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Efficient form handling with Zod validation
- **Zustand** - Lightweight state management
- **Radix UI** - Unstyled, accessible UI components
- **Shadcn/ui** - Pre-built accessible component library

### Backend & Services

- **Supabase** - PostgreSQL database, authentication (via SSR), and real-time features
- **Google Generative AI (Gemini)** - AI-powered quiz generation and content analysis
- **Next.js API Routes** - Serverless backend functions

### Utilities

- **react-markdown** - Markdown rendering for rich content
- **pdf-parse** - PDF processing and text extraction
- **date-fns** & **timeago.js** - Date formatting and relative time display
- **Axios** - HTTP client for API communication
- **Cheerio** - Web scraping for content extraction

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- Google Generative AI API key (for Gemini integration)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/elm19/schoolapp-ai
   cd schoolapp-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

### Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📚 Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Project structure and architectural decisions
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Detailed API endpoints and usage
- [FEATURES.md](FEATURES.md) - Comprehensive feature documentation
- [DATABASE.md](DATABASE.md) - Database schema and relationships

---

## 🔐 Authentication

The application uses Supabase Authentication with server-side session management:

1. **Sign Up** - Users create an account with email and password
2. **Email Confirmation** - Confirmation email sent for verification
3. **Login** - Authenticated users access protected routes via session cookies
4. **Session Management** - Server-side session handling with `@supabase/ssr` package
5. **Protected Routes** - Routes in `app/(protected)/` require authentication

---

## 📝 Environment Variables

| Variable                        | Description                           | Required |
| ------------------------------- | ------------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL             | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public)       | Yes      |
| `GOOGLE_GEMINI_API_KEY`         | Google Gemini API key for AI features | No\*     |

\*Can be set per-user in account settings

---

## 🚦 Development Workflow

1. Create a feature branch from `main`
2. Run `npm run dev` for local development
3. Use TypeScript for type safety
4. Follow the component-based architecture in `components/`
5. Test authentication flows thoroughly
6. Run `npm run lint` before committing
7. Build with `npm run build` to verify production readiness

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with clear commit messages
4. Test thoroughly before submitting
5. Submit a pull request with detailed description

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💡 Support

For issues and questions:

- Check the documentation files
- Review existing GitHub issues
- Create a new issue with detailed information
- Contact the development team

---

**Happy Learning! 🎓**
