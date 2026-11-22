# Task 9 Report: Marketing Conversion, Hosted-Scanner Routing, Analytics, and SEO

## Status

**PASS** (implementation complete, tests/typecheck/build pass, committed)

## Implementation

Implemented Task 9 in `/home/shiva/projects/.worktrees/busfactor-landing-page-funnel` on branch `feat/funnel-p0-p2`.

### What was built

- **Pure app-link helper** (`src/lib/app-links.ts`): `buildAppLink({ path, search, base })` trims trailing base slashes, normalizes path joining, copies `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` from the incoming search, and defaults to `utm_source=landing_page&utm_medium=referral` only when no `utm_source` is present. Pure function, no DOM dependency.
- **Marketing analytics/consent** (`src/lib/analytics.ts`): consent key `busfactor.analytics.consent.v1` with `getMarketingConsent`/`setMarketingConsent`/`initMarketingAnalytics`/`track`. PostHog initialized only when `VITE_POSTHOG_KEY` is set and consent is `granted`, with `autocapture: false`, `capture_pageview: false`, `disable_session_recording: true`, `person_profiles: "identified_only"`. Captures `landing_viewed` once after init with `surface: "marketing"`, `page`, `device_type`, and attribution. `track` merges base properties and drops null/undefined values. No repo content/URLs/paths/emails/secrets sent.
- **Consent banner** (`src/components/ConsentBanner.tsx`): dismissible fixed banner above footer area, does not block primary CTA. Renders nothing when `VITE_POSTHOG_KEY` is absent or consent already set. Accept initializes analytics; Decline stores denied consent.
- **AppLink** (`src/components/AppLink.tsx`): wraps outbound app links via `buildAppLink`, tracks provided event, and emits `campaign_clicked` with `target_path` when incoming URL carries `utm_source` or `utm_campaign`.
- **ViewTracker** (`src/components/ViewTracker.tsx`): one-shot `IntersectionObserver` (threshold 0.2) that fires a marketing event once when visible; disconnects after firing.
- **Hero/navigation/footer CTAs** (`src/App.tsx`): primary hero CTA is an `<a>` to `<VITE_APP_URL>/scan` built with `buildAppLink` and tracks `hero_cta_clicked` + `scanner_cta_clicked` (+ `campaign_clicked` when campaign UTMs present). Secondary action is `CopyButton` for `npx busfactor scan ./my-repo` labeled "Copy CLI command"; copy tracks `cli_command_copied` with `{ command: "scan" }` only on successful copy. Hero note: "Free hosted scan for public GitHub repositories. No signup. Nothing is executed." Header adds Scan CTA to app `/scan` and tracks `scanner_cta_clicked`; Docs nav tracks `docs_clicked`. Footer links: Scan, Docs, Privacy, Terms, Removal; legal links go to app pages; Scan/Docs tracked.
- **Conversion sections** (`src/App.tsx`): "After a scan" (4 steps, link to app `/docs`), "Free while in beta" wrapped in `ViewTracker` emitting `pricing_viewed` once when visible (lists free items and data handling with Privacy/Removal links), and conditional "Consented demo repository report" rendered only when `VITE_DEMO_REPORT_URL` is non-empty; no fabricated repo name/score/report.
- **Docs updates** (`src/docs/content.ts`, `src/docs/DocsPage.tsx`): distinguishes hosted scan = public GitHub URL only; CLI = local paths and GitHub URLs; hosted scans download temporary snapshot and never execute. Notes that BusFactor is not published on npm. Docs page includes visible "Open the hosted scanner" link with `scanner_cta_clicked`.
- **Env typing/example** (`src/vite-env.d.ts`, `.env.example`): declares `VITE_APP_URL`, `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`, `VITE_DEMO_REPORT_URL`, `VITE_DEMO_REPORT_LABEL`. `.env.example` includes production defaults/no secrets; added with `git add -f` because `.gitignore` ignores `.env*`.
- **SEO/deploy plumbing**: added `public/robots.txt` allowing `/` and sitemap URL `https://ravaniroshan.github.io/busfactor-landing-page/sitemap.xml`. Kept existing canonical/OG/sitemap behavior in Vite/site config. Updated `.github/workflows/deploy.yml` build env to pass `VITE_APP_URL`, `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`, `VITE_DEMO_REPORT_URL` from repository vars with documented defaults.
- **Animation hook** (`src/animations/usePageAnimations.ts`): added reveal for new `[data-anim="after-scan-list"]`/`[data-anim="after-scan-item"]` markers so the new section fits existing motion patterns.

