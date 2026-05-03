import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Shield, Ticket, Zap, MessageSquareWarning, FileText, Activity, RefreshCw } from "lucide-react";

type BotInfo = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  serverCount: number;
};

export default function Overview() {
  const [ticketsEnabled, setTicketsEnabled] = useLocalStorage("luna_feature_tickets", false);
  const [automodEnabled, setAutomodEnabled] = useLocalStorage("luna_feature_automod", true);
  const [filtersEnabled, setFiltersEnabled] = useLocalStorage("luna_feature_filters", true);
  const [levelingEnabled, setLevelingEnabled] = useLocalStorage("luna_feature_leveling", false);
  const [economyEnabled, setEconomyEnabled] = useLocalStorage("luna_feature_economy", false);
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [botLoading, setBotLoading] = useState(true);
  const [botError, setBotError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bot/info", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          setBotInfo(await res.json());
        } else {
          const data = await res.json().catch(() => ({}));
          setBotError(data.error ?? "Failed to load bot info");
        }
      })
      .catch(() => setBotError("Network error"))
      .finally(() => setBotLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-2">Luna command center. All systems nominal.</p>
        </div>
        {botInfo && (
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
            <img src={botInfo.avatar} alt={botInfo.username} className="w-10 h-10 rounded-full ring-2 ring-primary/30" />
            <div>
              <p className="text-sm font-bold">{botInfo.username}</p>
              <p className="text-xs text-muted-foreground">ID: {botInfo.id}</p>
            </div>
            <div className="ml-2 text-right">
              <p className="text-xl font-bold text-primary">{botInfo.serverCount}</p>
              <p className="text-xs text-muted-foreground">servers</p>
            </div>
          </div>
        )}
        {botLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm bg-card border border-border rounded-xl px-4 py-3">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading bot info…
          </div>
        )}
        {botError && !botLoading && (
          <div className="text-xs text-muted-foreground bg-card border border-border rounded-xl px-4 py-3 max-w-xs">
            {botError === "BOT_TOKEN not configured"
              ? "Add BOT_TOKEN as a Vercel env var to see live stats."
              : botError}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: "Servers", value: botInfo ? String(botInfo.serverCount) : "—", icon: Shield },
          { name: "Commands Loaded", value: "99", icon: Zap },
          { name: "Bot Status", value: botInfo ? "Online" : "—", icon: Activity },
        ].map((stat) => (
          <Card key={stat.name} className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold tracking-tight pt-4">Module Status</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard title="Ticket System" description="Advanced support tickets with transcripts" icon={Ticket} enabled={ticketsEnabled} onToggle={setTicketsEnabled} />
        <FeatureCard title="Automod" description="Protect against spam, links, and raids" icon={Shield} enabled={automodEnabled} onToggle={setAutomodEnabled} />
        <FeatureCard title="Word Filters" description="Block inappropriate language automatically" icon={MessageSquareWarning} enabled={filtersEnabled} onToggle={setFiltersEnabled} />
        <FeatureCard title="Leveling" description="Reward active members with XP and roles" icon={Zap} enabled={levelingEnabled} onToggle={setLevelingEnabled} />
        <FeatureCard title="Economy" description="Virtual currency, shops, and trading" icon={FileText} enabled={economyEnabled} onToggle={setEconomyEnabled} />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon: Icon, enabled, onToggle }: {
  title: string; description: string; icon: any; enabled: boolean; onToggle: (val: boolean) => void;
}) {
  return (
    <Card className="bg-card hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-secondary"><Icon className="w-5 h-5 text-primary" /></div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </CardHeader>
      <CardContent>
        <CardDescription className="pt-2">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
