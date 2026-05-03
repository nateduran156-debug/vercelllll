import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Gift, Plus, Trophy, Clock, Users, RotateCcw, Square, RefreshCw } from "lucide-react";

type Giveaway = {
  id: string;
  prize: string;
  winners: number;
  channel: string;
  endTime: string;
  entries: number;
  status: "active" | "ended";
  hostedBy: string;
};

const initialGiveaways: Giveaway[] = [
  { id: "1", prize: "Discord Nitro (1 Month)", winners: 1, channel: "#giveaways", endTime: "2026-05-10T18:00", entries: 142, status: "active", hostedBy: "Admin#0001" },
  { id: "2", prize: "Steam Gift Card $25", winners: 2, channel: "#giveaways", endTime: "2026-05-07T20:00", entries: 89, status: "active", hostedBy: "Mod#0002" },
  { id: "3", prize: "Custom Role", winners: 3, channel: "#events", endTime: "2026-04-28T15:00", entries: 231, status: "ended", hostedBy: "Admin#0001" },
  { id: "4", prize: "Bot Premium (1 Week)", winners: 1, channel: "#giveaways", endTime: "2026-04-20T12:00", entries: 178, status: "ended", hostedBy: "Owner#0000" },
];

export default function Giveaway() {
  const [giveaways, setGiveaways] = useLocalStorage<Giveaway[]>("luna_giveaways", initialGiveaways);
  const [prize, setPrize] = useState("");
  const [winners, setWinners] = useState("1");
  const [channel, setChannel] = useState("#giveaways");
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState("hours");
  const [tab, setTab] = useState<"active" | "ended">("active");

  const activeGiveaways = giveaways.filter(g => g.status === "active");
  const endedGiveaways = giveaways.filter(g => g.status === "ended");

  const createGiveaway = () => {
    if (!prize.trim() || !duration) return;
    const endDate = new Date();
    const mins = durationUnit === "minutes" ? parseInt(duration) : durationUnit === "hours" ? parseInt(duration) * 60 : parseInt(duration) * 1440;
    endDate.setMinutes(endDate.getMinutes() + mins);
    setGiveaways([{
      id: Date.now().toString(),
      prize: prize.trim(),
      winners: parseInt(winners) || 1,
      channel: channel || "#giveaways",
      endTime: endDate.toISOString().slice(0, 16),
      entries: 0,
      status: "active",
      hostedBy: "You",
    }, ...giveaways]);
    setPrize(""); setDuration(""); setWinners("1");
  };

  const endGiveaway = (id: string) =>
    setGiveaways(giveaways.map(g => g.id === id ? { ...g, status: "ended" } : g));

  const rerollGiveaway = (id: string) => {
    const g = giveaways.find(x => x.id === id);
    if (g) alert(`Rerolled winner for: ${g.prize}`);
  };

  const deleteGiveaway = (id: string) =>
    setGiveaways(giveaways.filter(g => g.id !== id));

  const timeLeft = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return "Ended";
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Giveaway</h1>
        <p className="text-muted-foreground mt-2">Create and manage giveaways to engage your community.</p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Active", value: activeGiveaways.length, color: "text-green-400" },
          { label: "Total Entries", value: activeGiveaways.reduce((s, g) => s + g.entries, 0).toLocaleString(), color: "text-primary" },
          { label: "Completed", value: endedGiveaways.length, color: "text-muted-foreground" },
        ].map(stat => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Create Giveaway</CardTitle>
          <CardDescription>Start a new giveaway in your server.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Prize</Label>
              <Input placeholder="e.g. Discord Nitro, Steam Gift Card" value={prize} onChange={e => setPrize(e.target.value)} data-testid="input-prize" />
            </div>
            <div className="space-y-2">
              <Label>Channel</Label>
              <Input placeholder="#giveaways" value={channel} onChange={e => setChannel(e.target.value)} data-testid="input-giveaway-channel" />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="flex gap-2">
                <Input type="number" min={1} placeholder="Amount" value={duration} onChange={e => setDuration(e.target.value)} className="flex-1" data-testid="input-duration" />
                <div className="flex gap-1">
                  {["minutes", "hours", "days"].map(u => (
                    <button key={u} onClick={() => setDurationUnit(u)} data-testid={`button-unit-${u}`}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-all ${durationUnit === u ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                      {u[0].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Number of Winners</Label>
              <Input type="number" min={1} max={20} value={winners} onChange={e => setWinners(e.target.value)} data-testid="input-winners" />
            </div>
          </div>
          <Button onClick={createGiveaway} disabled={!prize.trim() || !duration} data-testid="button-create-giveaway">
            <Gift className="w-4 h-4 mr-2" /> Start Giveaway
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {(["active", "ended"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} data-testid={`tab-${t}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${tab === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
            {t} ({t === "active" ? activeGiveaways.length : endedGiveaways.length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {(tab === "active" ? activeGiveaways : endedGiveaways).length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground text-sm">No {tab} giveaways.</p>
            </CardContent>
          </Card>
        ) : (tab === "active" ? activeGiveaways : endedGiveaways).map(g => (
          <Card key={g.id} className="bg-card border-border" data-testid={`giveaway-${g.id}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${g.status === "active" ? "bg-primary/10" : "bg-secondary"}`}>
                    <Gift className={`w-5 h-5 ${g.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{g.prize}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Trophy className="w-3 h-3" />{g.winners} winner{g.winners > 1 ? "s" : ""}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{g.entries} entries</span>
                      <span className="text-xs text-muted-foreground">{g.channel}</span>
                      {g.status === "active" && <span className="text-xs text-primary flex items-center gap-1"><Clock className="w-3 h-3" />{timeLeft(g.endTime)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {g.status === "active" && (
                    <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => endGiveaway(g.id)} data-testid={`button-end-${g.id}`}>
                      <Square className="w-3 h-3 mr-1" /> End
                    </Button>
                  )}
                  {g.status === "ended" && (
                    <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => rerollGiveaway(g.id)} data-testid={`button-reroll-${g.id}`}>
                      <RotateCcw className="w-3 h-3 mr-1" /> Reroll
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-destructive" onClick={() => deleteGiveaway(g.id)} data-testid={`button-delete-giveaway-${g.id}`}>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
