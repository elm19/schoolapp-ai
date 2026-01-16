"use client";
import { Copy, Eye, EyeOff, Plus, Trash2, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

interface ApiKey {
  id: string;
  key: string;
  created_at: string;
  usage: number;
  last_used?: string;
}

const APIKeySection = ({ apiKeys: initialKeys }: { apiKeys: ApiKey[] }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialKeys);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);

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

  const handleDeleteKey = async (keyId: string) => {
    const supabase = await createClient();
    try {
      const { error } = await supabase
        .from("gemini_keys")
        .delete()
        .eq("id", keyId);

      if (error) {
        toast.error("Failed to delete API key");
        return;
      }

      setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
      toast.success("API key deleted");
    } catch {
      toast.error("Failed to delete API key");
    }
  };

  const handleCreateNewKey = async () => {
    if (!newKeyValue.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    setIsCreating(true);
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to create an API key");
        setIsCreating(false);
        return;
      }

      // Insert the new key into the database
      const { data, error } = await supabase
        .from("gemini_keys")
        .insert({
          user_id: user.id,
          key: newKeyValue,
          usage: 0,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        toast.error("Failed to create API key");
        setIsCreating(false);
        return;
      }

      if (data && data.length > 0) {
        setApiKeys((prev) => [...prev, data[0]]);
        toast.success("API key created successfully");
        // Reset and close
        setNewKeyValue("");
        setIsCreateDialogOpen(false);
        setIsCreating(false);
      }
    } catch {
      toast.error("Failed to create API key");
      setIsCreating(false);
    }
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
    <>
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
          <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
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
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  variant="outline"
                >
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
                        <span>Created: {formatDate(apiKey.created_at)}</span>
                        <span>Used: {apiKey.usage} times</span>
                        {apiKey.last_used && (
                          <span>Last used: {formatDate(apiKey.last_used)}</span>
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

      {/* Create New Key Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Enter your API key. Make sure to copy it and store it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                placeholder="Enter your API key"
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                Your API key will be securely stored and used for integrations
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setNewKeyValue("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNewKey}
              disabled={isCreating || !newKeyValue.trim()}
            >
              {isCreating ? "Creating..." : "Create Key"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default APIKeySection;
