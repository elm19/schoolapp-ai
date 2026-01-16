# Architecture Overview

## Project Structure

```
schoolapp-ai/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication routes
│   │   ├── login/                # Login page
│   │   ├── sign-up/              # User registration
│   │   ├── confirm/              # Email confirmation
│   │   ├── forgot-password/       # Password recovery
│   │   ├── update-password/       # Password update
│   │   └── sign-up-success/       # Registration success
│   ├── api/                      # API endpoints
│   │   ├── enroll-course/        # Course enrollment
│   │   ├── extract-pdf/          # PDF text extraction
│   │   ├── gemini-ai/            # AI integration endpoint
│   │   ├── schoolapp-connect/    # External platform integration
│   │   ├── student/              # Student-related endpoints
│   │   ├── submit-quiz/          # Quiz submission
│   │   └── userphoto/            # User profile photo upload
│   ├── (protected)/              # Protected routes (require auth)
│   │   ├── courses/              # Course listing and details
│   │   ├── projects/             # Project management
│   │   ├── quiz/                 # Quiz interface
│   │   ├── users/                # User management
│   │   ├── settings/             # User settings
│   │   ├── org/                  # Organization management
│   │   └── layout.tsx            # Protected layout wrapper
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home/landing page
│
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── checkbox.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx
│   │   └── ... (other UI components)
│   ├── admin-panel/              # Admin dashboard components
│   │   ├── admin-panel-layout.tsx
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   ├── menu.tsx
│   │   └── user-nav.tsx
│   ├── course/                   # Course-specific components
│   │   ├── course-header.tsx
│   │   ├── course-actions.tsx
│   │   ├── announcements-section.tsx
│   │   ├── quizzes-section.tsx
│   │   ├── GenerateQuiz.tsx
│   │   └── course-settings-sheet.tsx
│   ├── project/                  # Project-specific components
│   │   ├── project-header.tsx
│   │   ├── project-card.tsx
│   │   ├── project-grid.tsx
│   │   ├── project-participants-list.tsx
│   │   ├── progress-tab.tsx
│   │   └── project-settings-menu.tsx
│   ├── quiz/                     # Quiz components
│   │   ├── quizFromQuestions.tsx
│   │   ├── quiz-results.tsx
│   │   └── user-submission-card.tsx
│   ├── settings/                 # Settings components
│   │   ├── profile-form.tsx
│   │   ├── password-change-form.tsx
│   │   ├── APIKeySection.tsx
│   │   └── school-platform-integration.tsx
│   ├── auth-forms/               # Authentication forms
│   │   ├── login-form.tsx
│   │   ├── sign-up-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   └── update-password-form.tsx
│   ├── providers/                # React context providers
│   │   └── theme-provider.tsx
│   └── ... (other utility components)
│
├── lib/                          # Utility functions
│   ├── supabase/                 # Supabase configuration
│   │   ├── server.ts             # Server-side client
│   │   ├── client.ts             # Client-side client
│   │   ├── middleware.ts          # Auth middleware
│   │   └── utils.ts
│   ├── pdfUtils.ts               # PDF processing utilities
│   ├── scrapper.ts               # Web scraping utilities
│   └── utils.ts                  # General utility functions
│
├── hooks/                        # Custom React hooks
│   ├── use-authuser.ts           # Authentication user hook
│   ├── use-sidebar.ts            # Sidebar state hook
│   └── use-store.ts              # Global store hook
│
├── types/                        # TypeScript type definitions
│   └── project.ts                # Project-related types
│
├── constants/                    # Application constants
│   └── prompts.ts                # AI prompt templates
│
├── public/                       # Static assets
│
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── .env.local                    # Environment variables (local)
```

## Architectural Patterns

### 1. Authentication Flow

- **Server-side Session Management**: Uses `@supabase/ssr` for cookie-based authentication
- **Protected Routes**: Routes in `app/(protected)/` require authentication via middleware
- **Auth Pages**: Public authentication flows in `app/auth/`

```
User Login/Signup → Email Confirmation → Session Created → Access Protected Routes
```

### 2. Component Hierarchy

```
App Root (app/layout.tsx)
├── Auth Routes (app/auth/*)
└── Protected Routes (app/(protected)/*)
    ├── Layout (Protected wrapper)
    ├── Admin Panel (app/(protected)/org/*)
    ├── Courses (app/(protected)/courses/*)
    ├── Projects (app/(protected)/projects/*)
    ├── Quizzes (app/(protected)/quiz/*)
    └── Settings (app/(protected)/settings/*)
```

### 3. Data Flow

```
UI Components (React)
    ↓
Form Submission / User Actions
    ↓
API Routes (app/api/*)
    ↓
Supabase Client (Database Operations)
    ↓
PostgreSQL Database
    ↓
Update State / Render Response
    ↓
UI Components (React)
```

### 4. AI Integration

The application integrates with Google Gemini AI through:

- **Endpoint**: `/api/gemini-ai`
- **Use Cases**:
  - Quiz generation from course content
  - Content analysis and summarization
  - Intelligent response evaluation

**Key Features**:

- User can provide their own API key in settings
- Falls back to server-side key if not configured
- Prompt templates in `constants/prompts.ts`

### 5. State Management

- **Global State**: Zustand store (see `hooks/use-store.ts`)
- **Form State**: React Hook Form with Zod validation
- **UI State**: Component-level state with React hooks
- **Auth State**: Supabase session state

## Key Technologies

### Frontend Framework

- **Next.js 16** with App Router for server components and API routes

### Styling

- **Tailwind CSS** for utility-first styling
- **next-themes** for dark mode support
- **Shadcn/ui** component library

### Form Handling

- **React Hook Form** for efficient form management
- **Zod** for TypeScript-first schema validation

### Database & Auth

- **Supabase** PostgreSQL database
- **@supabase/ssr** for secure cookie-based authentication

### UI Components

- **Radix UI** primitives for accessibility
- **Lucide Icons** for consistent iconography
- **Sonner** for toast notifications

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Type Checking**: Built into Next.js with TypeScript
3. **Linting**: ESLint configuration in `eslint.config.mjs`
4. **Building**: `npm run build` produces optimized production bundle
5. **Production**: `npm start`

## Environment Configuration

The app uses different Supabase clients:

- **Server-side** (`lib/supabase/server.ts`): For route handlers and server components
- **Client-side** (`lib/supabase/client.ts`): For browser-based operations
- **Middleware** (`lib/supabase/middleware.ts`): For auth verification

## Security Considerations

1. **Environment Variables**: Sensitive keys stored in `.env.local`
2. **Route Protection**: Middleware prevents unauthorized access to protected routes
3. **Authentication**: Server-side session validation with Supabase
4. **API Security**: Server-side validation of requests
5. **CORS**: API routes handle cross-origin requests securely

## Performance Optimizations

1. **Server Components**: Reduced JavaScript bundle size
2. **Image Optimization**: Next.js Image component for lazy loading
3. **Code Splitting**: Automatic route-based code splitting
4. **Caching**: Built-in Next.js caching strategies
5. **Markdown Rendering**: Client-side rendering for rich content

## Database Architecture

- **PostgreSQL** via Supabase
- **Real-time Subscriptions**: Supabase real-time features
- **Row-level Security**: RLS policies for data protection
