import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const commandsData = {
  ANTINUKE: ["antiban", "antikick", "antichannelcreate", "antichanneldelete", "antichannelupdate", "antirolecreat", "antiroledelete", "antiroleupdate", "antibotadd", "antiwebhook", "antiprune", "anti_everyone"],
  AUTOMOD: ["anticaps", "antilink", "anti-invites", "anti-mass-mention", "anti-emoji-spam", "antispam"],
  MODERATION: ["ban", "unban", "unbanall", "kick", "warn", "mute", "unmute", "timeout", "hide", "unhide", "lock", "unlock", "snipe", "role", "message"],
  GENERAL: ["help", "avatar", "userinfo", "serverinfo", "membercount", "ping", "botinfo", "invite"],
  FUN: ["coinflip", "8ball", "meme", "joke", "roast", "compliment", "rps", "trivia"],
  LEVELING: ["rank", "leaderboard", "setxp", "resetxp", "setlevel", "levelroles"],
  TICKETS: ["ticketsetup", "ticketpanel", "ticketcategory", "ticketclose", "tickettranscript", "ticketlog"],
  GIVEAWAY: ["gcreate", "gend", "greroll", "glist"],
  UTILITY: ["afk", "counting", "nightmode", "sticky", "todo", "timer", "backup", "crypto", "googlesearch", "googlelens"],
  GAMES: ["chess", "tictactoe", "connect4", "battleship", "wordle", "2048", "rps", "typeracer", "memgame"],
  CUSTOMIZATION: ["embed", "autorole", "autoreact", "autoresponder", "customrole", "vanityroles", "welcomer"],
  MEDIA: ["pfp", "pfps", "banner", "steal"],
  AI: ["ai", "chat"],
  "BOT STATUS": ["setactivity", "setstatus", "clearactivity"]
};

const allCategories = Object.keys(commandsData);

export default function Commands() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredData = Object.entries(commandsData).reduce((acc, [category, cmds]) => {
    if (activeCategory && category !== activeCategory) return acc;
    
    const filteredCmds = cmds.filter(cmd => 
      cmd.toLowerCase().includes(search.toLowerCase())
    );
    
    if (filteredCmds.length > 0) {
      acc[category] = filteredCmds;
    }
    
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commands Database</h1>
        <p className="text-muted-foreground mt-2">Explore and search through all 99 Luna commands.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search commands..." 
            className="pl-9 bg-card border-border/50 focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={activeCategory === null ? "default" : "secondary"}
            className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1 text-sm"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Badge>
          {allCategories.map(cat => (
            <Badge 
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80 transition-colors px-3 py-1 text-sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(filteredData).map(([category, cmds]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground border-b border-border/50 pb-2">{category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cmds.map(cmd => (
                <Card key={cmd} className="bg-card/30 hover:bg-primary/5 border-border/40 transition-colors">
                  <CardContent className="p-3 flex items-center gap-2">
                    <span className="text-primary font-mono text-sm">/</span>
                    <span className="font-medium text-sm">{cmd}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(filteredData).length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No commands found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
