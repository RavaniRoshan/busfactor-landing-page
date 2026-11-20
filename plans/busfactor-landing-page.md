# BusFactor Landing Page Implementation Plan

## Goal

Build a polished, responsive one-page marketing site for **BusFactor** in the existing React + Vite app. The page should borrow the supplied reference site’s design language—dark editorial presentation, restrained centered hero, pill actions, a large atmospheric product showcase, compact feature grids, and generous vertical rhythm—without copying its product, content, or exact composition.

The implementation will use the selected **Astra UI** kit as its component and token foundation. Because this is a public marketing page, use the user-approved top-navigation exception rather than Astra’s authenticated-app sidebar. Continue to use Astra’s semantic colors, typography, spacing, radii, components, icon rules, theme provider, and focus behavior everywhere else.

## Confirmed Product Decisions

- Brand name: **BusFactor**
- Original logo direction: a compact repository/handoff mark combining connected repository nodes, a transfer path, and a check/risk split, paired with a BusFactor wordmark
- Primary CTA: copy `npx busfactor scan ./my-repo`
- Secondary CTA: scroll to the on-page Quickstart/CLI documentation
- Navigation: compact top navigation, not the Astra app sidebar
- No backend, account system, scan upload, or live repository analysis is in scope
- Do not invent npm, GitHub, documentation, or social URLs

## Repository Findings and Constraints

- The project is currently an empty React 19 + Vite + Tailwind CSS v4 shell.
- Main files are `src/App.tsx`, `src/index.css`, and `src/main.tsx`.
- `@figma/astraui` and `@figma/astraui-kit` are already direct dependencies.
- The user-mentioned `styles/global.css` does not exist in the repository. Follow the project convention and place global/theme wiring in `src/index.css`.
- Import `@figma/astraui/styles.css` globally and wrap the app in `ThemeProvider`.
- Use only Astra’s defined Instrument Sans typography classes for page text.
- Use semantic Astra utilities/tokens rather than hardcoded colors, spacing, font sizes, font weights, border radii, or shadows.
- Use Astra components for interactive actions. Do not introduce another component library.
- Use Lucide icons only, imported from `lucide-react`; add it as a direct dependency because the app will import it directly.

## Visual Direction

### Overall

- Default to the dark expression of Astra’s semantic token set to match the inspiration; retain a user-controlled light/dark toggle and Astra theme persistence.
- Use `brand-tertiary` as the underlying canvas and `surface-bg` cards for content hierarchy.
- Keep the page approximately 90% neutral; reserve `brand-primary` for the primary CTA, active/focus states, tiny indicators, and score emphasis.
- Use no decorative card shadows. Let canvas/surface contrast create depth; reserve any subtle shadow for the sticky/floating navigation treatment only if Astra tokens/components already provide it.
- Use `rounded-corner-lg` for section/product cards, `rounded-corner-md` for compact internal panels, and Astra’s pill-shaped buttons.
- Preserve generous section spacing and narrow readable text measures. Hero content may be centered; body sections and cards remain left-aligned.

### Atmospheric Product Showcase

Create the reference image’s “large scenic showcase” feeling without photography:

- Place a large BusFactor report mockup inside a spacious token-driven ambient field.
- Build the field from CSS gradients using semantic CSS variables only; no hardcoded color values.
- The mock report should communicate the actual product:
  - Operability verdict and score
  - A seven-dimension risk map
  - Evidence citations such as `src/config.ts:42`
  - An `OPERATE.md` preview
  - A short list of author-only questions
- Keep this a static illustrative preview, not a fake live scanner.

## Page Structure and Content

### 1. Sticky Top Navigation

- Original BusFactor mark + wordmark on the left.
- Compact section actions for `How it works`, `Scoring`, `CLI`, and `Limits`; use Astra subtle buttons that scroll to section IDs.
- Theme toggle using Astra `IconButton` and `Tooltip`, with a verified Lucide icon.
- Small primary `Copy command` action on wider screens.
- On mobile, reduce the nav to brand, theme toggle, and copy action; section navigation remains available through the page flow rather than adding a complex menu.

