import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { apiUrl } from "@/lib/api";
import { ShieldAlert, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 8000;

async function loginRequest(password: string, signal: AbortSignal) {
  const res = await fetch(apiUrl("/api/admin/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
    signal,
  });
  return res;
}

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("catecos_admin_token");
    if (token) setLocation("/admin/dashboard");
  }, [setLocation]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setStatusMsg("Connecting to server…");

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await loginRequest(password, controller.signal);

        if (res.status === 401) {
          setError("Wrong password. Please try again.");
          setStatusMsg(null);
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? `Server error (${res.status}). Please try again.`);
          setStatusMsg(null);
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        localStorage.setItem("catecos_admin_token", data.token);
        setLocation("/admin/dashboard");
        return;

      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") {
          setIsLoading(false);
          setStatusMsg(null);
          return;
        }

        if (attempt < MAX_RETRIES) {
          setStatusMsg(`Server is waking up… retrying (${attempt}/${MAX_RETRIES - 1})`);
          await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        } else {
          setError("Server is unavailable right now. Please wait 30 seconds and try again.");
          setStatusMsg(null);
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
            <CardDescription>Catecos Nursing Hub</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                required
                disabled={isLoading}
                autoComplete="current-password"
                data-testid="admin-password-input"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {statusMsg && !error && (
              <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <AlertDescription>{statusMsg}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="admin-login-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait…
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
