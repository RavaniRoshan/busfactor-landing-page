# SEO Audit: BusFactor landing page

Site: https://ravaniroshan.github.io/busfactor-landing-page/
Collected with Firecrawl (`map`, `scrape` with markdown/links/images). One page, 200 OK, 6,475 chars of content, 1 credit.

## Executive Summary

The page has strong content and a correct H1→H2→H3 hierarchy, but it is **currently invisible to search engines** because the Figma Make scaffold ships with `robots: noindex, nofollow` and a `robots.txt` that disallows everything. Secondary gaps: no canonical URL, no Open Graph image, and no sitemap. The dusk-road background image was also being served as a 131-byte Git LFS pointer instead of the real 258 KB WebP (fixed separately — the deployed asset now returns 200 with 258,200 bytes).

## Site Structure

- Single-page site; Firecrawl `map` discovered 0 additional URLs (expected).
- Firecrawl found **0 crawlable links** — all navigation is JS `onClick` buttons (`scrollToSection`), so there is no `<a href="#section">` graph and no deep-linking/back-button support. Low priority for a one-page site; noted for follow-up.
- No `sitemap.xml` present.

## On-Page SEO

- Title: `BusFactor - Operability for unfamiliar codebases` — good, descriptive.
- Meta description: present, 150 chars, accurately summarizes the product.
- `lang="en"`, viewport, favicon — all present and correct.
- H1: "Could someone who didn't write this safely run it?" (one H1).
- H2s: section headings present; FAQ items are H3s — hierarchy is sound.
- Content: rich and specific (verdict, risk map, OPERATE.md, citations, CLI/flags, limits, 8 FAQs).
- Images: the dusk-road WebP is used as a decorative backdrop with `alt=""` throughout — correct for decorative images; no fix needed.

## Keyword Opportunities

Inferred themes from content (no target keywords supplied): "codebase operability", "engineering handoff", "operability score", "OPERATE.md", "author bus factor", "run unfamiliar codebase". The FAQ section already targets these well. Ranking comparison was skipped because the page is currently `noindex` — there is nothing to compare until indexing is enabled.

## Prioritized Recommendations

1. **CRITICAL — Remove `noindex, nofollow`.** Set `robots.index` to `true` in `.figma/make/site.json`. This also stops the plugin from emitting a `Disallow: /` robots.txt.
2. **HIGH — Add canonical URL** `<link rel="canonical" href="https://ravaniroshan.github.io/busfactor-landing-page/">` via `customScripts.headStart`.
3. **MEDIUM — Add Open Graph image** so shared links render a preview card (`openGraph.image` + automatic `twitter:card`/`twitter:image` from the plugin).
4. **LOW — Add `sitemap.xml`** with the single canonical URL.
5. **LOW — Convert nav buttons to real `<a href="#id">` links** for crawlable anchors and deep linking (visual regression risk; deferred).

## Sources

- `https://ravaniroshan.github.io/busfactor-landing-page/` — scraped HTML/markdown, metadata, links, images
- Firecrawl scrape ID `01a1f994-631e-748e-b1f6-7e8d89cabaca`
- Production HTML asset checks: assets, favicon, image content-length

## Rerun Inputs

workflow: firecrawl-seo-audit
site: https://ravaniroshan.github.io/busfactor-landing-page/
keywords: [codebase operability, engineering handoff, operability score, OPERATE.md]
output: markdown
