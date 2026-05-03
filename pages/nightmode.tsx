import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Moon, Sun, Clock, Plus, X, Hash } from "lucide-react";

export default function Nightmode() {
  const [enabled, setEnabled] = useLocalStorage("luna_nightmode_enabled", false);
  const [startTime, setStartTime] = useLocalStorage("luna_nightmode_start", "22:00");
  const [endTime, setEndTime] = useLocalStorage("luna_nightmode_end", "08:00");
  const [slowmode, setSlowmode] = useLocalStorage("luna_nightmode_slowmode", 30);
  const [lockdown, setLockdown] = useLocalStorage("luna_nightmode_lockdown", false);
  const [announcement, setAnnouncement] = useLocalStorage("luna_nightmode_announcement", true);
  const [announcementChannel, setAnnouncementChannel] = useLocalStorage("luna_nightmode_ann_channel", "");
  const [startMsg, setStartMsg] = useLocalStorage("luna_nightmode_start_msg", "Night mode is now active. Slowmode has been enabled.");
  const [endMsg, setEndMsg] = useLocalStorage("luna_nightmode_end_msg", "Good morning! Night mode has ended. Chat is back to normal.");
  const [excludedChannels, setExcludedChannels] = useLocalStorage<string[]>("luna_nightmode_excluded", []);
  const [chanInput, setChanInput] = useState("");
  const [timezone, setTimezone] = useLocalStorage("luna_nightmode_tz", "UTC");

  const timezones = ["UTC", "US/Eastern", "US/Central", "US/Pacific", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Australia/Sydney"];

  const addExcluded = () => {
    const t = chanInput.trim();
    if (t && !excludedChannels.includes(t)) { setExcludedChannels([...excludedChannels, t]); setChanInput(""); }
  };

  const formatTime12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nightmode</h1>
          <p className="text-muted-foreground mt-2">Automatically apply slowmode or lockdown during quiet hours.</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-nightmode" />
          <span className={`text-sm font-semibold ${enabled ? "text-blue-400" : "text-muted-foreground"}`}>{enabled ? "Scheduled" : "Off"}</span>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10">
                <Moon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Night mode starts</p>
                <p className="text-xl font-bold">{formatTime12(startTime)}</p>
              </div>
            </div>
            <div className="flex-1 h-px bg-border relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-orange-500/30" />
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground text-right">Night mode ends</p>
                <p className="text-xl font-bold text-right">{formatTime12(endTime)}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-orange-500/10">
                <Sun className="w-5 h-5 text-orange-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 grid-cols-2">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} data-testid="input-start-time" />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} data-testid="input-end-time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <div className="flex flex-wrap gap-1.5">
                {timezones.map(tz => (
                  <button key={tz} onClick={() => setTimezone(tz)} data-testid={`tz-${tz}`}
                    className={`px-2 py-1 rounded text-xs border transition-all ${timezone === tz ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    {tz.split("/").pop()}
                  </button>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Slowmode Duration</Label>
                <span className="font-mono text-primary">{slowmode}s</span>
              </div>
              <Slider value={[slowmode]} onValueChange={([v]) => setSlowmode(v)} min={0} max={120} step={5} data-testid="slider-slowmode" />
              <p className="text-xs text-muted-foreground">0 = disabled. Applied to all channels during night hours.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Behavior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Full Lockdown</p>
                <p className="text-xs text-muted-foreground">Prevent all messages (only staff can post)</p>
              </div>
              <Switch checked={lockdown} onCheckedChange={setLockdown} data-testid="switch-lockdown" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Announcements</p>
                <p className="text-xs text-muted-foreground">Post a message when night mode starts/ends</p>
              </div>
              <Switch checked={announcement} onCheckedChange={setAnnouncement} data-testid="switch-announcement" />
            </div>
            {announcement && (
              <>
                <div className="space-y-2">
                  <Label>Announcement Channel</Label>
                  <Input placeholder="#general" value={announcementChannel} onChange={e => setAnnouncementChannel(e.target.value)} data-testid="input-ann-channel" />
                </div>
                <div className="space-y-2">
                  <Label>Start Message</Label>
                  <Input value={startMsg} onChange={e => setStartMsg(e.target.value)} data-testid="input-start-msg" />
                </div>
                <div className="space-y-2">
                  <Label>End Message</Label>
                  <Input value={endMsg} onChange={e => setEndMsg(e.target.value)} data-testid="input-end-msg" />
                </div>
              </>
            )}
            <Separator />
            <div>
              <Label className="text-sm mb-2 block">Excluded Channels</Label>
              <div className="flex gap-2 mb-2">
                <Input placeholder="#always-on" value={chanInput} onChange={e => setChanInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addExcluded()} data-testid="input-excluded" />
                <Button size="sm" onClick={addExcluded}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {excludedChannels.map(c => (
                  <Badge key={c} variant="secondary" className="flex items-center gap-1 text-xs">
                    {c}<button onClick={() => setExcludedChannels(excludedChannels.filter(x => x !== c))} className="hover:text-destructive"><X className="w-2.5 h-2.5" /></button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
