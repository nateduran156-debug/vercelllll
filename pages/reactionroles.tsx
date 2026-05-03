import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  SmilePlus, Plus, X, Pencil, Check, Hash, ChevronDown, ChevronUp,
  Eye, Trash2, Send, Lock, Unlock, Copy
} from "lucide-react";

type RoleEntry = { emoji: string; role: string; description: string };
type Panel = {
  id: string;
  name: string;
  channel: string;
  messageId: string;
  embedTitle: string;
  embedDesc: string;
  embedColor: string;
  exclusive: boolean;
  enabled: boolean;
  roles: RoleEntry[];
};

const initialPanels: Panel[] = [
  {
    id: "1",
    name: "Color Roles",
    channel: "#roles",
    messageId: "1234567890",
    embedTitle: "🎨 Pick Your Color",
    embedDesc: "React below to choose your name color!",
    embedColor: "#7c3aed",
    exclusive: true,
    enabled: true,
    roles: [
      { emoji: "🔴", role: "Red", description: "Red name color" },
      { emoji: "🔵", role: "Blue", description: "Blue name color" },
      { emoji: "🟢", role: "Green", description: "Green name color" },
      { emoji: "🟡", role: "Yellow", description: "Yellow name color" },
    ],
  },
  {
    id: "2",
    name: "Notification Roles",
    channel: "#roles",
    messageId: "9876543210",
    embedTitle: "🔔 Notification Pings",
    embedDesc: "Choose which pings you want to receive.",
    embedColor: "#2563eb",
    exclusive: false,
    enabled: true,
    roles: [
      { emoji: "📢", role: "Announcements", description: "Server announcements" },
      { emoji: "🎮", role: "Gaming", description: "Gaming session pings" },
      { emoji: "🎉", role: "Events", description: "Server event pings" },
      { emoji: "🆕", role: "Updates", description: "Bot update notifications" },
    ],
  },
];

