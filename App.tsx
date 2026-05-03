import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import { AuthProvider, useAuth } from "@/contexts/auth-context";

import Overview from "@/pages/overview";
import Commands from "@/pages/commands";
import Tickets from "@/pages/tickets";
import Automod from "@/pages/automod";
import Filters from "@/pages/filters";
import Moderation from "@/pages/moderation";
import Status from "@/pages/status";
import Antinuke from "@/pages/antinuke";
import Leveling from "@/pages/leveling";
import Welcome from "@/pages/welcome";
import Logging from "@/pages/logging";
import Autorole from "@/pages/autorole";
import Autoresponder from "@/pages/autoresponder";
import Giveaway from "@/pages/giveaway";
import Backup from "@/pages/backup";
import CustomRoles from "@/pages/customroles";
import Counting from "@/pages/counting";
import Nightmode from "@/pages/nightmode";
import Sticky from "@/pages/sticky";
import Afk from "@/pages/afk";
import Embed from "@/pages/embed";
import Economy from "@/pages/economy";
import ReactionRoles from "@/pages/reactionroles";
import Starboard from "@/pages/starboard";
import Suggestions from "@/pages/suggestions";
import ServerStats from "@/pages/serverstats";
import Autoreact from "@/pages/autoreact";
import AntiAlt from "@/pages/antialt";
import Tags from "@/pages/tags";

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary fill-current">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
        </div>
        <p className="text-sm text-muted-foreground">Verifying session…</p>
      </div>
    </div>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();

  if (auth.status === "loading") return <LoadingScreen />;
  if (auth.status === "unauthenticated") return <Login />;
  return <>{children}</>;
}

function Router() {
  return (
    <AuthGate>
      <Layout>
        <Switch>
          <Route path="/" component={Overview} />
          <Route path="/commands" component={Commands} />
          <Route path="/tickets" component={Tickets} />
          <Route path="/automod" component={Automod} />
          <Route path="/filters" component={Filters} />
          <Route path="/moderation" component={Moderation} />
          <Route path="/status" component={Status} />
          <Route path="/antinuke" component={Antinuke} />
          <Route path="/leveling" component={Leveling} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/logging" component={Logging} />
          <Route path="/autorole" component={Autorole} />
          <Route path="/autoresponder" component={Autoresponder} />
          <Route path="/giveaway" component={Giveaway} />
          <Route path="/backup" component={Backup} />
          <Route path="/customroles" component={CustomRoles} />
          <Route path="/counting" component={Counting} />
          <Route path="/nightmode" component={Nightmode} />
          <Route path="/sticky" component={Sticky} />
          <Route path="/afk" component={Afk} />
          <Route path="/embed" component={Embed} />
          <Route path="/economy" component={Economy} />
          <Route path="/reactionroles" component={ReactionRoles} />
          <Route path="/starboard" component={Starboard} />
          <Route path="/suggestions" component={Suggestions} />
          <Route path="/serverstats" component={ServerStats} />
          <Route path="/autoreact" component={Autoreact} />
          <Route path="/antialt" component={AntiAlt} />
          <Route path="/tags" component={Tags} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </AuthGate>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
