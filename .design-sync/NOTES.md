# design-sync notes — Generations Wellness

## What this repo is, and why the setup looks unusual

`gw` is a **hand-authored static HTML site** — no framework, no build step, no
`package.json` at the repo root. There was no component library to import, so the
first sync (2026-09-14) **created one**: `.design-sync/ds-src/` is a React package
whose components emit the site's exact markup and class names. The styling is
100% the site's own — `assets/css/tokens.css` and `main.css` ship verbatim.

**Do not add a `package.json` to the repo root.** The site deploys on Vercel,
which auto-detects project type; a root manifest would change the build. The DS
package lives under `.design-sync/` precisely to avoid that.

## Layout

- `.design-sync/ds-src/` — the React DS package (`generations-wellness-ds`, `window.GW`)
- `.design-sync/ds-tokens/` — sibling tokens package (`cfg.tokensPkg`), holds `fonts.css` + 4 woff2
- `ds-src/node_modules/generations-wellness-tokens` — **symlink** to `../../ds-tokens`,
  recreated per clone: `ln -sfn ../../ds-tokens .design-sync/ds-src/node_modules/generations-wellness-tokens`
- `sync-css.mjs` runs as part of `buildCmd` and copies `assets/css/*.css` into the
  package. `cfg.cssEntry` is bounded to the package dir, which is why the copy exists.
  **`assets/css/` stays the single source of truth — never edit the copies** (they are gitignored).

## Fonts

Fraunces + Source Sans 3 were downloaded from Google Fonts as **latin-subset
variable woff2** (4 files) and are self-hosted in `ds-tokens/css/`. Both are SIL
OFL, so redistribution is fine. The 10 `@font-face` rules mirror the exact query
string documented at the top of `tokens.css`; re-derive them from that line if the
site's font request ever changes.

## Known render warns (triaged — not new failures)

- **`[FONT_MISSING]` "Iowan Old Style", "Palatino Linotype"** — false positive.
  These are *system fallbacks* in `--font-display`, listed after Fraunces. They are
  macOS/Windows resident fonts, not brand fonts, and must not be shipped. The two
  real brand families (Fraunces, Source Sans 3) both ship. Expect this warn on every
  sync; it is correct to ignore.
- `Kicker` cell `AsSpanInAColumn` renders faint — it shows a footer column (cream
  text) on a light card. Legitimate; the on-dark context is what that variant is for.
- `Breadcrumbs` cells are visually sparse — the component genuinely is one short row
  of links on emerald.

## JS-gated classes

Every scroll animation on the live site (`reveal`, `reveal-group`, `mask-on-load`,
`hero-stage`, `.past-hero` header transparency) is scoped under a `.js` root class
set by an inline script in the page `<head>`. Claude Design never sets it, so
components render in their **final visible state** — this is why previews are not
blank. The components deliberately **do not emit** those classes.

## Preview specifics

- `.design-sync/previews/_assets.ts` inlines 6 brand images as data URIs. It is
  **not** a component preview (`.ts`, not `.tsx`, so the scanner skips it).
  Regenerate with the snippet in git history if `assets/img/` changes. Previews need
  this because `/assets/img/...` does not resolve inside a preview card, and the
  deployed site does not serve those paths either (returns `text/html`).
- `SiteFooter` gained an `emblemSrc` prop **for this reason** — the emblem was
  hard-coded and rendered broken in the card.
- 16 components carry `cardMode: "column"` + an explicit `viewport` in
  `cfg.overrides` — full-width compositions (heroes, bands, footers, grids) that
  otherwise crop. Raise the viewport height if a card ever looks cut off.

## Re-sync risks — what can silently go stale

- **The DS package is hand-maintained.** If someone edits `assets/css/main.css` and
  adds a new pattern to the HTML pages, no component exists for it until one is
  written. The converter cannot discover markup-only patterns. Diff the site's class
  usage against `src/` when the site changes.
- **Copy drift.** Several components hard-code approved copy (`SiteFooter`'s medical
  disclaimer, `NapPanel`/`SiteFooter` NAP details, the tagline). The site's own HTML
  is authoritative; re-check these against the pages on any content change.
- **Phone number** `(369) 222-0979` is confirmed correct and appears as a default in
  `SiteHeader`, `SiteFooter`, `CtaBand`. Changing it means changing all three.
- **Fonts are network-fetched artifacts.** They are committed, so a re-sync will not
  re-download — but if Google bumps the font version the committed files simply stay
  at `v38`/`v19`. That is fine and deterministic.
- **Never uploaded yet.** The first sync built and verified everything locally but
  `DesignSync` was never authorized (`/design-login` not run), so **no project
  exists and `config.json` has no `projectId`.** The next run is still a first sync:
  it creates a project and takes the incremental upload path.
