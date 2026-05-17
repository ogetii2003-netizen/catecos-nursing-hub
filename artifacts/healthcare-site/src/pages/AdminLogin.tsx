import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { apiUrl } from "@/lib/api";
import { ShieldAlert, Loader2, AlertCircle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ServerState = "waking" | "ready" | "error";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [serverState, setServerState] = useState<ServerState>("waking");
  const [wakeAttempt, setWakeAttempt] = useState(0);
  const [loginError, setLoginError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("catecos_admin_token");
    if (token) setLocation("/admin/dashboard");
  }, [setLocation]);

  // Wake the API the moment the page loads — before user types anything
  const wakeServer = useCallback(async () => {
    setServerState("waking");
    for (let i = 1; i <= 6; i++) {
      setWakeAttempt(i);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);
        const res = await fetch(apiUrl("/api/healthz"), {
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timer);
        if (res.ok) {
          setServerState("ready");
          return;
        }
      } catch {
        // connection failed — wait and retry
      }
      if (i < 6) await new Promise(r => setTimeout(r, 5000));
    }
    setServerState("error");
  }, []);

  useEffect(() => {
    wakeServer();
    return () => { abortRef.current?.abort(); };
  }, [wakeServer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || serverState !== "ready") return;

    setIsLoggingIn(true);
    setLoginError(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.status === 401) {
        setLoginError("Wrong password. Please try again.");
        return;
      }
      if (!res.ok) {
        setLoginError(`Server error (${res.status}). Please try again.`);
        return;
      }
      const data = await res.json();
      localStorage.setItem("catecos_admin_token", data.token);
      setLocation("/admin/dashboard");
    } catch {
      clearTimeout(timer);
      // Server went back to sleep — re-wake and let user retry
      setLoginError("Connection dropped. Server is being re-awoken — please wait a moment and try again.");
      wakeServer();
    } finally {
      setIsLoggingIn(false);
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
          {serverState === "waking" && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <div>
                <p className="font-semibold text-slate-700">Starting up server…</p>
                <p className="text-sm text-slate-500 mt-1">
                  {wakeAttempt <= 1
                    ? "This takes up to 30 seconds on first visit."
                    : `Attempt ${wakeAttempt} of 6 — almost there…`}
                </p>
              </div>
            </div>
          )}

          {serverState === "error" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Server could not be reached after 6 attempts.
                </AlertDescription>
              </Alert>
              <Button variant="outline" onClick={wakeServer} className="gap-2">
                <Wifi className="w-4 h-4" /> Try again
              </Button>
            </div>
          )}

          {serverState === "ready" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Server is online
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                  required
                  disabled={isLoggingIn}
                  autoComplete="current-password"
                  data-testid="admin-password-input"
                />
              </div>

              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoggingIn}
                data-testid="admin-login-button"
              >
                {isLoggingIn ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in…</>
                ) : "Login"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
