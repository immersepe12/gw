#!/usr/bin/env python3
"""Build content pages for www.generationswellness.net.

Each page lives in content/<path>.html: a META comment holding JSON front matter,
followed by the page body (one or more <section> blocks using the site's CSS
components). This script wraps the body in the shared <head>, header, hero,
related-links module, CTA band and footer, merges the site-wide JSON-LD graph,
and writes <path>/index.html. It also refreshes the header nav and footer on the
hand-authored core pages so every page shares one navigation.

    python3 tools/build_pages.py            build everything, run QA
    python3 tools/build_pages.py --check    QA only (exit 1 on errors)
    --allow-planned   treat URLs in docs/seo/page-list.md as existing
    --only=<path>     report QA for matching content files only (repeatable)
"""
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
BASE = "https://www.generationswellness.net"
PHONE_HREF = "tel:+13692220979"
PHONE = "(369) 222-0979"
CORE_PAGES = ["index.html", "hyperbaric-oxygen-therapy/index.html", "benefits/index.html",
              "about/index.html", "faq/index.html", "contact/index.html", "404.html"]
CORE_TITLES = {
    "/": ("Home", "Physician-directed hyperbaric oxygen therapy in downtown Modesto."),
    "/hyperbaric-oxygen-therapy/": ("How HBOT Works at Our Center", "What a session feels like, how many sessions, and safety."),
    "/benefits/": ("Benefits & Who HBOT May Help", "The conditions HBOT is cleared for, described honestly."),
    "/about/": ("About Generations Wellness", "Our physician-directed approach, led by Dr. Rajwinder Singh Bahia, MD."),
    "/faq/": ("HBOT Questions, Answered", "Cost, safety, sessions, what to wear, and getting started."),
    "/contact/": ("Contact & Directions", "Call, visit 1801 H Street, or book a physician assessment."),
}

NAV = [("/hyperbaric-oxygen-therapy/", "Hyperbaric Therapy"), ("/conditions/", "Conditions"),
       ("/cost/", "Cost &amp; Insurance"), ("/learn/", "Learn"), ("/about/", "About"), ("/contact/", "Contact")]

FOOTER_COLS = [
    ("Treatment", [("/hyperbaric-oxygen-therapy/", "Hyperbaric Oxygen Therapy"), ("/conditions/", "Conditions We Treat"),
                   ("/what-to-expect/", "What to Expect"), ("/safety/", "Safety &amp; Eligibility"),
                   ("/cost/", "Cost"), ("/insurance/", "Insurance"), ("/for-physicians/", "For Physicians")]),
    ("Learn", [("/learn/", "Learn Hub"), ("/how-hbot-works/", "How HBOT Works"), ("/faq/", "FAQ"),
               ("/compare/", "Compare Options"), ("/hbot-research/", "HBOT Research"),
               ("/benefits/", "Benefits"), ("/service-area/", "Service Area")]),
]

SITE_NODES = [
    {
        "@type": "MedicalClinic",
        "@id": f"{BASE}/#clinic",
        "name": "Generations Wellness",
        "url": f"{BASE}/",
        "logo": f"{BASE}/assets/img/icon-512.png",
        "image": f"{BASE}/assets/img/og-image.jpg",
        "slogan": "Holistic Health, For Every Stage of Life",
        "description": "Physician-directed hyperbaric oxygen therapy (HBOT) and infusion center in downtown Modesto, CA.",
        "telephone": "+13692220979",
        "email": "marketing@generationswellness.net",
        "address": {"@type": "PostalAddress", "streetAddress": "1801 H Street, Suite C-1", "addressLocality": "Modesto",
                    "addressRegion": "CA", "postalCode": "95354", "addressCountry": "US"},
        "hasMap": "https://www.google.com/maps/search/?api=1&query=Generations+Wellness+1801+H+Street+Suite+C-1+Modesto+CA+95354",
        "availableService": [{"@id": f"{BASE}/#hbot"}, {"@id": f"{BASE}/#infusion"}],
    },
    {"@type": "MedicalTherapy", "@id": f"{BASE}/#hbot", "name": "Hyperbaric Oxygen Therapy", "alternateName": "HBOT",
     "provider": {"@id": f"{BASE}/#clinic"}},
    {"@type": "MedicalTherapy", "@id": f"{BASE}/#infusion", "name": "Infusion Therapy",
     "description": "Physician-ordered infusion therapy, provided in-clinic under medical supervision only after a physician determines it is appropriate.",
     "provider": {"@id": f"{BASE}/#clinic"}},
    {"@type": "Person", "@id": f"{BASE}/#physician", "name": "Rajwinder Singh Bahia", "honorificPrefix": "Dr.",
     "honorificSuffix": "MD", "jobTitle": "Physician", "worksFor": {"@id": f"{BASE}/#clinic"}, "url": f"{BASE}/about/"},
    {"@type": "WebSite", "@id": f"{BASE}/#website", "name": "Generations Wellness", "url": f"{BASE}/"},
]

