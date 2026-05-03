import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { BarChart2, Plus, X, RefreshCw, Eye, Hash, Users, Mic } from "lucide-react";

type StatChannel = {
  id: string;
  name: string;
  template: string;
  type: "text" | "voice" | "category";
  enabled: boolean;
  preview: string;
};

const defaultStats: StatChannel[] = [
  { id: "1", name: "Total Members", template: "👥 Members: {total}", type: "voice", enabled: true, preview: "👥 Members: 1,247" },
  { id: "2", name: "Online Members", template: "🟢 Online: {online}", type: "voice", enabled: true, preview: "🟢 Online: 342" },
  { id: "3", name: "Bot Count", template: "🤖 Bots: {bots}", type: "voice", enabled: false, preview: "🤖 Bots: 12" },
  { id: "4", name: "Boost Count", template: "💎 Boosts: {boosts}", type: "voice", enabled: true, preview: "💎 Boosts: 7" },
  { id: "5", name: "Human Members", template: "👤 Humans: {humans}", type: "voice", enabled: false, preview: "👤 Humans: 1,235" },
];

const variables = [
  { v: "{total}", desc: "Total member count" },
  { v: "{online}", desc: "Online members" },
  { v: "{offline}", desc: "Offline members" },
  { v: "{bots}", desc: "Bot count" },
  { v: "{humans}", desc: "Human member count" },
  { v: "{boosts}", desc: "Server boost count" },
  { v: "{tier}", desc: "Server boost tier" },
  { v: "{channels}", desc: "Total channel count" },
  { v: "{roles}", desc: "Total role count" },
  { v: "{emojis}", desc: "Total emoji count" },
  { v: "{created}", desc: "Server creation date" },
];

export default function ServerStats() {
  const [enabled, setEnabled] = useLocalStorage("luna_serverstats_enabled", false);
  const [updateInterval, setUpdateInterval] = useLocalStorage("luna_serverstats_interval", "10");
  const [categoryName, setCategoryName] = useLocalStorage("luna_serverstats_category", "📊 Server Stats");
  const [stats, setStats] = useLocalStorage<StatChannel[]>("luna_serverstats_list", defaultStats);
  const [newTemplate, setNewTemplate] = useState("");
  const [newName, setNewName] = useState("");

  const toggleStat = (id: string) =>
    setStats(stats.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));

  const updateTemplate = (id: string, template: string) =>
    setStats(stats.map(s => s.id === id ? { ...s, template } : s));

  const deleteStat = (id: string) =>
    setStats(stats.filter(s => s.id !== id));

  const addStat = () => {
    if (!newName.trim() || !newTemplate.trim()) return;
    setStats([...stats, {
      id: Date.now().toString(),
      name: newName.trim(),
      template: newTemplate.trim(),
      type: "voice",
      enabled: true,
      preview: newTemplate.replace(/\{[^}]+\}/g, "—"),
    }]);
    setNewName(""); setNewTemplate("");
  };

  const activeStat = stats.filter(s => s.enabled);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Server Stats</h1>
          <p className="text-muted-foreground mt-2">Display live server statistics as voice channel names that auto-update.</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-serverstats" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>{enabled ? "Active" : "Disabled"}</span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Active Channels", value: activeStat.length, color: "text-green-400" },
          { label: "Update Every", value: `${updateInterval}m`, color: "text-primary" },
          { label: "Total Configured", value: stats.length },
        ].map(s => (
          <Card key={s.label} className="bg-card border-border text-center">
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color || ""}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BarChart2 className="w-4 h-4 text-primary" /> Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="📊 Server Stats" data-testid="input-category" />
              <p className="text-xs text-muted-foreground">All stat channels are placed inside this category.</p>
            </div>
            <div className="space-y-2">
              <Label>Update Interval (minutes)</Label>
              <Input type="number" min={5} max={60} value={updateInterval} onChange={e => setUpdateInterval(e.target.value)} className="max-w-[120px]" data-testid="input-interval" />
              <p className="text-xs text-muted-foreground">Discord rate-limits channel renames. Minimum 5 minutes.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Live Preview</CardTitle>
            <CardDescription>How the stat channels look in your server.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-[#2f3136] rounded-lg p-3 space-y-1 font-mono text-sm">
              <div className="flex items-center gap-1.5 text-[#8e9297] text-xs mb-2">
                <span className="text-[#72767d]">▼</span>
                <span className="uppercase tracking-wider text-[10px]">{categoryName}</span>
              </div>
              {activeStat.map(s => (
                <div key={s.id} className="flex items-center gap-2 text-[#b9bbbe] text-xs pl-3">
                  <Mic className="w-3 h-3 text-[#72767d]" />
                  <span>{s.preview}</span>
                </div>
              ))}
              {activeStat.length === 0 && <p className="text-[#72767d] text-xs pl-3">No active stat channels.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Stat Channels</CardTitle>
          <Badge variant="outline" className="text-xs">{activeStat.length} active</Badge>
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          {stats.map(s => (
            <div key={s.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${s.enabled ? "border-border bg-secondary/30" : "border-border/50 bg-transparent opacity-50"}`} data-testid={`stat-${s.id}`}>
              <Switch checked={s.enabled} onCheckedChange={() => toggleStat(s.id)} data-testid={`switch-stat-${s.id}`} />
              <Mic className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{s.name}</p>
                <Input
                  value={s.template}
                  onChange={e => updateTemplate(s.id, e.target.value)}
                  className="h-7 text-xs font-mono"
                  data-testid={`input-template-${s.id}`}
                />
              </div>
              <button onClick={() => deleteStat(s.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Input placeholder="Channel name (label)" value={newName} onChange={e => setNewName(e.target.value)} className="text-sm" data-testid="input-new-name" />
            <Input placeholder="Template e.g. 👥 Members: {total}" value={newTemplate} onChange={e => setNewTemplate(e.target.value)} className="text-sm flex-[2]" data-testid="input-new-template" />
            <Button size="sm" onClick={addStat} disabled={!newName.trim() || !newTemplate.trim()} data-testid="button-add-stat"><Plus className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Available Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {variables.map(v => (
              <div key={v.v} className="flex items-center gap-2 p-2 rounded bg-secondary/40 border border-border">
                <code className="text-xs font-mono text-primary flex-shrink-0">{v.v}</code>
                <span className="text-xs text-muted-foreground">— {v.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
