# Generations Wellness — v2 "ATMOSPHERES"

A physician-directed hyperbaric oxygen therapy centre in Modesto, California.
Editorial luxury: deep emerald grounds, cream paper, **scarce** gold, Fraunces
display serif over Source Sans 3.

## No provider, no theme setup

Components render correctly on their own. Import them and go:

```jsx
import { Section, SectionHead, Card, Mosaic, ChipIcon, Icon, Button } from 'generations-wellness-ds';

<Section tone="card-bg" numeral="02" label="Why Oxygen Matters">
  <SectionHead deck kicker="Why Oxygen Matters"
    heading={<>How HBOT May Support Your <em>Healing</em></>}
    lead="Every benefit below reflects the same mechanism — more oxygen, delivered where your body needs it most." />
  <Mosaic>
    <Card variant="featured" icon={<ChipIcon><Icon name="caduceus" /></ChipIcon>} heading="Physician-Directed">
      <p>A physician assessment is mandatory before starting HBOT.</p>
    </Card>
  </Mosaic>
</Section>
```

Everything comes from `styles.css` (tokens → fonts → component CSS). There is no
`ThemeProvider`, no root wrapper, and no class-name prop system: **components
carry their own classes, and your own layout glue uses `var(--*)` tokens.**

## The one rule that breaks designs: light vs. dark surfaces

Half this system sits on emerald. Components that live there need their on-dark
form, and there is no automatic detection — you must pass it:

| On an emerald surface | Use |
|---|---|
| `Kicker` | `<Kicker onDark>` — the light-surface gold is unreadable there |
| secondary `Button` | `variant="secondary-on-dark"` — never plain `secondary` |
| `ChipIcon` | `tone="light"` |
| `Chips`, `LedgerLink` | `onDark` |

The emerald surfaces are `Section tone="dark"`, `Hero`, `PageHero`, `CtaBand`,
`NapPanel`, `ValleyPanel`'s photo band, and `SiteFooter`. Primary `Button` is the
gold gradient and is correct on both.

## Colour and type, by token

Never hard-code a hex. The real names, from `tokens.css`:

- **Greens** `--green-950` `--green-900` (brand emerald) `--green-800` `--green-700` `--green-600`; `--sage-100` `--sage-200` `--sage-300`
- **Golds** `--gold-200` … `--gold-800`. **`--gold-800` is the only gold legible as text on light.** `--gold-500`/`--gold-600` are the gradient; `--gold-300` is champagne for text on emerald.
- **Paper / ink** `--cream-50` `--cream-100` (page) `--cream-200`; `--ink-900` (body) `--ink-600` (muted); `--ink-400` is decorative only
- **Semantic** `--surface-page` `--focus-ring` `--focus-ring-on-dark` `--error` `--success`
- **Type** `--font-display` (Fraunces) `--font-body` (Source Sans 3)
- **Space** `--space-1` … `--space-12`

Gold is the scarcest thing here. `GoldText` — one phrase per screen, inside a
headline or a statistic, **never body copy** (a gradient fill has no reliable
contrast ratio at text sizes).

## Utility classes worth knowing

The system is component-first, but these real classes exist and are used
directly: `container` / `container--wide` / `container--text`, `lead`, `small`,
`prose`, `h4-style`, `h6-style`, `center`, `visually-hidden`, `gold-rule`,
`text-gold-gradient`, and spacing `mt-4` `mt-6` `mt-8` `mt-10` `mt-12`.

Classes ending in `reveal`, `reveal-group`, `mask-on-load` and `hero-stage` are
scroll-animation hooks from the live site. They are gated behind a `.js` root
class the components do not set, so **omit them** — the components already render
in their final visible state.

## Page skeleton

`SiteHeader` → `Hero` (home) or `PageHero` (inner pages, with `crumbs`) →
alternating `Section` bands → `CtaBand` → `SiteFooter`. Alternate the band tones
so neighbours never repeat a surface: `default` → `card-bg` → `default` → `dark`.
`Section` also carries the two editorial marks — `numeral="03"` (ghost numeral,
bled into the corner) and `label="The Therapy"` (rotated, up the outer edge).

## Content rules that are not style preferences

This is a medical site and the copy is compliance-bound:

- Benefits are always written as **"supports"** or **"may help"** — never "treats",
  "cures", or a promised outcome. Never name a condition HBOT is not FDA-cleared for.
- A physician assessment is **mandatory** before any course. Say so where a page
  invites someone to start.
- Any page making a benefit claim should carry a `Callout` on the same screen —
  `variant="careplan"` for the care-plan qualifier, `variant="important"` for the
  mandatory-assessment rule.
- `SiteFooter` carries the full medical disclaimer. Keep it on every page.
- Canonical NAP, used verbatim in `NapPanel`, the footer, and structured data:
  **Generations Wellness · 1801 H Street, Suite C-1 · Modesto, CA 95354 ·
  (369) 222-0979 · marketing@generationswellness.net**
- Tagline: **Holistic Health, For Every Stage of Life**

## Where the truth lives

Read these before styling anything by hand: `_ds/<folder>/styles.css` and its
imports (`tokens/tokens.css` for every token above, `_ds_bundle.css` for the
component CSS), and the per-component `<Name>.prompt.md` and `<Name>.d.ts`.
