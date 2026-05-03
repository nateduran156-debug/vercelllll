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
import { Star, Hash, Image, Lock, RefreshCw, Filter } from "lucide-react";

type StarredPost = {
  id: string;
  author: string;
  content: string;
  stars: number;
  channel: string;
  timestamp: string;
  hasImage: boolean;
};

const mockStarred: StarredPost[] = [
  { id: "1", author: "FunnyGuy#1234", content: "Anyone else notice the bot responded with a haiku? 😭 That's actually peak AI.", stars: 14, channel: "#general", timestamp: "2026-05-02", hasImage: false },
  { id: "2", author: "ArtistMember#5678", content: "Just finished this piece for the server!", stars: 22, channel: "#art-showcase", timestamp: "2026-05-01", hasImage: true },
  { id: "3", author: "Memer#9012", content: "Me explaining to my mom why I spend 6 hours in a Discord server:", stars: 18, channel: "#memes", timestamp: "2026-04-30", hasImage: true },
];

export default function Starboard() {
  const [enabled, setEnabled] = useLocalStorage("luna_starboard_enabled", false);
  const [channel, setChannel] = useLocalStorage("luna_starboard_channel", "");
  const [emoji, setEmoji] = useLocalStorage("luna_starboard_emoji", "⭐");
  const [threshold, setThreshold] = useLocalStorage("luna_starboard_threshold", 5);
  const [selfStar, setSelfStar] = useLocalStorage("luna_starboard_selfstar", false);
  const [botMessages, setBotMessages] = useLocalStorage("luna_starboard_bot_msgs", false);
  const [ignoredChannels, setIgnoredChannels] = useLocalStorage<string[]>("luna_starboard_ignored", []);
  const [chanInput, setChanInput] = useState("");
  const [allowNsfw, setAllowNsfw] = useLocalStorage("luna_starboard_nsfw", false);
  const [embedColor, setEmbedColor] = useLocalStorage("luna_starboard_color", "#f59e0b");

  const addIgnored = () => {
    const t = chanInput.trim();
    if (t && !ignoredChannels.includes(t)) { setIgnoredChannels([...ignoredChannels, t]); setChanInput(""); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Starboard</h1>
          <p className="text-muted-foreground mt-2">Members star great messages and they get posted to a dedicated starboard channel.</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-starboard" />
          <span className={`text-sm font-semibold ${enabled ? "text-yellow-400" : "text-muted-foreground"}`}>{enabled ? "Enabled" : "Disabled"}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 grid-cols-2">
              <div className="space-y-2">
                <Label>Starboard Channel</Label>
                <Input placeholder="#starboard" value={channel} onChange={e => setChannel(e.target.value)} data-testid="input-starboard-channel" />
              </div>
              <div className="space-y-2">
                <Label>Star Emoji</Label>
                <Input placeholder="⭐" value={emoji} onChange={e => setEmoji(e.target.value)} className="text-center text-lg" data-testid="input-emoji" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Minimum Stars Required</Label>
                <span className="font-mono text-yellow-400">{threshold} {emoji}</span>
              </div>
              <Slider value={[threshold]} onValueChange={([v]) => setThreshold(v)} min={1} max={25} step={1} data-testid="slider-threshold" />
            </div>
            <div className="space-y-2">
              <Label>Embed Accent Color</Label>
              <div className="flex gap-2 items-center">
                <input type="color" value={embedColor} onChange={e => setEmbedColor(e.target.value)} className="w-10 h-9 rounded border border-border bg-card cursor-pointer" />
                <Input value={embedColor} onChange={e => setEmbedColor(e.target.value)} className="font-mono text-sm" />
              </div>
            </div>
            <Separator />
            {[
              { label: "Allow Self-Starring", desc: "Members can star their own messages", value: selfStar, setter: setSelfStar, id: "switch-selfstar" },
              { label: "Include Bot Messages", desc: "Bot messages can appear on the starboard", value: botMessages, setter: setBotMessages, id: "switch-bot-msgs" },
              { label: "Allow NSFW Channels", desc: "NSFW channel messages can be starred", value: allowNsfw, setter: setAllowNsfw, id: "switch-nsfw" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                <Switch checked={item.value} onCheckedChange={item.setter} data-testid={item.id} />
              </div>
            ))}
            <Separator />
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Ignored Channels</Label>
              <div className="flex gap-2 mb-2">
                <Input placeholder="#channel" value={chanInput} onChange={e => setChanInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addIgnored()} data-testid="input-ignored" />
                <Button size="sm" onClick={addIgnored}>+</Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ignoredChannels.map(c => (
                  <Badge key={c} variant="secondary" className="flex items-center gap-1 text-xs">
                    {c}
                    <button onClick={() => setIgnoredChannels(ignoredChannels.filter(x => x !== c))} className="hover:text-destructive">×</button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
              <CardDescription>How a starred message appears in the starboard channel.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden" style={{ borderLeft: `4px solid ${embedColor}` }}>
                <div className="bg-[#2f3136] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[#b9bbbe] text-xs">
                    <span className="text-lg">⭐</span>
                    <span className="font-semibold text-white">14</span>
                    <span>|</span>
                    <span className="text-blue-400">#general</span>
                  </div>
                  <p className="text-[#dcddde] text-sm">Anyone else notice the bot responded with a haiku? 😭 That's actually peak AI.</p>
                  <div className="flex items-center gap-2 pt-1 border-t border-[#40444b]">
                    <div className="w-4 h-4 rounded-full bg-primary/30" />
                    <span className="text-[#72767d] text-xs">FunnyGuy#1234 • May 2, 2026</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Filter className="w-4 h-4 text-primary" /> Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 grid-cols-2">
              {[
                { label: "Total Starred", value: "54" },
                { label: "This Month", value: "23" },
                { label: "Top Poster", value: "ArtistMember" },
                { label: "Most Stars", value: "22 ⭐" },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-lg bg-secondary/40 border border-border text-center">
                  <p className="text-sm font-bold text-primary">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Hall of Fame</CardTitle>
          <CardDescription>Top starred messages in your server.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockStarred.map((post, i) => (
              <div key={post.id} className="flex items-start gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors" data-testid={`starred-${post.id}`}>
                <span className={`text-sm font-bold w-6 text-center flex-shrink-0 ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : "text-orange-400"}`}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{post.content}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{post.author}</span>
                    <span className="text-xs text-muted-foreground">{post.channel}</span>
                    {post.hasImage && <Badge variant="outline" className="text-[10px] flex items-center gap-1"><Image className="w-2.5 h-2.5" />Image</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-sm font-bold">{post.stars}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
