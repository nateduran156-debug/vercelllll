import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return res.status(500).send(
      `<html><body style="background:#0a0a0f;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
        <div style="text-align:center;max-width:400px;padding:32px;border:1px solid #3b3b5c;border-radius:12px">
          <h2 style="color:#a78bfa">Setup Required</h2>
          <p style="color:#888;font-size:14px">DISCORD_CLIENT_ID is not set. Add it as a Vercel environment variable and redeploy.</p>
          <a href="/" style="color:#a78bfa;font-size:13px">← Back</a>
        </div>
      </body></html>`
    );
  }

  const host = req.headers.host ?? "";
  const proto = host.includes("localhost") ? "http" : "https";
  const callbackUrl = encodeURIComponent(`${proto}://${host}/api/auth/callback`);
  const scopes = encodeURIComponent("identify guilds");
  const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&response_type=code&scope=${scopes}`;
  res.redirect(302, url);
}
