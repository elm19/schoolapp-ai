"use client";

import { useState } from "react";
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
import {
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Zap,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordChangeForm } from "@/components/settings/password-change-form";

interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
  usageCount: number;
  lastUsed?: string;
}

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key_1",
      key: "sk_test_51234567890abcdef",
      createdAt: "2024-12-15",
      usageCount: 42,
      lastUsed: "2024-12-17",
    },
    {
      id: "key_2",
      key: "sk_test_98765432109abcdef",
      createdAt: "2024-12-10",
      usageCount: 128,
      lastUsed: "2024-12-16",
    },
  ]);

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // API Key operations
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const handleToggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const handleDeleteKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
    toast.success("API key deleted");
  };

  const handleCreateNewKey = () => {
    // TODO: Implement actual key creation
    toast.info("New API key creation - Coming soon!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

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

        {/* API Keys Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your API keys for integrations and third-party services
              </CardDescription>
            </div>
            <Button onClick={handleCreateNewKey} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Key
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No API keys created yet
                  </p>
                  <Button onClick={handleCreateNewKey} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {showKeys[apiKey.id]
                              ? apiKey.key
                              : maskApiKey(apiKey.key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleKeyVisibility(apiKey.id)}
                            className="h-8 w-8 p-0"
                          >
                            {showKeys[apiKey.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyKey(apiKey.key)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                          <span>Created: {formatDate(apiKey.createdAt)}</span>
                          <span>Used: {apiKey.usageCount} times</span>
                          {apiKey.lastUsed && (
                            <span>
                              Last used: {formatDate(apiKey.lastUsed)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
