import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { MessageSquareWarning, Plus, X, Search } from "lucide-react";

export default function Filters() {
  const [enabled, setEnabled] = useLocalStorage("luna_filters_enabled", true);
  const [words, setWords] = useLocalStorage<string[]>("luna_filters_words", ["badword1", "badword2", "example"]);
  const [deleteMsg, setDeleteMsg] = useLocalStorage("luna_filters_delete", true);
  const [warnUser, setWarnUser] = useLocalStorage("luna_filters_warn", false);
  const [logFilter, setLogFilter] = useLocalStorage("luna_filters_log", true);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const addWord = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !words.includes(trimmed)) {
      setWords([...words, trimmed]);
      setInput("");
    }
  };

  const removeWord = (word: string) => {
    setWords(words.filter(w => w !== word));
  };

  const filtered = words.filter(w => w.includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Filter Words</h1>
          <p className="text-muted-foreground mt-2">Block specific words and phrases from being sent in your server.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Filter</span>
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-filters-enabled" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>
            {enabled ? "Active" : "Off"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Add Filtered Word</CardTitle>
              <CardDescription>Words are matched case-insensitively across all channels.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a word or phrase..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addWord()}
                  data-testid="input-add-word"
                />
                <Button onClick={addWord} data-testid="button-add-word">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Filtered Words</CardTitle>
                <CardDescription>{words.length} word{words.length !== 1 ? "s" : ""} in filter list</CardDescription>
              </div>
              <div className="relative w-48">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  className="pl-7 h-8 text-sm"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  data-testid="input-search-words"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {words.length === 0 ? "No words in the filter list yet." : "No words match your search."}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filtered.map(word => (
                    <Badge
                      key={word}
                      variant="secondary"
                      className="flex items-center gap-1.5 px-2.5 py-1 text-sm font-mono"
                      data-testid={`badge-word-${word}`}
                    >
                      {word}
                      <button
                        onClick={() => removeWord(word)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-testid={`button-remove-${word}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Actions on Trigger</CardTitle>
              <CardDescription>What happens when a filtered word is detected.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Delete Message", desc: "Auto-delete the offending message", value: deleteMsg, setter: setDeleteMsg, id: "switch-delete" },
                { label: "Warn User", desc: "Issue an automatic warning", value: warnUser, setter: setWarnUser, id: "switch-warn" },
                { label: "Log to Channel", desc: "Record detections in log channel", value: logFilter, setter: setLogFilter, id: "switch-log" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={item.value} onCheckedChange={item.setter} data-testid={item.id} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
