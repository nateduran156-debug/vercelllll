import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Users, Bot, Plus, X, Tag, Clock } from "lucide-react";

type RoleEntry = { id: string; name: string; delay: number };

export default function Autorole() {
  const [humanEnabled, setHumanEnabled] = useLocalStorage("luna_autorole_human", false);
  const [botEnabled, setBotEnabled] = useLocalStorage("luna_autorole_bot", false);
  const [humanRoles, setHumanRoles] = useLocalStorage<RoleEntry[]>("luna_autorole_human_roles", []);
  const [botRoles, setBotRoles] = useLocalStorage<RoleEntry[]>("luna_autorole_bot_roles", []);
  const [humanInput, setHumanInput] = useState("");
  const [humanDelay, setHumanDelay] = useState("0");
  const [botInput, setBotInput] = useState("");

  const addHumanRole = () => {
    const name = humanInput.trim();
    const delay = parseInt(humanDelay) || 0;
    if (name && !humanRoles.find(r => r.name === name)) {
      setHumanRoles([...humanRoles, { id: Date.now().toString(), name, delay }]);
      setHumanInput(""); setHumanDelay("0");
    }
  };
  const addBotRole = () => {
    const name = botInput.trim();
    if (name && !botRoles.find(r => r.name === name)) {
      setBotRoles([...botRoles, { id: Date.now().toString(), name, delay: 0 }]);
      setBotInput("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Autorole</h1>
        <p className="text-muted-foreground mt-2">Automatically assign roles when members or bots join your server.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Human Members
                </CardTitle>
                <CardDescription className="mt-1">Roles assigned when a person joins.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={humanEnabled} onCheckedChange={setHumanEnabled} data-testid="switch-human-autorole" />
                <span className={`text-xs font-semibold ${humanEnabled ? "text-green-400" : "text-muted-foreground"}`}>{humanEnabled ? "On" : "Off"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className={`space-y-4 transition-opacity ${!humanEnabled ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input placeholder="Role name or ID" value={humanInput} onChange={e => setHumanInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addHumanRole()} data-testid="input-human-role" />
                <Button size="sm" onClick={addHumanRole} data-testid="button-add-human-role"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <Input type="number" min={0} placeholder="Delay (seconds, 0 = instant)" value={humanDelay} onChange={e => setHumanDelay(e.target.value)} className="text-sm" data-testid="input-human-delay" />
              </div>
            </div>
            <div className="space-y-2 min-h-[4rem]">
              {humanRoles.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No autoroles configured for members.</p>
              ) : humanRoles.map(r => (
                <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary/40 border border-border" data-testid={`human-role-${r.id}`}>
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-medium">{r.name}</span>
                    {r.delay > 0 && <Badge variant="outline" className="text-xs text-muted-foreground">{r.delay}s delay</Badge>}
                  </div>
                  <button onClick={() => setHumanRoles(humanRoles.filter(x => x.id !== r.id))} className="text-muted-foreground hover:text-destructive transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" /> Bots
                </CardTitle>
                <CardDescription className="mt-1">Roles assigned when a bot joins.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={botEnabled} onCheckedChange={setBotEnabled} data-testid="switch-bot-autorole" />
                <span className={`text-xs font-semibold ${botEnabled ? "text-green-400" : "text-muted-foreground"}`}>{botEnabled ? "On" : "Off"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className={`space-y-4 transition-opacity ${!botEnabled ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="flex gap-2">
              <Input placeholder="Role name or ID" value={botInput} onChange={e => setBotInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addBotRole()} data-testid="input-bot-role" />
              <Button size="sm" onClick={addBotRole} data-testid="button-add-bot-role"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-2 min-h-[4rem]">
              {botRoles.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No autoroles configured for bots.</p>
              ) : botRoles.map(r => (
                <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary/40 border border-border" data-testid={`bot-role-${r.id}`}>
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-medium">{r.name}</span>
                  </div>
                  <button onClick={() => setBotRoles(botRoles.filter(x => x.id !== r.id))} className="text-muted-foreground hover:text-destructive transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Commands Reference</CardTitle>
          <CardDescription>Use these bot commands to manage autoroles directly in Discord.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { cmd: "&autorole add @role", desc: "Add role to give on join" },
              { cmd: "&autorole remove @role", desc: "Remove a role from autorole" },
              { cmd: "&autorole list", desc: "List all configured autoroles" },
              { cmd: "&autorole bots add @role", desc: "Add bot autorole" },
              { cmd: "&autorole clear", desc: "Remove all autoroles" },
              { cmd: "&autorole delay @role 30", desc: "Set delay before role is given" },
            ].map(item => (
              <div key={item.cmd} className="p-3 rounded-md bg-secondary/40 border border-border">
                <code className="text-xs font-mono text-primary block mb-1">{item.cmd}</code>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
