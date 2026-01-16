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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link as LinkIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface IntegrationData {
  isConnected: boolean;
  orgCode?: string;
  orgName?: string;
}

export default function SchoolPlatformIntegration({
  integrationData,
}: {
  integrationData: IntegrationData;
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"org-selection" | "credentials">(
    "org-selection"
  );

  const handleOrgSelect = (orgValue: string) => {
    setSelectedOrg(orgValue);
    setStep("credentials");
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrg || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }


      
      try {
        const response = await fetch('/api/schoolapp-connect', {
              method: 'POST',
              body: new URLSearchParams({
                  email: email,
                  password: password
              })
        });
        if (!response.ok) {
            throw new Error('Failed to connect to school platform');
        }
          console.log('Successfully connected to school platform');
          console.log(await response.json());
      } catch (error) {
          console.error('Error connecting to school platform:', error);
          toast.error("Failed to connect to school platform");
          return;
      }
          

    toast.success("Connecting to school platform...");

    // Reset form and close sheet
    setTimeout(() => {
      setEmail("");
      setPassword("");
      setSelectedOrg("");
      setStep("org-selection");
      setIsSheetOpen(false);
      toast.success("Successfully connected to school platform!");
    }, 1500);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      // Reset form when closing
      setEmail("");
      setPassword("");
      setSelectedOrg("");
      setStep("org-selection");
    }
  };

  return (
    <Card className="border-blue-200 dark:border-blue-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5" />
          School Platform Integration
        </CardTitle>
        <CardDescription>
          Connect your school platform to sync courses and assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 w-full">
        <div className="space-y-6">
          {/* Connection Status */}
          {integrationData.isConnected ? (
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-green-900 dark:text-green-100">
                    Connected
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    You are currently connected to{" "}
                    <span className="font-semibold">
                      {integrationData.orgName}
                    </span>{" "}
                                      (Code: <span className="font-mono font-semibold">
                        {integrationData.orgCode}
                    </span>
                    )
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => {
                    toast.success("Disconnected from school platform");
                  }}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
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
          )}

          <Separator />

          {/* Connection Sheet */}
          <Sheet open={isSheetOpen}  onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              <Button className="w-full">
                {integrationData.isConnected
                  ? "Change Organization"
                  : "Connect to an Organization"}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-md px-2">
              <SheetHeader>
                <SheetTitle>
                  {step === "org-selection"
                    ? "Select Organization"
                    : "Enter Credentials"}
                </SheetTitle>
                <SheetDescription>
                  {step === "org-selection"
                    ? "Choose your school organization"
                    : `Enter your credentials for ${selectedOrg}`}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-6">
                {step === "org-selection" ? (
                  <>
                    {/* Organization Selection Step */}
                    <div className="space-y-3">
                      <Label htmlFor="org-select">Organization</Label>
                      <Select
                        value={selectedOrg}
                        onValueChange={handleOrgSelect}
                      >
                        <SelectTrigger id="org-select">
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ensam-meknes">
                            Schoolapp Ensam Meknes
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Info Box */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex gap-3">
                        <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2 text-sm">
                          <p className="text-blue-900 dark:text-blue-100">
                            <strong>Currently Available:</strong> Only Schoolapp
                            Ensam Meknes is available for integration at the
                            moment.
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            If you&apos;d like to integrate your own organization,
                            please{" "}
                            <a
                              href="mailto:support@schoolapp.com"
                              className="underline hover:no-underline font-semibold"
                            >
                              contact us
                            </a>
                            . We&apos;d love to help!
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        if (selectedOrg) {
                          handleOrgSelect(selectedOrg);
                        } else {
                          toast.error("Please select an organization");
                        }
                      }}
                      className="w-full"
                      disabled={!selectedOrg}
                    >
                      Continue
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Credentials Step */}
                    <form onSubmit={handleConnect} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@school.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Your school email address
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Your school account password
                        </p>
                      </div>

                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex gap-3">
                          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-yellow-800 dark:text-yellow-200">
                            Your credentials are encrypted and securely stored.
                            They are never shared with third parties.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep("org-selection")}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button type="submit" className="flex-1">
                          Connect
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
}
