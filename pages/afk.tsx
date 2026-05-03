import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Coffee, Clock, X, Search, Users } from "lucide-react";

type AfkEntry = {
  id: string;
  user: string;
  reason: string;
  since: string;
  duration: string;
};

const mockAfkUsers: AfkEntry[] = [
  { id: "1", user: "Admin#0001", reason: "Grabbing food", since: "2026-05-03T01:00", duration: "1h 22m" },
  { id: "2", user: "Mod#0002", reason: "Sleeping", since: "2026-05-02T22:00", duration: "4h 22m" },
  { id: "3", user: "Member#1234", reason: "", since: "2026-05-03T00:30", duration: "1h 52m" },
];

export default function Afk() {
  const [enabled, setEnabled] = useLocalStorage("luna_afk_enabled", true);
  const [autoRemove, setAutoRemove] = useLocalStorage("luna_afk_autoremove", true);
  const [nickname, setNickname] = useLocalStorage("luna_afk_nickname", true);
  const [prefix, setPrefix] = useLocalStorage("luna_afk_prefix", "[AFK]");
  const [autoRemoveDelay, setAutoRemoveDelay] = useLocalStorage("luna_afk_delay", "5");
  const [ignoredChannels, setIgnoredChannels] = useLocalStorage<string[]>("luna_afk_ignored", []);
  const [ignoredRoles, setIgnoredRoles] = useLocalStorage<string[]>("luna_afk_ignored_roles", []);
  const [afkMessage, setAfkMessage] = useLocalStorage("luna_afk_message", "{user} is AFK: {reason}");
  const [returnMessage, setReturnMessage] = useLocalStorage("luna_afk_return", "Welcome back {user}! You were AFK for {duration}.");
  const [search, setSearch] = useState("");
  const [chanInput, setChanInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  const filtered = mockAfkUsers.filter(u =>
    u.user.toLowerCase().includes(search.toLowerCase()) ||
    u.reason.toLowerCase().includes(search.toLowerCase())
  );

  const addChan = () => {
    const t = chanInput.trim();
    if (t && !ignoredChannels.includes(t)) { setIgnoredChannels([...ignoredChannels, t]); setChanInput(""); }
  };
  const addRole = () => {
    const t = roleInput.trim();
    if (t && !ignoredRoles.includes(t)) { setIgnoredRoles([...ignoredRoles, t]); setRoleInput(""); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AFK</h1>
          <p className="text-muted-foreground mt-2">Let members set an AFK status that auto-replies when they're mentioned.</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-afk" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>{enabled ? "Enabled" : "Disabled"}</span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-3">
        <Card className="bg-card border-border text-center">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-primary">{mockAfkUsers.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Currently AFK</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border text-center">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">24</p>
            <p className="text-xs text-muted-foreground mt-1">AFK Today</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border text-center">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">2h 3m</p>
            <p className="text-xs text-muted-foreground mt-1">Avg Duration</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Coffee className="w-4 h-4 text-primary" /> AFK Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Nickname Prefix</p><p className="text-xs text-muted-foreground">Add a prefix to AFK member nicknames</p></div>
              <Switch checked={nickname} onCheckedChange={setNickname} data-testid="switch-nickname" />
            </div>
            {nickname && (
              <div className="space-y-2">
                <Label>Prefix Text</Label>
                <Input value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="[AFK]" data-testid="input-prefix" />
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Auto Remove AFK</p><p className="text-xs text-muted-foreground">Remove AFK status when member sends a message</p></div>
              <Switch checked={autoRemove} onCheckedChange={setAutoRemove} data-testid="switch-autoremove" />
            </div>
            {autoRemove && (
              <div className="space-y-2">
                <Label>Removal delay (seconds after first message)</Label>
                <Input type="number" min={0} max={60} value={autoRemoveDelay} onChange={e => setAutoRemoveDelay(e.target.value)} className="max-w-[120px]" data-testid="input-delay" />
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <Label>AFK Mention Message</Label>
              <Input value={afkMessage} onChange={e => setAfkMessage(e.target.value)} data-testid="input-afk-msg" />
              <p className="text-xs text-muted-foreground">Shown when an AFK member is mentioned. Variables: <code className="text-primary">{"{user}"}</code> <code className="text-primary">{"{reason}"}</code></p>
            </div>
            <div className="space-y-2">
              <Label>Return Message</Label>
              <Input value={returnMessage} onChange={e => setReturnMessage(e.target.value)} data-testid="input-return-msg" />
              <p className="text-xs text-muted-foreground">Variables: <code className="text-primary">{"{user}"}</code> <code className="text-primary">{"{duration}"}</code></p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Ignored Channels & Roles</CardTitle>
            <CardDescription>AFK status won't be checked in these channels or by these roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Ignored Channels</Label>
              <div className="flex gap-2 mb-2">
                <Input placeholder="#channel" value={chanInput} onChange={e => setChanInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addChan()} data-testid="input-ignored-chan" />
                <Button size="sm" onClick={addChan}>+</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
                {ignoredChannels.map(c => <Badge key={c} variant="secondary" className="flex items-center gap-1 text-xs">{c}<button onClick={() => setIgnoredChannels(ignoredChannels.filter(x => x !== c))} className="hover:text-destructive"><X className="w-2.5 h-2.5" /></button></Badge>)}
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Ignored Roles</Label>
              <div className="flex gap-2 mb-2">
                <Input placeholder="@role" value={roleInput} onChange={e => setRoleInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addRole()} data-testid="input-ignored-role" />
                <Button size="sm" onClick={addRole}>+</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
                {ignoredRoles.map(r => <Badge key={r} variant="secondary" className="flex items-center gap-1 text-xs">{r}<button onClick={() => setIgnoredRoles(ignoredRoles.filter(x => x !== r))} className="hover:text-destructive"><X className="w-2.5 h-2.5" /></button></Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Currently AFK</CardTitle>
            <CardDescription>{mockAfkUsers.length} members currently away</CardDescription>
          </div>
          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input className="pl-7 h-8 text-sm" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search-afk" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.map(u => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/20 transition-colors" data-testid={`afk-${u.id}`}>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{u.user}</p>
                  <p className="text-xs text-muted-foreground">{u.reason || <span className="italic">No reason given</span>}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{u.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
