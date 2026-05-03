import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sword, Search, Ban, UserX, AlertTriangle, Clock, Shield } from "lucide-react";

type LogEntry = {
  id: number;
  action: "ban" | "kick" | "warn" | "timeout" | "unban";
  user: string;
  moderator: string;
  reason: string;
  time: string;
};

const mockLog: LogEntry[] = [
  { id: 1, action: "ban", user: "ToxicUser#1234", moderator: "Admin#0001", reason: "Repeated harassment", time: "2m ago" },
  { id: 2, action: "warn", user: "Spammer#5678", moderator: "Mod#0002", reason: "Excessive spam in #general", time: "15m ago" },
  { id: 3, action: "kick", user: "Raider#9012", moderator: "Admin#0001", reason: "Raid attempt", time: "1h ago" },
  { id: 4, action: "timeout", user: "LoudUser#3456", moderator: "Mod#0003", reason: "Caps spam", time: "2h ago" },
  { id: 5, action: "ban", user: "Scammer#7890", moderator: "Admin#0001", reason: "Phishing links", time: "3h ago" },
  { id: 6, action: "unban", user: "Reformed#1111", moderator: "Admin#0001", reason: "Ban appeal accepted", time: "5h ago" },
  { id: 7, action: "warn", user: "NewUser#2222", moderator: "Mod#0002", reason: "Off-topic posting", time: "6h ago" },
  { id: 8, action: "kick", user: "Troll#3333", moderator: "Mod#0003", reason: "Trolling in voice", time: "8h ago" },
];

const actionConfig = {
  ban: { label: "Ban", icon: Ban, color: "text-red-400", bg: "bg-red-500/10" },
  kick: { label: "Kick", icon: UserX, color: "text-orange-400", bg: "bg-orange-500/10" },
  warn: { label: "Warn", icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  timeout: { label: "Timeout", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
  unban: { label: "Unban", icon: Shield, color: "text-green-400", bg: "bg-green-500/10" },
};

export default function Moderation() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = mockLog.filter(entry => {
    const matchesSearch =
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.reason.toLowerCase().includes(search.toLowerCase()) ||
      entry.moderator.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || entry.action === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    ban: mockLog.filter(e => e.action === "ban").length,
    kick: mockLog.filter(e => e.action === "kick").length,
    warn: mockLog.filter(e => e.action === "warn").length,
    timeout: mockLog.filter(e => e.action === "timeout").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderation</h1>
        <p className="text-muted-foreground mt-2">Recent moderation actions across your server.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Object.entries(counts).map(([action, count]) => {
          const cfg = actionConfig[action as keyof typeof actionConfig];
          const Icon = cfg.icon;
          return (
            <Card key={action} className="bg-card border-border cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setFilter(filter === action ? "all" : action)} data-testid={`card-count-${action}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-md ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{cfg.label}s</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Action Log</CardTitle>
            <CardDescription>Showing {filtered.length} of {mockLog.length} entries</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input className="pl-7 h-8 w-48 text-sm" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search-log" />
            </div>
            {(["all", "ban", "kick", "warn", "timeout", "unban"] as const).map(f => (
              <Button
                key={f}
                variant={filter === f ? "default" : "secondary"}
                size="sm"
                className="h-8 text-xs capitalize"
                onClick={() => setFilter(f)}
                data-testid={`button-filter-${f}`}
              >
                {f}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">No entries match your filters.</p>
            ) : filtered.map(entry => {
              const cfg = actionConfig[entry.action];
              const Icon = cfg.icon;
              return (
                <div key={entry.id} className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors" data-testid={`log-entry-${entry.id}`}>
                  <div className={`p-2 rounded-md flex-shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{entry.user}</span>
                      <Badge variant="outline" className={`text-xs ${cfg.color} border-current/30`}>{cfg.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{entry.reason}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">by {entry.moderator}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{entry.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
