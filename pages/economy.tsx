import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Coins, TrendingUp, Package, Plus, X, Trophy, Settings } from "lucide-react";

type ShopItem = { id: string; name: string; price: number; description: string; roleReward: string };

const initialItems: ShopItem[] = [
  { id: "1", name: "VIP Role (7 days)", price: 500, description: "Get VIP status for a week", roleReward: "VIP" },
  { id: "2", name: "Custom Nickname", price: 200, description: "Set a custom nickname for yourself", roleReward: "" },
  { id: "3", name: "Color Role", price: 150, description: "Choose a custom color for your name", roleReward: "Custom Color" },
];

export default function Economy() {
  const [enabled, setEnabled] = useLocalStorage("luna_economy_enabled", false);
  const [currency, setCurrency] = useLocalStorage("luna_economy_currency", "coins");
  const [currencySymbol, setCurrencySymbol] = useLocalStorage("luna_economy_symbol", "🪙");
  const [workMin, setWorkMin] = useLocalStorage("luna_economy_work_min", 50);
  const [workMax, setWorkMax] = useLocalStorage("luna_economy_work_max", 200);
  const [workCooldown, setWorkCooldown] = useLocalStorage("luna_economy_work_cd", 60);
  const [dailyAmount, setDailyAmount] = useLocalStorage("luna_economy_daily", 500);
  const [weeklyAmount, setWeeklyAmount] = useLocalStorage("luna_economy_weekly", 2000);
  const [startBalance, setStartBalance] = useLocalStorage("luna_economy_start", 100);
  const [robEnabled, setRobEnabled] = useLocalStorage("luna_economy_rob", true);
  const [gamblingEnabled, setGamblingEnabled] = useLocalStorage("luna_economy_gambling", true);
  const [lotteryEnabled, setLotteryEnabled] = useLocalStorage("luna_economy_lottery", false);
  const [shopItems, setShopItems] = useLocalStorage<ShopItem[]>("luna_economy_shop", initialItems);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemRole, setNewItemRole] = useState("");

  const addItem = () => {
    if (!newItemName.trim() || !newItemPrice) return;
    setShopItems([...shopItems, {
      id: Date.now().toString(),
      name: newItemName.trim(),
      price: parseInt(newItemPrice),
      description: newItemDesc.trim(),
      roleReward: newItemRole.trim(),
    }]);
    setNewItemName(""); setNewItemPrice(""); setNewItemDesc(""); setNewItemRole("");
  };

  const topUsers = [
    { name: "RichUser#1234", balance: 12500 },
    { name: "Investor#5678", balance: 8900 },
    { name: "Grinder#9012", balance: 7200 },
    { name: "Saver#3456", balance: 5600 },
    { name: "Worker#7890", balance: 4100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Economy</h1>
          <p className="text-muted-foreground mt-2">Virtual currency system with work, daily rewards, shop, and more.</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} data-testid="switch-economy" />
          <span className={`text-sm font-semibold ${enabled ? "text-green-400" : "text-muted-foreground"}`}>{enabled ? "Enabled" : "Disabled"}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Coins className="w-4 h-4 text-primary" /> Currency Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 grid-cols-2">
              <div className="space-y-2">
                <Label>Currency Name</Label>
                <Input value={currency} onChange={e => setCurrency(e.target.value)} placeholder="coins" data-testid="input-currency-name" />
              </div>
              <div className="space-y-2">
                <Label>Currency Symbol</Label>
                <Input value={currencySymbol} onChange={e => setCurrencySymbol(e.target.value)} placeholder="🪙" data-testid="input-currency-symbol" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Starting Balance</Label>
              <Input type="number" min={0} value={startBalance} onChange={e => setStartBalance(Number(e.target.value))} data-testid="input-start-balance" />
              <p className="text-xs text-muted-foreground">New members start with this amount.</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Daily Reward</Label>
              <Input type="number" min={0} value={dailyAmount} onChange={e => setDailyAmount(Number(e.target.value))} data-testid="input-daily" />
            </div>
            <div className="space-y-2">
              <Label>Weekly Reward</Label>
              <Input type="number" min={0} value={weeklyAmount} onChange={e => setWeeklyAmount(Number(e.target.value))} data-testid="input-weekly" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Work Command</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Min Earnings</Label>
                <span className="font-mono text-primary">{workMin} {currency}</span>
              </div>
              <Slider value={[workMin]} onValueChange={([v]) => setWorkMin(v)} min={1} max={500} step={5} data-testid="slider-work-min" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Max Earnings</Label>
                <span className="font-mono text-primary">{workMax} {currency}</span>
              </div>
              <Slider value={[workMax]} onValueChange={([v]) => setWorkMax(v)} min={workMin} max={1000} step={5} data-testid="slider-work-max" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Cooldown (minutes)</Label>
                <span className="font-mono text-primary">{workCooldown}m</span>
              </div>
              <Slider value={[workCooldown]} onValueChange={([v]) => setWorkCooldown(v)} min={1} max={360} step={5} data-testid="slider-work-cooldown" />
            </div>
            <Separator />
            {[
              { label: "Rob Command", desc: "Allow stealing from other users", value: robEnabled, setter: setRobEnabled, id: "switch-rob" },
              { label: "Gambling", desc: "Enable coinflip, slots, blackjack", value: gamblingEnabled, setter: setGamblingEnabled, id: "switch-gambling" },
              { label: "Lottery", desc: "Weekly lottery with jackpot", value: lotteryEnabled, setter: setLotteryEnabled, id: "switch-lottery" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                <Switch checked={item.value} onCheckedChange={item.setter} data-testid={item.id} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Shop Items</CardTitle>
              <CardDescription>Items members can buy with their {currency}.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Item Name</Label>
                <Input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="e.g. VIP Role" data-testid="input-item-name" />
              </div>
              <div className="space-y-1.5">
                <Label>Price ({currency})</Label>
                <Input type="number" min={1} value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="500" data-testid="input-item-price" />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} placeholder="What it does" data-testid="input-item-desc" />
              </div>
              <div className="space-y-1.5">
                <Label>Role Reward (optional)</Label>
                <Input value={newItemRole} onChange={e => setNewItemRole(e.target.value)} placeholder="@Role on purchase" data-testid="input-item-role" />
              </div>
            </div>
            <Button onClick={addItem} disabled={!newItemName.trim() || !newItemPrice} data-testid="button-add-item">
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {shopItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/30" data-testid={`shop-item-${item.id}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs text-primary border-primary/30 font-mono">{item.price.toLocaleString()} {currencySymbol}</Badge>
                      {item.roleReward && <Badge variant="outline" className="text-[10px] text-green-400 border-green-400/30">+{item.roleReward}</Badge>}
                    </div>
                  </div>
                  <button onClick={() => setShopItems(shopItems.filter(x => x.id !== item.id))} className="text-muted-foreground hover:text-destructive flex-shrink-0 mt-0.5"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Richest Members</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {topUsers.map((u, i) => (
                <div key={u.name} className="flex items-center gap-4 px-6 py-3" data-testid={`economy-rank-${i + 1}`}>
                  <span className={`w-7 text-center text-sm font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-400" : "text-muted-foreground"}`}>#{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{u.name[0]}</div>
                  <span className="flex-1 text-sm font-medium">{u.name}</span>
                  <span className="font-mono text-sm text-primary">{currencySymbol} {u.balance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