CTA = {
    "emergency": ("If This Is an Emergency", "Call <em class=\"text-gold-gradient\">911</em> First",
                  "Emergency hyperbaric treatment happens in hospital settings. For follow-up questions once you are stable, our team is glad to talk.",
                  ("Call 911", "tel:911"), ("Talk to Our Team", "/contact/")),
    "research": ("Your Next Step", "Talk to a Physician About <em class=\"text-gold-gradient\">Your</em> Situation",
                 "We'll give you an honest answer about whether HBOT is appropriate for you, including when it isn't.",
                 ("Schedule a Physician Assessment", "/contact/"), ("Conditions HBOT Is Cleared For", "/conditions/")),
    "physicians": ("Refer a Patient", "Coordinate Care With <em class=\"text-gold-gradient\">Our</em> Team",
                   "Call to discuss a patient, request an assessment, or arrange a visit to the center.",
                   ("Call to Refer", PHONE_HREF), ("Contact &amp; Directions", "/contact/")),
    "default": ("Your Next Step", "Begin With a <em class=\"text-gold-gradient\">Physician</em> Assessment",
                "Every course starts with an honest conversation and a physician assessment. No pressure, no obligation.",
                ("Book a Physician Assessment", "/contact/"), ("What to Expect", "/what-to-expect/")),
}

RINGS = ('<svg class="rings rings--live" viewBox="0 0 720 720" fill="none" aria-hidden="true">\n'
         '        <circle cx="360" cy="360" r="72" stroke-opacity=".20"/><circle cx="360" cy="360" r="120" stroke-opacity=".16"/>'
         '<circle cx="360" cy="360" r="172" stroke-opacity=".13"/><circle cx="360" cy="360" r="228" stroke-opacity=".10"/>'
         '<circle cx="360" cy="360" r="288" stroke-opacity=".08"/><circle cx="360" cy="360" r="352" stroke-opacity=".06"/>\n      </svg>')
CALL_SVG = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>')
ARROW_SVG = ('<svg class="index-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" '
             'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>')

BANNED = [
    (r"\bcures?\b", "claims a cure"), (r"\bguarantee[ds]?\b", "guarantee language"),
    (r"completely safe|100% safe|risk-free|no side effects|zero risk", "absolute safety claim"),
    (r"FDA[- ]approved (therapy|treatment)", "'FDA-approved therapy' (use FDA-cleared indication)"),
    (r"\bdetox", "detox claim"), (r"\breverses?\b(?! osmosis)", "reversal claim"),
    (r"\{\{|\}\}", "unfilled placeholder"), (r"CLINIC TO CONFIRM", "unfilled placeholder"),
    (r"[Mm]edically reviewed by", "review claim (Dr. Bahia has not reviewed pages yet)"),
    (r"\bstate-of-the-art\b|\belite\b", "hype language"),
]


def esc(s):
    return html.escape(s, quote=True)


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s)


def load_pages():
    pages = []
    for f in sorted(CONTENT.rglob("*.html")):
        text = f.read_text()
        m = re.match(r"\s*<!--META\s*(\{.*?\})\s*-->\s*(.*)", text, re.S)
        if not m:
            if "--only=" in " ".join(sys.argv) and not any(a.split("=", 1)[1] in str(f) for a in sys.argv if a.startswith("--only=")):
                continue
            raise SystemExit(f"{f}: missing <!--META {{...}} --> header")
        try:
            meta = json.loads(m.group(1))
        except json.JSONDecodeError as e:
            if "--only=" in " ".join(sys.argv) and not any(a.split("=", 1)[1] in str(f) for a in sys.argv if a.startswith("--only=")):
                continue
            raise SystemExit(f"{f}: META is not valid JSON: {e}")
        meta["_src"] = f.relative_to(ROOT)
        meta["_body"] = m.group(2).strip()
        pages.append(meta)
    return pages


