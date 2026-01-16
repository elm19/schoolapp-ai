import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Zap, CheckCircle2 } from "lucide-react";

async function AuthCheck() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/courses");
  }

  return null;
}

function HomeContent() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">SchoolApp AI</div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-slate-700"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Learn, Collaborate, <span className="text-blue-400">Succeed</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          A modern learning management system powered by AI. Create courses,
          collaborate on projects, and assess learning with interactive quizzes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg h-12 px-8"
            >
              Get Started Free
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              size="lg"
              variant="outline"
              className="text-lg h-12 px-8 border-slate-600 text-white hover:bg-slate-800"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <BookOpen className="w-10 h-10 text-blue-400 mb-2" />
              <CardTitle className="text-white">Course Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Create and manage courses with rich content support,
                announcements, and quizzes.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Users className="w-10 h-10 text-blue-400 mb-2" />
              <CardTitle className="text-white">Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Build team projects, assign participants, and track progress
                together in real-time.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Zap className="w-10 h-10 text-blue-400 mb-2" />
              <CardTitle className="text-white">AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Leverage AI capabilities for intelligent content extraction and
                assessment support.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <CheckCircle2 className="w-10 h-10 text-blue-400 mb-2" />
              <CardTitle className="text-white">Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Create interactive quizzes with instant feedback and
                comprehensive analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* User Types Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          Built for Educators & Learners
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* For Teachers */}
          <div className="rounded-lg bg-slate-800 border border-slate-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              For Educators
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Create and publish courses</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Manage student enrollment</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Track student progress</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Create assessments and quizzes</span>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div className="rounded-lg bg-slate-800 border border-slate-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">For Students</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Browse and enroll in courses</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Collaborate on team projects</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>Take interactive quizzes</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span>
                <span>View detailed feedback</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of educators and learners on SchoolApp AI today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-slate-100 text-lg h-12 px-8"
              >
                Sign Up Now
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg h-12 px-8 border-white text-white hover:bg-blue-600"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-slate-400 text-sm">
          <p>&copy; 2026 SchoolApp AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      }
    >
      <AuthCheck />
      <HomeContent />
    </Suspense>
  );
}
