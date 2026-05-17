import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { apiUrl } from "@/lib/api";
import { ShieldAlert, Loader2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const warmingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("catecos_admin_token");
    if (token) setLocation("/admin/dashboard");
  }, [setLocation]);

  useEffect(() => {
    return () => {
      if (warmingTimerRef.current) clearTimeout(warmingTimerRef.current);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setIsWarmingUp(false);
    setError(null);

    warmingTimerRef.current = setTimeout(() => setIsWarmingUp(true), 5000);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (warmingTimerRef.current) clearTimeout(warmingTimerRef.current);

      if (res.status === 401) {
        setError("Wrong password. Please try again.");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Server error (${res.status}). Please try again.`);
        return;
      }

      const data = await res.json();
      localStorage.setItem("catecos_admin_token", data.token);
      setLocation("/admin/dashboard");
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (warmingTimerRef.current) clearTimeout(warmingTimerRef.current);

      if (err instanceof Error && err.name === "AbortError") {
        setError("Server took too long to respond. Please try again — it should be faster now.");
      } else {
        setError("Could not connect to the server. Check your internet and try again.");
      }
    } finally {
      setIsLoading(false);
      setIsWarmingUp(false);
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

            {isWarmingUp && !error && (
              <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Server is warming up — this can take up to 30 seconds on first use. Please wait…
                </AlertDescription>
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
                  {isWarmingUp ? "Waiting for server…" : "Logging in…"}
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
