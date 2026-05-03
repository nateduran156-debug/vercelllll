import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { BookMarked, Plus, X, Pencil, Check, Search, Copy, Clock } from "lucide-react";

type Tag = {
  id: string;
  name: string;
  content: string;
  aliases: string[];
  uses: number;
  createdBy: string;
  restricted: boolean;
};

const initialTags: Tag[] = [
  { id: "1", name: "rules", content: "📋 **Server Rules**\n\n1. Be respectful\n2. No spamming\n3. No NSFW content\n4. Follow Discord ToS\n\nViolations may result in a mute or ban.", aliases: ["rule", "serverrules"], uses: 142, createdBy: "Admin#0001", restricted: false },
  { id: "2", name: "invite", content: "🔗 **Invite Luna Bot**\nhttps://discord.com/oauth2/authorize\n\nUse `&help` to see all available commands.", aliases: ["inv", "add"], uses: 89, createdBy: "Admin#0001", restricted: false },
  { id: "3", name: "staff", content: "👑 **Staff Team**\n\n- **Owner:** ServerOwner\n- **Admins:** Admin1, Admin2\n- **Mods:** Mod1, Mod2, Mod3\n\nNeed help? Open a ticket with `&ticket`.", aliases: ["mods", "admins"], uses: 67, createdBy: "Admin#0001", restricted: false },
  { id: "4", name: "ban-appeal", content: "📝 **Ban Appeal Form**\n\nIf you believe your ban was unjust, fill out this form:\nhttps://forms.google.com/...", aliases: ["appeal"], uses: 23, createdBy: "Mod#0002", restricted: true },
];

export default function Tags() {
  const [tags, setTags] = useLocalStorage<Tag[]>("luna_tags_list", initialTags);
  const [prefix, setPrefix] = useLocalStorage("luna_tags_prefix", "&");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Partial<Tag>>({});
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAliases, setNewAliases] = useState("");
  const [newRestricted, setNewRestricted] = useState(false);
  const [creating, setCreating] = useState(false);

  const filtered = tags.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase()) ||
    t.aliases.some(a => a.toLowerCase().includes(search.toLowerCase()))
  );

  const addTag = () => {
    if (!newName.trim() || !newContent.trim()) return;
    setTags([...tags, {
      id: Date.now().toString(),
      name: newName.trim().toLowerCase().replace(/\s+/g, "-"),
      content: newContent.trim(),
      aliases: newAliases.split(/[\s,]+/).map(a => a.trim()).filter(Boolean),
      uses: 0,
      createdBy: "You",
      restricted: newRestricted,
    }]);
    setNewName(""); setNewContent(""); setNewAliases(""); setNewRestricted(false); setCreating(false);
  };

  const startEdit = (t: Tag) => { setEditingId(t.id); setEditState({ ...t }); };
  const saveEdit = () => {
    setTags(tags.map(t => t.id === editingId ? { ...t, ...editState } : t));
    setEditingId(null);
  };
  const deleteTag = (id: string) => setTags(tags.filter(t => t.id !== id));

  const copyTagCommand = (name: string) => {
    navigator.clipboard.writeText(`${prefix}tag ${name}`).catch(() => {});
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground mt-2">Create custom bot responses that members can call with <code className="text-primary">{prefix}tag &lt;name&gt;</code>.</p>
        </div>
        <Button onClick={() => setCreating(true)} data-testid="button-new-tag">
          <Plus className="w-4 h-4 mr-2" /> New Tag
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Total Tags", value: tags.length },
          { label: "Total Uses", value: tags.reduce((s, t) => s + t.uses, 0).toLocaleString(), color: "text-primary" },
          { label: "Most Used", value: tags.sort((a, b) => b.uses - a.uses)[0]?.name || "—" },
        ].map(s => (
          <Card key={s.label} className="bg-card border-border text-center">
            <CardContent className="p-4">
              <p className={`text-xl font-bold truncate ${s.color || ""}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Tag Prefix</Label>
          <Input value={prefix} onChange={e => setPrefix(e.target.value)} className="max-w-[120px]" placeholder="&" data-testid="input-prefix" />
          <p className="text-xs text-muted-foreground">Members use <code className="text-primary">{prefix}tag &lt;tagname&gt;</code> to trigger tags.</p>
        </div>
      </div>

      {creating && (
        <Card className="bg-card border-primary/30 border-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Create New Tag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Tag Name</Label>
                <Input placeholder="e.g. rules, faq, staff" value={newName} onChange={e => setNewName(e.target.value)} data-testid="input-tag-name" />
                <p className="text-xs text-muted-foreground">Called with: <code className="text-primary">{prefix}tag {newName || "name"}</code></p>
              </div>
              <div className="space-y-1.5">
                <Label>Aliases (comma-separated)</Label>
                <Input placeholder="e.g. rule, serverrules" value={newAliases} onChange={e => setNewAliases(e.target.value)} data-testid="input-aliases" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Tag response text. Supports Discord markdown (**bold**, *italic*, `code`, etc.)"
                rows={5}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                data-testid="textarea-content"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={newRestricted} onCheckedChange={setNewRestricted} data-testid="switch-restricted" />
              <div>
                <p className="text-sm font-medium">Staff Only</p>
                <p className="text-xs text-muted-foreground">Only moderators and admins can use this tag</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addTag} disabled={!newName.trim() || !newContent.trim()} data-testid="button-create-tag">
                <Check className="w-4 h-4 mr-1" /> Create Tag
              </Button>
              <Button variant="secondary" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">All Tags ({filtered.length})</CardTitle>
          <div className="relative w-52">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input className="pl-7 h-8 text-sm" placeholder="Search tags..." value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No tags found.</p>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(tag => (
                <div key={tag.id} className="px-5 py-4 hover:bg-secondary/20 transition-colors" data-testid={`tag-${tag.id}`}>
                  {editingId === tag.id ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Name</Label>
                          <Input value={editState.name || ""} onChange={e => setEditState({ ...editState, name: e.target.value })} data-testid={`input-edit-name-${tag.id}`} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Aliases</Label>
                          <Input
                            value={(editState.aliases || []).join(", ")}
                            onChange={e => setEditState({ ...editState, aliases: e.target.value.split(/[\s,]+/).map(a => a.trim()).filter(Boolean) })}
                            data-testid={`input-edit-aliases-${tag.id}`}
                          />
                        </div>
                      </div>
                      <textarea
                        value={editState.content || ""}
                        onChange={e => setEditState({ ...editState, content: e.target.value })}
                        rows={4}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        data-testid={`textarea-edit-${tag.id}`}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}><Check className="w-3.5 h-3.5 mr-1" /> Save</Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <code className="text-sm font-mono font-bold text-primary">{prefix}tag {tag.name}</code>
                          {tag.aliases.map(a => (
                            <Badge key={a} variant="outline" className="text-[10px] font-mono text-muted-foreground">{a}</Badge>
                          ))}
                          {tag.restricted && <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-400/30">Staff Only</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-wrap">{tag.content}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-2.5 h-2.5" />by {tag.createdBy}</span>
                          <span className="text-[10px] text-muted-foreground">{tag.uses.toLocaleString()} uses</span>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => copyTagCommand(tag.name)} title="Copy command" data-testid={`button-copy-${tag.id}`}><Copy className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(tag)} data-testid={`button-edit-${tag.id}`}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:text-destructive" onClick={() => deleteTag(tag.id)} data-testid={`button-delete-${tag.id}`}><X className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
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
