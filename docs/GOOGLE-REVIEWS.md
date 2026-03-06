# Google Reviews (Places API)

The contact, reviews, and home pages can show **live Google reviews** from your Business Profile when the API key is set.

**→ Step-by-step setup: [GOOGLE-REVIEWS-SETUP.md](./GOOGLE-REVIEWS-SETUP.md)** (Google Cloud + codebase, exact steps.)

## Jobsuite job-engine (recommended to limit API calls)

If this site uses Jobsuite (e.g. contact form posts to job-engine), reviews can be served from a **public job-engine endpoint** so Google is called at most about **once per day** per contractor:

1. **job-engine**: Set `GOOGLE_PLACES_API_KEY` in the job-engine environment. In contractor configuration (e.g. `contractor_config`), set `google_places_display_name` to the search string used to find your place (e.g. `"RL Peek Painting Park City"`).
2. **This site**: `lib/site.ts` already defines `JOBSUITE_API_BASE` and `JOBSUITE_CONTRACTOR_ID`. The app will then request `GET {API_BASE}/api/v1/public/reviews?contractor_id=...` and use that result when available, falling back to direct Places API or static reviews otherwise.

No extra env vars are required on the website; the job-engine does Place ID resolution and review fetching and caches reviews for 24 hours.

## Setup (quick reference)

1. **Google Cloud**
   - Create a project and enable [Places API (New)](https://console.cloud.google.com/apis/library/places-backend.googleapis.com).
   - Create an API key and restrict it to the Places API.

2. **Env vars** (server-only; e.g. in `.env.local`):

   ```bash
   GOOGLE_PLACES_API_KEY=your_api_key
   ```

   That’s enough for reviews to work: the app resolves your Place ID via [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search) using the query **“RL Peek Painting Park City”** (customize with `GOOGLE_PLACES_TEXT_QUERY` if needed).

   Optional — if you already have a Place ID and want to skip Text Search:

   ```bash
   GOOGLE_PLACE_ID=ChIJ...   # From Business Profile or scripts/get-place-id.mjs
   ```

   Optional — different search query (default is “RL Peek Painting Park City”):

   ```bash
   GOOGLE_PLACES_TEXT_QUERY="Your business name and city"
   ```

## Resolving Place ID (Text Search)

The app uses the **Text Search (New)** API to resolve the Place ID for “RL Peek Painting Park City” when `GOOGLE_PLACE_ID` is not set. The first result is used and cached for 1 hour.

To look up the Place ID yourself (e.g. to set `GOOGLE_PLACE_ID` and avoid Text Search on each deploy):

```bash
npm run place-id
# Or with a custom query:
GOOGLE_PLACES_API_KEY=your_key node scripts/get-place-id.mjs "Your business name and city"
```

## Behavior

- **When API key is set:** The app fetches up to 5 reviews (resolving Place ID via Text Search if needed), caches them for 1 hour, and shows 5-star reviews on the contact page (sidebar), reviews page (full list), and home page (3 cards).
- **When not set:** The same pages use static fallback review text so the layout and copy still work.

## Billing

Places API (New) is billable. **Text Search** (Essentials ID or Pro, depending on fields) is used to resolve Place ID. The **Place Details** call that includes `reviews` uses the **Enterprise + Atmosphere** SKU. See [Places API pricing](https://developers.google.com/maps/billing-and-pricing/sku-details).
