# ScriptMate — Static (GitHub Pages)

A fully static version of ScriptMate with **cross-device order sync** via Google Sheets.

## Files
```
index.html              ← Main ordering page
admin.html              ← Admin dashboard
google-apps-script.js   ← Paste this into Google Apps Script (see setup below)
404.html                ← Custom 404 page
static/
  css/main.css          ← Main styles
  css/admin.css         ← Admin styles
  js/main.js            ← Order form logic
  js/admin.js           ← Admin dashboard logic
```

---

## ⚡ Quick Setup (Fix Admin Panel — 5 Minutes)

The admin panel was not showing orders from other devices because `localStorage` is **per-browser**.
Orders now sync through **Google Sheets** (free, no account needed beyond Google).

### Step 1 — Create the Google Apps Script backend

1. Go to **https://script.google.com** → click **"New project"**
2. Delete all existing code
3. Open `google-apps-script.js` from this folder and **paste all of it**
4. Click 💾 Save → name it "ScriptMate Backend"
5. Click **Deploy → New deployment**
6. Click ⚙ gear next to "Type" → select **Web app**
7. Set **"Execute as"** → `Me`
8. Set **"Who has access"** → `Anyone`
9. Click **Deploy** → **copy the Web App URL** (looks like `https://script.google.com/macros/s/ABC123.../exec`)

### Step 2 — Add the URL to your site

Open **`static/js/main.js`** — change line 10:
```js
const GAS_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

Open **`static/js/admin.js`** — change line 10 (same URL):
```js
const GAS_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

### Step 3 — Redeploy to GitHub Pages

Push the updated files. Done! ✅

---

## How it works now

| Feature | Before (broken) | After (fixed) |
|---|---|---|
| Order storage | `localStorage` (this browser only) | Google Sheets (all devices) |
| Admin sees orders | Only if same browser | ✅ From any device |
| Offline fallback | ✅ | ✅ (localStorage backup) |
| File uploads | Filename noted only | Filename noted only |
| WhatsApp notify | Auto-populated | Auto-populated |

---

## Change Admin Password

Open `static/js/admin.js` and update line 14:
```js
const ADMIN_PASSWORD = 'YourNewPassword';
```

## Customise WhatsApp Number

Open `static/js/main.js` and search for `wa.me/91...`.

## Deploy to GitHub Pages

1. Create a GitHub repository
2. Push all files to the `main` branch
3. Go to **Settings → Pages → Source → Deploy from branch → main / (root)**
4. Your site will be live at `https://<username>.github.io/<repo>/`