## TDD Evidence

### RED (failing test before implementation)

Command:
```bash
npm install -D vitest --legacy-peer-deps
npx vitest run src/lib/app-links.test.ts
```

Output (failure as expected; module missing before implementation):
```
(!) Your Vite config uses features that are unsupported by `configLoader: 'native'`, which is planned to become the default in a future major version of Vite:
  - `__dirname` (vite.config.ts:32:27). Use `import.meta.dirname` instead
  - JSON import "./.figma/make/site.json" without import attributes (vite.config.ts:7:31). Add `with { type: 'json' }`
Set `VITE_CONFIG_NATIVE_IGNORE_WARNING=true` to suppress this warning.

 RUN  v5.1.1 /home/shiva/projects/.worktrees/busfactor-landing-page-funnel

 ❯ src/lib/app-links.test.ts (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/lib/app-links.test.ts [ src/lib/app-links.test.ts ]
Error: Cannot find module './app-links' imported from /home/shiva/projects/.worktrees/busfactor-landing-page-funnel/src/lib/app-links.test.ts
 ❯ src/lib/app-links.test.ts:2:1
      1| import { describe, expect, it } from "vitest";
      2| import { buildAppLink } from "./app-links";
       | ^
      3|
      4| it("preserves campaign UTMs on the way to the app", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  15:30:48
   Duration  209ms (worker 93%, environment 7%)

Command failed with exit code: 1.
```

Note: initial `npm install -D vitest` (without `--legacy-peer-deps`) failed due pre-existing peer conflict between `@figma/astraui-kit` React 18 peerOptional and project React 19; re-ran with `--legacy-peer-deps` consistent with repo AGENTS/deploy workflow.

### GREEN (after implementing helper)

Command:
```bash
npx vitest run src/lib/app-links.test.ts
```

Output:
```
 RUN  v5.1.1 /home/shiva/projects/.worktrees/busfactor-landing-page-funnel

 ✓ src/lib/app-links.test.ts (3 tests) 4ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  15:31:23
   Duration  197ms (transform 65%, import 20%, worker 8%, tests 6%)
```

### Final verification

`npm test`:
```
> figma-make-app@1.0.0 test
> vitest run

 RUN  v5.1.1 /home/shiva/projects/.worktrees/busfactor-landing-page-funnel

 ✓ src/lib/app-links.test.ts (3 tests) 4ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  15:38:51
   Duration  150ms (import 42%, transform 31%, tests 13%, worker 13%)
```

`npm run typecheck`:
```
> figma-make-app@1.0.0 typecheck
> tsc --noEmit
```
(exit 0)

`npm run build`:
```
> figma-make-app@1.0.0 build
> vite build

vite v8.3.8 building client environment for production...
✓ 1606 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                        1.36 kB │ gzip:   0.54 kB
dist/assets/dusk-road-BQa81O0n.webp  258.20 kB
dist/assets/index-uz55lurh.css        69.50 kB │ gzip:  14.49 kB
dist/assets/index-DqQ8UDWB.js        800.46 kB │ gzip: 267.16 kB
✓ built in 1.06s
```

Build artifact checks:
- `dist/robots.txt` exists with Allow / and sitemap URL.
- `dist/index.html` contains canonical and OG image/title tags.
- Built JS contains expected CTA strings (`Scan your repository`, `Copy CLI command`), analytics event names, consent key, PostHog integration, and app URL.

## Files Changed

- `.env.example` (new, force-added despite `.env*` ignore)
- `.github/workflows/deploy.yml`
- `package-lock.json`
- `package.json`
- `public/robots.txt` (new)
- `src/App.tsx`
- `src/animations/usePageAnimations.ts`
- `src/components/AppLink.tsx` (new)
- `src/components/ConsentBanner.tsx` (new)
- `src/components/ViewTracker.tsx` (new)
- `src/docs/DocsPage.tsx`
- `src/docs/content.ts`
- `src/lib/analytics.ts` (new)
- `src/lib/app-links.test.ts` (new)
- `src/lib/app-links.ts` (new)
- `src/vite-env.d.ts`

