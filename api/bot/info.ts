import type { VercelRequest, VercelResponse } from "@vercel/node";
import { jwtVerify } from "jose";

function parseCookies(cookieHeader: string): Record<string, string> {
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );
}

async function isAuthenticated(req: VercelRequest): Promise<boolean> {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) return false;
  const cookies = parseCookies(req.headers.cookie ?? "");
  const token = cookies["luna_session"];
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(sessionSecret));
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await isAuthenticated(req))) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    return res.status(404).json({ error: "BOT_TOKEN not configured" });
  }

  try {
    const [botRes, guildRes] = await Promise.all([
      fetch("https://discord.com/api/v10/users/@me", {
        headers: { Authorization: `Bot ${botToken}` },
      }),
      fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: { Authorization: `Bot ${botToken}` },
      }),
    ]);

    if (!botRes.ok) {
      return res.status(400).json({ error: "Invalid bot token" });
    }

    const bot = (await botRes.json()) as {
      id: string;
      username: string;
      discriminator: string;
      avatar: string | null;
    };

    const guilds = guildRes.ok ? await guildRes.json() as unknown[] : [];

    const avatarUrl = bot.avatar
      ? `https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.webp?size=256`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    return res.json({
      id: bot.id,
      username: bot.username,
      discriminator: bot.discriminator,
      avatar: avatarUrl,
      serverCount: Array.isArray(guilds) ? guilds.length : 0,
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch bot info" });
  }
}