def nav(current):
    cur = ' aria-current="page"'
    items = "\n".join(
        f'          <li><a href="{u}"{cur if u == current else ""}>{label}</a></li>' for u, label in NAV)
    if current == "/contact/":
        cta = f'<a class="btn btn--primary" href="{PHONE_HREF}">Call {PHONE}</a>'
    else:
        cta = '<a class="btn btn--primary" href="/contact/">Book an Assessment</a>'
    return (f'<nav id="site-nav" class="site-nav" aria-label="Main">\n        <ul>\n{items}\n        </ul>\n'
            f'        <div class="nav-cta">\n          {cta}\n        </div>\n      </nav>')


def footer():
    cols = ""
    for title, links in FOOTER_COLS:
        lis = "\n".join(f'              <li><a href="{u}">{t}</a></li>' for u, t in links)
        cols += (f'          <nav class="footer-col" aria-label="{title}">\n            <span class="kicker">{title}</span>\n'
                 f'            <ul>\n{lis}\n            </ul>\n          </nav>\n')
    return f'''<footer class="site-footer">
    <div class="footer-divider" aria-hidden="true"></div>
    <div class="footer-main">
      <div class="footer-ghost" aria-hidden="true" data-word="Generations"></div>
      <div class="container">
        <div class="footer-grid footer-grid--5">
          <div class="footer-brand">
            <img src="/assets/img/emblem-gold-160.webp" alt="" width="72" height="74" loading="lazy">
            <p class="footer-wordmark">Generations<span>Wellness</span></p>
            <p class="footer-tagline">Holistic Health, For Every Stage of Life</p>
          </div>
{cols}          <div class="footer-col">
            <span class="kicker">Visit</span>
            <address>
              Generations Wellness<br>
              1801 H Street, Suite C-1<br>
              Modesto, CA 95354<br>
              <a href="https://www.google.com/maps/search/?api=1&amp;query=Generations+Wellness+1801+H+Street+Suite+C-1+Modesto+CA+95354" rel="noopener">Get directions</a>
            </address>
            <p class="small mt-4">Sessions by appointment.</p>
          </div>
          <div class="footer-col">
            <span class="kicker">Contact</span>
            <ul>
              <li><a href="{PHONE_HREF}">{PHONE}</a></li>
              <li><a href="mailto:marketing@generationswellness.net">marketing@generationswellness.net</a></li>
              <li><a href="/contact/">Book a physician consultation</a></li>
            </ul>
            <p class="small mt-4">Physicians: we welcome referrals and will coordinate care with your office. <a href="/for-physicians/">Refer a patient</a>.</p>
          </div>
        </div>
        <p class="footer-disclaimer"><strong>Medical Disclaimer:</strong> The information on this website is provided for general educational purposes only and is not medical advice, diagnosis, or treatment. Hyperbaric oxygen therapy (HBOT) at Generations Wellness is provided only after an assessment by a physician, who determines whether HBOT is appropriate as part of your care plan. HBOT complements — and never replaces — the medical treatment prescribed by your doctors. The FDA has cleared hyperbaric chambers for specific conditions; HBOT has not been proven safe or effective for other conditions. Individual results vary, and no outcome is guaranteed. If you believe you have a medical emergency, call 911. <a href="/medical-disclaimer/">Full medical disclaimer</a> · <a href="/privacy-policy/">Privacy policy</a> · <a href="/editorial-policy/">Editorial policy</a></p>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <span>© 2026 Generations Wellness · Modesto, California</span>
        <span><a href="{BASE}/">www.generationswellness.net</a></span>
      </div>
    </div>
  </footer>'''


def crumbs_for(meta, by_url):
    url = meta["url"]
    trail = [("Home", "/")]
    parts = [p for p in url.strip("/").split("/") if p]
    for i in range(1, len(parts)):
        u = "/" + "/".join(parts[:i]) + "/"
        parent = by_url.get(u)
        name = parent.get("crumb") if parent else parts[i - 1].replace("-", " ").title()
        trail.append((name, u))
    trail.append((meta["crumb"], url))
    return trail