## Self-Review

- **Scope:** Changes confined to marketing-site worktree; no main product repo or main checkout touched.
- **TDD:** Followed red-green for `buildAppLink` as specified. Added the exact brief tests, observed module-not-found failure, implemented pure helper, got green, then ran full required verification.
- **Analytics/privacy:** No PostHog init/capture before consent; no autocapture/pageview autocapture/session recording; no banner/events when key absent. Events include `surface: "marketing"`, `page`, `device_type`, attribution where available. `cli_command_copied` sends only `{ command: "scan" }`, not command text; copy event fires only on successful copy (small hardening beyond brief).
- **CTA/routing:** Hero primary is hosted scan link to `<VITE_APP_URL>/scan` with UTM propagation/default referral attribution; CLI command remains secondary copy action. Header has Scan CTA; footer has Scan/Docs/Privacy/Terms/Removal with legal links to app pages.
- **Conversion sections:** Added After-a-scan, Free-while-in-beta with `pricing_viewed` once via `ViewTracker`, and conditional consented demo report only when `VITE_DEMO_REPORT_URL` non-empty. No fabricated repo name/score/report.
- **Docs:** Clearly distinguishes hosted scan (public GitHub URL only) vs CLI (local paths and GitHub URLs); states hosted scans download temporary snapshot and never execute; avoids claiming npm publication.
- **SEO/deploy:** `public/robots.txt` added; canonical/OG/sitemap retained; workflow passes required VITE vars with defaults.

## Concerns / Follow-ups

- **Vite chunk-size warning**: `npm run build` reports a >500 kB JS chunk warning. This is pre-existing build behavior/size profile, not introduced by this task’s logic; no code-splitting change made to avoid unrelated refactor.
- **Vite config warnings during tests/build**: existing warnings about `__dirname` and JSON import attributes in `vite.config.ts`; unrelated to Task 9.
- **No DOM/component tests added**: brief only required pure `buildAppLink` tests and no DOM required. Analytics consent/banner/ViewTracker behavior is implemented per spec but not covered by automated DOM tests; browser QA recommended.
- **Default app URL**: hardcoded default `https://heir-weld.vercel.app` per brief; ensure this matches the intended production app environment across deployments.

## Review Fixes (post-review)

Addressed four review findings:

1. **`cli_command_copied` opt-in tracking**: `CopyButton` now takes `trackEvent?: "cli_command_copied"` and only emits the event when explicitly passed and copy succeeds. Scan-command copy buttons (hero, quickstart local/GitHub commands, CLI integration snippet) pass `trackEvent="cli_command_copied"`. MCP command, skill path, CLI usage copy, and docs code-block copy buttons keep copied UI but emit nothing.
2. **`.env.example` tracked normally**: added `!.env.example` exception to `.gitignore` so future edits are tracked without `git add -f`.
3. **Analytics failure isolation**: `initMarketingAnalytics` and `track` wrap PostHog init/capture in `try/catch`; on failure set `disabled=true` and become no-op, preventing exceptions from surfacing into React effects/click handlers. Consent and key checks remain before any capture/init; no sends before consent.
4. **Docs hosted scanner link uses AppLink**: `DocsPage` "Open the hosted scanner" now uses `AppLink` with `event="scanner_cta_clicked"` and `eventProperties={{ location: "docs_intro" }}`, so it retains scan CTA tracking and also gets `campaign_clicked` behavior on UTM-attributed visits.

### Verification after fixes

Commands run:
```bash
npm test
npm run typecheck
npm run build
git check-ignore -v .env.example || echo "not ignored"
```

Results:
- `npm test` — PASS (1 file, 3 tests)
- `npm run typecheck` — PASS
- `npm run build` — PASS (`dist/index.html`, `dist/robots.txt`, built assets generated)
- `.env.example` — `not ignored`

## Commit

- `0219956` — `feat: route marketing CTAs to hosted scanner with attribution` (branch `feat/funnel-p0-p2`)
- `3d2a68b` — `fix: harden marketing analytics and CTA tracking` (review fixes)

## Verification Summary

- `npm test` — PASS (1 file, 3 tests)
- `npm run typecheck` — PASS
- `npm run build` — PASS (`dist/robots.txt` present; canonical/OG present)