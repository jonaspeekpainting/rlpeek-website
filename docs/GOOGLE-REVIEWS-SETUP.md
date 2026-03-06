# Get Google Reviews – Exact Steps

This app needs **one API** and **one env variable** to show live reviews from your Google Business Profile.

---

## Part 1: Google Cloud Console

### 1. Open the API Library

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project (or create one).
3. In the left sidebar, go to **APIs & Services** → **Library** (or **Enabled APIs & services** and then **+ ENABLE APIS AND SERVICES**).

### 2. Enable Places API (New) — required for Text Search and reviews

You must enable **“Places API (New)”** (the new backend). The old “Places API” alone is not enough; SearchText and reviews use the new API.

1. Open the API Library: **APIs & Services** → **Library**.
2. Either:
   - Go directly to: **[Enable Places API (New)](https://console.cloud.google.com/apis/library/places-backend.googleapis.com)**  
   - Or search for **Places API (New)** and open the one whose ID is **places-backend.googleapis.com** (not the older “Places API”).
3. Click **Enable**.
4. Ensure a **billing account** is linked to the project (required for Places API). Free tier still applies.

### 3. Create or use an API key

1. Go to **APIs & Services** → **Credentials**.
2. Click **+ CREATE CREDENTIALS** → **API key**.
3. Copy the new key (or use an existing “Maps Platform” key).

### 4. Restrict the key (recommended)

1. Click the key name (or the pencil icon to edit).
2. Under **API restrictions**, choose **Restrict key**.
3. In the dropdown, select **Places API (New)** (the one you enabled in step 2 — “Places API (New)” / places-backend). Do not select only the legacy “Places API” or SearchText will stay blocked.
4. Click **Save**.

You’re done in Google Cloud. The key can now be used for **Text Search** (to find your place) and **Place Details** (to get reviews).

---

## Part 2: Your codebase

### 1. Add the API key to env

The app reads the key from the environment. For local dev and for production you need to set it where the app runs.

**Local development**

1. In the project root, open or create **`.env.local`** (same folder as `package.json`).
2. Add one line (replace with your real key):

   ```bash
   GOOGLE_PLACES_API_KEY=AIzaSy...your_actual_key_here
   ```

3. Save the file. Do not commit this file (it should be in `.gitignore`).

**Production (e.g. Vercel)**

1. In your host’s dashboard, open the project → **Settings** → **Environment variables** (or equivalent).
2. Add a variable:
   - **Name:** `GOOGLE_PLACES_API_KEY`
   - **Value:** your same API key
3. Save and redeploy so the new variable is available.

### 2. No other env vars required

- The app looks up your business with the query **“RL Peek Painting Park City”** by default. You don’t need to set a Place ID or another query unless you want to change that.
- Optional overrides (only if needed):
  - **`GOOGLE_PLACE_ID`** – if you already know your Place ID and want to skip the search.
  - **`GOOGLE_PLACES_TEXT_QUERY`** – if you want a different search string (e.g. another business or location).

### 3. Verify locally

1. Restart the dev server so it picks up `.env.local`:

   ```bash
   npm run dev
   ```

2. Open the site and go to **Contact**, **Reviews**, or **Home**. You should see real Google reviews (or the same fallback text if the API returns no reviews yet).
3. Optional: run the Place ID script to confirm the key and search work:

   ```bash
   npm run place-id
   ```

   You should see a Place ID, name, and address. If you see “API key not valid”, the key isn’t loaded or isn’t allowed to use Places API (re-check Part 1, step 4).

---

## Summary

| Where            | What to do |
|------------------|------------|
| **Google Cloud** | Enable **Places API**; create an API key; restrict the key to **Places API**. |
| **Codebase**     | Set **`GOOGLE_PLACES_API_KEY`** in `.env.local` (local) and in your host’s env (production). |
| **Optional**     | Run **`npm run place-id`** to confirm the key and “RL Peek Painting Park City” resolve to your place. |

After that, the contact, reviews, and home pages will request reviews from Google automatically; no code changes are required.

---

## "API key not valid" (400) – What to check

Google returns this when the key is rejected. Common causes:

### 1. Application restrictions (most common)

The key is used **on the server** (Next.js), not in the browser. If the key is restricted to **“HTTP referrers (websites)”** only, server requests have no browser referrer and Google rejects them.

**Fix:**

1. In Google Cloud go to **APIs & Services** → **Credentials**.
2. Click your API key (edit).
3. Under **Application restrictions**:
   - For **local dev**: choose **None**.
   - For **production**: use **None** or **IP addresses** and add your server/hosting IPs (e.g. Vercel’s IPs if you use Vercel). Do **not** use “HTTP referrers” for this key if it’s only used server-side.
4. Under **API restrictions** keep **Restrict key** and **Places API** as in Part 1.
5. Click **Save**.

### 2. Key not loaded in the app

Check the server log when the error appears. You should see either:

- `Env GOOGLE_PLACES_API_KEY: key present (length 39)` → key is loaded; the problem is almost certainly **Application restrictions** (see above).
- `Env GOOGLE_PLACES_API_KEY: key missing` → the app isn’t seeing the variable. Fix:
  - Use **`.env.local`** in the project root (same folder as `package.json`).
  - Restart the dev server after changing env (`npm run dev`).
  - No spaces around `=`, e.g. `GOOGLE_PLACES_API_KEY=AIzaSy...`.

### 3. Wrong key or Places API not enabled

- Copy the key again from **Credentials** and paste it into `.env.local` (no extra spaces or quotes).
- In **APIs & Services** → **Library**, confirm **Places API (New)** (places-backend.googleapis.com) is **Enabled**.
- In the key’s **API restrictions**, confirm **Places API (New)** is in the list.

### 4. 403 "SearchText are blocked" / API_KEY_SERVICE_BLOCKED

This means the key is valid but the **Places API (New)** is not enabled for the project, or the key is restricted to the wrong API.

1. Open **[Places API (New) in the API Library](https://console.cloud.google.com/apis/library/places-backend.googleapis.com)** and click **Enable** (if it says “Manage”, it’s already enabled).
2. Edit your API key → **API restrictions** → ensure **Places API (New)** is selected (not only the legacy “Places API”).
3. Save and wait a minute, then try again.
