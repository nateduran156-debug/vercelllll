import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Lightbulb, ThumbsUp, ThumbsDown, Check, X, Clock, MessageSquare, Hash } from "lucide-react";

type Suggestion = {
  id: string;
  author: string;
  content: string;
  upvotes: number;
  downvotes: number;
  status: "pending" | "approved" | "denied" | "implemented";
  reason: string;
  timestamp: string;
};

const initialSuggestions: Suggestion[] = [
  { id: "1", author: "Member#1234", content: "Add a music bot integration so we can listen to music in voice channels together!", upvotes: 34, downvotes: 3, status: "pending", reason: "", timestamp: "2026-05-02" },
  { id: "2", author: "User#5678", content: "Create a weekly game night event in the #events channel.", upvotes: 28, downvotes: 1, status: "approved", reason: "Great idea! Planning to start next Friday.", timestamp: "2026-05-01" },
  { id: "3", author: "Gamer#9012", content: "Add a dedicated channel for game screenshots.", upvotes: 19, downvotes: 5, status: "implemented", reason: "#game-screenshots has been created!", timestamp: "2026-04-29" },
  { id: "4", author: "New#0001", content: "Remove all bots from the server", upvotes: 2, downvotes: 41, status: "denied", reason: "Bots are core to this server's functionality.", timestamp: "2026-04-28" },
];

const statusConfig = {
  pending: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock },
  approved: { label: "Approved", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Check },
  implemented: { label: "Implemented", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", icon: Check },
  denied: { label: "Denied", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: X },
};

