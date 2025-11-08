import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInForm from "./signin-form";

export default function SignIn() {
  // Check server-side environment variable at runtime
  const showDemoUser = process.env.ENABLE_DEMO_USER === "true";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-brand">unwhelm</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to manage your tasks
          </p>
        </div>

        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Loading...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          }
        >
          <SignInForm showDemoUser={showDemoUser} />
        </Suspense>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
