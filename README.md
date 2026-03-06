# RL Peek Painting – Next.js Website

Next.js 16 app for [RL Peek Painting](https://www.rlpeekpainting.com), optimized for **SEO** and **AEO** (Answer Engine Optimization). Content is sourced from the live site via scrape scripts and stored in `content/*.json`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- **`npm run scrape`** – Fetches all pages from rlpeekpainting.com using the sitemap and saves HTML to `scraped/html/` and a manifest to `scraped/manifest.json`. Run once (or when you want to refresh content). Requires network.
- **`npm run extract`** – Parses scraped HTML and builds `content/*.json` (all, services, service-areas, tips, projects). Run after `scrape` if you’ve re-scraped.
- **`npm run build`** – Production build. Uses `content/*.json`; ensure you’ve run `scrape` and `extract` at least once so `content/` exists.

## Image Assets

Image placeholders are used for logo, hero, and project photos. See **[IMAGE_TODOS.md](IMAGE_TODOS.md)** for the list of assets to provide and where to put them (`public/images/`).

## SEO & AEO

- **Metadata**: Unique title/description and canonical URL per page.
- **Sitemap**: `/sitemap.xml` generated from content; human-readable list at `/site-map`.
- **robots.txt**: Allows crawlers and points to the sitemap.
- **JSON-LD**: LocalBusiness (root layout), FAQPage (home and pages with FAQs), Article (tips and projects), BreadcrumbList (inner pages).

## Project Structure

- `app/` – Routes (home, about-us, contact-us, services, service-areas, home-painting-tips, latest-projects, reviews, meet-the-team, employment, privacy, terms, site-map) and dynamic segments.
- `components/` – Header, Footer, PageContent, Breadcrumbs, LocalBusinessJsonLd.
- `content/` – JSON content index (from `npm run extract`).
- `lib/` – `site.ts` (config), `content.ts` (content loaders).
- `scripts/` – `scrape-site.mjs`, `extract-content.mjs`.
