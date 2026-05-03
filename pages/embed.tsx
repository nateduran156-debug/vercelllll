import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Code2, Eye, Send, RefreshCw, Plus, X } from "lucide-react";
import { useState } from "react";

type EmbedField = { name: string; value: string; inline: boolean };

export default function Embed() {
  const [title, setTitle] = useLocalStorage("luna_embed_title", "");
  const [description, setDescription] = useLocalStorage("luna_embed_desc", "");
  const [color, setColor] = useLocalStorage("luna_embed_color", "#7c3aed");
  const [footer, setFooter] = useLocalStorage("luna_embed_footer", "");
  const [footerIcon, setFooterIcon] = useLocalStorage("luna_embed_footer_icon", "");
  const [author, setAuthor] = useLocalStorage("luna_embed_author", "");
  const [authorIcon, setAuthorIcon] = useLocalStorage("luna_embed_author_icon", "");
  const [thumbnail, setThumbnail] = useLocalStorage("luna_embed_thumbnail", "");
  const [image, setImage] = useLocalStorage("luna_embed_image", "");
  const [url, setUrl] = useLocalStorage("luna_embed_url", "");
  const [timestamp, setTimestamp] = useLocalStorage("luna_embed_timestamp", false);
  const [fields, setFields] = useLocalStorage<EmbedField[]>("luna_embed_fields", []);
  const [channel, setChannel] = useLocalStorage("luna_embed_channel", "");

  const addField = () => setFields([...fields, { name: "Field Name", value: "Field value", inline: false }]);
  const updateField = (i: number, patch: Partial<EmbedField>) =>
    setFields(fields.map((f, idx) => idx === i ? { ...f, ...patch } : f));
  const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i));

  const reset = () => {
    setTitle(""); setDescription(""); setColor("#7c3aed"); setFooter(""); setAuthor("");
    setThumbnail(""); setImage(""); setUrl(""); setTimestamp(false); setFields([]);
  };

  const copyJson = () => {
    const embed: Record<string, unknown> = { color: parseInt(color.replace("#", ""), 16) };
    if (title) embed.title = title;
    if (url) embed.url = url;
    if (description) embed.description = description;
    if (author) embed.author = { name: author, icon_url: authorIcon || undefined };
    if (thumbnail) embed.thumbnail = { url: thumbnail };
    if (image) embed.image = { url: image };
    if (footer) embed.footer = { text: footer, icon_url: footerIcon || undefined };
    if (timestamp) embed.timestamp = new Date().toISOString();
    if (fields.length) embed.fields = fields;
    navigator.clipboard.writeText(JSON.stringify({ embeds: [embed] }, null, 2));
  };

  const hasContent = title || description || author || footer;
  const inlineFields = fields.filter(f => f.inline);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Embed Builder</h1>
        <p className="text-muted-foreground mt-2">Create rich Discord embeds with a live preview.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Core</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Embed title" data-testid="input-embed-title" />
              </div>
              <div className="space-y-1.5">
                <Label>Title URL</Label>
                <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." data-testid="input-embed-url" />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Main embed body text. Supports **markdown**."
                  rows={4}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  data-testid="textarea-description"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-1.5 flex-1">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-9 rounded border border-border bg-card cursor-pointer" />
                    <Input value={color} onChange={e => setColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5 flex items-end gap-2">
                  <div className="flex items-center gap-2 pb-1">
                    <Switch checked={timestamp} onCheckedChange={setTimestamp} data-testid="switch-timestamp" />
                    <span className="text-sm">Timestamp</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Author & Footer</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Author Name</Label>
                  <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name" data-testid="input-author" />
                </div>
                <div className="space-y-1.5">
                  <Label>Author Icon URL</Label>
                  <Input value={authorIcon} onChange={e => setAuthorIcon(e.target.value)} placeholder="https://..." data-testid="input-author-icon" />
                </div>
                <div className="space-y-1.5">
                  <Label>Footer Text</Label>
                  <Input value={footer} onChange={e => setFooter(e.target.value)} placeholder="Footer text" data-testid="input-footer" />
                </div>
                <div className="space-y-1.5">
                  <Label>Footer Icon URL</Label>
                  <Input value={footerIcon} onChange={e => setFooterIcon(e.target.value)} placeholder="https://..." data-testid="input-footer-icon" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Images</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Thumbnail URL (small image top-right)</Label>
                <Input value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://..." data-testid="input-thumbnail" />
              </div>
              <div className="space-y-1.5">
                <Label>Large Image URL (bottom of embed)</Label>
                <Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." data-testid="input-image" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Fields ({fields.length}/25)</CardTitle>
              <Button size="sm" variant="secondary" onClick={addField} disabled={fields.length >= 25}><Plus className="w-3.5 h-3.5 mr-1" />Add Field</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((f, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg border border-border bg-secondary/30">
                  <div className="flex-1 grid gap-2 grid-cols-2">
                    <Input value={f.name} onChange={e => updateField(i, { name: e.target.value })} placeholder="Name" className="text-xs" />
                    <Input value={f.value} onChange={e => updateField(i, { value: e.target.value })} placeholder="Value" className="text-xs" />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Switch checked={f.inline} onCheckedChange={v => updateField(i, { inline: v })} />
                    <span className="text-xs text-muted-foreground">inline</span>
                    <button onClick={() => removeField(i)} className="text-muted-foreground hover:text-destructive"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {fields.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No fields added. Fields appear as key-value pairs in the embed.</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> Preview</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={reset}><RefreshCw className="w-3.5 h-3.5 mr-1" />Reset</Button>
                <Button size="sm" variant="secondary" onClick={copyJson}><Code2 className="w-3.5 h-3.5 mr-1" />Copy JSON</Button>
              </div>
            </CardHeader>
            <CardContent>
              {!hasContent && fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Fill in the fields on the left to see a preview.</div>
              ) : (
                <div className="rounded-md overflow-hidden" style={{ borderLeft: `4px solid ${color}` }}>
                  <div className="bg-[#2f3136] p-4 space-y-2">
                    {author && (
                      <div className="flex items-center gap-2">
                        {authorIcon && <img src={authorIcon} className="w-5 h-5 rounded-full" onError={e => (e.currentTarget.style.display = "none")} />}
                        <span className="text-[#b9bbbe] text-xs font-medium">{author}</span>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        {title && (
                          <p className={`font-semibold text-sm mb-1 ${url ? "text-blue-400 hover:underline cursor-pointer" : "text-white"}`}>{title}</p>
                        )}
                        {description && (
                          <p className="text-[#dcddde] text-xs whitespace-pre-wrap">{description}</p>
                        )}
                        {fields.length > 0 && (
                          <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: inlineFields.length > 0 ? "repeat(2, 1fr)" : "1fr" }}>
                            {fields.map((f, i) => (
                              <div key={i} className={f.inline ? "" : "col-span-full"}>
                                <p className="text-white text-xs font-semibold">{f.name}</p>
                                <p className="text-[#b9bbbe] text-xs">{f.value}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {thumbnail && (
                        <img src={thumbnail} className="w-16 h-16 rounded object-cover flex-shrink-0" onError={e => (e.currentTarget.style.display = "none")} />
                      )}
                    </div>
                    {image && (
                      <img src={image} className="w-full rounded mt-2 max-h-40 object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                    )}
                    {(footer || timestamp) && (
                      <div className="flex items-center gap-2 pt-1 border-t border-[#40444b]">
                        {footerIcon && <img src={footerIcon} className="w-4 h-4 rounded-full" onError={e => (e.currentTarget.style.display = "none")} />}
                        <span className="text-[#72767d] text-[11px]">
                          {footer}{footer && timestamp ? " • " : ""}{timestamp ? new Date().toLocaleString() : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Send to Discord</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Channel</Label>
                <Input placeholder="#channel-name" value={channel} onChange={e => setChannel(e.target.value)} data-testid="input-send-channel" />
              </div>
              <Button className="w-full" data-testid="button-send-embed">
                <Send className="w-4 h-4 mr-2" /> Send Embed
              </Button>
              <p className="text-xs text-muted-foreground text-center">Or use <code className="text-primary">&embed</code> in Discord to build interactively.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
