"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserNameAction } from "@/lib/server-actions";
import { User } from "next-auth";

interface AccountSettingsFormProps {
  user: User;
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        await updateUserNameAction(name);
        // Refresh the page to get updated session data
        router.refresh();
        setMessage({
          type: "success",
          text: "Name updated successfully",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Failed to update name",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Information
        </h3>

        {/* Email (read-only) */}
        <div className="mb-4">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={user.email || ""}
            disabled
            className="mt-1 bg-gray-50"
          />
          <p className="mt-1 text-xs text-gray-500">
            Email cannot be changed
          </p>
        </div>

        {/* Name (editable) */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1"
              disabled={isPending}
            />
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isPending || name === user.name}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

    </div>
  );
}
