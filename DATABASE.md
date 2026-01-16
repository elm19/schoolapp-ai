# Database Schema

## Overview

SchoolApp AI uses **PostgreSQL** via Supabase as its database. This document outlines the key tables, relationships, and schema structure.

## Core Tables

### 1. Profiles

Stores user account information and metadata.

```sql
profiles (
  id              UUID          PRIMARY KEY (references auth.users.id)
  email           VARCHAR       UNIQUE NOT NULL
  full_name       VARCHAR
  avatar_url      VARCHAR
  bio             TEXT
  user_type       ENUM          ('student', 'teacher', 'admin')
  institution     VARCHAR
  created_at      TIMESTAMP     DEFAULT NOW()
  updated_at      TIMESTAMP     DEFAULT NOW()
  last_login      TIMESTAMP
  is_active       BOOLEAN       DEFAULT TRUE
)
```

**Relationships**:

- Referenced by: courses, enrollments, projects, quiz_submissions

---

### 2. Courses

Stores course information and metadata.

```sql
courses (
  id              UUID          PRIMARY KEY
  creator_id      UUID          REFERENCES profiles(id)
  title           VARCHAR       NOT NULL
  description     TEXT
  content         TEXT
  category        VARCHAR
  credits         INTEGER
  duration        INTEGER       (in weeks)
  visibility      ENUM          ('public', 'private') DEFAULT 'public'
  created_at      TIMESTAMP     DEFAULT NOW()
  updated_at      TIMESTAMP     DEFAULT NOW()
  is_active       BOOLEAN       DEFAULT TRUE
  thumbnail_url   VARCHAR
)
```

**Relationships**:

- Instructor: profiles (creator_id)
- Has many: course_enrollments, quizzes, announcements

---

### 3. Course Enrollments

Tracks student enrollment in courses.

```sql
course_enrollments (
  id              UUID          PRIMARY KEY
  user_id         UUID          REFERENCES profiles(id) NOT NULL
  course_id       UUID          REFERENCES courses(id) NOT NULL
  enrolled_at     TIMESTAMP     DEFAULT NOW()
  status          ENUM          ('active', 'dropped', 'archived')
  progress        DECIMAL       (0-100, percentage)
  completed_at    TIMESTAMP
  UNIQUE(user_id, course_id)
)
```

**Relationships**:

- Student: profiles (user_id)
- Course: courses (course_id)

---

### 4. Quizzes

Stores quiz definitions and settings.

```sql
quizzes (
  id              UUID          PRIMARY KEY
  course_id       UUID          REFERENCES courses(id) NOT NULL
  created_by      UUID          REFERENCES profiles(id) NOT NULL
  title           VARCHAR       NOT NULL
  description     TEXT
  time_limit      INTEGER       (in minutes, nullable = unlimited)
  show_answers    BOOLEAN       DEFAULT FALSE
  num_attempts    INTEGER       DEFAULT 1
  passing_score   DECIMAL       DEFAULT 70
  difficulty      ENUM          ('easy', 'medium', 'hard')
  created_at      TIMESTAMP     DEFAULT NOW()
  updated_at      TIMESTAMP     DEFAULT NOW()
  is_published    BOOLEAN       DEFAULT FALSE
)
```

**Relationships**:

- Course: courses (course_id)
- Creator: profiles (created_by)
- Has many: quiz_questions, quiz_submissions

---

### 5. Quiz Questions

Stores individual quiz questions.

```sql
quiz_questions (
  id              UUID          PRIMARY KEY
  quiz_id         UUID          REFERENCES quizzes(id) NOT NULL
  question_text   TEXT          NOT NULL
  question_type   ENUM          ('multiple_choice', 'true_false', 'short_answer', 'essay')
  options         JSON          (for multiple choice)
  correct_answer  VARCHAR       NOT NULL
  explanation     TEXT
  points          DECIMAL       DEFAULT 1
  order           INTEGER
  created_at      TIMESTAMP     DEFAULT NOW()
)
```

**Relationships**:

- Quiz: quizzes (quiz_id)

---

### 6. Quiz Submissions

Tracks student quiz attempts.

```sql
quiz_submissions (
  id              UUID          PRIMARY KEY
  quiz_id         UUID          REFERENCES quizzes(id) NOT NULL
  user_id         UUID          REFERENCES profiles(id) NOT NULL
  answers         JSON
  score           DECIMAL
  percentage      DECIMAL       (0-100)
  time_spent      INTEGER       (in seconds)
  submitted_at    TIMESTAMP     DEFAULT NOW()
  status          ENUM          ('submitted', 'grading', 'graded')
  teacher_feedback TEXT
)
```

**Relationships**:

- Quiz: quizzes (quiz_id)
- Student: profiles (user_id)

---

### 7. Projects

Stores project information.

```sql
projects (
  id              UUID          PRIMARY KEY
  creator_id      UUID          REFERENCES profiles(id) NOT NULL
  course_id       UUID          REFERENCES courses(id)
  title           VARCHAR       NOT NULL
  description     TEXT
  status          ENUM          ('planning', 'active', 'completed', 'archived')
  start_date      DATE
  deadline        DATE
  visibility      ENUM          ('private', 'team', 'public')
  created_at      TIMESTAMP     DEFAULT NOW()
  updated_at      TIMESTAMP     DEFAULT NOW()
)
```

**Relationships**:

- Creator: profiles (creator_id)
- Course: courses (course_id)
- Has many: project_participants, project_progress

---

### 8. Project Participants

Tracks team members on projects.

