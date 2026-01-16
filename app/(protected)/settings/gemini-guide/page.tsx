import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function GeminiGuide() {
  return (
    <ContentLayout title="How to Get a Gemini API Key">
      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <p className="text-muted-foreground mt-2">
            Follow this step-by-step guide to obtain your Google Gemini API key
            and add it to your account.
          </p>
        </div>

        {/* Prerequisites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Before you start, make sure you have:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>A Google account</li>
              <li>Access to Google Cloud Console</li>
              <li>
                A valid payment method (for billing purposes, though some free
                tier options are available)
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Step-by-step guide */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step-by-Step Instructions</h2>

          {/* Step 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Step 1: Go to Google AI Studio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The easiest way to get a Gemini API key is through Google AI
                Studio.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between"
              >
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Google AI Studio
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <p className="text-sm">
                This is the quickest way to get started. Google AI Studio
                provides a free tier for the Gemini API.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Step 2: Create a New API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Click on &quot;Get API Key&quot; button</li>
                <li>
                  Select &quot;Create new API key in new project&quot; or choose
                  an existing project
                </li>
                <li>
                  Google will automatically create a new project for you (if
                  creating new)
                </li>
                <li>Your API key will be generated and displayed</li>
              </ol>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Step 3: Copy Your API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">Once your API key is generated:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Click the copy icon next to your API key to copy it to
                  clipboard
                </li>
                <li>
                  Keep this key safe and secure - don&apos;t share it with
                  others
                </li>
                <li>You can regenerate keys anytime if needed</li>
              </ol>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Step 4: Add Your Key to SchoolApp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Go to the{" "}
                  <Link
                    href="/settings"
                    className="text-blue-600 hover:underline"
                  >
                    Settings page
                  </Link>
                </li>
                <li>Scroll to the &quot;Gemini API Keys&quot; section</li>
                <li>Click &quot;New Key&quot;</li>
                <li>Paste your Gemini API key in the dialog</li>
                <li>Click &quot;Create Key&quot; to save it</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Alternative Method */}
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-lg">
              Alternative: Google Cloud Console
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              If you prefer using Google Cloud Console for more control:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Go to{" "}
                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Cloud Console
                </a>
              </li>
              <li>Create a new project or select an existing one</li>
              <li>
                Enable the &quot;Generative Language API&quot; for your project
              </li>
              <li>Navigate to &quot;Credentials&quot; in the left sidebar</li>
              <li>
                Click &quot;Create Credentials&quot; and select &quot;API
                Key&quot;
              </li>
              <li>Copy the generated API key</li>
              <li>Add it to SchoolApp following Step 4 above</li>
            </ol>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle className="text-lg">⚠️ Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Keep your API key private:</strong> Never share your API
              key publicly or with untrusted sources. Anyone with your key can
              make requests to Google&apos;s API on your behalf.
            </p>
            <p>
              <strong>Usage limits:</strong> Google Gemini API has free tier
              usage limits. Monitor your usage in Google AI Studio or Google
              Cloud Console to avoid unexpected charges.
            </p>
            <p>
              <strong>Secure storage:</strong> Your API key is encrypted and
              stored securely in our servers. It will only be used for the
              AI-powered features in SchoolApp.
            </p>
          </CardContent>
        </Card>

        {/* Ready to Continue */}
        <Card className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="text-lg">Ready to Continue?</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full justify-between">
              <Link href="/settings">
                Go to Settings
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
