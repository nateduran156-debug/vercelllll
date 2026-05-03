import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader(
    "Set-Cookie",
    "luna_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );
  res.json({ ok: true });
}
