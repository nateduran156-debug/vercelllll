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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) return res.status(401).json({ error: "Not configured" });

  const rawCookies = req.headers.cookie ?? "";
  const cookies = parseCookies(rawCookies);
  const token = cookies["luna_session"];

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const secret = new TextEncoder().encode(sessionSecret);
    const { payload } = await jwtVerify(token, secret);
    return res.json(payload);
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }
}
