import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, setAdminToken, clearAdminToken } from "@/lib/api";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.loginAdmin({ username, password });
      if (!res.ok || !res.token) {
        clearAdminToken();
        setError("Invalid username or password");
        return;
      }
      setAdminToken(res.token);
      onLogin();
    } catch {
      setError("Could not connect to API server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-border bg-card/40 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <Terminal className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-mono text-2xl">Admin Panel</CardTitle>
            <CardDescription>Sign in with your admin credentials to manage content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3 h-3" /> Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive font-mono">{error}</p>}
              <Button type="submit" className="w-full font-mono" disabled={loading}>
                {loading ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
