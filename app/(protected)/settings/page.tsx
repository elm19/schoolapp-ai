import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Link as LinkIcon } from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordChangeForm } from "@/components/settings/password-change-form";
import APIKeySection from "@/components/settings/APIKeySection";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const keys = await supabase
    .from("gemini_keys")
    .select("*")
    .order("created_at", { ascending: false });
  const apiKeys = keys.data || [];
  return (
    <ContentLayout title={"Settings"}>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Section */}
        <ProfileForm />

        {/* Password Section */}
        <PasswordChangeForm />

        <APIKeySection
          apiKeys={apiKeys}
        />

        {/* School Platform Connection Section */}
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              School Platform Integration
            </CardTitle>
            <CardDescription>
              Connect to your school platform to sync courses and assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-sm">Not Connected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your school platform is not connected yet
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Connection Form */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Platform Selection
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { name: "Canvas", id: "canvas" },
                      { name: "Blackboard", id: "blackboard" },
                      { name: "Moodle", id: "moodle" },
                      { name: "Google Classroom", id: "google_classroom" },
                    ].map((platform) => (
                      <Button
                        key={platform.id}
                        variant="outline"
                        className="justify-start h-auto py-3"
                        disabled
                      >
                        <span>{platform.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="platform-url">Platform URL</Label>
                  <Input
                    id="platform-url"
                    placeholder="https://your-school.instructure.com"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform-token">API Token / Key</Label>
                  <Input
                    id="platform-token"
                    type="password"
                    placeholder="Enter your platform API token"
                    disabled
                  />
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    This feature is coming soon. You&apos;ll be able to securely
                    connect your school platform to sync your courses and
                    assignments automatically.
                  </p>
                </div>

                <Button disabled className="w-full">
                  Connect Platform
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" disabled>
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
