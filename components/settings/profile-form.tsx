"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";


export function ProfileForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || "");
          setUsername(user.user_metadata?.username || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const supabase =  createClient();

      // Update user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          username: username,
        },
      });

      if (authError) {
        toast.error("Failed to update profile in auth");
        return;
      }

      // Get the user to update profiles table
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Update the profiles table
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            username: username,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (profileError) {
          toast.error("Failed to update profile in database");
          return;
        }
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              placeholder="Enter your email"
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed from this page
            </p>
          </div>
          <Button onClick={handleUpdateProfile} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
