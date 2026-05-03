import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Hash, RefreshCw, Target, AlertTriangle, Trophy, Settings } from "lucide-react";

export default function Counting() {
  const [enabled, setEnabled] = useLocalStorage("luna_counting_enabled", false);
  const [channel, setChannel] = useLocalStorage("luna_counting_channel", "");
  const [currentCount, setCurrentCount] = useLocalStorage("luna_counting_current", "0");
  const [goal, setGoal] = useLocalStorage("luna_counting_goal", "");
  const [allowRecount, setAllowRecount] = useLocalStorage("luna_counting_recount", false);
  const [deleteWrong, setDeleteWrong] = useLocalStorage("luna_counting_delete_wrong", true);
  const [resetOnFail, setResetOnFail] = useLocalStorage("luna_counting_reset", true);
  const [failRole, setFailRole] = useLocalStorage("luna_counting_fail_role", "");
  const [goalRole, setGoalRole] = useLocalStorage("luna_counting_goal_role", "");
  const [failMessage, setFailMessage] = useLocalStorage("luna_counting_fail_msg", "{user} ruined the count at {count}! Starting over from 0.");
  const [goalMessage, setGoalMessage] = useLocalStorage("luna_counting_goal_msg", "We reached {goal}! Congratulations everyone!");
  const [topCounters] = useLocalStorage("luna_counting_top", [
    { name: "Counter#1234", count: 342 },
    { name: "NumberGuy#5678", count: 289 },
    { name: "MathWiz#9012", count: 201 },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Counting</h1>
          <p className="text-muted-foreground mt-2">A counting channel where members count up together without making mistakes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-counting" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>{enabled ? "Enabled" : "Disabled"}</span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-3">
        <Card className="bg-card border-border text-center">
          <CardContent className="p-5">
            <p className="text-3xl font-bold text-primary">{parseInt(currentCount).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Current Count</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border text-center">
          <CardContent className="p-5">
            <p className="text-3xl font-bold">{goal ? parseInt(goal).toLocaleString() : "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">Goal</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border text-center">
          <CardContent className="p-5">
            <p className={`text-3xl font-bold ${goal && parseInt(currentCount) > 0 ? "text-green-400" : "text-muted-foreground"}`}>
              {goal ? Math.round((parseInt(currentCount) / parseInt(goal)) * 100) + "%" : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Counting Channel</Label>
              <Input placeholder="#counting" value={channel} onChange={e => setChannel(e.target.value)} data-testid="input-counting-channel" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label>Current Count</Label>
                <Input type="number" min={0} value={currentCount} onChange={e => setCurrentCount(e.target.value)} data-testid="input-current-count" />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Goal (optional)</Label>
                <Input type="number" min={1} placeholder="e.g. 1000" value={goal} onChange={e => setGoal(e.target.value)} data-testid="input-goal" />
              </div>
            </div>
            <Separator />
            {[
              { label: "Allow Recounting", desc: "Same user can count twice in a row", value: allowRecount, setter: setAllowRecount, id: "switch-recount" },
              { label: "Delete Wrong Numbers", desc: "Auto-delete incorrect count messages", value: deleteWrong, setter: setDeleteWrong, id: "switch-delete-wrong" },
              { label: "Reset on Fail", desc: "Reset count to 0 when someone fails", value: resetOnFail, setter: setResetOnFail, id: "switch-reset" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                <Switch checked={item.value} onCheckedChange={item.setter} data-testid={item.id} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-primary" /> Fail & Goal Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Fail Role (given to the person who failed)</Label>
                <Input placeholder="@Ruined It" value={failRole} onChange={e => setFailRole(e.target.value)} data-testid="input-fail-role" />
              </div>
              <div className="space-y-2">
                <Label>Goal Reward Role</Label>
                <Input placeholder="@Counting Champion" value={goalRole} onChange={e => setGoalRole(e.target.value)} data-testid="input-goal-role" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Fail Message</Label>
                <Input value={failMessage} onChange={e => setFailMessage(e.target.value)} data-testid="input-fail-msg" />
                <p className="text-xs text-muted-foreground">Variables: <code className="text-primary">{"{user}"}</code> <code className="text-primary">{"{count}"}</code></p>
              </div>
              <div className="space-y-2">
                <Label>Goal Message</Label>
                <Input value={goalMessage} onChange={e => setGoalMessage(e.target.value)} data-testid="input-goal-msg" />
                <p className="text-xs text-muted-foreground">Variables: <code className="text-primary">{"{goal}"}</code></p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Top Counters</CardTitle>
              <CardDescription>Members with the most correct counts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {topCounters.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3 py-1">
                  <span className={`w-5 text-center text-xs font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : "text-orange-400"}`}>#{i + 1}</span>
                  <span className="flex-1 text-sm">{c.name}</span>
                  <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">{c.count.toLocaleString()}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