### 2. Hero

- Small low-emphasis product descriptor: “Evidence-backed repository handoff.”
- Main question: **“Could someone who didn’t write this safely run it?”**
- Supporting copy: “BusFactor scans a repository and returns an operability verdict, a risk map, an OPERATE.md, and questions only the original author can answer. Every claim cites a file and line.”
- Primary button: copies `npx busfactor scan ./my-repo`.
- Secondary button: scrolls to Quickstart.
- Inline command surface beneath the actions with a copy affordance and concise copied-state feedback.
- Do not claim availability, pricing, users, performance, or integrations beyond the supplied facts.

### 3. Product Report Showcase

- Large report card with:
  - Repository label and “Scan complete” status
  - Example score and verdict
  - Seven compact score rows/bars
  - Two example evidence-backed risks
  - `OPERATE.md` and “Author questions” output tiles
- Clearly label it as an example report where needed so invented sample values are not presented as real measurements.

### 4. Four Core Outputs

Uniform responsive feature grid:

1. **Operability verdict** — a direct answer about safe operation
2. **Risk map** — the weak points that block handoff
3. **OPERATE.md** — a practical runbook drafted from repository evidence
4. **Author-only questions** — unknowns the code cannot resolve

Use verified Lucide icons, consistent icon sizing, identical card structure, and concise descriptions.

### 5. How It Works

Three-step sequence:

1. **Point it at a repository** — local path or public GitHub URL
2. **Scan without executing code** — inspect repository evidence only
3. **Hand off with confidence** — receive verdict, citations, runbook, and questions

Represent the flow with surface cards and a restrained connected-path motif derived from the logo.

### 6. Scoring

- Heading and explanation: seven dimensions, 100 points; code computes the score while the LLM explains and drafts.
- Show seven named example dimensions chosen to make the concept understandable without pretending to quote an unavailable rubric version:
  - Setup
  - Run
  - Deploy
  - Observe
  - Recover
  - Secure
  - Maintain
- Explicitly state that the real rubric is public and versioned.
- Use visual score bars only as a conceptual sample and label them “Example report.”

### 7. Quickstart and CLI

Provide copyable code blocks for:

- `npx busfactor scan ./my-repo`
- `npx busfactor scan https://github.com/owner/repo`
- `busfactor scan <path|url> --out <dir> --format md,json --fail-under <score>`

Include exit-code reference:

- `0` success
- `2` `--fail-under` threshold missed
- `1` error

Each code row gets an Astra copy button with keyboard access and copied-state feedback. Use a semantic monospace stack only for code; all non-code text stays in the design system’s defined font faces.

### 8. Ecosystem

Two equal cards:

- **MCP server**
  - Command: `node packages/mcp/dist/index.js`
  - Tools: `scan_repo`, `get_report`, `generate_operate_md`
- **Claude Code skill**
  - Reference: `skills/handoff/SKILL.md`

Do not create external links because no destinations were supplied.

### 9. Limits and Trust

Present compact factual tiles for:

- Maximum 5,000 files
- Maximum 25 MB per scan
- Public GitHub URLs or local paths
- Repository code is never executed
- Source snapshots are deleted after 7 days
- License: TBD

Prioritize the non-execution and deletion facts as trust signals without adding unsupported security claims.

### 10. Final CTA and Footer

- Closing question and repeated copy-command CTA.
- Footer with BusFactor mark, one-line product summary, and button-based section navigation.
- Include “License TBD” as factual fine print.
- No fake legal, privacy, contact, login, or social links.

## Component and File Plan

### `package.json` / `pnpm-lock.yaml`

- Add `lucide-react` as a direct runtime dependency using the project’s pnpm workflow.

### `src/main.tsx`

- Import `ThemeProvider` from `@figma/astraui`.
- Wrap `<App />` with `ThemeProvider` inside the existing strict mode.

### `src/App.tsx`

