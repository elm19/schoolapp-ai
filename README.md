# SchoolApp AI

A modern, full-featured learning management system (LMS) built with Next.js, Supabase, and AI capabilities. SchoolApp AI provides educators and students with an intuitive platform to manage courses, collaborate on projects, and assess learning through interactive quizzes.

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#project-structure"><strong>Project Structure</strong></a> ·
  <a href="#authentication"><strong>Authentication</strong></a>
</p>

---

## ✨ Features

### Core Functionality

- **Course Management** - Create, browse, and enroll in courses with rich content support
- **Project Collaboration** - Build team projects with participant management and progress tracking
- **Quiz System** - Create and take assessments with instant feedback
- **User Settings** - Manage profile information and API keys
- **Admin Panel** - Comprehensive dashboard for educators and administrators

### Advanced Features

- **AI-Powered Assistance** - Integration with Google Gemini AI for intelligent features
- **PDF Support** - Extract and process PDF content for course materials
- **Real-time Notifications** - Using Sonner toast notifications
- **Markdown Support** - Rich text content rendering with markdown
- **Progress Tracking** - Monitor project progress with timestamped updates
- **Dark Mode** - Beautiful theme switching with next-themes

### User Roles

- **Teachers** - Create courses and quizzes, manage student progress
- **Students** - Enroll in courses, participate in projects, take quizzes

---

## 🛠 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router and server components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Efficient form handling
- **Zustand** - Lightweight state management
- **Radix UI** - Unstyled, accessible UI components

### Backend & Services

- **Supabase** - PostgreSQL database, authentication, and real-time features
- **Google Generative AI (Gemini)** - AI-powered features
- **Next.js API Routes** - Serverless backend functions

### Utilities

- **react-markdown** - Markdown rendering
- **pdf-parse** - PDF processing
- **date-fns** - Date formatting and manipulation
- **Zod** - TypeScript-first schema validation
- **Axios** - HTTP client

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Google API key for Gemini AI

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd schoolapp-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📁 Project Structure

```
schoolapp-ai/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages (login, sign-up, etc.)
│   ├── api/                      # API routes
│   │   ├── enroll-course/        # Course enrollment
│   │   ├── extract-pdf/          # PDF extraction
│   │   ├── gemini-ai/            # AI integration
│   │   └── submit-quiz/          # Quiz submission
│   └── (protected)/              # Protected routes
│       ├── courses/              # Courses listing and details
│       ├── projects/             # Projects management
│       ├── quiz/                 # Quiz pages
│       └── settings/             # User settings
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components (buttons, cards, forms, etc.)
│   ├── admin-panel/              # Admin dashboard components
│   ├── course/                   # Course-specific components
│   └── project/                  # Project-specific components
├── lib/                          # Utility functions and helpers
│   ├── supabase/                 # Supabase client setup
│   └── utils.ts                  # General utilities
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── constants/                    # Application constants (prompts, etc.)
└── public/                       # Static assets
```

---

## 🔐 Authentication

The application uses Supabase Authentication with the following flow:

1. **Sign Up** - Users create an account with email and password
2. **Email Confirmation** - Confirmation email sent for verification
3. **Login** - Authenticated users access protected routes
4. **Session Management** - Server-side session handling with `@supabase/ssr`

Protected routes require authentication and are located in `app/(protected)/`

---

## 📚 Key Components

### Course Management

- **CourseHeader** - Displays course title, creator, and metadata
- **AnnouncementsSection** - Course announcements
- **QuizzesSection** - Associated quizzes
- **DownloadSupport** - Download course materials

### Project Features

- **ProjectHeader** - Project overview and information
- **ProjectParticipantsList** - Team member management
- **ProgressTab** - Progress updates with markdown support
- **ProjectSettingsMenu** - Project configuration

### Quiz System

- **QuizFromQuestions** - Quiz interface and submission
- **QuizResults** - Results display and analysis

---

## 🔌 API Routes

### `/api/enroll-course`

- Enrolls a student in a course

### `/api/extract-pdf`

- Extracts text content from PDF files

### `/api/gemini-ai`

- Communicates with Google Gemini AI for intelligent features

### `/api/submit-quiz`

- Handles quiz submission and grading

---

## 🎨 Styling

The project uses Tailwind CSS with:

- Custom theme configuration in `tailwind.config.ts`
- Dark mode support via `next-themes`
- Prose styling for markdown content
- Responsive design patterns

---

## 🔄 Database Schema

Key tables in Supabase:

- **profiles** - User information
- **courses** - Course content and metadata
- **course_enrollments** - Student-course relationships
- **quizzes** - Quiz definitions
- **quiz_submissions** - Student quiz attempts
- **projects** - Project information
- **project_participants** - Team members
- **project_progress** - Progress updates
- **announcements** - Course announcements

---

## 🚦 Development Workflow

1. Create feature branch from `main`
2. Run `npm run dev` for development
3. Use TypeScript for type safety
4. Follow component-based architecture
5. Test authentication flows
6. Run `npm run lint` before committing
7. Build with `npm run build` to verify production readiness

---

## 📝 Environment Variables

| Variable                        | Description                           |
| ------------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public)       |
| `NEXT_PUBLIC_GEMINI_API_KEY`    | Google Gemini API key for AI features |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💡 Support

For issues and questions:

- Check existing GitHub issues
- Create a new issue with detailed information
- Contact the development team

---

**Happy Learning! 🎓**

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Proxy
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

```env
NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[INSERT SUPABASE PROJECT API PUBLISHABLE OR ANON KEY]
```

> [!NOTE]
> This example uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, which refers to Supabase's new **publishable** key format.
> Both legacy **anon** keys and new **publishable** keys can be used with this variable name during the transition period. Supabase's dashboard may show `NEXT_PUBLIC_SUPABASE_ANON_KEY`; its value can be used in this example.
> See the [full announcement](https://github.com/orgs/supabase/discussions/29260) for more information.

Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
