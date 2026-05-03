import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ShieldCheck, Type, Link, Users, AtSign, Smile, MessageSquare } from "lucide-react";

const modules = [
  {
    key: "anticaps",
    label: "Anti-Caps",
    desc: "Delete messages with excessive capital letters",
    icon: Type,
    hasThreshold: true,
    thresholdLabel: "Caps threshold (%)",
    defaultThreshold: 70,
  },
  {
    key: "antilink",
    label: "Anti-Link",
    desc: "Block unauthorized URLs and hyperlinks",
    icon: Link,
    hasThreshold: false,
  },
  {
    key: "antiinvite",
    label: "Anti-Invite",
    desc: "Remove Discord server invite links",
    icon: Users,
    hasThreshold: false,
  },
  {
    key: "antimentions",
    label: "Anti-Mass-Mention",
    desc: "Prevent bulk pinging of users or roles",
    icon: AtSign,
    hasThreshold: true,
    thresholdLabel: "Max mentions per message",
    defaultThreshold: 5,
  },
  {
    key: "antiemoji",
    label: "Anti-Emoji-Spam",
    desc: "Limit excessive emoji usage in messages",
    icon: Smile,
    hasThreshold: true,
    thresholdLabel: "Max emojis per message",
    defaultThreshold: 8,
  },
  {
    key: "antispam",
    label: "Anti-Spam",
    desc: "Rate-limit users sending messages too fast",
    icon: MessageSquare,
    hasThreshold: true,
    thresholdLabel: "Messages per 5 seconds",
    defaultThreshold: 5,
  },
];

export default function Automod() {
  const [globalEnabled, setGlobalEnabled] = useLocalStorage("luna_automod_global", true);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automod</h1>
          <p className="text-muted-foreground mt-2">Automated moderation to keep your server clean and safe.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">All Modules</span>
          <Switch checked={globalEnabled} onCheckedChange={setGlobalEnabled} data-testid="switch-automod-global" />
          <span className={`text-sm font-semibold ${globalEnabled ? "text-green-400" : "text-muted-foreground"}`}>
            {globalEnabled ? "Active" : "Paused"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map(mod => (
          <AutomodCard key={mod.key} mod={mod} globalEnabled={globalEnabled} />
        ))}
      </div>
    </div>
  );
}

function AutomodCard({ mod, globalEnabled }: { mod: typeof modules[0]; globalEnabled: boolean }) {
  const [enabled, setEnabled] = useLocalStorage(`luna_automod_${mod.key}`, true);
  const [threshold, setThreshold] = useLocalStorage(`luna_automod_${mod.key}_threshold`, mod.defaultThreshold ?? 5);
  const Icon = mod.icon;
  const isActive = globalEnabled && enabled;

  return (
    <Card className={`bg-card border-border transition-opacity ${!globalEnabled ? "opacity-50" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${isActive ? "bg-primary/10" : "bg-secondary"}`}>
            <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div>
            <CardTitle className="text-sm">{mod.label}</CardTitle>
            <CardDescription className="text-xs mt-0.5">{mod.desc}</CardDescription>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={!globalEnabled} data-testid={`switch-${mod.key}`} />
      </CardHeader>
      {mod.hasThreshold && enabled && globalEnabled && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{mod.thresholdLabel}</span>
              <span className="font-mono text-primary">{threshold}</span>
            </div>
            <Slider
              value={[threshold]}
              onValueChange={([v]) => setThreshold(v)}
              min={1}
              max={mod.key === "anticaps" ? 100 : 20}
              step={1}
              data-testid={`slider-${mod.key}`}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