export default function Suggestions() {
  const [enabled, setEnabled] = useLocalStorage("luna_suggestions_enabled", false);
  const [channel, setChannel] = useLocalStorage("luna_suggestions_channel", "");
  const [logChannel, setLogChannel] = useLocalStorage("luna_suggestions_log", "");
  const [threadEnabled, setThreadEnabled] = useLocalStorage("luna_suggestions_thread", true);
  const [dmResult, setDmResult] = useLocalStorage("luna_suggestions_dm", true);
  const [selfVote, setSelfVote] = useLocalStorage("luna_suggestions_selfvote", false);
  const [upEmoji, setUpEmoji] = useLocalStorage("luna_suggestions_up", "👍");
  const [downEmoji, setDownEmoji] = useLocalStorage("luna_suggestions_down", "👎");
  const [suggestions, setSuggestions] = useLocalStorage<Suggestion[]>("luna_suggestions_list", initialSuggestions);
  const [filter, setFilter] = useState<"all" | Suggestion["status"]>("all");
  const [reasonInputs, setReasonInputs] = useState<Record<string, string>>({});

  const filtered = filter === "all" ? suggestions : suggestions.filter(s => s.status === filter);

  const updateStatus = (id: string, status: Suggestion["status"]) => {
    setSuggestions(suggestions.map(s => s.id === id ? { ...s, status, reason: reasonInputs[id] || s.reason } : s));
    setReasonInputs(r => { const c = { ...r }; delete c[id]; return c; });
  };

  const counts = {
    all: suggestions.length,
    pending: suggestions.filter(s => s.status === "pending").length,
    approved: suggestions.filter(s => s.status === "approved").length,
    implemented: suggestions.filter(s => s.status === "implemented").length,
    denied: suggestions.filter(s => s.status === "denied").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suggestions</h1>
          <p className="text-muted-foreground mt-2">Collect and manage community suggestions with vote buttons.</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-suggestions" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>{enabled ? "Enabled" : "Disabled"}</span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-4">
        {[
          { key: "pending", label: "Pending", color: "text-yellow-400" },
          { key: "approved", label: "Approved", color: "text-blue-400" },
          { key: "implemented", label: "Implemented", color: "text-green-400" },
          { key: "denied", label: "Denied", color: "text-red-400" },
        ].map(s => (
          <Card key={s.key} className="bg-card border-border text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setFilter(s.key as Suggestion["status"])}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{counts[s.key as keyof typeof counts]}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 grid-cols-2">
              <div className="space-y-2">
                <Label>Suggestion Channel</Label>
                <Input placeholder="#suggestions" value={channel} onChange={e => setChannel(e.target.value)} data-testid="input-sugg-channel" />
              </div>
              <div className="space-y-2">
                <Label>Log Channel</Label>
                <Input placeholder="#suggestion-log" value={logChannel} onChange={e => setLogChannel(e.target.value)} data-testid="input-log-channel" />
              </div>
              <div className="space-y-2">
                <Label>Upvote Emoji</Label>
                <Input value={upEmoji} onChange={e => setUpEmoji(e.target.value)} className="text-center text-lg" data-testid="input-up-emoji" />
              </div>
              <div className="space-y-2">
                <Label>Downvote Emoji</Label>
                <Input value={downEmoji} onChange={e => setDownEmoji(e.target.value)} className="text-center text-lg" data-testid="input-down-emoji" />
              </div>
            </div>
            <Separator />
            {[
              { label: "Auto-Create Thread", desc: "Create a discussion thread under each suggestion", value: threadEnabled, setter: setThreadEnabled, id: "switch-thread" },
              { label: "DM Submitter on Decision", desc: "Notify users when their suggestion is reviewed", value: dmResult, setter: setDmResult, id: "switch-dm" },
              { label: "Allow Self-Voting", desc: "Members can vote on their own suggestions", value: selfVote, setter: setSelfVote, id: "switch-selfvote" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                <Switch checked={item.value} onCheckedChange={item.setter} data-testid={item.id} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>How a suggestion appears in your channel.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border-l-4 border-yellow-500">
              <div className="bg-[#2f3136] p-4 space-y-3">
                <p className="text-white text-sm font-semibold">💡 New Suggestion</p>
                <p className="text-[#dcddde] text-sm">Add a music bot integration so we can listen to music together!</p>
                <div className="flex items-center gap-2 pt-1 border-t border-[#40444b]">
                  <div className="w-4 h-4 rounded-full bg-primary/30" />
                  <span className="text-[#72767d] text-xs">Member#1234 • Today at 3:00 PM</span>
                </div>
                <div className="flex gap-3 pt-1">
                  <span className="text-sm bg-[#43b581]/20 text-[#43b581] px-2 py-1 rounded">{upEmoji} 34</span>
                  <span className="text-sm bg-[#f04747]/20 text-[#f04747] px-2 py-1 rounded">{downEmoji} 3</span>
                  <span className="text-[#b9bbbe] text-xs ml-auto flex items-center">92% approval</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Suggestions</CardTitle>
          <div className="flex gap-1.5">
            {(["all", "pending", "approved", "implemented", "denied"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} data-testid={`filter-${f}`}
                className={`px-2.5 py-1 rounded text-xs font-medium border capitalize transition-all ${filter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                {f} {f !== "all" && <span className="opacity-60">({counts[f]})</span>}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.map(s => {
              const cfg = statusConfig[s.status];
              const StatusIcon = cfg.icon;
              const total = s.upvotes + s.downvotes;
              const pct = total > 0 ? Math.round((s.upvotes / total) * 100) : 0;
              return (
                <div key={s.id} className="px-5 py-4 hover:bg-secondary/20 transition-colors" data-testid={`suggestion-${s.id}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-1.5 rounded-md flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-1">{s.content}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-muted-foreground">{s.author}</span>
                        <span className="text-xs text-green-400 flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{s.upvotes}</span>
                        <span className="text-xs text-red-400 flex items-center gap-1"><ThumbsDown className="w-3 h-3" />{s.downvotes}</span>
                        <span className="text-xs text-muted-foreground">{pct}% approval</span>
                        {s.reason && <span className="text-xs text-muted-foreground italic truncate max-w-xs">"{s.reason}"</span>}
                      </div>
                      {s.status === "pending" && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Input
                            placeholder="Optional reason..."
                            value={reasonInputs[s.id] || ""}
                            onChange={e => setReasonInputs({ ...reasonInputs, [s.id]: e.target.value })}
                            className="h-7 text-xs w-52"
                            data-testid={`input-reason-${s.id}`}
                          />
                          <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700" onClick={() => updateStatus(s.id, "approved")} data-testid={`button-approve-${s.id}`}>Approve</Button>
                          <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => updateStatus(s.id, "implemented")} data-testid={`button-implement-${s.id}`}>Implemented</Button>
                          <Button size="sm" className="h-7 text-xs bg-red-600/80 hover:bg-red-700" onClick={() => updateStatus(s.id, "denied")} data-testid={`button-deny-${s.id}`}>Deny</Button>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className={`text-[10px] capitalize flex-shrink-0 ${cfg.color} border-current/30`}>{cfg.label}</Badge>
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
