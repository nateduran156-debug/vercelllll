import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Ticket, Hash, Users, FolderOpen, FileText, Bell } from "lucide-react";

export default function Tickets() {
  const [enabled, setEnabled] = useLocalStorage("luna_tickets_enabled", false);
  const [transcripts, setTranscripts] = useLocalStorage("luna_tickets_transcripts", true);
  const [pingRole, setPingRole] = useLocalStorage("luna_tickets_pingrole", true);
  const [autoClose, setAutoClose] = useLocalStorage("luna_tickets_autoclose", false);
  const [channel, setChannel] = useLocalStorage("luna_tickets_channel", "");
  const [category, setCategory] = useLocalStorage("luna_tickets_category", "");
  const [logChannel, setLogChannel] = useLocalStorage("luna_tickets_log", "");
  const [embedTitle, setEmbedTitle] = useLocalStorage("luna_tickets_title", "Create a Ticket");
  const [embedDesc, setEmbedDesc] = useLocalStorage("luna_tickets_desc", "Need assistance? Select a category below to create a ticket.");
  const [embedFooter, setEmbedFooter] = useLocalStorage("luna_tickets_footer", "Luna Bot");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ticket System</h1>
          <p className="text-muted-foreground mt-2">Advanced support tickets with transcripts and category routing.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">System</span>
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-tickets-enabled" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Hash className="w-4 h-4 text-primary" /> Channel Configuration
            </CardTitle>
            <CardDescription>Set up the channels for ticket creation and logging.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-channel">Ticket Panel Channel</Label>
              <Input
                id="ticket-channel"
                placeholder="#create-ticket"
                value={channel}
                onChange={e => setChannel(e.target.value)}
                data-testid="input-ticket-channel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-category">Ticket Category</Label>
              <Input
                id="ticket-category"
                placeholder="Support Tickets"
                value={category}
                onChange={e => setCategory(e.target.value)}
                data-testid="input-ticket-category"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-log">Log Channel</Label>
              <Input
                id="ticket-log"
                placeholder="#ticket-logs"
                value={logChannel}
                onChange={e => setLogChannel(e.target.value)}
                data-testid="input-ticket-log"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderOpen className="w-4 h-4 text-primary" /> Module Toggles
            </CardTitle>
            <CardDescription>Enable or disable individual ticket features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Ticket Transcripts", desc: "Save full chat logs when a ticket is closed", value: transcripts, setter: setTranscripts, id: "switch-transcripts" },
              { label: "Ping Support Role", desc: "Notify the support role when a ticket opens", value: pingRole, setter: setPingRole, id: "switch-pingrole" },
              { label: "Auto-Close Inactive", desc: "Automatically close tickets with no activity", value: autoClose, setter: setAutoClose, id: "switch-autoclose" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch checked={item.value} onCheckedChange={item.setter} data-testid={item.id} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-primary" /> Embed Customization
            </CardTitle>
            <CardDescription>Customize the ticket panel embed that users interact with.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="embed-title">Embed Title</Label>
              <Input id="embed-title" value={embedTitle} onChange={e => setEmbedTitle(e.target.value)} data-testid="input-embed-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="embed-footer">Embed Footer</Label>
              <Input id="embed-footer" value={embedFooter} onChange={e => setEmbedFooter(e.target.value)} data-testid="input-embed-footer" />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="embed-desc">Description</Label>
              <Input id="embed-desc" value={embedDesc} onChange={e => setEmbedDesc(e.target.value)} data-testid="input-embed-desc" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
