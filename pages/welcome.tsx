import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Bell, Hash, LogIn, LogOut, Mail, Image } from "lucide-react";

export default function Welcome() {
  const [welcomeEnabled, setWelcomeEnabled] = useLocalStorage("luna_welcome_enabled", false);
  const [leaveEnabled, setLeaveEnabled] = useLocalStorage("luna_leave_enabled", false);
  const [dmEnabled, setDmEnabled] = useLocalStorage("luna_welcome_dm", false);
  const [welcomeChannel, setWelcomeChannel] = useLocalStorage("luna_welcome_channel", "");
  const [leaveChannel, setLeaveChannel] = useLocalStorage("luna_leave_channel", "");
  const [dmMessage, setDmMessage] = useLocalStorage("luna_welcome_dm_msg", "Welcome to {server}, {user}! Read the rules and enjoy your stay.");

  const [wTitle, setWTitle] = useLocalStorage("luna_welcome_title", "Welcome to {server}!");
  const [wDesc, setWDesc] = useLocalStorage("luna_welcome_desc", "Hey {user}, welcome to **{server}**! You are member **#{count}**. Make sure to read the rules!");
  const [wFooter, setWFooter] = useLocalStorage("luna_welcome_footer", "{server} • {date}");
  const [wColor, setWColor] = useLocalStorage("luna_welcome_color", "#7c3aed");
  const [wImage, setWImage] = useLocalStorage("luna_welcome_image", true);
  const [wThumbnail, setWThumbnail] = useLocalStorage("luna_welcome_thumbnail", true);

  const [lTitle, setLTitle] = useLocalStorage("luna_leave_title", "{user} has left");
  const [lDesc, setLDesc] = useLocalStorage("luna_leave_desc", "**{user}** has left **{server}**. We now have **{count}** members.");
  const [lFooter, setLFooter] = useLocalStorage("luna_leave_footer", "{server} • {date}");
  const [lColor, setLColor] = useLocalStorage("luna_leave_color", "#6b7280");

  const variables = ["{user}", "{server}", "{count}", "{date}", "{id}"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome / Leave</h1>
        <p className="text-muted-foreground mt-2">Greet new members and acknowledge those who leave your server.</p>
      </div>

      <Tabs defaultValue="welcome">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="welcome" data-testid="tab-welcome">
            <LogIn className="w-3.5 h-3.5 mr-1.5" /> Welcome
          </TabsTrigger>
          <TabsTrigger value="leave" data-testid="tab-leave">
            <LogOut className="w-3.5 h-3.5 mr-1.5" /> Leave
          </TabsTrigger>
        </TabsList>

        <TabsContent value="welcome" className="space-y-6 mt-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div>
              <p className="font-medium">Welcome Messages</p>
              <p className="text-sm text-muted-foreground">Send a message when a new member joins</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={welcomeEnabled} onCheckedChange={setWelcomeEnabled} data-testid="switch-welcome" />
              <span className={`text-sm font-semibold ${welcomeEnabled ? "text-green-400" : "text-muted-foreground"}`}>{welcomeEnabled ? "On" : "Off"}</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> Channel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Welcome Channel</Label>
                  <Input placeholder="#welcome" value={welcomeChannel} onChange={e => setWelcomeChannel(e.target.value)} data-testid="input-welcome-channel" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary" /> DM on Join</p>
                    <p className="text-xs text-muted-foreground">Send a DM to new members</p>
                  </div>
                  <Switch checked={dmEnabled} onCheckedChange={setDmEnabled} data-testid="switch-dm" />
                </div>
                {dmEnabled && (
                  <div className="space-y-2">
                    <Label>DM Message</Label>
                    <Input value={dmMessage} onChange={e => setDmMessage(e.target.value)} data-testid="input-dm-message" />
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Show Avatar Thumbnail</p></div>
                  <Switch checked={wThumbnail} onCheckedChange={setWThumbnail} data-testid="switch-thumbnail" />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Show Banner Image</p></div>
                  <Switch checked={wImage} onCheckedChange={setWImage} data-testid="switch-image" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Embed Customization</CardTitle>
                <CardDescription>Design the welcome embed appearance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={wTitle} onChange={e => setWTitle(e.target.value)} data-testid="input-welcome-title" />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Input value={wDesc} onChange={e => setWDesc(e.target.value)} data-testid="input-welcome-desc" />
                </div>
                <div className="space-y-1.5">
                  <Label>Footer</Label>
                  <Input value={wFooter} onChange={e => setWFooter(e.target.value)} data-testid="input-welcome-footer" />
                </div>
                <div className="space-y-1.5">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={wColor} onChange={e => setWColor(e.target.value)} className="w-10 h-9 rounded border border-border bg-card cursor-pointer" data-testid="input-welcome-color" />
                    <Input value={wColor} onChange={e => setWColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
              <CardDescription>How the welcome embed looks (approximate).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-border" style={{ borderLeftColor: wColor, borderLeftWidth: 4 }}>
                <div className="bg-[#2f3136] p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {wThumbnail && <div className="w-10 h-10 rounded-full bg-primary/30 flex-shrink-0 flex items-center justify-center text-primary font-bold">L</div>}
                    <div>
                      <p className="font-semibold text-white text-sm">{wTitle.replace("{server}", "My Server")}</p>
                      <p className="text-[#b9bbbe] text-xs mt-0.5">{wDesc.replace("{user}", "@NewMember").replace("{server}", "My Server").replace("{count}", "1,234")}</p>
                    </div>
                  </div>
                  {wFooter && <p className="text-[#72767d] text-[11px] pt-1 border-t border-[#40444b]">{wFooter.replace("{server}", "My Server").replace("{date}", new Date().toLocaleDateString())}</p>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <p className="text-xs text-muted-foreground w-full mb-1">Available variables:</p>
                {variables.map(v => <code key={v} className="text-xs bg-secondary px-1.5 py-0.5 rounded text-primary font-mono">{v}</code>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-6 mt-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div>
              <p className="font-medium">Leave Messages</p>
              <p className="text-sm text-muted-foreground">Send a message when a member leaves</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={leaveEnabled} onCheckedChange={setLeaveEnabled} data-testid="switch-leave" />
              <span className={`text-sm font-semibold ${leaveEnabled ? "text-green-400" : "text-muted-foreground"}`}>{leaveEnabled ? "On" : "Off"}</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> Channel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Leave Channel</Label>
                  <Input placeholder="#leave (blank = same as welcome)" value={leaveChannel} onChange={e => setLeaveChannel(e.target.value)} data-testid="input-leave-channel" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Embed Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5"><Label>Title</Label><Input value={lTitle} onChange={e => setLTitle(e.target.value)} data-testid="input-leave-title" /></div>
                <div className="space-y-1.5"><Label>Description</Label><Input value={lDesc} onChange={e => setLDesc(e.target.value)} data-testid="input-leave-desc" /></div>
                <div className="space-y-1.5"><Label>Footer</Label><Input value={lFooter} onChange={e => setLFooter(e.target.value)} data-testid="input-leave-footer" /></div>
                <div className="space-y-1.5">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={lColor} onChange={e => setLColor(e.target.value)} className="w-10 h-9 rounded border border-border bg-card cursor-pointer" data-testid="input-leave-color" />
                    <Input value={lColor} onChange={e => setLColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-base">Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-border" style={{ borderLeftColor: lColor, borderLeftWidth: 4 }}>
                <div className="bg-[#2f3136] p-4 space-y-2">
                  <p className="font-semibold text-white text-sm">{lTitle.replace("{user}", "LeavingUser")}</p>
                  <p className="text-[#b9bbbe] text-xs">{lDesc.replace("{user}", "LeavingUser").replace("{server}", "My Server").replace("{count}", "1,233")}</p>
                  {lFooter && <p className="text-[#72767d] text-[11px] pt-1 border-t border-[#40444b]">{lFooter.replace("{server}", "My Server").replace("{date}", new Date().toLocaleDateString())}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
