import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Pin, Plus, X, Pencil, Check, MessageSquare, Hash } from "lucide-react";

type StickyMessage = {
  id: string;
  channel: string;
  message: string;
  enabled: boolean;
  triggerCount: number;
};

const initialStickies: StickyMessage[] = [
  { id: "1", channel: "#rules", message: "Please read and follow the server rules. Violations may result in a ban.", enabled: true, triggerCount: 5 },
  { id: "2", channel: "#general", message: "Keep it friendly! No spam or excessive pinging.", enabled: true, triggerCount: 10 },
  { id: "3", channel: "#art-showcase", message: "Share your artwork here! React with ⭐ to show appreciation.", enabled: false, triggerCount: 3 },
];

export default function Sticky() {
  const [stickies, setStickies] = useLocalStorage<StickyMessage[]>("luna_sticky_list", initialStickies);
  const [channel, setChannel] = useState("");
  const [message, setMessage] = useState("");
  const [triggerCount, setTriggerCount] = useState("5");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Partial<StickyMessage>>({});

  const addSticky = () => {
    if (!channel.trim() || !message.trim()) return;
    setStickies([...stickies, {
      id: Date.now().toString(),
      channel: channel.trim(),
      message: message.trim(),
      enabled: true,
      triggerCount: parseInt(triggerCount) || 5,
    }]);
    setChannel(""); setMessage(""); setTriggerCount("5");
  };

  const toggle = (id: string) => setStickies(stickies.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  const remove = (id: string) => setStickies(stickies.filter(s => s.id !== id));
  const startEdit = (s: StickyMessage) => { setEditingId(s.id); setEditState({ ...s }); };
  const saveEdit = () => {
    setStickies(stickies.map(s => s.id === editingId ? { ...s, ...editState } : s));
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sticky Messages</h1>
        <p className="text-muted-foreground mt-2">Pin messages that repost themselves to keep them visible at the bottom of a channel.</p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Active Stickies", value: stickies.filter(s => s.enabled).length, color: "text-green-400" },
          { label: "Total Stickies", value: stickies.length },
          { label: "Channels", value: new Set(stickies.map(s => s.channel)).size },
        ].map(stat => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color || ""}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Add Sticky Message</CardTitle>
          <CardDescription>The message will repost itself after N messages are sent in the channel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Channel</Label>
              <Input placeholder="#channel-name" value={channel} onChange={e => setChannel(e.target.value)} data-testid="input-sticky-channel" />
            </div>
            <div className="space-y-2">
              <Label>Repost every N messages</Label>
              <Input type="number" min={1} max={100} value={triggerCount} onChange={e => setTriggerCount(e.target.value)} data-testid="input-trigger-count" />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={addSticky} disabled={!channel.trim() || !message.trim()} className="w-full" data-testid="button-add-sticky">
                <Pin className="w-4 h-4 mr-2" /> Add Sticky
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Message Content</Label>
            <Input placeholder="Type the sticky message here..." value={message} onChange={e => setMessage(e.target.value)} data-testid="input-sticky-message" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Active Stickies</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stickies.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No sticky messages configured.</p>
          ) : (
            <div className="divide-y divide-border">
              {stickies.map(s => (
                <div key={s.id} className={`px-5 py-4 hover:bg-secondary/20 transition-colors ${!s.enabled ? "opacity-50" : ""}`} data-testid={`sticky-${s.id}`}>
                  {editingId === s.id ? (
                    <div className="space-y-3">
                      <div className="grid gap-2 md:grid-cols-2">
                        <Input value={editState.channel || ""} onChange={e => setEditState({ ...editState, channel: e.target.value })} placeholder="Channel" />
                        <Input type="number" value={editState.triggerCount || 5} onChange={e => setEditState({ ...editState, triggerCount: parseInt(e.target.value) })} placeholder="Trigger count" />
                      </div>
                      <Input value={editState.message || ""} onChange={e => setEditState({ ...editState, message: e.target.value })} placeholder="Message" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}><Check className="w-3.5 h-3.5 mr-1" /> Save</Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <Switch checked={s.enabled} onCheckedChange={() => toggle(s.id)} data-testid={`switch-sticky-${s.id}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-xs font-mono text-primary border-primary/30"><Hash className="w-2.5 h-2.5 mr-1 inline" />{s.channel.replace("#", "")}</Badge>
                          <Badge variant="outline" className="text-xs text-muted-foreground">Every {s.triggerCount} msgs</Badge>
                        </div>
                        <p className="text-sm text-foreground/90 line-clamp-2">{s.message}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => remove(s.id)}><X className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
