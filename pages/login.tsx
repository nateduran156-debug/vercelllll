import { useEffect, useState } from "react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    if (authError === "not_configured") {
      setConfigured(false);
      setError("Discord OAuth is not configured yet. Set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in your environment.");
    } else if (authError === "denied") {
      setError("Authorization was cancelled. Please try again.");
    } else if (authError) {
      setError("Something went wrong during login. Please try again.");
    }
    if (authError) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Luna Control</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in with Discord to manage your bot</p>
          </div>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {!configured ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
              <p className="text-sm font-semibold text-amber-400">Setup Required</p>
              <p className="text-xs text-amber-400/80">Add these environment variables in your Vercel project, then redeploy:</p>
              <div className="space-y-1.5">
                {["DISCORD_CLIENT_ID","DISCORD_CLIENT_SECRET","BOT_TOKEN","SESSION_SECRET"].map(v => (
                  <div key={v} className="bg-amber-950/40 rounded px-2 py-1">
                    <code className="text-xs text-amber-300 font-mono">{v}</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-400/70">See SETUP.md in the zip for the full step-by-step guide.</p>
            </div>
          ) : (
            <a
              href="/api/auth/discord"
              className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#5865F2" }}
              data-testid="button-discord-login"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Continue with Discord
            </a>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Only authorized server administrators can access this dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex-1 h-px bg-border" />
          <p className="text-xs text-muted-foreground">Luna Bot v4.2.0</p>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>
    </div>
  );
}
