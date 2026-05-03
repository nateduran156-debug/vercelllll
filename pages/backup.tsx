import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Database, Plus, RotateCcw, Trash2, Download, Clock, CheckCircle, AlertTriangle, Info } from "lucide-react";

type BackupEntry = {
  id: string;
  name: string;
  createdAt: string;
  size: string;
  includes: string[];
  status: "complete" | "partial";
};

const initialBackups: BackupEntry[] = [
  { id: "1", name: "Full Backup — May 1", createdAt: "2026-05-01T14:30", size: "2.4 MB", includes: ["channels", "roles", "permissions", "bans", "emojis"], status: "complete" },
  { id: "2", name: "Pre-Update Backup", createdAt: "2026-04-28T09:15", size: "2.1 MB", includes: ["channels", "roles", "permissions"], status: "complete" },
  { id: "3", name: "Quick Channels Backup", createdAt: "2026-04-20T18:45", size: "0.8 MB", includes: ["channels"], status: "partial" },
];

const backupComponents = [
  { key: "channels", label: "Channels", desc: "All text and voice channels with their settings" },
  { key: "roles", label: "Roles", desc: "All roles with permissions and colors" },
  { key: "permissions", label: "Permissions", desc: "Channel permission overwrites" },
  { key: "bans", label: "Ban List", desc: "All server bans with reasons" },
  { key: "emojis", label: "Emojis", desc: "Custom server emojis" },
  { key: "settings", label: "Server Settings", desc: "Server name, icon, verification level" },
];

export default function Backup() {
  const [backups, setBackups] = useLocalStorage<BackupEntry[]>("luna_backups", initialBackups);
  const [autoBackup, setAutoBackup] = useLocalStorage("luna_backup_auto", false);
  const [autoInterval, setAutoInterval] = useLocalStorage("luna_backup_interval", "24");
  const [selected, setSelected] = useLocalStorage<string[]>("luna_backup_components", ["channels", "roles", "permissions", "bans"]);
  const [backupName, setBackupName] = useState("");
  const [creating, setCreating] = useState(false);

  const toggleComponent = (key: string) =>
    setSelected(selected.includes(key) ? selected.filter(s => s !== key) : [...selected, key]);

  const createBackup = () => {
    if (selected.length === 0) return;
    setCreating(true);
    setTimeout(() => {
      setBackups([{
        id: Date.now().toString(),
        name: backupName.trim() || `Backup — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        createdAt: new Date().toISOString().slice(0, 16),
        size: `${(selected.length * 0.4 + Math.random()).toFixed(1)} MB`,
        includes: [...selected],
        status: selected.length >= 4 ? "complete" : "partial",
      }, ...backups]);
      setBackupName("");
      setCreating(false);
    }, 1200);
  };

  const deleteBackup = (id: string) =>
    setBackups(backups.filter(b => b.id !== id));

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backup</h1>
        <p className="text-muted-foreground mt-2">Save and restore your server's structure, roles, and settings.</p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Total Backups", value: backups.length },
          { label: "Latest Backup", value: backups[0] ? fmtDate(backups[0].createdAt) : "Never" },
          { label: "Auto Backup", value: autoBackup ? `Every ${autoInterval}h` : "Off", accent: autoBackup },
        ].map(stat => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className={`text-lg font-bold truncate ${stat.accent ? "text-green-400" : ""}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Create Backup</CardTitle>
            <CardDescription>Select what to include and save a snapshot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Backup Name (optional)</Label>
              <Input placeholder={`Backup — ${new Date().toLocaleDateString()}`} value={backupName} onChange={e => setBackupName(e.target.value)} data-testid="input-backup-name" />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Include in backup:</Label>
              <div className="grid gap-2 grid-cols-2">
                {backupComponents.map(c => (
                  <button
                    key={c.key}
                    onClick={() => toggleComponent(c.key)}
                    data-testid={`toggle-${c.key}`}
                    className={`text-left p-3 rounded-lg border text-sm transition-all ${selected.includes(c.key) ? "border-primary bg-primary/10" : "border-border bg-secondary/30 hover:border-primary/30"}`}
                  >
                    <p className={`font-medium text-xs ${selected.includes(c.key) ? "text-primary" : ""}`}>{c.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={createBackup} disabled={creating || selected.length === 0} className="w-full" data-testid="button-create-backup">
              <Database className={`w-4 h-4 mr-2 ${creating ? "animate-spin" : ""}`} />
              {creating ? "Creating backup..." : "Create Backup"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Auto Backup</CardTitle>
            <CardDescription>Automatically create backups on a schedule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable Auto Backup</p>
                <p className="text-xs text-muted-foreground">Automatically backup on interval</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} data-testid="switch-auto-backup" />
                <span className={`text-xs font-semibold ${autoBackup ? "text-green-400" : "text-muted-foreground"}`}>{autoBackup ? "On" : "Off"}</span>
              </div>
            </div>
            {autoBackup && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Interval (hours)</Label>
                  <Input type="number" min={1} max={168} value={autoInterval} onChange={e => setAutoInterval(e.target.value)} className="max-w-[120px]" data-testid="input-interval" />
                  <p className="text-xs text-muted-foreground">Backup will run every <strong>{autoInterval}</strong> hour{autoInterval !== "1" ? "s" : ""}.</p>
                </div>
              </>
            )}
            <Separator />
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-400/90">Use <code className="font-mono">&backup create</code> in Discord to create a backup directly from chat.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Saved Backups</CardTitle>
          <CardDescription>{backups.length} backup{backups.length !== 1 ? "s" : ""} stored</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {backups.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No backups yet. Create your first backup above.</p>
          ) : (
            <div className="divide-y divide-border">
              {backups.map(b => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors" data-testid={`backup-${b.id}`}>
                  <div className={`p-2 rounded-lg flex-shrink-0 ${b.status === "complete" ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                    {b.status === "complete"
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{b.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">{fmtDate(b.createdAt)}</span>
                      <span className="text-xs text-muted-foreground">{b.size}</span>
                      <div className="flex gap-1 flex-wrap">
                        {b.includes.map(inc => <Badge key={inc} variant="outline" className="text-[10px] px-1.5 py-0 capitalize">{inc}</Badge>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button size="sm" variant="secondary" className="h-8 text-xs gap-1" data-testid={`button-restore-${b.id}`}>
                      <RotateCcw className="w-3 h-3" /> Restore
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-destructive" onClick={() => deleteBackup(b.id)} data-testid={`button-delete-backup-${b.id}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
