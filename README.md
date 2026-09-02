# Generations Wellness — Website

Static marketing site for **Generations Wellness**, a physician-directed hyperbaric oxygen therapy (HBOT) center at 1801 H Street, Suite C-1, Modesto, CA 95354.

Built as a hand-authored static site (no framework, no build step) for maximum performance and SEO, designed to be hosted on **GitHub Pages** with the custom domain `www.generationswellness.net`.

## Structure

```
/                       index.html          Home
/hyperbaric-oxygen-therapy/                 Main service page (what HBOT is, how it works, what to expect)
/benefits/                                  Benefits & who may benefit
/about/                                     About the center
/faq/                                       Frequently asked questions (FAQPage schema)
/contact/                                   Contact, map, NAP
assets/css/             tokens.css (design tokens) + main.css (site styles)
assets/js/main.js       Navigation, reveals (progressive enhancement only)
assets/img/             Brand assets extracted from the print leaflet
docs/                   Design system, SEO strategy, competitor research — kept LOCAL only
                        (excluded via .gitignore so internal strategy is never published)
sitemap.xml, robots.txt, 404.html, CNAME, .nojekyll
```

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080 — all internal URLs are root-absolute, so serve from the repo root.

## Deploying to GitHub Pages

1. Push this repository to GitHub (`main` branch).
2. Repo → Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Custom domain: `www.generationswellness.net` (the `CNAME` file in this repo keeps it set). Enable **Enforce HTTPS** once the certificate is issued.
4. DNS at the domain registrar:
   - `www` → CNAME → `<github-username>.github.io`
   - Apex `generationswellness.net` → A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (redirects to www)
5. After the first deploy, submit `https://www.generationswellness.net/sitemap.xml` in Google Search Console.

`.nojekyll` disables Jekyll processing so files are served exactly as committed.

## Editing notes

- Design tokens (colors, type scale, spacing) live in `assets/css/tokens.css`; page styles in `assets/css/main.css`. The system is documented in `docs/design-system.md`.
- Every page carries its own unique `<title>`, meta description, canonical URL, Open Graph tags, and JSON-LD structured data. If you add a page, add it to `sitemap.xml` too.
- Medical claim language is deliberately qualified ("supports", "may help") and mirrors the approved brochure copy — keep it that way. See `docs/seo-content-strategy.md` → Compliance guardrails.