Implement the page and keep the component boundaries readable:

- `BusFactorLogo`
- `ThemeToggle`
- `CopyButton` or `CommandRow`
- `SectionHeading`
- `ReportShowcase`
- `FeatureCard`
- `ScoreRow`
- `LandingPage`

Use arrays for repeated features, score dimensions, CLI references, and limits so repeated cards remain structurally identical.

State and behavior:

- Track the most recently copied command.
- Use `navigator.clipboard.writeText`.
- If Clipboard API access fails, use a small local textarea-based fallback and still provide accessible status feedback.
- Reset copied labels after a short interval and clear timers on unmount.
- Scroll section buttons with `scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })`.
- Respect `prefers-reduced-motion`.
- Theme toggle uses Astra’s `useTheme` and persisted theme behavior.
- Initialize dark mode only when no Astra theme preference has already been saved, so user choice is never overwritten.

### `src/index.css`

- Keep `@import 'tailwindcss';` first.
- Add `@import '@figma/astraui/styles.css';` in the import block.
- Add only global page behavior and minimal custom composition that Tailwind utilities cannot express cleanly:
  - body/root full-height defaults
  - smooth scrolling with reduced-motion override
  - token-based ambient showcase gradients
  - optional logo geometry helpers
- All custom colors, spacing, radii, borders, and typography must reference Astra CSS variables. Do not duplicate the token values into a second theme.
- Do not add a Tailwind config, PostCSS config, or `@source` rule.

## Accessibility

- Maintain a single logical page title via `role="heading"`/`aria-level` if no Astra heading primitive exists.
- Every section gets a labeled heading and stable ID.
- Copy actions expose descriptive labels and a polite live region for success/failure feedback.
- Theme icon button includes a tooltip and accessible label.
- All interactions work with keyboard input and display Astra focus-visible styles.
- Ensure muted text remains readable; do not use tertiary text for critical content.
- Use no hover-only critical information.
- Respect reduced motion for scrolling and decorative transitions.
- Validate color contrast in both modes using semantic tokens.

## Responsive Behavior

- Desktop: centered constrained content, compact sticky top nav, multi-column feature/limit grids, wide report showcase.
- Tablet: reduce grids to two columns and preserve readable command blocks.
- Mobile:
  - stack hero actions and all cards
  - keep command rows horizontally safe with wrapping or controlled scrolling
  - simplify top navigation
  - avoid fixed heights
  - preserve tokenized page-edge padding and section rhythm
- Ensure no horizontal overflow at common narrow widths.

## Verification

1. Run the repository formatter on changed source files using `.figma/make/format`.
2. Run `pnpm run build` and resolve all TypeScript/Vite errors.
3. Inspect the running supervised preview without starting another dev server.
4. Verify at desktop and mobile widths:
   - all sections render in the intended order
   - grids collapse correctly
   - no horizontal overflow
   - report mockup remains legible
   - top navigation remains usable
5. Exercise interactions:
   - hero and CLI copy actions copy the exact commands
   - copied/failure feedback is announced and resets
   - section navigation reaches the correct section
   - theme toggle persists and both modes remain legible
   - reduced-motion behavior avoids smooth animation
6. Search produced files to confirm:
   - no hardcoded color literals, arbitrary spacing, arbitrary radii, or unsupported typography
   - no raw button/input/select/textarea/anchor/heading elements
   - no modifications inside the Astra packages
   - only verified Lucide icon imports are used

## Acceptance Criteria

- The page unmistakably presents BusFactor rather than reproducing the reference product.
- The visual language reads as dark, restrained, editorial, spacious, and product-led.
- The original BusFactor mark is visible and coherent at both nav and footer sizes.
- Every supplied product fact appears accurately and unsupported claims are avoided.
- Primary and secondary CTAs work.
- All CLI commands are copyable and exact.
- UI styling is controlled through Astra semantic tokens and the designated font faces.
- The page is responsive, keyboard accessible, reduced-motion aware, and build-clean.
