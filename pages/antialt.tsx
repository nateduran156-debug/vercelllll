import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ShieldAlert, Clock, Ban, UserX, MessageSquare, Info, AlertTriangle } from "lucide-react";

export default function AntiAlt() {
  const [enabled, setEnabled] = useLocalStorage("luna_antialt_enabled", false);
  const [minAge, setMinAge] = useLocalStorage("luna_antialt_minage", 7);
  const [action, setAction] = useLocalStorage("luna_antialt_action", "kick");
  const [sendDm, setSendDm] = useLocalStorage("luna_antialt_dm", true);
  const [dmMessage, setDmMessage] = useLocalStorage("luna_antialt_dm_msg", "Your account is too new to join {server}. Please rejoin after your account is at least {days} days old.");
  const [logChannel, setLogChannel] = useLocalStorage("luna_antialt_log", "");
  const [whitelistRoles, setWhitelistRoles] = useLocalStorage<string[]>("luna_antialt_whitelist", []);
  const [roleInput, setRoleInput] = useState_mock("");
  const [verifyRole, setVerifyRole] = useLocalStorage("luna_antialt_verify_role", "");
  const [useVerify, setUseVerify] = useLocalStorage("luna_antialt_use_verify", false);

  function useState_mock(def: string): [string, (v: string) => void] {
    const [v, setV] = useLocalStorage("luna_antialt_role_input", def);
    return [v, setV];
  }

  const addWhitelist = () => {
    const t = roleInput.trim();
    if (t && !whitelistRoles.includes(t)) { setWhitelistRoles([...whitelistRoles, t]); setRoleInput(""); }
  };

  const formatAge = (days: number) => {
    if (days < 1) return `${Math.round(days * 24)} hours`;
    if (days === 1) return "1 day";
    if (days < 30) return `${days} days`;
    return `${Math.round(days / 30)} months`;
  };

  const recentBlocked = [
    { name: "NewUser#1234", age: "0 days", action: "kicked", time: "2h ago" },
    { name: "FreshAcc#5678", age: "2 days", action: "kicked", time: "5h ago" },
    { name: "BrandNew#9012", age: "1 day", action: "kicked", time: "1d ago" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Anti-Alt</h1>
          <p className="text-muted-foreground mt-2">Block newly created accounts from joining your server to prevent raids and ban evasion.</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-antialt" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>{enabled ? "Armed" : "Off"}</span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Min Account Age", value: formatAge(minAge), color: "text-primary" },
          { label: "Blocked Today", value: "3", color: "text-red-400" },
          { label: "Action", value: action.charAt(0).toUpperCase() + action.slice(1), color: "" },
        ].map(s => (
          <Card key={s.label} className="bg-card border-border text-center">
            <CardContent className="p-4">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Account Age Requirement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <Label>Minimum Account Age</Label>
                <span className="font-mono text-primary">{formatAge(minAge)}</span>
              </div>
              <Slider value={[minAge]} onValueChange={([v]) => setMinAge(v)} min={0} max={90} step={1} data-testid="slider-minage" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 days</span>
                <span>30 days</span>
                <span>90 days</span>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-400/90">Accounts created less than <strong>{formatAge(minAge)}</strong> ago will be {action}ed. Recommended: 7–14 days for active servers.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Ban className="w-4 h-4 text-primary" /> Punishment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Action on Detection</Label>
              <div className="grid gap-2">
                {[
                  { v: "kick", label: "Kick", desc: "Remove them — they can rejoin when old enough", icon: UserX },
                  { v: "ban", label: "Ban", desc: "Permanently ban the account", icon: Ban },
                  { v: "mute", label: "Mute (Timeout)", desc: "Apply a timeout until account is old enough", icon: Clock },
                  { v: "verify_role", label: "Verify Role", desc: "Assign a restricted role requiring manual verification", icon: ShieldAlert },
                ].map(opt => (
                  <button key={opt.v} onClick={() => setAction(opt.v)} data-testid={`button-action-${opt.v}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${action === opt.v ? "border-primary bg-primary/10" : "border-border bg-secondary/20 hover:border-primary/30"}`}>
                    <opt.icon className={`w-4 h-4 flex-shrink-0 ${action === opt.v ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className={`text-sm font-medium ${action === opt.v ? "text-primary" : ""}`}>{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {action === "verify_role" && (
              <div className="space-y-2">
                <Label>Verification Role</Label>
                <Input placeholder="@Unverified" value={verifyRole} onChange={e => setVerifyRole(e.target.value)} data-testid="input-verify-role" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> DM & Logging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Send DM on Block</p><p className="text-xs text-muted-foreground">Inform the user why they were blocked</p></div>
              <Switch checked={sendDm} onCheckedChange={setSendDm} data-testid="switch-dm" />
            </div>
            {sendDm && (
              <div className="space-y-2">
                <Label>DM Message</Label>
                <Input value={dmMessage} onChange={e => setDmMessage(e.target.value)} data-testid="input-dm-msg" />
                <p className="text-xs text-muted-foreground">Variables: <code className="text-primary">{"{server}"}</code> <code className="text-primary">{"{days}"}</code></p>
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <Label>Log Channel</Label>
              <Input placeholder="#mod-logs" value={logChannel} onChange={e => setLogChannel(e.target.value)} data-testid="input-log-channel" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-primary" /> Recent Blocked Accounts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentBlocked.map((u, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <Ban className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">Account age: {u.age} — {u.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{u.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