def schema(meta, trail):
    url = BASE + meta["url"]
    nodes = [dict(n) for n in SITE_NODES]
    page_nodes = json.loads(json.dumps(meta.get("schema", [])))
    web = next((n for n in page_nodes if n.get("@id") == url + "#webpage"), None)
    if web is None:
        web = {"@type": meta.get("page_type_schema", "WebPage"), "@id": url + "#webpage"}
        page_nodes.insert(0, web)
    web.setdefault("url", url)
    web["name"] = meta["title"]
    web["description"] = meta["description"]
    web.setdefault("inLanguage", "en-US")
    web["isPartOf"] = {"@id": f"{BASE}/#website"}
    web["breadcrumb"] = {"@id": url + "#breadcrumb"}
    web["datePublished"] = meta["published"]
    web["dateModified"] = meta["updated"]
    web.pop("reviewedBy", None)
    web.pop("lastReviewed", None)
    for n in page_nodes:
        n.pop("reviewedBy", None)
        n.pop("lastReviewed", None)
    items = []
    for i, (name, u) in enumerate(trail, 1):
        item = {"@type": "ListItem", "position": i, "name": strip_tags(html.unescape(name))}
        if i < len(trail):
            item["item"] = BASE + u
        items.append(item)
    page_nodes.append({"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": items})
    graph = {"@context": "https://schema.org", "@graph": nodes + page_nodes}
    return json.dumps(graph, indent=2, ensure_ascii=False).replace("</", "<\\/")


def related(meta, by_url):
    urls = meta.get("related", [])
    if not urls:
        return ""
    rows = []
    for u in urls:
        if u in by_url:
            t, d = by_url[u].get("card_title") or strip_tags(by_url[u]["h1"]), by_url[u]["description"]
        elif u in CORE_TITLES:
            t, d = CORE_TITLES[u]
        else:
            continue
        rows.append(f'''          <li>
            <a class="index-row" href="{u}">
              <span class="idx" aria-hidden="true"></span>
              <div class="index-title"><h3>{esc(t)}</h3></div>
              <p class="index-desc">{esc(d)}</p>
              {ARROW_SVG}
            </a>
          </li>''')
    return f'''
    <section class="section section--card-bg related">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Keep Reading</p>
          <h2>Related Pages</h2>
          <span class="gold-rule"></span>
        </div>
        <ul class="index">
{chr(10).join(rows)}
        </ul>
      </div>
    </section>'''


def hub_children(meta, pages):
    if not meta.get("hub"):
        return ""
    url = meta["url"]
    kids = [p for p in pages if p["url"] != url and p["url"].startswith(url)
            and p["url"][len(url):].strip("/").count("/") == 0]
    kids += [p for p in pages if p["url"] in meta.get("hub_extra", [])]
    if not kids:
        return ""
    rows = "\n".join(f'''          <li>
            <a class="index-row" href="{p["url"]}">
              <span class="idx" aria-hidden="true"></span>
              <div class="index-title"><h3>{esc(p.get("card_title") or strip_tags(p["h1"]))}</h3></div>
              <p class="index-desc">{esc(p["description"])}</p>
              {ARROW_SVG}
            </a>
          </li>''' for p in kids)
    return f'''
    <section class="section hub-index">
      <div class="container">
        <div class="section-head">
          <p class="kicker">In This Section</p>
          <h2>{esc(meta.get("hub_heading", "All Pages in This Section"))}</h2>
          <span class="gold-rule"></span>
        </div>
        <ul class="index">
{rows}
        </ul>
      </div>
    </section>'''


def cta_band(meta):
    kicker, heading, lead, (p_label, p_href), (s_label, s_href) = CTA[meta.get("cta", "default")]
    return f'''
    <section class="cta-band" data-breathe>
      {RINGS}
      <div class="container">
        <p class="kicker">{kicker}</p>
        <h2>{heading}</h2>
        <p class="lead">{lead}</p>
        <div class="hero-actions">
          <a class="btn btn--primary" href="{p_href}">{p_label}</a>
          <a class="btn btn--secondary-on-dark" href="{s_href}">{s_label}</a>
        </div>
        <p class="cta-phone">Prefer to talk? <a href="{PHONE_HREF}">{PHONE}</a></p>
      </div>
    </section>'''


