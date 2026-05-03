import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SignJWT } from "jose";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!clientId || !clientSecret || !sessionSecret) {
    return res.redirect("/?auth_error=not_configured");
  }

  const { code, error } = req.query;
  if (error || !code || typeof code !== "string") {
    return res.redirect("/?auth_error=denied");
  }

  const host = req.headers.host ?? "";
  const proto = host.includes("localhost") ? "http" : "https";
  const callbackUrl = `${proto}://${host}/api/auth/callback`;

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: callbackUrl,
      }),
    });

    if (!tokenRes.ok) return res.redirect("/?auth_error=token_failed");

    const tokenData = (await tokenRes.json()) as { access_token: string };

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) return res.redirect("/?auth_error=user_failed");

    const user = (await userRes.json()) as {
      id: string;
      username: string;
      global_name: string | null;
      discriminator: string;
      avatar: string | null;
    };

    const secret = new TextEncoder().encode(sessionSecret);
    const jwt = await new SignJWT({
      id: user.id,
      username: user.username,
      global_name: user.global_name,
      discriminator: user.discriminator,
      avatar: user.avatar,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const isProd = !host.includes("localhost");
    res.setHeader(
      "Set-Cookie",
      `luna_session=${jwt}; HttpOnly; Path=/; Max-Age=604800; SameSite=${isProd ? "None" : "Lax"}${isProd ? "; Secure" : ""}`
    );

    res.redirect(302, "/");
  } catch {
    res.redirect("/?auth_error=exception");
  }
}
