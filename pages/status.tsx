import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Zap, Gamepad2, Eye, Headphones, Swords, Radio, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const activityTypes = [
  { value: "playing", label: "Playing", icon: Gamepad2, prefix: "Playing" },
  { value: "watching", label: "Watching", icon: Eye, prefix: "Watching" },
  { value: "listening", label: "Listening to", icon: Headphones, prefix: "Listening to" },
  { value: "competing", label: "Competing in", icon: Swords, prefix: "Competing in" },
  { value: "streaming", label: "Streaming", icon: Radio, prefix: "Streaming" },
];

const statusTypes = [
  { value: "online", label: "Online", color: "bg-green-500", glow: "shadow-[0_0_8px_rgba(34,197,94,0.8)]" },
  { value: "idle", label: "Idle", color: "bg-yellow-500", glow: "shadow-[0_0_8px_rgba(234,179,8,0.8)]" },
  { value: "dnd", label: "Do Not Disturb", color: "bg-red-500", glow: "shadow-[0_0_8px_rgba(239,68,68,0.8)]" },
  { value: "invisible", label: "Invisible", color: "bg-gray-500", glow: "" },
];

export default function Status() {
  const [activityType, setActivityType] = useLocalStorage("luna_status_type", "playing");
  const [activityText, setActivityText] = useLocalStorage("luna_status_text", "");
  const [presence, setPresence] = useLocalStorage("luna_status_presence", "online");

  const selectedActivity = activityTypes.find(a => a.value === activityType)!;
  const selectedStatus = statusTypes.find(s => s.value === presence)!;
  const ActivityIcon = selectedActivity.icon;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bot Status</h1>
        <p className="text-muted-foreground mt-2">Configure the activity and presence shown on Luna's profile.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-4 h-4 text-primary" /> Activity Type
            </CardTitle>
            <CardDescription>Select what type of activity Luna displays.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {activityTypes.map(type => {
              const Icon = type.icon;
              const isSelected = activityType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setActivityType(type.value)}
                  data-testid={`button-activity-${type.value}`}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {type.label}
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Circle className="w-4 h-4 text-primary" /> Presence Status
            </CardTitle>
            <CardDescription>Set Luna's online presence indicator.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {statusTypes.map(status => {
              const isSelected = presence === status.value;
              return (
                <button
                  key={status.value}
                  onClick={() => setPresence(status.value)}
                  data-testid={`button-presence-${status.value}`}
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-lg border text-sm font-medium transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${status.color} ${isSelected ? status.glow : ""}`} />
                  {status.label}
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Activity Text</CardTitle>
            <CardDescription>The text shown after the activity type on Luna's profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity-text">Activity Text</Label>
              <Input
                id="activity-text"
                placeholder={`e.g. "your server" or "music"`}
                value={activityText}
                onChange={e => setActivityText(e.target.value)}
                data-testid="input-activity-text"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Preview</p>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/40 border border-border">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">L</div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${selectedStatus.color} ${selectedStatus.glow}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Luna</p>
                  <p className="text-xs text-muted-foreground">
                    {activityText
                      ? <><ActivityIcon className="inline w-3 h-3 mr-1" />{selectedActivity.prefix} <span className="text-foreground">{activityText}</span></>
                      : <span className="italic">No activity set</span>
                    }
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline" className="text-xs capitalize">{selectedStatus.label}</Badge>
                </div>
              </div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground font-medium mb-1">Discord Command</p>
              <code className="text-xs font-mono text-primary">
                {activityText
                  ? `&setactivity ${activityType} ${activityText}`
                  : `&clearactivity`}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