def render(meta, pages, by_url):
    url = meta["url"]
    trail = crumbs_for(meta, by_url)
    title, desc = esc(meta["title"]), esc(meta["description"])
    og_type = "article" if meta.get("type") in ("article", "research", "condition", "compare") else "website"
    article_meta = ""
    if og_type == "article":
        article_meta = (f'\n  <meta property="article:published_time" content="{meta["published"]}">'
                        f'\n  <meta property="article:modified_time" content="{meta["updated"]}">')
    crumbs_html = "\n".join(
        f'            <li><a href="{u}">{n}</a></li>' if i < len(trail) - 1 else f'            <li><span aria-current="page">{n}</span></li>'
        for i, (n, u) in enumerate(trail))
    import datetime
    d = datetime.date.fromisoformat(meta["updated"])
    updated_h = f"{d.strftime('%B')} {d.day}, {d.year}"
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>document.documentElement.classList.add('js')</script>
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{BASE}{url}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#034439">

  <meta property="og:type" content="{og_type}">
  <meta property="og:site_name" content="Generations Wellness">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{BASE}{url}">
  <meta property="og:image" content="{BASE}/assets/img/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Patient resting inside a hyperbaric oxygen chamber at Generations Wellness in Modesto, CA">
  <meta property="og:locale" content="en_US">{article_meta}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="{BASE}/assets/img/og-image.jpg">

  <link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/assets/img/favicon-64.png" sizes="64x64" type="image/png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500;1,9..144,600&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/main.css">

  <script type="application/ld+json">
{schema(meta, trail)}
  </script>
</head>
<body class="page-{meta.get("type", "page")}">
  <a class="skip-link" href="#main">Skip to main content</a>

  <header class="site-header">
    <div class="container container--wide header-inner">
      <a class="brand" href="/" aria-label="Generations Wellness — home">
        <img class="brand-mark" src="/assets/img/logo-coin-96.png" alt="" width="96" height="96">
        <span class="brand-text">
          <span class="brand-name">Generations</span>
          <span class="brand-sub">Wellness</span>
        </span>
      </a>
      {nav(url)}
      <a class="btn btn--primary btn--sm header-cta" href="/contact/">Book an Assessment</a>
      <a class="btn btn--primary btn--sm header-call" href="{PHONE_HREF}">{CALL_SVG}Call</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="visually-hidden">Menu</span>
        <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="progress-line" aria-hidden="true"></div>
  </header>

  <main id="main">
    <header class="page-hero depth">
      <div class="rings-static" aria-hidden="true"></div>
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <ol>
{crumbs_html}
          </ol>
        </nav>
        <p class="kicker kicker--on-dark">{meta["kicker"]}</p>
        <h1>{meta["h1"]}</h1>
        <p class="lead">{meta["lead"]}</p>
        <p class="page-meta">Physician-directed care under Dr. Rajwinder Singh Bahia, MD · Updated <time datetime="{meta["updated"]}">{updated_h}</time></p>
      </div>
    </header>
    <div class="hero-end-sentinel" aria-hidden="true"></div>

{meta["_body"]}
{hub_children(meta, pages)}{related(meta, by_url)}{cta_band(meta)}
  </main>

  {footer()}

  <script src="/assets/js/main.js" defer></script>
