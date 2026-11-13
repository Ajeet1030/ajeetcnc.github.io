# AJEET OS – Personal Desktop 2027

Ajeet Kumar's personal web desktop — liquid crystal glass look, working app
windows, and Riya AI assistant. **Open for everyone:** whoever opens the link
lands straight on the desktop and sees Ajeet's full profile, apps and social
accounts — no login needed to look around. A password only protects the
owner's editing and settings. Plain HTML + CSS + vanilla JavaScript. No
frameworks, no build step, no server needed.

## Files

| File | What it is |
|---|---|
| `index.html` | The desktop markup (open this) |
| `style.css` | All styles — liquid crystal glass theme |
| `script.js` | All logic — window manager, apps, login, Riya AI |
| `assets/ajeet.jpg` | Owner photo used as wallpaper portrait + avatar |

Keep all files together in the same folder, exactly like this.

## Run it

- **On your phone/PC:** just open `index.html` in a browser.
- **Online (GitHub Pages):** upload the whole folder (including `assets/`)
  to any static host — GitHub Pages, Netlify, Vercel — and open the page URL.
  On GitHub Pages: put the files in your repo, then Settings → Pages →
  deploy from the branch. Done — it works from the direct link.

## Visiting & owner login

- **Visitors need no login at all.** The site opens directly on the desktop:
  wallpaper with Ajeet's photo, his profile card, every app, the Riya AI
  panel and the Social Hub are all visible and usable for viewing. Opening
  apps, browsing files, Calculator / Calendar / Paint, chatting with Riya
  and opening social links are free for everyone.
- **All social accounts show together in one place:** the Social Hub window
  lists every account in a single view, the Start panel's "My Social
  Accounts" row shows every account's icon together, and the top-bar
  **Social** button opens that same all-in-one view.
- **The password only protects owner actions:** changing Settings (accent,
  transparency, light mode, weather city, password, reset), adding / editing
  / deleting social accounts, installing / removing apps in the App Store,
  and restoring a backup. Tapping any of those asks for the owner login
  first — nothing else does.
- **First time the owner clicks "Owner Login"** (Start panel button), they
  **set the owner password** (minimum 4 characters). Only a SHA-256 hash is
  stored in the browser — never the plain password. Later, the same card
  verifies against that hash; a wrong password shows an error. Tick
  **Remember Me** to keep the owner session on that browser.
- While logged in, the Start panel shows **"Ajeet Kumar — Super Admin"**;
  as a guest it shows **"Guest"** with the Owner Login button. **Lock
  Screen** and **Logout** return to the open desktop (guest view) — never
  to a blocking login wall.
- Forgot the password? Use **Forgot Password?** on the owner login card to
  reset it (your data stays saved), or change it later from
  **Settings → Change Password** (owner login required).

## Good to know

- **Your data saves in the browser's localStorage** on the device you use —
  notes, tasks, files, social links, settings and the password hash. It does
  not sync between devices. Use **Tools → Backup Manager** to download a
  backup file and restore it on another device/browser.
- Social Hub starts with Ajeet's two real Instagram accounts
  (@theajeetbhai and @insta_wallpaper4k) plus his public WhatsApp chat link
  ("WhatsApp par chat karo"), all shown together. Other platforms are added
  by the owner from inside the Social Hub — no passwords are ever collected.
- Weather comes from the free Open-Meteo API (no key) — the only internet
  call the app makes. If it fails, the widget shows "Weather unavailable".
- The System Performance gauges are an animated **live demo**, labelled as
  such — they are not real device readings.
- Everything else (windows, drag, search, calculator, paint, file manager,
  recycle bin, Riya AI quick actions) works fully offline.
