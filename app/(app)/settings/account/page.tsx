import { CheckCircle2, LogOut, User as UserIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { signOutAction } from "@/lib/server-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { AccountSettingsForm } from "@/components/account-settings-form";

export const metadata: Metadata = {
  title: "todone / Account Settings",
};

export default async function AccountSettingsPage() {
  // Check authentication
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/tasks"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="hidden md:block text-2xl font-bold text-gray-900 ml-3">
                  todone
                </h1>
              </Link>
              <span className="text-gray-400">/</span>
              <h2 className="text-xl font-semibold text-gray-700">
                Account Settings
              </h2>
            </div>
            <div className="flex items-center space-x-1 md:space-x-3">
              <form action={signOutAction}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Sign out</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Account Settings
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your profile information
                </p>
              </div>
            </div>
            <Link href="/tasks">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Account Settings Form */}
        <AccountSettingsForm user={session.user} />
      </div>
    </div>
  );
}
