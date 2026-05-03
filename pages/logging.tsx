import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ScrollText, MessageSquare, UserX, Shield, Hash, Tag, Settings, Mic, FileText } from "lucide-react";

const logCategories = [
  {
    label: "Messages",
    icon: MessageSquare,
    events: [
      { key: "msg_delete", label: "Message Deleted", desc: "Logs deleted messages with content" },
      { key: "msg_edit", label: "Message Edited", desc: "Logs message edits (before & after)" },
      { key: "msg_bulk", label: "Bulk Delete", desc: "Logs mass message deletions" },
    ],
  },
  {
    label: "Members",
    icon: UserX,
    events: [
      { key: "member_join", label: "Member Join", desc: "Logs when a member joins the server" },
      { key: "member_leave", label: "Member Leave", desc: "Logs when a member leaves or is kicked" },
      { key: "member_ban", label: "Member Ban", desc: "Logs bans with reason and moderator" },
      { key: "member_unban", label: "Member Unban", desc: "Logs unbans" },
      { key: "member_update", label: "Member Update", desc: "Logs nickname and role changes" },
      { key: "member_warn", label: "Member Warn", desc: "Logs warnings issued to members" },
      { key: "member_timeout", label: "Member Timeout", desc: "Logs timeouts with duration" },
    ],
  },
  {
    label: "Channels",
    icon: Hash,
    events: [
      { key: "channel_create", label: "Channel Created", desc: "Logs new channel creation" },
      { key: "channel_delete", label: "Channel Deleted", desc: "Logs channel deletions" },
      { key: "channel_update", label: "Channel Updated", desc: "Logs name, topic, and permission edits" },
    ],
  },
  {
    label: "Roles",
    icon: Tag,
    events: [
      { key: "role_create", label: "Role Created", desc: "Logs new role creation" },
      { key: "role_delete", label: "Role Deleted", desc: "Logs role deletions" },
      { key: "role_update", label: "Role Updated", desc: "Logs permission and name changes" },
    ],
  },
  {
    label: "Server",
    icon: Settings,
    events: [
      { key: "server_update", label: "Server Updated", desc: "Logs server name, icon, and setting changes" },
      { key: "invite_create", label: "Invite Created", desc: "Logs new invite links" },
      { key: "invite_delete", label: "Invite Deleted", desc: "Logs deleted invites" },
      { key: "emoji_update", label: "Emoji Updated", desc: "Logs emoji additions and removals" },
    ],
  },
  {
    label: "Voice",
    icon: Mic,
    events: [
      { key: "voice_join", label: "Voice Join", desc: "Logs when members join voice channels" },
      { key: "voice_leave", label: "Voice Leave", desc: "Logs when members leave voice channels" },
      { key: "voice_move", label: "Voice Move", desc: "Logs when members are moved between voice channels" },
    ],
  },
  {
    label: "Automod",
    icon: Shield,
    events: [
      { key: "automod_trigger", label: "Automod Trigger", desc: "Logs every automod rule activation" },
      { key: "filter_trigger", label: "Word Filter Hit", desc: "Logs filtered word detections" },
    ],
  },
];

export default function Logging() {
  const [masterEnabled, setMasterEnabled] = useLocalStorage("luna_logging_master", false);
  const [defaultChannel, setDefaultChannel] = useLocalStorage("luna_logging_default_channel", "");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logging</h1>
          <p className="text-muted-foreground mt-2">Track every action in your server with detailed event logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Logging</span>
          <Switch checked={masterEnabled} onCheckedChange={setMasterEnabled} data-testid="switch-logging-master" />
          <span className={`text-sm font-semibold ${masterEnabled ? "text-green-400" : "text-muted-foreground"}`}>{masterEnabled ? "Active" : "Off"}</span>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Default Log Channel</CardTitle>
          <CardDescription>Events without a specific channel will be sent here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder="#audit-logs" value={defaultChannel} onChange={e => setDefaultChannel(e.target.value)} className="max-w-sm" data-testid="input-default-channel" />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {logCategories.map(cat => (
          <LogCategory key={cat.label} category={cat} masterEnabled={masterEnabled} />
        ))}
      </div>
    </div>
  );
}

function LogCategory({ category, masterEnabled }: { category: typeof logCategories[0]; masterEnabled: boolean }) {
  const Icon = category.icon;
  return (
    <Card className={`bg-card border-border transition-opacity ${!masterEnabled ? "opacity-50" : ""}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" /> {category.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {category.events.map(event => (
            <LogEventRow key={event.key} event={event} masterEnabled={masterEnabled} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LogEventRow({ event, masterEnabled }: { event: { key: string; label: string; desc: string }; masterEnabled: boolean }) {
  const [enabled, setEnabled] = useLocalStorage(`luna_log_${event.key}`, false);
  const [channel, setChannel] = useLocalStorage(`luna_log_${event.key}_channel`, "");

  return (
    <div className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/20 transition-colors" data-testid={`log-event-${event.key}`}>
      <Switch checked={enabled} onCheckedChange={setEnabled} disabled={!masterEnabled} data-testid={`switch-${event.key}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{event.label}</p>
        <p className="text-xs text-muted-foreground">{event.desc}</p>
      </div>
      {enabled && masterEnabled && (
        <Input
          className="w-40 h-7 text-xs"
          placeholder="#log-channel"
          value={channel}
          onChange={e => setChannel(e.target.value)}
          data-testid={`input-channel-${event.key}`}
        />
      )}
    </div>
  );
}
