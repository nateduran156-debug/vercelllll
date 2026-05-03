import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { MessageSquare, Plus, X, Pencil, Check, ToggleLeft } from "lucide-react";

type Responder = {
  id: string;
  trigger: string;
  response: string;
  enabled: boolean;
  matchType: "exact" | "contains" | "startswith";
};

const initialResponders: Responder[] = [
  { id: "1", trigger: "hello", response: "Hey there! How can I help you today?", enabled: true, matchType: "contains" },
  { id: "2", trigger: "rules", response: "Check out our rules in #rules channel!", enabled: true, matchType: "exact" },
  { id: "3", trigger: "invite", response: "You can invite Luna Bot with: `&invite`", enabled: false, matchType: "contains" },
];

export default function Autoresponder() {
  const [enabled, setEnabled] = useLocalStorage("luna_autoresponder_enabled", false);
  const [responders, setResponders] = useLocalStorage<Responder[]>("luna_autoresponder_list", initialResponders);
  const [trigger, setTrigger] = useState("");
  const [response, setResponse] = useState("");
  const [matchType, setMatchType] = useState<Responder["matchType"]>("contains");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTrigger, setEditTrigger] = useState("");
  const [editResponse, setEditResponse] = useState("");

  const addResponder = () => {
    if (!trigger.trim() || !response.trim()) return;
    setResponders([...responders, {
      id: Date.now().toString(),
      trigger: trigger.trim(),
      response: response.trim(),
      enabled: true,
      matchType,
    }]);
    setTrigger(""); setResponse("");
  };

  const toggleResponder = (id: string) =>
    setResponders(responders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

  const deleteResponder = (id: string) =>
    setResponders(responders.filter(r => r.id !== id));

  const startEdit = (r: Responder) => {
    setEditingId(r.id);
    setEditTrigger(r.trigger);
    setEditResponse(r.response);
  };

  const saveEdit = () => {
    setResponders(responders.map(r => r.id === editingId ? { ...r, trigger: editTrigger, response: editResponse } : r));
    setEditingId(null);
  };

  const matchBadgeColor = (m: Responder["matchType"]) =>
    m === "exact" ? "text-blue-400 border-blue-400/30" : m === "startswith" ? "text-orange-400 border-orange-400/30" : "text-green-400 border-green-400/30";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Autoresponder</h1>
          <p className="text-muted-foreground mt-2">Automatically reply to specific triggers in your server.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Module</span>
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-autoresponder" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>{enabled ? "Active" : "Off"}</span>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Add New Responder</CardTitle>
          <CardDescription>Set a trigger word/phrase and the bot's reply.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Trigger (what users type)</Label>
              <Input placeholder='e.g. "hello" or "!rules"' value={trigger} onChange={e => setTrigger(e.target.value)} data-testid="input-trigger" />
            </div>
            <div className="space-y-2">
              <Label>Response (what Luna replies)</Label>
              <Input placeholder="Bot's reply message..." value={response} onChange={e => setResponse(e.target.value)} data-testid="input-response" />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Label className="text-sm">Match type:</Label>
            {(["contains", "exact", "startswith"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMatchType(m)}
                data-testid={`button-match-${m}`}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${matchType === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
              >
                {m}
              </button>
            ))}
            <Button className="ml-auto" onClick={addResponder} disabled={!trigger.trim() || !response.trim()} data-testid="button-add-responder">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Responders</CardTitle>
          <CardDescription>{responders.filter(r => r.enabled).length} active of {responders.length} total</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {responders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No autoresponders configured yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {responders.map(r => (
                <div key={r.id} className={`px-5 py-4 transition-colors hover:bg-secondary/20 ${!r.enabled ? "opacity-50" : ""}`} data-testid={`responder-${r.id}`}>
                  {editingId === r.id ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input value={editTrigger} onChange={e => setEditTrigger(e.target.value)} placeholder="Trigger" data-testid="input-edit-trigger" />
                        <Input value={editResponse} onChange={e => setEditResponse(e.target.value)} placeholder="Response" data-testid="input-edit-response" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit} data-testid="button-save-edit"><Check className="w-3.5 h-3.5 mr-1" /> Save</Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <Switch checked={r.enabled} onCheckedChange={() => toggleResponder(r.id)} data-testid={`switch-responder-${r.id}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-mono font-medium bg-secondary px-2 py-0.5 rounded">{r.trigger}</span>
                          <Badge variant="outline" className={`text-[10px] capitalize ${matchBadgeColor(r.matchType)}`}>{r.matchType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{r.response}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(r)} data-testid={`button-edit-${r.id}`}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => deleteResponder(r.id)} data-testid={`button-delete-${r.id}`}><X className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Variables</CardTitle>
          <CardDescription>Use these in your response messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { v: "{user}", desc: "Mentions the user" },
              { v: "{username}", desc: "User's display name" },
              { v: "{server}", desc: "Server name" },
              { v: "{channel}", desc: "Current channel" },
              { v: "{membercount}", desc: "Total member count" },
              { v: "{id}", desc: "User's ID" },
            ].map(item => (
              <div key={item.v} className="flex items-center gap-2 p-2 rounded-md bg-secondary/40 border border-border">
                <code className="text-xs font-mono text-primary">{item.v}</code>
                <span className="text-xs text-muted-foreground">— {item.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