export default function ReactionRoles() {
  const [panels, setPanels] = useLocalStorage<Panel[]>("luna_rroles_panels", initialPanels);
  const [expandedId, setExpandedId] = useState<string | null>("1");
  const [creatingPanel, setCreatingPanel] = useState(false);
  const [editingPanelId, setEditingPanelId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const [newPanel, setNewPanel] = useState<Omit<Panel, "id" | "roles" | "enabled">>({
    name: "", channel: "", messageId: "", embedTitle: "", embedDesc: "",
    embedColor: "#7c3aed", exclusive: false,
  });

  const [addingRoleTo, setAddingRoleTo] = useState<string | null>(null);
  const [newEmoji, setNewEmoji] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const createPanel = () => {
    if (!newPanel.name.trim() || !newPanel.channel.trim()) return;
    setPanels([...panels, {
      ...newPanel,
      id: Date.now().toString(),
      enabled: true,
      roles: [],
    }]);
    setNewPanel({ name: "", channel: "", messageId: "", embedTitle: "", embedDesc: "", embedColor: "#7c3aed", exclusive: false });
    setCreatingPanel(false);
  };

  const deletePanel = (id: string) => {
    setPanels(panels.filter(p => p.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const togglePanel = (id: string) =>
    setPanels(panels.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));

  const addRole = (panelId: string) => {
    if (!newEmoji.trim() || !newRole.trim()) return;
    setPanels(panels.map(p => p.id === panelId
      ? { ...p, roles: [...p.roles, { emoji: newEmoji.trim(), role: newRole.trim(), description: newRoleDesc.trim() }] }
      : p
    ));
    setNewEmoji(""); setNewRole(""); setNewRoleDesc(""); setAddingRoleTo(null);
  };

  const removeRole = (panelId: string, idx: number) =>
    setPanels(panels.map(p => p.id === panelId
      ? { ...p, roles: p.roles.filter((_, i) => i !== idx) }
      : p
    ));

  const updatePanelField = (id: string, field: keyof Panel, value: unknown) =>
    setPanels(panels.map(p => p.id === id ? { ...p, [field]: value } : p));

  const copyCommand = (p: Panel) => {
    const cmd = `&reactionrole create ${p.channel} ${p.embedTitle}`;
    navigator.clipboard.writeText(cmd).catch(() => {});
  };

  const totalRoles = panels.reduce((s, p) => s + p.roles.length, 0);
  const activePanels = panels.filter(p => p.enabled).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reaction Roles</h1>
          <p className="text-muted-foreground mt-2">
            Let members self-assign roles by reacting to a message with an emoji.
          </p>
        </div>
        <Button onClick={() => setCreatingPanel(true)} data-testid="button-new-panel">
          <Plus className="w-4 h-4 mr-2" /> New Panel
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Active Panels", value: activePanels, color: "text-green-400" },
          { label: "Total Roles", value: totalRoles, color: "text-primary" },
          { label: "Total Panels", value: panels.length },
        ].map(stat => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color || ""}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {creatingPanel && (
        <Card className="bg-card border-primary/30 border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Create New Panel
            </CardTitle>
            <CardDescription>Configure the panel before adding emoji→role pairs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Panel Name (internal)</Label>
                <Input placeholder="e.g. Color Roles" value={newPanel.name} onChange={e => setNewPanel({ ...newPanel, name: e.target.value })} data-testid="input-panel-name" />
              </div>
              <div className="space-y-1.5">
                <Label>Channel</Label>
                <Input placeholder="#roles" value={newPanel.channel} onChange={e => setNewPanel({ ...newPanel, channel: e.target.value })} data-testid="input-panel-channel" />
              </div>
              <div className="space-y-1.5">
                <Label>Embed Title</Label>
                <Input placeholder="🎨 Pick Your Role" value={newPanel.embedTitle} onChange={e => setNewPanel({ ...newPanel, embedTitle: e.target.value })} data-testid="input-panel-title" />
              </div>
              <div className="space-y-1.5">
                <Label>Embed Description</Label>
                <Input placeholder="React to assign a role!" value={newPanel.embedDesc} onChange={e => setNewPanel({ ...newPanel, embedDesc: e.target.value })} data-testid="input-panel-desc" />
              </div>
              <div className="space-y-1.5">
                <Label>Accent Color</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={newPanel.embedColor} onChange={e => setNewPanel({ ...newPanel, embedColor: e.target.value })} className="w-10 h-9 rounded border border-border bg-card cursor-pointer" />
                  <Input value={newPanel.embedColor} onChange={e => setNewPanel({ ...newPanel, embedColor: e.target.value })} className="font-mono text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-5">
                <Switch checked={newPanel.exclusive} onCheckedChange={v => setNewPanel({ ...newPanel, exclusive: v })} data-testid="switch-new-exclusive" />
                <div>
                  <p className="text-sm font-medium">Exclusive Mode</p>
                  <p className="text-xs text-muted-foreground">Only allow one role from this panel</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={createPanel} disabled={!newPanel.name.trim() || !newPanel.channel.trim()} data-testid="button-create-panel">
                <Check className="w-4 h-4 mr-1" /> Create Panel
              </Button>
              <Button variant="secondary" onClick={() => setCreatingPanel(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {panels.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <SmilePlus className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No reaction role panels yet. Create one above!</p>
            </CardContent>
          </Card>
        ) : panels.map(panel => (
          <Card
            key={panel.id}
            className={`bg-card border-border transition-opacity ${!panel.enabled ? "opacity-60" : ""}`}
            data-testid={`panel-${panel.id}`}
          >
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-secondary/20 transition-colors"
              onClick={() => setExpandedId(expandedId === panel.id ? null : panel.id)}
            >
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: panel.embedColor }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{panel.name}</p>
                  <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">{panel.channel}</Badge>
                  {panel.exclusive && (
                    <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-400/30 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Exclusive
                    </Badge>
                  )}
                  <Badge variant="outline" className={`text-[10px] ${panel.enabled ? "text-green-400 border-green-400/30" : "text-muted-foreground"}`}>
                    {panel.enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{panel.roles.length} role{panel.roles.length !== 1 ? "s" : ""} configured</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <Switch
                  checked={panel.enabled}
                  onCheckedChange={() => togglePanel(panel.id)}
                  data-testid={`switch-panel-${panel.id}`}
                />
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setPreviewId(previewId === panel.id ? null : panel.id)} data-testid={`button-preview-${panel.id}`}>
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => deletePanel(panel.id)} data-testid={`button-delete-panel-${panel.id}`}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                {expandedId === panel.id
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                }
              </div>
            </div>

            {previewId === panel.id && (
              <div className="px-5 pb-4">
                <div className="rounded-lg overflow-hidden" style={{ borderLeft: `4px solid ${panel.embedColor}` }}>
                  <div className="bg-[#2f3136] p-4 space-y-3">
                    <div>
                      <p className="text-white font-semibold text-sm">{panel.embedTitle || panel.name}</p>
                      {panel.embedDesc && <p className="text-[#b9bbbe] text-xs mt-1">{panel.embedDesc}</p>}
                    </div>
                    {panel.roles.length > 0 && (
                      <div className="space-y-1.5">
                        {panel.roles.map((r, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <span className="text-lg leading-none">{r.emoji}</span>
                            <div>
                              <span className="text-white text-xs font-medium">{r.role}</span>
                              {r.description && <span className="text-[#72767d] text-xs ml-2">— {r.description}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      {panel.roles.map((r, i) => (
                        <span key={i} className="text-xl cursor-pointer hover:scale-110 transition-transform" title={r.role}>{r.emoji}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => copyCommand(panel)} data-testid={`button-copy-cmd-${panel.id}`}>
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy Command
                  </Button>
                  <code className="text-xs text-muted-foreground flex items-center">&reactionrole setup {panel.channel}</code>
                </div>
              </div>
            )}

            {expandedId === panel.id && (
              <div className="border-t border-border">
                <div className="px-5 pt-4 pb-2">
                  <div className="grid gap-3 md:grid-cols-3 mb-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Embed Title</Label>
                      <Input value={panel.embedTitle} onChange={e => updatePanelField(panel.id, "embedTitle", e.target.value)} className="h-8 text-sm" data-testid={`input-title-${panel.id}`} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Description</Label>
                      <Input value={panel.embedDesc} onChange={e => updatePanelField(panel.id, "embedDesc", e.target.value)} className="h-8 text-sm" data-testid={`input-desc-${panel.id}`} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Color</Label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={panel.embedColor} onChange={e => updatePanelField(panel.id, "embedColor", e.target.value)} className="w-8 h-8 rounded border border-border bg-card cursor-pointer" />
                        <Input value={panel.embedColor} onChange={e => updatePanelField(panel.id, "embedColor", e.target.value)} className="h-8 text-xs font-mono" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <Switch checked={panel.exclusive} onCheckedChange={v => updatePanelField(panel.id, "exclusive", v)} data-testid={`switch-exclusive-${panel.id}`} />
                    <div>
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        {panel.exclusive ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-muted-foreground" />}
                        Exclusive Mode
                      </p>
                      <p className="text-xs text-muted-foreground">Members can only hold one role from this panel at a time.</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Emoji → Role Pairs</p>
                    <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => setAddingRoleTo(addingRoleTo === panel.id ? null : panel.id)} data-testid={`button-add-role-to-${panel.id}`}>
                      <Plus className="w-3 h-3 mr-1" /> Add Pair
                    </Button>
                  </div>

                  {addingRoleTo === panel.id && (
                    <div className="flex gap-2 mb-3 items-end p-3 rounded-lg bg-secondary/40 border border-border">
                      <div className="space-y-1 w-20">
                        <Label className="text-xs">Emoji</Label>
                        <Input placeholder="🎨" value={newEmoji} onChange={e => setNewEmoji(e.target.value)} className="h-8 text-center text-lg" data-testid="input-new-emoji" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Role</Label>
                        <Input placeholder="Role name or ID" value={newRole} onChange={e => setNewRole(e.target.value)} className="h-8" data-testid="input-new-role" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label className="text-xs">Description (optional)</Label>
                        <Input placeholder="Short description" value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} className="h-8" data-testid="input-new-role-desc" />
                      </div>
                      <Button size="sm" className="h-8" onClick={() => addRole(panel.id)} disabled={!newEmoji.trim() || !newRole.trim()} data-testid="button-save-role-pair">
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8" onClick={() => setAddingRoleTo(null)}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}

                  <div className="divide-y divide-border rounded-lg border border-border overflow-hidden mb-4">
                    {panel.roles.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-5">No emoji→role pairs yet. Click "Add Pair" above.</p>
                    ) : panel.roles.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-secondary/20 hover:bg-secondary/40 transition-colors" data-testid={`role-pair-${panel.id}-${i}`}>
                        <span className="text-2xl leading-none w-8 text-center">{r.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{r.role}</p>
                          {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
                        </div>
                        <button
                          onClick={() => removeRole(panel.id, i)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          data-testid={`button-remove-pair-${panel.id}-${i}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-4 flex items-center gap-3 border-t border-border pt-3">
                  <code className="text-xs text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded font-mono flex-1 truncate">
                    &reactionrole setup {panel.channel} — then react to configure
                  </code>
                  <Button size="sm" variant="secondary" data-testid={`button-post-panel-${panel.id}`}>
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Post Panel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">How Reaction Roles Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { step: "1", title: "Create a Panel", desc: "Set a channel, embed design, and exclusive mode. Give it a name for your own reference." },
              { step: "2", title: "Add Emoji → Roles", desc: "For each emoji you want Luna to watch, assign it to a role. Add a description to show in the embed." },
              { step: "3", title: "Post the Panel", desc: "Luna sends the embed to your chosen channel. Members react to get the role, unreact to remove it." },
            ].map(item => (
              <div key={item.step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
