# Luna Control — Vercel Deployment Guide

## Prerequisites
- A [Vercel](https://vercel.com) account
- A [Discord Application](https://discord.com/developers/applications)
- Your Discord bot token

---

## Step 1 — Create a Discord Application

1. Go to https://discord.com/developers/applications
2. Click **New Application**, give it a name (e.g. "Luna Control")
3. Go to **OAuth2** → **General**
4. Copy your **Client ID**
5. Click **Reset Secret** → copy the **Client Secret**
6. Under **Redirects**, add:
   ```
   https://YOUR-PROJECT.vercel.app/api/auth/callback
   ```
   (Replace with your actual Vercel URL after deploying)

---

## Step 2 — Get your Bot Token

1. In the same Discord application, go to **Bot**
2. Click **Reset Token** → copy the **Bot Token**

---

## Step 3 — Deploy to Vercel

1. Unzip this project and push it to a GitHub repo (or use `vercel deploy`)
2. Import the repo in [Vercel](https://vercel.com/new)
3. Under **Environment Variables**, add all of the following:

| Variable | Value |
|---|---|
| `DISCORD_CLIENT_ID` | Your Discord app Client ID |
| `DISCORD_CLIENT_SECRET` | Your Discord app Client Secret |
| `BOT_TOKEN` | Your Discord bot token |
| `SESSION_SECRET` | A random 32+ character string (e.g. use https://1password.com/password-generator/) |

4. Click **Deploy**

---

## Step 4 — Add the Redirect URI

After Vercel assigns your URL (e.g. `luna-control.vercel.app`):

1. Go back to your Discord application → **OAuth2** → **Redirects**
2. Add: `https://luna-control.vercel.app/api/auth/callback`
3. Save changes

---

## Done!

Visit your Vercel URL, click **Continue with Discord**, and you'll be logged in.
The overview page will automatically show your bot's live stats (name, avatar, server count) using the `BOT_TOKEN` you provided.

---

## Bot Startup (KataBump)

Start command: `python Yuna-CV2-AIO-main/aerox.py`
