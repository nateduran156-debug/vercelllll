import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import {
  Activity, Command, Ticket, ShieldCheck, MessageSquareWarning, Sword,
  Zap, Shield, TrendingUp, Bell, Users, MessageSquare, Gift, Database,
  Moon, ScrollText, Tag, Hash, Pin, Coffee, Code2, Coins, SmilePlus,
  Star, Lightbulb, BarChart2, UserX, BookMarked, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: "General",
    items: [
      { name: "Overview", href: "/", icon: Activity },
      { name: "Commands", href: "/commands", icon: Command },
    ],
  },
  {
    label: "Protection",
    items: [
      { name: "Antinuke", href: "/antinuke", icon: Shield },
      { name: "Automod", href: "/automod", icon: ShieldCheck },
      { name: "Filter Words", href: "/filters", icon: MessageSquareWarning },
      { name: "Anti-Alt", href: "/antialt", icon: UserX },
    ],
  },
  {
    label: "Moderation",
    items: [
      { name: "Moderation", href: "/moderation", icon: Sword },
      { name: "Logging", href: "/logging", icon: ScrollText },
    ],
  },
  {
    label: "Features",
    items: [
      { name: "Tickets", href: "/tickets", icon: Ticket },
      { name: "Leveling", href: "/leveling", icon: TrendingUp },
      { name: "Economy", href: "/economy", icon: Coins },
      { name: "Giveaway", href: "/giveaway", icon: Gift },
      { name: "Welcome / Leave", href: "/welcome", icon: Bell },
      { name: "Autorole", href: "/autorole", icon: Users },
      { name: "Autoresponder", href: "/autoresponder", icon: MessageSquare },
      { name: "Custom Roles", href: "/customroles", icon: Tag },
      { name: "Reaction Roles", href: "/reactionroles", icon: SmilePlus },
      { name: "Starboard", href: "/starboard", icon: Star },
      { name: "Suggestions", href: "/suggestions", icon: Lightbulb },
      { name: "Autoreact", href: "/autoreact", icon: SmilePlus },
      { name: "Tags", href: "/tags", icon: BookMarked },
    ],
  },
  {
    label: "Utilities",
    items: [
      { name: "Counting", href: "/counting", icon: Hash },
      { name: "Nightmode", href: "/nightmode", icon: Moon },
      { name: "Sticky Messages", href: "/sticky", icon: Pin },
      { name: "AFK", href: "/afk", icon: Coffee },
      { name: "Embed Builder", href: "/embed", icon: Code2 },
    ],
  },
  {
    label: "Server",
    items: [
      { name: "Server Stats", href: "/serverstats", icon: BarChart2 },
      { name: "Backup", href: "/backup", icon: Database },
      { name: "Bot Status", href: "/status", icon: Zap },
    ],
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { auth, logout, avatarUrl } = useAuth();
  const user = auth.status === "authenticated" ? auth.user : null;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-56 border-r border-border bg-card flex flex-col hidden md:flex flex-shrink-0">
        <div className="h-14 flex items-center px-4 border-b border-border gap-2.5 flex-shrink-0">
          <Moon className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm tracking-tight">Luna Control</span>
        </div>
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div
                        className={cn(
                          "flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer hover-elevate",
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        )}
                        data-testid={`nav-${item.href.replace("/", "") || "overview"}`}
                      >
                        <item.icon className={cn("mr-2 flex-shrink-0 h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-2.5 border-t border-border flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-2 px-2 py-1.5">
              <img
                src={avatarUrl(user)}
                alt={user.username}
                className="w-6 h-6 rounded-full flex-shrink-0 ring-1 ring-primary/30"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium truncate">
                  {user.global_name ?? user.username}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  @{user.username}
                </span>
              </div>
              <button
                onClick={() => logout()}
                title="Sign out"
                className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                data-testid="button-logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">L</div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium truncate">Luna Bot</span>
                <span className="text-[10px] text-muted-foreground">v4.2.0</span>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-6 sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="text-sm font-medium text-muted-foreground">Systems Operational</span>
          </div>
          <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
            <span>24 servers</span>
            <span>99 commands</span>
            <span className="text-green-400 font-medium">Online</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-5 md:p-7">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
