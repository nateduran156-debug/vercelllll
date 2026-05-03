import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Shield, Ban, UserX, Hash, Tag, Bot, Webhook, Users, AtSign, Plus, X, Info } from "lucide-react";

const protections = [
  { key: "antiban", label: "Anti-Ban", desc: "Prevent mass banning of members", icon: Ban, severity: "critical" },
  { key: "antikick", label: "Anti-Kick", desc: "Prevent mass kicking of members", icon: UserX, severity: "critical" },
  { key: "antichannelcreate", label: "Anti-Channel Create", desc: "Block unauthorized channel creation", icon: Hash, severity: "high" },
  { key: "antichanneldelete", label: "Anti-Channel Delete", desc: "Block unauthorized channel deletion", icon: Hash, severity: "high" },
  { key: "antichannelupdate", label: "Anti-Channel Update", desc: "Block unauthorized channel edits", icon: Hash, severity: "medium" },
  { key: "antirolecreate", label: "Anti-Role Create", desc: "Block unauthorized role creation", icon: Tag, severity: "high" },
  { key: "antiroledelete", label: "Anti-Role Delete", desc: "Block unauthorized role deletion", icon: Tag, severity: "high" },
  { key: "antiroleupdate", label: "Anti-Role Update", desc: "Block unauthorized role permission edits", icon: Tag, severity: "high" },
  { key: "antibotadd", label: "Anti-Bot Add", desc: "Prevent unauthorized bots from joining", icon: Bot, severity: "critical" },
  { key: "antiwebhook", label: "Anti-Webhook", desc: "Block unauthorized webhook creation", icon: Webhook, severity: "medium" },
  { key: "antiprune", label: "Anti-Prune", desc: "Prevent mass member pruning", icon: Users, severity: "critical" },
  { key: "anti_everyone", label: "Anti-Everyone", desc: "Prevent unauthorized @everyone pings", icon: AtSign, severity: "medium" },
];

const severityConfig = {
  critical: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  high: { label: "High", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  medium: { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
};

export default function Antinuke() {
  const [globalEnabled, setGlobalEnabled] = useLocalStorage("luna_antinuke_global", true);
  const [trustedUsers, setTrustedUsers] = useLocalStorage<string[]>("luna_antinuke_trusted", []);
  const [trustedBots, setTrustedBots] = useLocalStorage<string[]>("luna_antinuke_trusted_bots", []);
  const [userInput, setUserInput] = useState("");
  const [botInput, setBotInput] = useState("");
  const [threshold, setThreshold] = useLocalStorage("luna_antinuke_threshold", "5");
  const [action, setAction] = useLocalStorage("luna_antinuke_action", "ban");

  const enabled = protections.filter(p => {
    const [val] = [useProtectionState(p.key)];
    return val;
  });

  const addTrustedUser = () => {
    const t = userInput.trim();
    if (t && !trustedUsers.includes(t)) { setTrustedUsers([...trustedUsers, t]); setUserInput(""); }
  };
  const addTrustedBot = () => {
    const t = botInput.trim();
    if (t && !trustedBots.includes(t)) { setTrustedBots([...trustedBots, t]); setBotInput(""); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Antinuke</h1>
          <p className="text-muted-foreground mt-2">Protect your server from raids, nukes, and unauthorized destructive actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Protection</span>
          <Switch checked={globalEnabled} onCheckedChange={setGlobalEnabled} data-testid="switch-antinuke-global" />
          <span className={`text-sm font-semibold ${globalEnabled ? "text-green-400" : "text-muted-foreground"}`}>
            {globalEnabled ? "Armed" : "Disabled"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {protections.map(p => <ProtectionCard key={p.key} protection={p} globalEnabled={globalEnabled} />)}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Punishment Action</CardTitle>
            <CardDescription>What happens to a user who triggers antinuke.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["ban", "kick", "strip_roles", "timeout"].map(a => (
              <button
                key={a}
                onClick={() => setAction(a)}
                data-testid={`button-action-${a}`}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left capitalize ${action === a ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${action === a ? "bg-primary" : "bg-muted-foreground/30"}`} />
                {a.replace("_", " ")}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Action Threshold</CardTitle>
            <CardDescription>Number of destructive actions before punishment triggers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={20}
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                className="w-24 text-center text-lg font-bold"
                data-testid="input-threshold"
              />
              <div className="text-sm text-muted-foreground">
                <p>actions within <span className="text-foreground font-medium">10 seconds</span></p>
                <p className="text-xs mt-0.5">before punishment is applied</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
              <Info className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-400/90">Setting too low may trigger false positives during legitimate admin activity.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Trusted Users
            </CardTitle>
            <CardDescription>These users are exempt from antinuke checks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="User ID or @username" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTrustedUser()} data-testid="input-trusted-user" />
              <Button size="sm" onClick={addTrustedUser} data-testid="button-add-trusted-user"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
              {trustedUsers.length === 0 ? <p className="text-xs text-muted-foreground">No trusted users added.</p> :
                trustedUsers.map(u => (
                  <Badge key={u} variant="secondary" className="flex items-center gap-1 font-mono text-xs" data-testid={`badge-user-${u}`}>
                    {u}
                    <button onClick={() => setTrustedUsers(trustedUsers.filter(x => x !== u))} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
                  </Badge>
                ))
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" /> Trusted Bots
            </CardTitle>
            <CardDescription>These bots are exempt from antibotadd checks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="Bot ID or @botname" value={botInput} onChange={e => setBotInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTrustedBot()} data-testid="input-trusted-bot" />
              <Button size="sm" onClick={addTrustedBot} data-testid="button-add-trusted-bot"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[2rem]">
              {trustedBots.length === 0 ? <p className="text-xs text-muted-foreground">No trusted bots added.</p> :
                trustedBots.map(b => (
                  <Badge key={b} variant="secondary" className="flex items-center gap-1 font-mono text-xs" data-testid={`badge-bot-${b}`}>
                    {b}
                    <button onClick={() => setTrustedBots(trustedBots.filter(x => x !== b))} className="hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
                  </Badge>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function useProtectionState(key: string): [boolean, (v: boolean) => void] {
  return useLocalStorage(`luna_antinuke_${key}`, true);
}

function ProtectionCard({ protection, globalEnabled }: { protection: typeof protections[0]; globalEnabled: boolean }) {
  const [enabled, setEnabled] = useProtectionState(protection.key);
  const cfg = severityConfig[protection.severity as keyof typeof severityConfig];
  const Icon = protection.icon;

  return (
    <Card className={`bg-card border-border transition-opacity ${!globalEnabled ? "opacity-40" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-1.5 rounded-md flex-shrink-0 ${enabled && globalEnabled ? cfg.bg : "bg-secondary"}`}>
              <Icon className={`w-3.5 h-3.5 ${enabled && globalEnabled ? cfg.color : "text-muted-foreground"}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{protection.label}</p>
              <p className="text-xs text-muted-foreground truncate">{protection.desc}</p>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} disabled={!globalEnabled} data-testid={`switch-${protection.key}`} />
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${cfg.color} border-current/30`}>{cfg.label}</Badge>
          <span className={`text-[10px] font-medium ${enabled && globalEnabled ? "text-green-400" : "text-muted-foreground"}`}>
            {enabled && globalEnabled ? "Active" : "Off"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
