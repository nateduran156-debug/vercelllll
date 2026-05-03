import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Tag, Plus, X, Pencil, Check, Hash, Star, Crown } from "lucide-react";

type CustomRole = {
  id: string;
  name: string;
  color: string;
  selfAssignable: boolean;
  requiredRole: string;
  description: string;
};

const initialRoles: CustomRole[] = [
  { id: "1", name: "Gamer", color: "#7c3aed", selfAssignable: true, requiredRole: "", description: "Gaming enthusiast" },
  { id: "2", name: "Artist", color: "#2563eb", selfAssignable: true, requiredRole: "", description: "Creative member" },
  { id: "3", name: "Music Fan", color: "#16a34a", selfAssignable: true, requiredRole: "", description: "Music lover" },
  { id: "4", name: "VIP", color: "#d97706", selfAssignable: false, requiredRole: "Level 25+", description: "Exclusive VIP role" },
];

export default function CustomRoles() {
  const [enabled, setEnabled] = useLocalStorage("luna_customroles_enabled", true);
  const [roles, setRoles] = useLocalStorage<CustomRole[]>("luna_customroles_list", initialRoles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#7c3aed");
  const [newDesc, setNewDesc] = useState("");
  const [newRequired, setNewRequired] = useState("");
  const [newSelfAssign, setNewSelfAssign] = useState(true);
  const [panelChannel, setPanelChannel] = useLocalStorage("luna_customroles_channel", "");
  const [uniqueRole, setUniqueRole] = useLocalStorage("luna_customroles_unique", false);
  const [editState, setEditState] = useState<Partial<CustomRole>>({});

  const addRole = () => {
    if (!newName.trim()) return;
    setRoles([...roles, {
      id: Date.now().toString(),
      name: newName.trim(),
      color: newColor,
      selfAssignable: newSelfAssign,
      requiredRole: newRequired.trim(),
      description: newDesc.trim(),
    }]);
    setNewName(""); setNewDesc(""); setNewRequired(""); setNewColor("#7c3aed");
  };

  const startEdit = (r: CustomRole) => { setEditingId(r.id); setEditState({ ...r }); };
  const saveEdit = () => {
    setRoles(roles.map(r => r.id === editingId ? { ...r, ...editState } : r));
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Roles</h1>
          <p className="text-muted-foreground mt-2">Let members self-assign roles and create cosmetic custom roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-customroles" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>{enabled ? "Enabled" : "Disabled"}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Add New Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 grid-cols-2">
              <div className="space-y-1.5 col-span-2">
                <Label>Role Name</Label>
                <Input placeholder="e.g. Gamer, Artist" value={newName} onChange={e => setNewName(e.target.value)} data-testid="input-role-name" />
              </div>
              <div className="space-y-1.5">
                <Label>Role Color</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-10 h-9 rounded border border-border bg-card cursor-pointer" />
                  <Input value={newColor} onChange={e => setNewColor(e.target.value)} className="font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Required Role (optional)</Label>
                <Input placeholder="e.g. Member" value={newRequired} onChange={e => setNewRequired(e.target.value)} data-testid="input-required-role" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Description</Label>
                <Input placeholder="Short description shown in panel" value={newDesc} onChange={e => setNewDesc(e.target.value)} data-testid="input-role-desc" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Self-Assignable</p>
                <p className="text-xs text-muted-foreground">Members can assign this role themselves</p>
              </div>
              <Switch checked={newSelfAssign} onCheckedChange={setNewSelfAssign} data-testid="switch-self-assign" />
            </div>
            <Button onClick={addRole} disabled={!newName.trim()} className="w-full" data-testid="button-add-role">
              <Plus className="w-4 h-4 mr-2" /> Add Role
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> Panel Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Role Panel Channel</Label>
              <Input placeholder="#roles" value={panelChannel} onChange={e => setPanelChannel(e.target.value)} data-testid="input-panel-channel" />
              <p className="text-xs text-muted-foreground">Use <code className="text-primary">&customrole panel</code> to post the role selector here.</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Unique Roles</p>
                <p className="text-xs text-muted-foreground">Only allow one self-assignable role at a time</p>
              </div>
              <Switch checked={uniqueRole} onCheckedChange={setUniqueRole} data-testid="switch-unique" />
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Quick Commands</p>
              {[
                { cmd: "&customrole add @role", desc: "Make a role self-assignable" },
                { cmd: "&customrole remove @role", desc: "Remove from self-assignable" },
                { cmd: "&customrole list", desc: "Show all custom roles" },
                { cmd: "&iam @role", desc: "Assign yourself a role" },
                { cmd: "&iamnot @role", desc: "Remove a role from yourself" },
              ].map(c => (
                <div key={c.cmd} className="flex items-center gap-2">
                  <code className="text-xs font-mono text-primary flex-shrink-0">{c.cmd}</code>
                  <span className="text-xs text-muted-foreground truncate">— {c.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Configured Roles ({roles.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {roles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No custom roles yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {roles.map(r => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/20 transition-colors" data-testid={`role-${r.id}`}>
                  {editingId === r.id ? (
                    <div className="flex-1 grid gap-2 grid-cols-3">
                      <Input value={editState.name || ""} onChange={e => setEditState({ ...editState, name: e.target.value })} placeholder="Name" />
                      <Input value={editState.description || ""} onChange={e => setEditState({ ...editState, description: e.target.value })} placeholder="Description" />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={saveEdit}><Check className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{r.name}</span>
                          {r.selfAssignable && <Badge variant="outline" className="text-[10px] text-green-400 border-green-400/30">Self-assign</Badge>}
                          {r.requiredRole && <Badge variant="outline" className="text-[10px] text-yellow-400 border-yellow-400/30">Req: {r.requiredRole}</Badge>}
                        </div>
                        {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(r)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => setRoles(roles.filter(x => x.id !== r.id))}><X className="w-3.5 h-3.5" /></Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
