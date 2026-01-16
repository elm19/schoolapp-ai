# Documentation Index

Welcome to SchoolApp AI! This is your guide to all available documentation for the project.

## 📋 Quick Navigation

### For First-Time Setup

Start here if you're new to the project:

1. **[README.md](README.md)** - Overview of SchoolApp AI, features, and quick start
2. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Complete setup guide and development workflow

### For Understanding the Project

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Project structure, design patterns, and technical decisions
- **[FEATURES.md](FEATURES.md)** - Comprehensive feature documentation with usage examples
- **[DATABASE.md](DATABASE.md)** - Database schema, tables, and relationships

### For Building & Integrating

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API endpoints, request/response formats
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Code examples, component development, best practices

---

## 📚 Documentation Overview

### README.md

**What**: Project overview and getting started guide
**Read if you want to**:

- Understand what SchoolApp AI does
- Learn about key features
- Set up the project locally
- See the tech stack
- Quick navigation links

**Length**: ~5 minutes read

---

### ARCHITECTURE.md

**What**: Technical architecture and project structure
**Read if you want to**:

- Understand how the project is organized
- Learn about architectural patterns
- Understand data flow
- See component hierarchy
- Learn about security and performance

**Length**: ~10 minutes read

---

### FEATURES.md

**What**: Complete feature documentation
**Read if you want to**:

- Explore all available features
- Understand user roles and capabilities
- Learn about AI-powered features
- Discover available integrations
- See the roadmap for future features

**Key Sections**:

- Course Management
- Project Collaboration
- Quiz System (including AI-powered generation)
- User Management & Settings
- AI Features
- Admin Panel
- And more!

**Length**: ~20 minutes read

---

### DATABASE.md

**What**: Database schema and structure
**Read if you want to**:

- Understand the data model
- Learn about table relationships
- See all database tables and fields
- Understand indexes and performance
- Learn about RLS policies

**Key Tables**:

- profiles (users)
- courses
- course_enrollments
- quizzes & quiz_questions
- quiz_submissions
- projects & project_participants
- project_progress
- announcements
- And more!

**Length**: ~15 minutes read

---

### API_DOCUMENTATION.md

**What**: REST API endpoints and usage
**Read if you want to**:

- Learn about available API endpoints
- Understand request/response formats
- See error handling
- Learn about authentication
- Find rate limiting info

**Available Endpoints**:

- POST /api/enroll-course
- POST /api/extract-pdf
- POST /api/gemini-ai
- POST /api/submit-quiz
- GET/POST /api/student
- POST /api/userphoto
- POST /api/schoolapp-connect

**Length**: ~10 minutes read

---

### DEVELOPMENT.md

**What**: Developer guide with code examples
**Read if you want to**:

- Set up local development environment
- Learn component development
- See code examples
- Understand the development workflow
- Learn best practices
- Debug issues

**Sections**:

- Initial Setup & Prerequisites
- Running the Application
- Creating New Features
- Component Development
- Database Operations (code examples)
- Form Handling
- Authentication
- API Route Development
- Using Hooks
- Performance Tips
- Troubleshooting

**Length**: ~25 minutes read

---

## 🎯 Common Scenarios

### "I want to get the project running"

1. Read [README.md](README.md#-getting-started)
2. Follow [DEVELOPMENT.md](DEVELOPMENT.md#getting-started)

### "I need to add a new course feature"

1. Check [FEATURES.md](FEATURES.md#course-management)
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for structure
3. Follow examples in [DEVELOPMENT.md](DEVELOPMENT.md)
4. Reference [DATABASE.md](DATABASE.md) for schema

### "I need to create an API endpoint"

1. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for patterns
2. See code examples in [DEVELOPMENT.md](DEVELOPMENT.md#api-route-development)
3. Check [DATABASE.md](DATABASE.md) for data operations

### "I need to understand a feature"

1. Check [FEATURES.md](FEATURES.md)
2. Look at components in the codebase
3. Review examples in [DEVELOPMENT.md](DEVELOPMENT.md)

### "I'm new to the project"

1. Read [README.md](README.md) (5 min)
2. Skim [ARCHITECTURE.md](ARCHITECTURE.md) (10 min)
3. Follow [DEVELOPMENT.md](DEVELOPMENT.md) setup (15 min)
4. Explore the features in [FEATURES.md](FEATURES.md)

---

## 🔗 File Structure

```
schoolapp-ai/
├── README.md                 ← Start here
├── ARCHITECTURE.md           ← Understand the structure
├── FEATURES.md               ← Explore capabilities
├── DATABASE.md               ← Learn the data model
├── API_DOCUMENTATION.md      ← For API integration
├── DEVELOPMENT.md            ← For coding
└── DOCUMENTATION_INDEX.md    ← You are here
```

---

## 📊 Quick Reference

### Tech Stack at a Glance

```
Frontend:  Next.js 16 | React 19 | TypeScript | Tailwind CSS
UI:        Shadcn/ui | Radix UI | React Hook Form | Zod
Backend:   Supabase | PostgreSQL | Next.js API Routes
AI:        Google Gemini API
```

### Key Features

- ✅ Course Management
- ✅ Project Collaboration
- ✅ AI-Powered Quiz Generation
- ✅ User Authentication
- ✅ Real-time Notifications
- ✅ Admin Panel
- ✅ Dark Mode Support

### Key Directories

```
app/           Next.js routes and API
components/    React components (organized by feature)
lib/           Utilities (Supabase, helpers)
hooks/         Custom React hooks
types/         TypeScript definitions
constants/     App-wide constants
```

---

## 🤝 Contributing

When contributing to SchoolApp AI:

1. **Before you start**: Read relevant documentation
2. **While developing**: Check code examples in DEVELOPMENT.md
3. **Before committing**: Run linter (`npm run lint`)
4. **When ready**: Follow git workflow (branch → commit → PR)

---

## ❓ FAQ

**Q: Where do I add a new page?**
A: See [ARCHITECTURE.md](ARCHITECTURE.md#project-structure) for structure. Create page in `app/(protected)/your-feature/page.tsx`

**Q: How do I connect to the database?**
A: See [DEVELOPMENT.md](DEVELOPMENT.md#database-operations) for code examples.

**Q: Where's the authentication logic?**
A: Check [ARCHITECTURE.md](ARCHITECTURE.md#authentication-flow) for flow and `lib/supabase/` for implementation.

**Q: How do I use AI features?**
A: See [FEATURES.md](FEATURES.md#ai-features) for overview and [API_DOCUMENTATION.md](API_DOCUMENTATION.md#3-gemini-ai-integration) for API details.

**Q: What's the database schema?**
A: Complete schema in [DATABASE.md](DATABASE.md)

---

## 📞 Support

- **Setup Issues**: Check DEVELOPMENT.md troubleshooting
- **Feature Questions**: See FEATURES.md
- **Architecture Questions**: Read ARCHITECTURE.md
- **Database Questions**: Reference DATABASE.md
- **API Questions**: Check API_DOCUMENTATION.md

---

**Last Updated**: January 16, 2026
**SchoolApp AI** - An AI-powered Learning Management System