</body>
</html>
'''


class Balance(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
            "path", "line", "circle", "rect", "stop", "use", "ellipse", "polygon", "polyline"}

    def __init__(self):
        super().__init__()
        self.stack, self.errors, self.h1 = [], [], 0

    def handle_starttag(self, tag, attrs):
        if tag == "h1":
            self.h1 += 1
        if tag not in self.VOID:
            self.stack.append((tag, self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()
        else:
            self.errors.append(f"line {self.getpos()[0]}: unexpected </{tag}> (open: {self.stack[-1] if self.stack else None})")


def qa(pages, known_urls):
    errors, warnings = [], []
    for p in pages:
        src = p["_src"]
        for key in ("url", "title", "description", "h1", "crumb", "kicker", "lead", "published", "updated"):
            if not p.get(key):
                errors.append(f"{src}: META missing '{key}'")
        if len(p.get("title", "")) > 60:
            warnings.append(f"{src}: title {len(p['title'])} chars (>60)")
        if len(p.get("description", "")) > 160:
            warnings.append(f"{src}: description {len(p['description'])} chars (>160)")
        body = p["_body"]
        if re.search(r"<h1[\s>]", body):
            errors.append(f"{src}: body must not contain <h1> (the hero renders it)")
        if "FAQPage" in json.dumps(p.get("schema", [])):
            errors.append(f"{src}: FAQPage schema is reserved for /faq/")
        text = strip_tags(body) + " " + p.get("lead", "") + " " + p.get("description", "")
        for pat, why in BANNED:
            for m in re.finditer(pat, text, re.I):
                ctx = text[max(0, m.start() - 60):m.end() + 60].replace("\n", " ")
                if why in ("claims a cure", "reversal claim") and re.search(r"\bnot\b|\bno\b|n't|never|cannot|isn't|doesn't|won't|claim", ctx, re.I):
                    continue
                errors.append(f"{src}: {why}: …{ctx}…")
        for href in re.findall(r'href="(/[^"#?]*)', body):
            if href.startswith("/assets/"):
                if not (ROOT / href.lstrip("/")).exists():
                    errors.append(f"{src}: missing asset {href}")
                continue
            if not href.endswith("/"):
                errors.append(f"{src}: internal link without trailing slash {href}")
            elif href not in known_urls:
                errors.append(f"{src}: broken internal link {href}")
        for img in re.findall(r'src="(/assets/[^"]+)"', body):
            if not (ROOT / img.lstrip("/")).exists():
                errors.append(f"{src}: missing image {img}")
        words = len(strip_tags(body).split())
        if words < p.get("min_words", 300):
            warnings.append(f"{src}: only {words} words")
        b = Balance()
        b.feed(body)
        for e in b.errors[:3]:
            errors.append(f"{src}: tag balance {e}")
        if b.stack:
            errors.append(f"{src}: unclosed tags {b.stack[:3]}")
    inbound = {p["url"]: 0 for p in pages}
    for p in pages:
        for href in set(re.findall(r'href="(/[^"#?]*)"', p["_body"])) | set(p.get("related", [])):
            if href in inbound and href != p["url"]:
                inbound[href] += 1
    for u, n in inbound.items():
        parent = "/" + "/".join(u.strip("/").split("/")[:-1]) + "/" if u.strip("/").count("/") else None
        if n == 0 and not (parent and parent in {p["url"] for p in pages if p.get("hub")}):
            warnings.append(f"{u}: no inbound content links")
    return errors, warnings


def refresh_core():
    for rel in CORE_PAGES:
        f = ROOT / rel
        s = f.read_text()
        url = "/" if rel in ("index.html", "404.html") else "/" + rel.replace("index.html", "")
        s2 = re.sub(r'<nav id="site-nav".*?</nav>', lambda m: nav(url if rel != "404.html" else ""), s, count=1, flags=re.S)
        s2 = re.sub(r'<footer class="site-footer">.*?</footer>', lambda m: footer(), s2, count=1, flags=re.S)
        if s2 != s:
            f.write_text(s2)


def main():
    check_only = "--check" in sys.argv
    pages = load_pages()
    by_url = {p["url"]: p for p in pages}
    if len(by_url) != len(pages):
        raise SystemExit("duplicate url in content/")
    known = set(by_url) | set(CORE_TITLES)
    if "--allow-planned" in sys.argv:
        plan = ROOT / "docs" / "seo" / "page-list.md"
        if plan.exists():
            known |= set(re.findall(r"\| \d+ \| (/\S*/) \|", plan.read_text())) | {"/learn/"}
    only = [a.split("=", 1)[1] for a in sys.argv if a.startswith("--only=")]
    qa_pages = [p for p in pages if not only or any(str(p["_src"]).endswith(o) or o in str(p["_src"]) for o in only)]
    errors, warnings = qa(qa_pages, known)
    if only:
        warnings = [w for w in warnings if not w.startswith("/")]
    for w in warnings:
        print("warn:", w)
    for e in errors:
        print("ERROR:", e)
    if errors:
        print(f"\n{len(errors)} error(s); nothing written.")
        sys.exit(1)
    if check_only:
        print(f"QA passed for {len(pages)} page(s).")
        return
    for p in pages:
        out = ROOT / p["url"].strip("/") / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(p, pages, by_url))
    refresh_core()
    print(f"built {len(pages)} page(s); refreshed nav/footer on {len(CORE_PAGES)} core pages.")


if __name__ == "__main__":
    main()
