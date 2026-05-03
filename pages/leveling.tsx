import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { TrendingUp, Plus, X, Award, MessageSquare, Bell, Layers } from "lucide-react";

type LevelRole = { level: number; roleId: string };

export default function Leveling() {
  const [enabled, setEnabled] = useLocalStorage("luna_leveling_enabled", false);
  const [xpMin, setXpMin] = useLocalStorage("luna_leveling_xpmin", 15);
  const [xpMax, setXpMax] = useLocalStorage("luna_leveling_xpmax", 25);
  const [cooldown, setCooldown] = useLocalStorage("luna_leveling_cooldown", 60);
  const [levelUpMsg, setLevelUpMsg] = useLocalStorage("luna_leveling_msg", true);
  const [stackRoles, setStackRoles] = useLocalStorage("luna_leveling_stack", true);
  const [dmNotify, setDmNotify] = useLocalStorage("luna_leveling_dm", false);
  const [levelChannel, setLevelChannel] = useLocalStorage("luna_leveling_channel", "");
  const [levelUpText, setLevelUpText] = useLocalStorage("luna_leveling_text", "GG {user}, you leveled up to **Level {level}**!");
  const [ignoredChannels, setIgnoredChannels] = useLocalStorage<string[]>("luna_leveling_ignored", []);
  const [ignoredRoles, setIgnoredRoles] = useLocalStorage<string[]>("luna_leveling_ignored_roles", []);
  const [levelRoles, setLevelRoles] = useLocalStorage<LevelRole[]>("luna_leveling_roles", [
    { level: 5, roleId: "Active Member" },
    { level: 10, roleId: "Regular" },
    { level: 25, roleId: "Veteran" },
  ]);
  const [newLevel, setNewLevel] = useState("");
  const [newRole, setNewRole] = useState("");
  const [chanInput, setChanInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  const addLevelRole = () => {
    const l = parseInt(newLevel);
    if (!isNaN(l) && l > 0 && newRole.trim()) {
      setLevelRoles([...levelRoles, { level: l, roleId: newRole.trim() }].sort((a, b) => a.level - b.level));
      setNewLevel(""); setNewRole("");
    }
  };

  const mockLeaderboard = [
    { name: "ServerOwner", level: 42, xp: 18450, rank: 1 },
    { name: "ActiveUser", level: 31, xp: 12200, rank: 2 },
    { name: "CoolMember", level: 28, xp: 10800, rank: 3 },
    { name: "Chatterbox", level: 24, xp: 8900, rank: 4 },
    { name: "Lurker", level: 18, xp: 6200, rank: 5 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leveling</h1>
          <p className="text-muted-foreground mt-2">Reward active members with XP, level-up messages, and milestone roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">System</span>
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-leveling-enabled" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>{enabled ? "Enabled" : "Disabled"}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> XP Settings</CardTitle>
            <CardDescription>Configure how much XP members earn per message.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Minimum XP per message</Label>
                <span className="font-mono text-primary">{xpMin}</span>
              </div>
              <Slider value={[xpMin]} onValueChange={([v]) => setXpMin(v)} min={1} max={50} step={1} data-testid="slider-xp-min" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Maximum XP per message</Label>
                <span className="font-mono text-primary">{xpMax}</span>
              </div>
              <Slider value={[xpMax]} onValueChange={([v]) => setXpMax(v)} min={xpMin} max={100} step={1} data-testid="slider-xp-max" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Cooldown (seconds)</Label>
                <span className="font-mono text-primary">{cooldown}s</span>
              </div>
              <Slider value={[cooldown]} onValueChange={([v]) => setCooldown(v)} min={10} max={300} step={5} data-testid="slider-cooldown" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Notifications</CardTitle>
            <CardDescription>Control level-up announcement behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Level-Up Messages", desc: "Announce when a member levels up", value: levelUpMsg, setter: setLevelUpMsg, id: "switch-levelupmsg" },
              { label: "DM Notifications", desc: "Send level-up message to user's DMs", value: dmNotify, setter: setDmNotify, id: "switch-dm" },
              { label: "Stack Level Roles", desc: "Members keep all previous level roles", value: stackRoles, setter: setStackRoles, id: "switch-stack" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                <Switch checked={item.value} onCheckedChange={item.setter} data-testid={item.id} />
              </div>
            ))}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="level-channel">Level-Up Channel</Label>
              <Input id="level-channel" placeholder="#level-ups (blank = same channel)" value={levelChannel} onChange={e => setLevelChannel(e.target.value)} data-testid="input-level-channel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="levelup-text">Level-Up Message</Label>
              <Input id="levelup-text" value={levelUpText} onChange={e => setLevelUpText(e.target.value)} data-testid="input-levelup-text" />
              <p className="text-xs text-muted-foreground">Variables: <code className="text-primary">{"{user}"}</code> <code className="text-primary">{"{level}"}</code> <code className="text-primary">{"{xp}"}</code></p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Level Roles</CardTitle>
            <CardDescription>Automatically assign roles when members reach a level.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input type="number" min={1} placeholder="Level" value={newLevel} onChange={e => setNewLevel(e.target.value)} className="w-24" data-testid="input-new-level" />
              <Input placeholder="Role name or ID" value={newRole} onChange={e => setNewRole(e.target.value)} onKeyDown={e => e.key === "Enter" && addLevelRole()} data-testid="input-new-role" />
              <Button size="sm" onClick={addLevelRole} data-testid="button-add-level-role"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {levelRoles.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">No level roles configured.</p> :
                levelRoles.map((lr, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary/40 border border-border" data-testid={`level-role-${lr.level}`}>
                    <div className="flex items-center gap-2.5">
                      <Badge variant="outline" className="text-xs font-mono text-primary border-primary/30">Lvl {lr.level}</Badge>
                      <span className="text-sm">{lr.roleId}</span>
                    </div>
                    <button onClick={() => setLevelRoles(levelRoles.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Ignored Channels & Roles</CardTitle>
            <CardDescription>No XP will be earned in these channels or by these roles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Ignored Channels</Label>
              <div className="flex gap-2 mb-2">
                <Input placeholder="#channel-name" value={chanInput} onChange={e => setChanInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && chanInput.trim() && !ignoredChannels.includes(chanInput.trim())) { setIgnoredChannels([...ignoredChannels, chanInput.trim()]); setChanInput(""); }}} data-testid="input-ignored-channel" />
                <Button size="sm" onClick={() => { if (chanInput.trim() && !ignoredChannels.includes(chanInput.trim())) { setIgnoredChannels([...ignoredChannels, chanInput.trim()]); setChanInput(""); }}} data-testid="button-add-ignored-channel"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ignoredChannels.map(c => <Badge key={c} variant="secondary" className="flex items-center gap-1 text-xs">{c}<button onClick={() => setIgnoredChannels(ignoredChannels.filter(x => x !== c))} className="hover:text-destructive"><X className="w-2.5 h-2.5" /></button></Badge>)}
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Ignored Roles</Label>
              <div className="flex gap-2 mb-2">
                <Input placeholder="@role-name" value={roleInput} onChange={e => setRoleInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && roleInput.trim() && !ignoredRoles.includes(roleInput.trim())) { setIgnoredRoles([...ignoredRoles, roleInput.trim()]); setRoleInput(""); }}} data-testid="input-ignored-role" />
                <Button size="sm" onClick={() => { if (roleInput.trim() && !ignoredRoles.includes(roleInput.trim())) { setIgnoredRoles([...ignoredRoles, roleInput.trim()]); setRoleInput(""); }}} data-testid="button-add-ignored-role"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ignoredRoles.map(r => <Badge key={r} variant="secondary" className="flex items-center gap-1 text-xs">{r}<button onClick={() => setIgnoredRoles(ignoredRoles.filter(x => x !== r))} className="hover:text-destructive"><X className="w-2.5 h-2.5" /></button></Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Top Members (Preview)</CardTitle>
          <CardDescription>Sample leaderboard — real data comes from the bot.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockLeaderboard.map(m => (
              <div key={m.rank} className="flex items-center gap-4 px-6 py-3" data-testid={`leaderboard-${m.rank}`}>
                <span className={`w-7 text-center text-sm font-bold ${m.rank === 1 ? "text-yellow-400" : m.rank === 2 ? "text-gray-400" : m.rank === 3 ? "text-orange-400" : "text-muted-foreground"}`}>#{m.rank}</span>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{m.name[0]}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.xp.toLocaleString()} XP</p>
                </div>
                <Badge variant="outline" className="text-xs font-mono text-primary border-primary/30">Level {m.level}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
