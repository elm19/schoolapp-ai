import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordChangeForm } from "@/components/settings/password-change-form";
import APIKeySection from "@/components/settings/APIKeySection";
import SchoolPlatformIntegration from "@/components/settings/school-platform-integration";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const user_d = (await supabase.auth.getUser()).data.user?.id;
  const keys = await supabase
    .from("gemini_keys")
    .select("*")
    .order("created_at", { ascending: false });
  const {data:platform} = await supabase
    .from("schoolapp")
    .select("*")
    .eq("user_id", user_d)
    .single();
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

        <APIKeySection apiKeys={apiKeys} />

        <SchoolPlatformIntegration
          integrationData={{
            isConnected: platform !== null,
            orgCode: platform?.code || "",
            orgName: "Schoolapp Ensam Meknes",
          }}
        />

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
