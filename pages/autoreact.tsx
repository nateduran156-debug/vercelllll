import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SmilePlus, Plus, X, Hash, Pencil, Check } from "lucide-react";

type ReactRule = {
  id: string;
  channel: string;
  trigger: string;
  triggerType: "all" | "contains" | "startswith";
  emojis: string[];
  enabled: boolean;
};

const initialRules: ReactRule[] = [
  { id: "1", channel: "#art-showcase", trigger: "", triggerType: "all", emojis: ["❤️", "🔥", "⭐", "👏"], enabled: true },
  { id: "2", channel: "#memes", trigger: "", triggerType: "all", emojis: ["😂", "💀", "🔥"], enabled: true },
  { id: "3", channel: "#suggestions", trigger: "", triggerType: "all", emojis: ["👍", "👎"], enabled: false },
  { id: "4", channel: "#general", trigger: "gm", triggerType: "contains", emojis: ["☀️", "🌅"], enabled: true },
];

export default function Autoreact() {
  const [rules, setRules] = useLocalStorage<ReactRule[]>("luna_autoreact_rules", initialRules);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newChannel, setNewChannel] = useState("");
  const [newTrigger, setNewTrigger] = useState("");
  const [newTriggerType, setNewTriggerType] = useState<ReactRule["triggerType"]>("all");
  const [newEmojis, setNewEmojis] = useState("");
  const [emojiInputs, setEmojiInputs] = useState<Record<string, string>>({});

  const addRule = () => {
    if (!newChannel.trim()) return;
    const emojis = newEmojis.split(/\s+/).map(e => e.trim()).filter(Boolean);
    if (emojis.length === 0) return;
    setRules([...rules, {
      id: Date.now().toString(),
      channel: newChannel.trim(),
      trigger: newTrigger.trim(),
      triggerType: newTriggerType,
      emojis,
      enabled: true,
    }]);
    setNewChannel(""); setNewTrigger(""); setNewEmojis("");
  };

  const toggleRule = (id: string) => setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const deleteRule = (id: string) => setRules(rules.filter(r => r.id !== id));

  const addEmojiToRule = (id: string) => {
    const e = (emojiInputs[id] || "").trim();
    if (!e) return;
    setRules(rules.map(r => r.id === id && !r.emojis.includes(e) ? { ...r, emojis: [...r.emojis, e] } : r));
    setEmojiInputs({ ...emojiInputs, [id]: "" });
  };

  const removeEmojiFromRule = (ruleId: string, emoji: string) =>
    setRules(rules.map(r => r.id === ruleId ? { ...r, emojis: r.emojis.filter(e => e !== emoji) } : r));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Autoreact</h1>
        <p className="text-muted-foreground mt-2">Automatically react to messages in specific channels or that contain certain trigger words.</p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Active Rules", value: rules.filter(r => r.enabled).length, color: "text-green-400" },
          { label: "Total Rules", value: rules.length },
          { label: "Channels Covered", value: new Set(rules.map(r => r.channel)).size },
        ].map(s => (
          <Card key={s.label} className="bg-card border-border text-center">
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color || ""}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Add Autoreact Rule</CardTitle>
          <CardDescription>Choose a channel and the emojis Luna will add to every message (or messages matching a trigger).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Channel</Label>
              <Input placeholder="#channel" value={newChannel} onChange={e => setNewChannel(e.target.value)} data-testid="input-new-channel" />
            </div>
            <div className="space-y-1.5">
              <Label>Trigger Word (optional)</Label>
              <Input placeholder='e.g. "gm" — blank = all messages' value={newTrigger} onChange={e => setNewTrigger(e.target.value)} data-testid="input-new-trigger" />
            </div>
            <div className="space-y-1.5">
              <Label>Match Type</Label>
              <div className="flex gap-1">
                {(["all", "contains", "startswith"] as const).map(t => (
                  <button key={t} onClick={() => setNewTriggerType(t)} data-testid={`button-type-${t}`}
                    className={`px-2 py-1.5 rounded text-xs border transition-all flex-1 capitalize ${newTriggerType === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    {t === "all" ? "All" : t === "contains" ? "Contains" : "Starts"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Emojis (space-separated)</Label>
              <Input placeholder="❤️ 🔥 ⭐" value={newEmojis} onChange={e => setNewEmojis(e.target.value)} data-testid="input-new-emojis" />
            </div>
          </div>
          <Button onClick={addRule} disabled={!newChannel.trim() || !newEmojis.trim()} data-testid="button-add-rule">
            <Plus className="w-4 h-4 mr-2" /> Add Rule
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Configured Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {rules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No autoreact rules configured.</p>
          ) : (
            <div className="divide-y divide-border">
              {rules.map(rule => (
                <div key={rule.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors ${!rule.enabled ? "opacity-50" : ""}`} data-testid={`rule-${rule.id}`}>
                  <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} data-testid={`switch-rule-${rule.id}`} />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs font-mono text-primary border-primary/30">
                        <Hash className="w-2.5 h-2.5 mr-1 inline" />{rule.channel.replace("#", "")}
                      </Badge>
                      {rule.trigger ? (
                        <Badge variant="outline" className="text-xs text-muted-foreground capitalize">
                          {rule.triggerType}: "{rule.trigger}"
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">All messages</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {rule.emojis.map(emoji => (
                        <span key={emoji} className="flex items-center gap-1 text-lg bg-secondary/50 px-1.5 py-0.5 rounded-md" data-testid={`emoji-${rule.id}-${emoji}`}>
                          {emoji}
                          <button onClick={() => removeEmojiFromRule(rule.id, emoji)} className="text-muted-foreground hover:text-destructive text-xs ml-0.5"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      ))}
                      <div className="flex gap-1">
                        <Input
                          placeholder="+"
                          value={emojiInputs[rule.id] || ""}
                          onChange={e => setEmojiInputs({ ...emojiInputs, [rule.id]: e.target.value })}
                          className="w-12 h-7 text-center text-lg p-1"
                          onKeyDown={e => e.key === "Enter" && addEmojiToRule(rule.id)}
                          data-testid={`input-add-emoji-${rule.id}`}
                        />
                        <Button size="sm" className="h-7 w-7 p-0" onClick={() => addEmojiToRule(rule.id)} data-testid={`button-add-emoji-${rule.id}`}><Plus className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteRule(rule.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0" data-testid={`button-delete-rule-${rule.id}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
