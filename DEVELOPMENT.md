# Development Guide

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher (or yarn/pnpm)
- **Git**: For version control
- **VS Code**: Recommended editor
- **Supabase Account**: [Create free account](https://supabase.com)
- **Google AI API Key**: [Get from Google Cloud Console](https://makersuite.google.com/app/apikey)

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd schoolapp-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**
   Create `.env.local` in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_GEMINI_API_KEY=your_google_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure Overview

```
schoolapp-ai/
├── app/                 # Next.js App Router
├── components/          # React components
├── lib/                 # Utilities and helpers
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
├── constants/           # App constants
├── public/              # Static files
└── styles/              # Global styles
```

### Key Directories

- `app/(protected)/` - Authentication-required routes
- `app/api/` - Backend endpoints
- `components/ui/` - Base UI components (shadcn/ui)
- `lib/supabase/` - Database and auth clients

---

## Running the Application

### Development Mode

```bash
npm run dev
```

- Hot reload enabled
- Development database connected
- Verbose logging enabled

### Production Build

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

---

## Key Technologies

### Frontend Stack

- **React 19** with Next.js 16 App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** + **Zod** for form validation
- **Zustand** for state management

### Backend Stack

- **Supabase** (PostgreSQL) for database
- **Supabase Auth** for authentication
- **Next.js API Routes** for serverless backend
- **Google Generative AI** for AI features

### UI Components

- **Shadcn/ui** - Pre-built accessible components
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library

---

## Development Workflow

### Creating a New Feature

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Create component**

   ```bash
   # Create in components/ directory
   components/my-feature.tsx
   ```

3. **Add types**

   ```bash
   # Add TypeScript types
   types/my-feature.ts
   ```

4. **Create API endpoint (if needed)**

   ```bash
   app/api/my-endpoint/route.ts
   ```

5. **Test locally**

   ```bash
   npm run dev
   # Navigate to your feature in browser
   ```

6. **Lint and type-check**
   ```bash
   npm run lint
   ```

---

## Component Development

### Creating UI Components

Place reusable components in `components/ui/`:

```tsx
// components/ui/my-button.tsx
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function MyButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: MyButtonProps) {
  return (
    <button
      className={cn(
        "font-semibold rounded-lg transition-colors",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" && "bg-gray-200 text-black hover:bg-gray-300",
        size === "sm" && "px-3 py-1 text-sm",
        size === "md" && "px-4 py-2 text-base",
        size === "lg" && "px-6 py-3 text-lg",
        className
      )}
      {...props}
    />
  );
}
```

### Creating Page Components

Pages go in `app/(protected)/[feature]/page.tsx`:

```tsx
// app/(protected)/my-feature/page.tsx
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function PageContent() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">My Feature</h1>
      {/* Page content */}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
```

---

## Database Operations

### Using Supabase Client

#### Server-side (Recommended)

```tsx
import { createClient } from "@/lib/supabase/server";

async function getData() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("visibility", "public");

  if (error) throw error;
  return data;
}
```

#### Client-side

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

export function MyComponent() {
  const supabase = createClient();

  const handleClick = async () => {
    const { data, error } = await supabase.from("courses").select("*");
  };

  return <button onClick={handleClick}>Load</button>;
}
```

### Common Operations

**Select**

```tsx
const { data } = await supabase
  .from("courses")
  .select("id, title, description")
  .eq("visibility", "public")
  .order("created_at", { ascending: false })
  .limit(10);
```

**Insert**

```tsx
const { data, error } = await supabase
  .from("courses")
  .insert([{ title: "Course 1", description: "..." }])
  .select();
```

**Update**

```tsx
const { data, error } = await supabase
  .from("courses")
  .update({ title: "New Title" })
  .eq("id", courseId)
  .select();
```

**Delete**

```tsx
const { error } = await supabase.from("courses").delete().eq("id", courseId);
```

---

## Form Handling

Using React Hook Form + Zod:

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10),
  visibility: z.enum(["public", "private"]),
});

type FormData = z.infer<typeof schema>;

export function CourseForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/create-course", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        // Handle success
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("title")} placeholder="Course Title" />
      {form.formState.errors.title && (
        <span>{form.formState.errors.title.message}</span>
      )}
      <button type="submit">Create Course</button>
    </form>
  );
}
```

---

## Authentication

### Checking Authentication

**Server Component**

```tsx
import { createClient } from "@/lib/supabase/server";

async function ProtectedComponent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return <div>Hello {user.email}</div>;
}
```

**Client Component**

```tsx
"use client";
import { useAuthUser } from "@/hooks/use-authuser";

export function MyComponent() {
  const { user, loading } = useAuthUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Hello {user.email}</div>;
}
```

---

## API Route Development

Creating API endpoints in `app/api/`:

```tsx
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request
    const body = await req.json();

    // Validate input
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Business logic
    const { data, error } = await supabase
      .from("courses")
      .insert([{ title: body.title, creator_id: user.id }])
      .select();

    if (error) throw error;

    // Success response
    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## Using Hooks

### useAuthUser Hook

```tsx
"use client";
import { useAuthUser } from "@/hooks/use-authuser";

export function MyComponent() {
  const { user, loading, error } = useAuthUser();

  if (loading) return <div>Loading...</div>;

  return <div>{user?.email}</div>;
}
```

### useSidebar Hook

```tsx
"use client";
import { useSidebar } from "@/hooks/use-sidebar";

export function Layout() {
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      <button onClick={toggle}>Toggle</button>
      {isOpen && <Sidebar />}
    </>
  );
}
```

---

## Testing

### Manual Testing

1. Create test user accounts
2. Test user flows (signup, login, course enrollment, quiz)
3. Test protected routes
4. Test error scenarios

### Best Practices

- Test on multiple browsers
- Test on mobile devices
- Check console for errors
- Verify API responses

---

## Debugging

### Using Browser DevTools

- React Developer Tools
- Network tab for API calls
- Console for errors

### Server-side Logging

```tsx
console.log("Debug info:", variable);
```

### Supabase Logs

- Check Supabase dashboard for query logs
- Monitor API usage and errors

---

## Common Issues & Solutions

### Authentication Issues

**Problem**: User not persisting between page refreshes
**Solution**: Clear cookies, check `.env.local` configuration, restart dev server

### Database Errors

**Problem**: "Permission denied" errors
**Solution**: Check RLS policies, verify user role, check table permissions

### Styling Issues

**Problem**: Tailwind classes not applying
**Solution**: Restart dev server, check `tailwind.config.ts`, verify class spelling

---

## Performance Tips

1. **Use Server Components** by default
2. **Code Splitting**: Automatic with App Router
3. **Image Optimization**: Use Next.js Image component
4. **Lazy Loading**: Use React.lazy for large components
5. **Caching**: Leverage Next.js caching strategies

---

## Code Style

### TypeScript

```tsx
// Use interfaces for objects
interface Course {
  id: string;
  title: string;
}

// Use types for unions
type UserRole = "student" | "teacher" | "admin";
```

### Components

```tsx
// Use named exports
export function MyComponent() {}

// Use destructuring
function MyComponent({ title, children }: Props) {}
```

### Naming

- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case for components

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Production build
npm start                # Start production server

# Quality
npm run lint             # Run linter
npx tsc --noEmit         # Type check

# Database
# Use Supabase CLI for migrations
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Shadcn/ui](https://ui.shadcn.com)

---

## Getting Help

1. Check existing documentation (README, FEATURES, API_DOCUMENTATION)
2. Review similar implementations in codebase
3. Check Supabase documentation
4. Create GitHub issue with detailed description

---

**Happy coding! 🚀**