```sql
project_participants (
  id              UUID          PRIMARY KEY
  project_id      UUID          REFERENCES projects(id) NOT NULL
  user_id         UUID          REFERENCES profiles(id) NOT NULL
  role            ENUM          ('owner', 'lead', 'member')
  joined_at       TIMESTAMP     DEFAULT NOW()
  contribution    DECIMAL       (0-100, percentage)
  UNIQUE(project_id, user_id)
)
```

**Relationships**:

- Project: projects (project_id)
- Team member: profiles (user_id)

---

### 9. Project Progress

Tracks progress updates on projects.

```sql
project_progress (
  id              UUID          PRIMARY KEY
  project_id      UUID          REFERENCES projects(id) NOT NULL
  updated_by      UUID          REFERENCES profiles(id) NOT NULL
  progress_text   TEXT          NOT NULL (markdown format)
  percentage      DECIMAL       (0-100)
  created_at      TIMESTAMP     DEFAULT NOW()
  updated_at      TIMESTAMP     DEFAULT NOW()
)
```

**Relationships**:

- Project: projects (project_id)
- Author: profiles (updated_by)

---

### 10. Announcements

Stores course announcements.

```sql
announcements (
  id              UUID          PRIMARY KEY
  course_id       UUID          REFERENCES courses(id) NOT NULL
  creator_id      UUID          REFERENCES profiles(id) NOT NULL
  title           VARCHAR       NOT NULL
  content         TEXT          NOT NULL
  priority        ENUM          ('normal', 'high', 'urgent') DEFAULT 'normal'
  created_at      TIMESTAMP     DEFAULT NOW()
  updated_at      TIMESTAMP     DEFAULT NOW()
  expires_at      TIMESTAMP
)
```

**Relationships**:

- Course: courses (course_id)
- Author: profiles (creator_id)

---

### 11. API Keys

Stores user's Google Gemini API keys securely.

```sql
gemini_keys (
  id              UUID          PRIMARY KEY
  user_id         UUID          REFERENCES profiles(id) NOT NULL UNIQUE
  key             VARCHAR       NOT NULL (encrypted)
  created_at      TIMESTAMP     DEFAULT NOW()
  last_used       TIMESTAMP
  is_active       BOOLEAN       DEFAULT TRUE
)
```

**Relationships**:

- User: profiles (user_id)

---

### 12. User Preferences

Stores user-specific settings.

```sql
user_preferences (
  id              UUID          PRIMARY KEY
  user_id         UUID          REFERENCES profiles(id) UNIQUE NOT NULL
  theme           ENUM          ('light', 'dark', 'auto') DEFAULT 'auto'
  email_notifications BOOLEAN   DEFAULT TRUE
  course_notifications BOOLEAN  DEFAULT TRUE
  project_notifications BOOLEAN DEFAULT TRUE
  language        VARCHAR       DEFAULT 'en'
  timezone        VARCHAR
  updated_at      TIMESTAMP     DEFAULT NOW()
)
```

**Relationships**:

- User: profiles (user_id)

---

## Entity Relationships

### Enrollment Flow

```
profiles (student)
    ↓ enrolls in
course_enrollments
    ↓ for
courses
```

### Quiz Flow

```
courses
    ↓ contains
quizzes
    ↓ contains
quiz_questions
    ↓ answered by
quiz_submissions
    ↓ from
profiles (student)
```

### Project Flow

```
profiles (creator)
    ↓ creates
projects
    ↓ has
project_participants
    ↓ are
profiles (team members)
    ↓ update
project_progress
```

---

## Indexing Strategy

### Primary Keys

- All tables use UUID primary keys
- Foreign keys are properly indexed

### Performance Indexes

```sql
-- Course lookups
CREATE INDEX idx_courses_creator ON courses(creator_id);
CREATE INDEX idx_courses_visibility ON courses(visibility);

-- Enrollment lookups
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);

-- Quiz lookups
CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quiz_submissions_user ON quiz_submissions(user_id);

-- Project lookups
CREATE INDEX idx_projects_creator ON projects(creator_id);
CREATE INDEX idx_project_participants_user ON project_participants(user_id);
```

---

## Row-Level Security (RLS)

The database implements RLS policies to protect data:

### Course Access

- Public courses: readable by all
- Private courses: readable only by enrolled students and teacher
- Creation: restricted to teachers/admins

### Quiz Access

- Readable by enrolled students
- Writable only by course instructor

### Project Access

- Readable by team members
- Writable by project owner/leads

### User Profiles

- User can read their own profile
- Admins can read all profiles
- User can update their own profile

---

## Data Validation

### Constraints

- Email must be unique
- Course title is required
- Quiz score must be 0-100
- Deadline must be after start date
- User can't enroll twice in same course

### Triggers

- Update `updated_at` timestamp on record changes
- Cascade delete on course deletion
- Prevent deletion of courses with submissions

---

## Backup Strategy

- Daily automated backups
- 30-day backup retention
- Point-in-time recovery available
- Test restores monthly

---

## Performance Considerations

1. **Pagination**: Implement for large result sets
2. **Indexing**: Covered above
3. **Query Optimization**: Use specific fields, avoid SELECT \*
4. **Caching**: Cache user preferences and course metadata
5. **Archiving**: Archive old submissions after 1 year

---

## Migration Strategy

- Use database migrations for schema changes
- Version control all schema changes
- Test migrations in staging first
- Rollback plan for each migration

---

## Future Extensions

- User activity audit log
- Course discussion forums
- File upload storage
- Email notification logs
- System analytics tables
