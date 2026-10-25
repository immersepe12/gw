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
REVIEWED_ON = "2026-09-23"  # Dr. Bahia's sign-off, confirmed by the clinic
CORE_PAGES = ["index.html", "hyperbaric-oxygen-therapy/index.html", "benefits/index.html",
              "about/index.html", "faq/index.html", "contact/index.html", "404.html"]
CORE_TITLES = {
    "/": ("Generations Wellness Home", "Physician-led outpatient medical practice in downtown Modesto."),
    "/hyperbaric-oxygen-therapy/": ("Hyperbaric Oxygen Therapy in Modesto", "Physician-directed HBOT in hard-shell chambers in downtown Modesto, for FDA-cleared indications."),
    "/benefits/": ("Benefits & Who HBOT May Help", "The conditions HBOT is cleared for, described honestly."),
    "/about/": ("About Generations Wellness", "Our physician-directed approach, led by Dr. Rajwinder Singh Bahia, MD."),
    "/faq/": ("HBOT Questions, Answered", "Cost, safety, sessions, what to wear, and getting started."),
    "/contact/": ("Contact & Directions", "Call, visit 1801 H Street, or book a physician assessment."),
}

PHONE2_HREF = "tel:+12098090022"
PHONE2 = "(209) 809-0022"
PRACTICE = "Generations Wellness Medical Practice"

# The practice's service lines. Hub pages live at the root-level slug.
SERVICES = [
    ("physical-therapy", "/physical-therapy/", "Physical Therapy", "PhysicalTherapy"),
    ("pain-management", "/pain-management/", "Pain Management", "MedicalTherapy"),
    ("counseling", "/counseling/", "Counseling", "PsychologicalTreatment"),
    ("pediatric-speech-therapy", "/pediatric-speech-therapy/", "Pediatric Speech Therapy", "MedicalTherapy"),
    ("pediatric-therapy", "/pediatric-therapy/", "Pediatric Therapy", "MedicalTherapy"),
    ("occupational-therapy", "/occupational-therapy/", "Occupational Therapy", "MedicalTherapy"),
    ("wound-care", "/wound-care/", "Wound Care", "MedicalTherapy"),
    ("iv-therapy", "/iv-therapy/", "IV Therapy", "MedicalTherapy"),
    ("hbot", "/hyperbaric-oxygen-therapy/", "Hyperbaric Oxygen Therapy", "MedicalTherapy"),
]

NAV = [("/services/", "Services"), ("/new-patients/", "New Patients"),
       ("/self-pay-pricing/", "Pricing"), ("/learn/", "Learn"), ("/about/", "About"), ("/contact/", "Contact")]

FOOTER_COLS = [
    ("Services", [(u, n) for _, u, n, _ in SERVICES]),
    ("Patients", [("/services/", "All Services"), ("/new-patients/", "New Patients"), ("/cost/", "HBOT Cost"),
                  ("/insurance/", "Insurance"), ("/learn/", "Learn"), ("/faq/", "FAQ"),
                  ("/service-area/", "Service Area"), ("/for-physicians/", "For Physicians")]),
]

# Google Maps pin for 1801 H St C-1 (The Shops at Lincoln School), per coordinator 2026-10-24.
AREA_SERVED = ([{"@type": "City", "name": c, "containedInPlace": {"@type": "State", "name": "California"}}
                for c in ("Modesto", "Ceres", "Turlock", "Riverbank", "Oakdale", "Salida", "Manteca", "Ripon", "Stockton")]
               + [{"@type": "AdministrativeArea", "name": "Stanislaus County, California"}])

SITE_NODES = [
    {
        "@type": "MedicalClinic",
        "@id": f"{BASE}/#clinic",
        "name": PRACTICE,
        "alternateName": "Generations Wellness",
        "url": f"{BASE}/",
        "logo": f"{BASE}/assets/img/icon-512.png",
        "image": f"{BASE}/assets/img/og-image.jpg",
        "slogan": "Holistic Health, For Every Stage of Life",
        "description": "Physician-led outpatient medical practice in downtown Modesto, CA, offering hyperbaric oxygen therapy, wound care, IV therapy, counseling, physical and occupational therapy, pediatric speech and developmental therapy, and pain management.",
        "telephone": "+13692220979",
        "contactPoint": [{"@type": "ContactPoint", "telephone": "+13692220979", "contactType": "appointments"},
                         {"@type": "ContactPoint", "telephone": "+12098090022", "contactType": "appointments"}],
        "email": "marketing@generationswellness.net",
        "address": {"@type": "PostalAddress", "streetAddress": "1801 H Street, Suite C-1", "addressLocality": "Modesto",
                    "addressRegion": "CA", "postalCode": "95354", "addressCountry": "US"},
        "geo": {"@type": "GeoCoordinates", "latitude": 37.6452296, "longitude": -120.9912123},
        "hasMap": "https://www.google.com/maps/search/?api=1&query=Generations+Wellness+1801+H+Street+Suite+C-1+Modesto+CA+95354",
        "areaServed": AREA_SERVED,
        "isAcceptingNewPatients": True,
        "medicalSpecialty": ["Physiotherapy", "SpeechPathology"],
        "availableService": [{"@id": f"{BASE}/#{k}"} for k, _, _, _ in SERVICES] + [{"@id": f"{BASE}/#infusion"}],
        "sameAs": ["https://www.facebook.com/people/Generations-Wellness/61594639832610/", "https://www.instagram.com/generations_wellness_/"],
    },
    *[{"@type": t, "@id": f"{BASE}/#{k}", "name": n, "url": f"{BASE}{u}", "provider": {"@id": f"{BASE}/#clinic"}}
      for k, u, n, t in SERVICES],
    {"@type": "MedicalTherapy", "@id": f"{BASE}/#infusion", "name": "Infusion Therapy",
     "description": "Physician-ordered infusion therapy, provided in-clinic under medical supervision only after a physician determines it is appropriate.",
     "provider": {"@id": f"{BASE}/#clinic"}},
    {"@type": "Person", "@id": f"{BASE}/#physician", "name": "Rajwinder Singh Bahia", "honorificPrefix": "Dr.",
     "honorificSuffix": "MD", "jobTitle": "Medical Director", "worksFor": {"@id": f"{BASE}/#clinic"}, "url": f"{BASE}/about/"},
    {"@type": "WebSite", "@id": f"{BASE}/#website", "name": PRACTICE, "url": f"{BASE}/"},
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
    "es": ("Su siguiente paso", "Empiece con una <em class=\"text-gold-gradient\">evaluación médica</em>",
           "Llame a cualquiera de nuestros dos números para hacer una pregunta o pedir una cita. Antes de cualquier tratamiento, un médico revisa su caso.",
           ("Llamar al (369) 222-0979", PHONE_HREF), ("Contacto y cómo llegar", "/contact/")),
    "service": ("Your Next Step", "Book an <em class=\"text-gold-gradient\">Appointment</em>",
                "Call either number to ask a question or book a visit. Our team will tell you what to bring and what happens first.",
                ("Book an Appointment", "/contact/"), ("All Services", "/services/")),
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


SERVICE_BLURBS = {
    "/hyperbaric-oxygen-therapy/": "Medical-grade HBOT, hard-shell chambers",
    "/wound-care/": "Care for wounds that are slow to heal",
    "/iv-therapy/": "Physician-ordered infusions after screening",
    "/counseling/": "Talk therapy, in person or by video",
    "/physical-therapy/": "Pain, injury and post-surgery rehab",
    "/occupational-therapy/": "Everyday skills, hands and daily living",
    "/pediatric-speech-therapy/": "Speech, language and feeding for kids",
    "/pediatric-therapy/": "Motor and developmental therapy for kids",
    "/pain-management/": "Physician-led, non-opioid-first pain care",
}
CHEVRON = ('<svg class="chev-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>')
PIN_SVG = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" '
           'stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>')


def nav(current):
    cur = ' aria-current="page"'
    in_services = current == "/services/" or any(current.startswith(u) for _, u, _, _ in SERVICES)
    items = []
    for u, label in NAV:
        if u == "/services/":
            links = "\n".join(
                f'              <li><a href="{su}"{cur if su == current else ""}><span class="mega-name">{n}</span>'
                f'<span class="mega-desc">{SERVICE_BLURBS[su]}</span></a></li>' for _, su, n, _ in SERVICES)
            items.append(
                f'          <li class="has-menu"><a href="/services/" class="menu-trigger"{cur if in_services else ""}>Services{CHEVRON}</a>\n'
                f'            <div class="mega"><div class="mega-inner">\n'
                f'              <p class="mega-kicker">Our Services · Outpatient care in Modesto</p>\n'
                f'              <ul class="mega-grid">\n{links}\n              </ul>\n'
                f'              <a class="mega-all" href="/services/">See all services and how to start &rarr;</a>\n'
                f'            </div></div>\n          </li>')
        elif u == "/hyperbaric-oxygen-therapy/":
            continue
        else:
            items.append(f'          <li><a href="{u}"{cur if u == current else ""}>{label}</a></li>')
    if current == "/contact/":
        cta = f'<a class="btn btn--primary" href="{PHONE_HREF}">Call {PHONE}</a>'
    else:
        cta = '<a class="btn btn--primary" href="/contact/">Book an Appointment</a>'
    body = "\n".join(items)
    return (f'<nav id="site-nav" class="site-nav" aria-label="Main">\n        <ul>\n{body}\n        </ul>\n'
            f'        <div class="nav-cta">\n          {cta}\n          <p class="nav-phones"><a href="{PHONE_HREF}">{PHONE}</a> · <a href="{PHONE2_HREF}">{PHONE2}</a></p>\n        </div>\n      </nav>')


def site_header(url):
    return f'''<!-- utility -->
  <div class="utility-bar">
    <div class="container container--wide utility-inner">
      <p class="utility-place">{PIN_SVG}<span>Outpatient medical practice · 1801 H Street, Suite C-1, Modesto</span></p>
      <p class="utility-phones">{CALL_SVG}<a href="{PHONE_HREF}">{PHONE}</a><span aria-hidden="true">·</span><a href="{PHONE2_HREF}">{PHONE2}</a><span class="utility-sep" aria-hidden="true"></span><span>Visits by appointment</span></p>
    </div>
  </div>
  <!-- /utility -->
  <header class="site-header">
    <div class="container container--wide header-inner">
      <a class="brand" href="/" aria-label="{PRACTICE} — home">
        <img class="brand-mark" src="/assets/img/logo-coin-96.png" alt="" width="96" height="96">
        <span class="brand-text">
          <span class="brand-name">Generations Wellness</span>
          <span class="brand-sub">Medical Practice</span>
        </span>
      </a>
      {nav(url)}
      <a class="btn btn--primary btn--sm header-cta" href="{PHONE_HREF if url == "/contact/" else "/contact/"}">{"Call " + PHONE if url == "/contact/" else "Book an Appointment"}</a>
      <a class="btn btn--primary btn--sm header-call" href="{PHONE_HREF}">{CALL_SVG}Call</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="visually-hidden">Menu</span>
        <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <div class="progress-line" aria-hidden="true"></div>
  </header>'''


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
            <p class="small mt-4">Visits by appointment.</p>
            <p class="small mt-4">Serving the Central Valley, including <a href="/service-area/turlock/">Turlock</a>, <a href="/service-area/manteca/">Manteca</a>, <a href="/service-area/stockton/">Stockton</a> and <a href="/service-area/merced/">Merced</a>. <a href="/service-area/">All towns we serve</a>.</p>
          </div>
          <div class="footer-col">
            <span class="kicker">Contact</span>
            <ul>
              <li><a href="{PHONE_HREF}">{PHONE}</a></li>
              <li><a href="{PHONE2_HREF}">{PHONE2}</a></li>
              <li><a href="mailto:marketing@generationswellness.net">marketing@generationswellness.net</a></li>
              <li><a href="https://www.instagram.com/generations_wellness_/" rel="noopener">Instagram</a> · <a href="https://www.facebook.com/people/Generations-Wellness/61594639832610/" rel="noopener">Facebook</a></li>
              <li><a href="/contact/">Book a physician consultation</a></li>
            </ul>
            <p class="small mt-4">Physicians: we welcome referrals and will coordinate care with your office. <a href="/for-physicians/">Refer a patient</a>.</p>
          </div>
        </div>
        <p class="footer-disclaimer"><strong>Medical Disclaimer:</strong> The information on this website is provided for general educational purposes only and is not medical advice, diagnosis, or treatment. Services at Generations Wellness Medical Practice are provided after an appropriate assessment by a licensed clinician, who determines whether a treatment is right for you. Our care complements, and never replaces, the treatment prescribed by your other doctors. Hyperbaric chambers are FDA-cleared for specific conditions only. Individual results vary, and no outcome is promised. If you have a medical emergency, call 911. If you are in crisis or thinking about suicide, call or text 988. <a href="/medical-disclaimer/">Full medical disclaimer</a> · <a href="/privacy-policy/">Privacy policy</a> · <a href="/editorial-policy/">Editorial policy</a></p>
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
    trail = [("Inicio" if meta.get("lang") == "es" else "Home", "/")]
    parts = [p for p in url.strip("/").split("/") if p]
    for i in range(1, len(parts)):
        u = "/" + "/".join(parts[:i]) + "/"
        parent = by_url.get(u)
        if parent is None and u not in CORE_TITLES:
            continue  # no page at this level (e.g. /es/): don't link to a 404
        name = parent.get("crumb") if parent else CORE_TITLES[u][0]
        trail.append((name, u))
    trail.append((meta["crumb"], url))
    return trail


SERVICE_HUBS = {u: (k, n) for k, u, n, _ in SERVICES}


def service_hub(url):
    """The service hub (url, key, name) a page belongs to, or None."""
    first = "/" + url.strip("/").split("/")[0] + "/" if url.strip("/") else "/"
    if first in SERVICE_HUBS:
        return (first,) + SERVICE_HUBS[first]
    return None


FAQ_EXEMPT = {"/privacy-policy/", "/medical-disclaimer/", "/editorial-policy/", "/404/"}
FAQ_MIN = 5


def _plain(fragment):
    fragment = re.sub(r"<svg.*?</svg>", "", fragment, flags=re.S)
    fragment = re.sub(r"</p>\s*<p[^>]*>", " ", fragment)
    return re.sub(r"\s+", " ", html.unescape(strip_tags(fragment))).strip()


def extract_faqs(doc):
    """Visible FAQ Q&As: every <details> inside the page (summary = question, .faq-answer = answer)."""
    out = []
    for d in re.findall(r"<details[\s>].*?</details>", doc, re.S):
        q = re.search(r"<summary[^>]*>(.*?)</summary>", d, re.S)
        a = re.search(r'<div class="faq-answer"[^>]*>(.*)</div>', d, re.S)
        if q and a:
            out.append((_plain(q.group(1)), _plain(a.group(1))))
    return out


def faq_node(url, faqs, lang="en-US"):
    return {"@type": "FAQPage", "@id": url + "#faq", "url": url, "inLanguage": lang,
            "isPartOf": {"@id": url + "#webpage"},
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                           for q, a in faqs]}


def sync_faq_schema(s, url):
    """Core pages: drop any FAQPage node from the main graph and (re)write one separate FAQPage
    ld+json block generated from the visible FAQ, so it survives rebuilds and always matches."""
    s = re.sub(r'\s*<script type="application/ld\+json" id="faq-jsonld">.*?</script>', "", s, flags=re.S)
    m = re.search(r'(<script type="application/ld\+json">\s*)(\{.*?\})(\s*</script>)', s, re.S)
    if m:
        data = json.loads(m.group(2))
        if "FAQPage" in json.dumps(data):
            data["@graph"] = [n for n in data.get("@graph", []) if n.get("@type") != "FAQPage"]
            out = json.dumps(data, indent=2, ensure_ascii=False).replace("</", "<\\/")
            s = s[:m.start(2)] + out + s[m.end(2):]
            m = re.search(r'(<script type="application/ld\+json">\s*)(\{.*?\})(\s*</script>)', s, re.S)
    faqs = extract_faqs(_main_html(s) or s)
    if faqs and m:
        node = {"@context": "https://schema.org", **faq_node(BASE + url, faqs)}
        block = ('\n  <script type="application/ld+json" id="faq-jsonld">\n'
                 + json.dumps(node, indent=2, ensure_ascii=False).replace("</", "<\\/") + "\n  </script>")
        s = s[:m.end()] + block + s[m.end():]
    return s


def schema(meta, trail, body=""):
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
    web["inLanguage"] = "es-US" if meta.get("lang") == "es" else web.get("inLanguage", "en-US")
    web["isPartOf"] = {"@id": f"{BASE}/#website"}
    web["breadcrumb"] = {"@id": url + "#breadcrumb"}
    web["datePublished"] = meta["published"]
    web["dateModified"] = meta["updated"]
    img = og_image(meta)
    web["primaryImageOfPage"] = {"@type": "ImageObject", "url": BASE + img[0], "width": img[1], "height": img[2]}
    reviewed = meta.get("reviewed", REVIEWED_ON)
    if reviewed:
        web["reviewedBy"] = {"@id": f"{BASE}/#physician"}
        web["lastReviewed"] = reviewed
    hub = service_hub(meta["url"])
    if meta.get("type") == "service" or (hub and meta.get("type") == "hub"):
        # Service pages describe a service, not an article: MedicalWebPage + Service.
        page_nodes = [n for n in page_nodes if n.get("@type") not in ("Article", "MedicalScholarlyArticle")]
        if web.get("@type") in ("WebPage", "Article"):
            web["@type"] = "MedicalWebPage"
        svc = next((n for n in page_nodes if n.get("@type") == "Service"), None)
        if svc is None:
            svc = {"@type": "Service", "@id": url + "#service"}
            page_nodes.append(svc)
        svc.setdefault("name", strip_tags(html.unescape(meta.get("card_title") or meta["h1"])))
        svc.setdefault("url", url)
        if hub:
            svc.setdefault("serviceType", hub[2])
            web.setdefault("about", {"@id": f"{BASE}/#{hub[1]}"})
        svc["provider"] = {"@id": f"{BASE}/#clinic"}
        svc["areaServed"] = AREA_SERVED
        svc.setdefault("availableChannel", {"@type": "ServiceChannel", "serviceLocation": {"@id": f"{BASE}/#clinic"},
                                            "servicePhone": "+13692220979"})
        web["mainEntity"] = {"@id": svc["@id"]}
    for n in page_nodes:
        if reviewed and n is not web and n.get("@type") in ("Article", "MedicalScholarlyArticle"):
            n["reviewedBy"] = {"@id": f"{BASE}/#physician"}
    items = []
    for i, (name, u) in enumerate(trail, 1):
        item = {"@type": "ListItem", "position": i, "name": strip_tags(html.unescape(name))}
        if i < len(trail):
            item["item"] = BASE + u
        items.append(item)
    page_nodes.append({"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": items})
    faqs = extract_faqs(body)
    if faqs:
        page_nodes.append(faq_node(url, faqs, "es-US" if meta.get("lang") == "es" else "en-US"))
    graph = {"@context": "https://schema.org", "@graph": nodes + page_nodes}
    return json.dumps(graph, indent=2, ensure_ascii=False).replace("</", "<\\/")


def card(u, by_url):
    if u in by_url:
        return by_url[u].get("card_title") or strip_tags(by_url[u]["h1"]), by_url[u]["description"]
    if u in CORE_TITLES:
        return CORE_TITLES[u]
    return None


def parent_of(url):
    parts = url.strip("/").split("/")
    return "/" + "/".join(parts[:-1]) + "/" if len(parts) > 1 else None


def related_urls(meta, by_url, exclude=()):
    """Hand-picked related URLs, plus the parent hub and the two nearest siblings,
    minus anything already listed on the page (hub index) and the page itself."""
    url = meta["url"]
    urls = list(meta.get("related", []))
    parent = parent_of(url)
    if parent and (parent in by_url or parent in CORE_TITLES):
        if parent not in urls:
            urls.insert(0, parent)
        sibs = sorted(u for u in by_url if parent_of(u) == parent and not by_url[u].get("noindex"))
        if url in sibs and len(sibs) > 1:
            i = sibs.index(url)
            for j in (i + 1, i - 1):
                sib = sibs[j % len(sibs)]
                if sib != url and sib not in urls:
                    urls.append(sib)
    seen, out = set(), []
    for u in urls:
        if u == url or u in exclude or u in seen or card(u, by_url) is None:
            continue
        seen.add(u)
        out.append(u)
    return out


def related(meta, by_url, exclude=()):
    urls = related_urls(meta, by_url, exclude)
    if not urls:
        return ""
    rows = []
    for u in urls:
        t, d = card(u, by_url)
        rows.append(f'''          <li>
            <a class="index-row" href="{u}">
              <span class="idx" aria-hidden="true"></span>
              <div class="index-title"><h3>{esc(t)}</h3></div>
              <p class="index-desc">{esc(d)}</p>
              {ARROW_SVG}
            </a>
          </li>''')
    es = meta.get("lang") == "es"
    return f'''
    <section class="section section--card-bg related">
      <div class="container">
        <div class="section-head">
          <p class="kicker">{"Siga leyendo" if es else "Keep Reading"}</p>
          <h2>{"Páginas relacionadas (en inglés)" if es else "Related Pages"}</h2>
          <span class="gold-rule"></span>
        </div>
        <ul class="index">
{chr(10).join(rows)}
        </ul>
      </div>
    </section>'''


def hub_kids(meta, pages):
    if not meta.get("hub"):
        return []
    url = meta["url"]
    kids = [p for p in pages if p["url"] != url and p["url"].startswith(url)
            and p["url"][len(url):].strip("/").count("/") == 0]
    kids += [p for p in pages if p["url"] in meta.get("hub_extra", [])]
    return kids


def hub_children(meta, pages):
    kids = hub_kids(meta, pages)
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
        <p class="cta-phone">{"¿Prefiere llamar?" if meta.get("lang") == "es" else "Prefer to talk?"} <a href="{PHONE_HREF}">{PHONE}</a> · <a href="{PHONE2_HREF}">{PHONE2}</a></p>
      </div>
    </section>'''


HBOT_SECTIONS = {"hyperbaric-oxygen-therapy", "conditions", "compare", "learn", "hbot-research", "cost", "insurance",
                 "safety", "what-to-expect", "how-hbot-works", "benefits", "for-physicians", "our-standards", "es"}
OG_IMAGES = {
    "hbot": ("/assets/img/og-image.jpg", 1200, 630,
             "Patient resting inside a hyperbaric oxygen chamber at Generations Wellness in Modesto, CA"),
    "iv": ("/assets/img/og-iv-therapy.jpg", 705, 369,
           "Patient relaxing in the IV therapy lounge at Generations Wellness Medical Practice in Modesto"),
    "practice": ("/assets/img/og-practice.jpg", 1200, 630,
                 "Generations Wellness Medical Practice logo, Modesto, CA"),
}


def og_image(meta):
    """(path, width, height, alt): the HBOT chamber photo only on HBOT pages, the IV lounge photo on
    IV pages, and the neutral practice logo card everywhere else (no stock photos invented)."""
    if meta.get("og_image") in OG_IMAGES:
        return OG_IMAGES[meta["og_image"]]
    first = meta["url"].strip("/").split("/")[0]
    if first == "iv-therapy":
        return OG_IMAGES["iv"]
    if first in HBOT_SECTIONS:
        return OG_IMAGES["hbot"]
    return OG_IMAGES["practice"]


CSS_SOURCES = ["assets/css/fonts.css", "assets/css/tokens.css", "assets/css/main.css"]
CSS_OUT = "assets/css/site.min.css"
FONT_PRELOADS = ["/assets/fonts/fraunces-normal-latin.woff2", "/assets/fonts/fraunces-italic-latin.woff2"]


def minify_css(css):
    """Conservative minifier: strips comments and redundant whitespace, never touches strings,
    and keeps the space before ':' (descendant + pseudo-class selectors) and around + - in calc()."""
    out, i, n = [], 0, len(css)
    while i < n:
        c = css[i]
        if c in "\"'":
            j = i + 1
            while j < n and css[j] != c:
                j += 2 if css[j] == "\\" else 1
            out.append(css[i:j + 1])
            i = j + 1
        elif css.startswith("/*", i):
            j = css.find("*/", i + 2)
            i = n if j < 0 else j + 2
        elif c.isspace():
            j = i
            while j < n and css[j].isspace():
                j += 1
            prev = out[-1][-1:] if out else ""
            nxt = css[j:j + 1]
            if prev and prev not in "{};," and nxt not in "{};,":
                out.append(" ")
            i = j
        else:
            if c in "{}" and out and out[-1] == " ":
                out.pop()
            if c == "}" and out and out[-1] == ";":
                out.pop()
            out.append(c)
            i += 1
    return "".join(out).strip() + "\n"


def build_css():
    """Merge fonts + tokens + main into one minified stylesheet; return a cache-busting version."""
    import hashlib
    css = "\n".join((ROOT / f).read_text() for f in CSS_SOURCES)
    mini = minify_css(css)
    (ROOT / CSS_OUT).write_text(mini)
    return hashlib.sha256(mini.encode()).hexdigest()[:10]


def css_block(version):
    pre = "\n".join(f'  <link rel="preload" href="{f}" as="font" type="font/woff2" crossorigin>' for f in FONT_PRELOADS)
    return f'<!-- css -->\n{pre}\n  <link rel="stylesheet" href="/{CSS_OUT}?v={version}">\n  <!-- /css -->'


CSS_VERSION = None


def css_version():
    global CSS_VERSION
    if CSS_VERSION is None:
        import hashlib
        p = ROOT / CSS_OUT
        CSS_VERSION = hashlib.sha256(p.read_bytes()).hexdigest()[:10] if p.exists() else "0"
    return CSS_VERSION


def js_version():
    import hashlib
    return hashlib.sha256((ROOT / "assets/js/main.js").read_bytes()).hexdigest()[:10]


def hreflang_links(meta):
    alts = meta.get("hreflang")
    if not alts:
        return ""
    lines = [f'  <link rel="alternate" hreflang="{lang}" href="{BASE}{u}">' for lang, u in alts.items()]
    if "en" in alts:
        lines.append(f'  <link rel="alternate" hreflang="x-default" href="{BASE}{alts["en"]}">')
    return "\n" + "\n".join(lines)


def render(meta, pages, by_url):
    url = meta["url"]
    trail = crumbs_for(meta, by_url)
    title, desc = esc(meta["title"]), esc(meta["description"])
    og_type = "article" if meta.get("type") in ("article", "research", "condition", "compare") else "website"
    es = meta.get("lang") == "es"
    img, img_w, img_h, img_alt = og_image(meta)
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
    rv = meta.get("reviewed", REVIEWED_ON)
    if rv:
        r = datetime.date.fromisoformat(rv)
        rh = f"{r.strftime('%B')} {r.day}, {r.year}"
        byline = (f'Medically reviewed by <a href="/about/">Dr. Rajwinder Singh Bahia, MD</a> · '
                  f'<time datetime="{rv}">{rh}</time>')
    elif es:
        meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre",
                 "octubre", "noviembre", "diciembre"]
        byline = (f'{PRACTICE} · Director médico: Dr. Rajwinder Singh Bahia, MD · Actualizado el '
                  f'<time datetime="{meta["updated"]}">{d.day} de {meses[d.month - 1]} de {d.year}</time>')
    else:
        byline = (f'{PRACTICE} · Medical director Dr. Rajwinder Singh Bahia, MD · Updated '
                  f'<time datetime="{meta["updated"]}">{updated_h}</time>')
    kids = {p["url"] for p in hub_kids(meta, pages)}
    return f'''<!DOCTYPE html>
<html lang="{"es" if es else "en"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>document.documentElement.classList.add('js')</script>
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{BASE}{url}">{hreflang_links(meta)}
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#034439">

  <meta property="og:type" content="{og_type}">
  <meta property="og:site_name" content="Generations Wellness">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{BASE}{url}">
  <meta property="og:image" content="{BASE}{img}">
  <meta property="og:image:width" content="{img_w}">
  <meta property="og:image:height" content="{img_h}">
  <meta property="og:image:alt" content="{esc(img_alt)}">
  <meta property="og:locale" content="{"es_US" if es else "en_US"}">{article_meta}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="{BASE}{img}">
  <meta name="twitter:image:alt" content="{esc(img_alt)}">

  <link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/assets/img/favicon-64.png" sizes="64x64" type="image/png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  {css_block(css_version())}

  <script type="application/ld+json">
{schema(meta, trail, meta["_body"])}
  </script>
</head>
<body class="page-{meta.get("type", "page")}">
  <a class="skip-link" href="#main">Skip to main content</a>

  {site_header(url)}

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
        <p class="page-meta">{byline}</p>
      </div>
    </header>
    <div class="hero-end-sentinel" aria-hidden="true"></div>

{meta["_body"]}
{hub_children(meta, pages)}{related(meta, by_url, kids)}{cta_band(meta)}
  </main>

  {footer()}

  <script src="/assets/js/main.js?v={js_version()}" defer></script>
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
        tl, dl = len(p.get("title", "")), len(p.get("description", ""))
        if tl > TITLE_MAX:
            errors.append(f"{src}: title {tl} chars (>{TITLE_MAX})")
        elif tl < TITLE_MIN:
            warnings.append(f"{src}: title {tl} chars (<{TITLE_MIN})")
        if not DESC_MIN <= dl <= DESC_MAX:
            errors.append(f"{src}: description {dl} chars (want {DESC_MIN}-{DESC_MAX})")
        body = p["_body"]
        if re.search(r"<h1[\s>]", body):
            errors.append(f"{src}: body must not contain <h1> (the hero renders it)")
        if "FAQPage" in json.dumps(p.get("schema", [])):
            errors.append(f"{src}: do not hand-write FAQPage in META; the build generates it from the visible FAQ")
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


TITLE_MIN, TITLE_MAX = 30, 60
DESC_MIN, DESC_MAX = 140, 160
MIN_INBOUND = 5


def _main_html(doc):
    m = re.search(r"<main[\s>].*?</main>", doc, re.S)
    main = m.group(0) if m else ""
    return re.sub(r'<nav class="breadcrumbs".*?</nav>', "", main, flags=re.S)


def qa_rendered(docs, check_inbound):
    """Checks on the final HTML: one H1, no skipped heading levels, no repeated H2/H3 text, unique
    titles/descriptions, and contextual inbound links (links inside <main>, minus breadcrumbs, from
    other pages; header/footer navigation is not counted)."""
    errors, warnings = [], []
    titles, descs = {}, {}
    for url, doc in docs.items():
        h1 = len(re.findall(r"<h1[\s>]", doc))
        if h1 != 1:
            errors.append(f"{url}: {h1} <h1> elements (want exactly 1)")
        levels = [int(x) for x in re.findall(r"<h([1-6])[\s>]", doc)]
        for a, b in zip(levels, levels[1:]):
            if b > a + 1:
                errors.append(f"{url}: heading level skips from h{a} to h{b}")
                break
        seen = {}
        for lvl, txt in re.findall(r"<h([23])[^>]*>(.*?)</h\1>", _main_html(doc), re.S):
            t = re.sub(r"\s+", " ", strip_tags(txt)).strip().lower()
            t = (lvl, t)
            if t in seen:
                errors.append(f"{url}: repeated h{lvl} \"{t[1][:50]}\"")
            seen[t] = 1
        t = re.search(r"<title>(.*?)</title>", doc, re.S)
        d = re.search(r'<meta name="description" content="([^"]*)"', doc)
        if t:
            titles.setdefault(html.unescape(t.group(1)), []).append(url)
        if d:
            descs.setdefault(html.unescape(d.group(1)), []).append(url)
    for url, doc in docs.items():
        visible = extract_faqs(_main_html(doc))
        schema_qs = []
        for blk in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', doc, re.S):
            data = json.loads(blk.replace("<\\/", "</"))
            for n in data.get("@graph", [data]):
                if n.get("@type") == "FAQPage":
                    schema_qs.append([(q["name"], q["acceptedAnswer"]["text"]) for q in n["mainEntity"]])
        if len(schema_qs) > 1:
            errors.append(f"{url}: {len(schema_qs)} FAQPage nodes (want 1)")
        if url not in FAQ_EXEMPT:
            if len(visible) < FAQ_MIN:
                errors.append(f"{url}: {len(visible)} visible FAQs (want {FAQ_MIN}+)")
            if not schema_qs:
                errors.append(f"{url}: visible FAQ but no FAQPage schema")
        if schema_qs and schema_qs[0] != visible:
            errors.append(f"{url}: FAQPage questions/answers do not match the visible FAQ")
    for k, v in list(titles.items()) + list(descs.items()):
        if len(v) > 1:
            errors.append(f"duplicate title/description on {v}: {k[:60]}")
    inbound = {u: set() for u in docs}
    for src, doc in docs.items():
        for href in set(re.findall(r'href="(/[^"#?]*)"', _main_html(doc))):
            if href in inbound and href != src:
                inbound[href].add(src)
    for u, check in check_inbound.items():
        if check and len(inbound.get(u, ())) < MIN_INBOUND:
            warnings.append(f"{u}: only {len(inbound.get(u, ()))} contextual inbound links (want {MIN_INBOUND}+)")
    return errors, warnings, inbound


def sync_site_graph(s):
    """Replace the site-wide nodes (#clinic, services, #physician, #website) in a core page's JSON-LD
    with the current SITE_NODES, keeping its page-specific nodes."""
    m = re.search(r'(<script type="application/ld\+json">\s*)(\{.*?\})(\s*</script>)', s, re.S)
    if not m:
        return s
    data = json.loads(m.group(2))
    site_ids = {n["@id"] for n in SITE_NODES}
    page_nodes = [n for n in data.get("@graph", []) if n.get("@id") not in site_ids]
    data["@graph"] = [dict(n) for n in SITE_NODES] + page_nodes
    out = json.dumps(data, indent=2, ensure_ascii=False).replace("</", "<\\/")
    return s[:m.start(2)] + out + s[m.end(2):]


def refresh_core():
    for rel in CORE_PAGES:
        f = ROOT / rel
        s = f.read_text()
        url = "/" if rel in ("index.html", "404.html") else "/" + rel.replace("index.html", "")
        s2 = re.sub(r'(?:<!-- utility -->.*?<!-- /utility -->\s*)?<header class="site-header">.*?</header>',
                    lambda m: site_header(url if rel != "404.html" else ""), s, count=1, flags=re.S)
        s2 = re.sub(r'<footer class="site-footer">.*?</footer>', lambda m: footer(), s2, count=1, flags=re.S)
        s2 = re.sub(r'(?:<!-- css -->.*?<!-- /css -->|<link rel="preconnect" href="https://fonts.googleapis.com">.*?'
                    r'<link rel="stylesheet" href="/assets/css/main.css">)',
                    lambda m: css_block(css_version()), s2, count=1, flags=re.S)
        s2 = re.sub(r'src="/assets/js/main\.js[^"]*"', f'src="/assets/js/main.js?v={js_version()}"', s2)
        s2 = sync_site_graph(s2)
        if rel != "404.html":
            s2 = sync_faq_schema(s2, url)
        if s2 != s:
            f.write_text(s2)


def main():
    global CSS_VERSION
    check_only = "--check" in sys.argv
    pages = load_pages()
    by_url = {p["url"]: p for p in pages}
    if len(by_url) != len(pages):
        raise SystemExit("duplicate url in content/")
    known = set(by_url) | set(CORE_TITLES)
    if "--allow-planned" in sys.argv:
        for plan in (ROOT / "docs" / "seo" / "page-list.md", ROOT / "docs" / "v2" / "page-list-v2.md"):
            if plan.exists():
                known |= set(re.findall(r"\| *\d+ *\| *(/\S*/) *\|", plan.read_text()))
        known |= {"/learn/", "/hyperbaric-oxygen-therapy/", "/wound-care/", "/iv-therapy/", "/counseling/",
                  "/physical-therapy/", "/occupational-therapy/", "/pediatric-speech-therapy/",
                  "/pediatric-therapy/", "/pain-management/", "/services/"}
    only = [a.split("=", 1)[1] for a in sys.argv if a.startswith("--only=")]
    qa_pages = [p for p in pages if not only or any(str(p["_src"]).endswith(o) or o in str(p["_src"]) for o in only)]
    errors, warnings = qa(qa_pages, known)
    if only:
        warnings = [w for w in warnings if not w.startswith("/")]
    if not check_only:
        CSS_VERSION = build_css()
    docs = {p["url"]: render(p, pages, by_url) for p in pages}
    core_docs = {}
    for rel in CORE_PAGES:
        if rel == "404.html":
            continue
        u = "/" if rel == "index.html" else "/" + rel.replace("index.html", "")
        core_docs[u] = sync_faq_schema((ROOT / rel).read_text(), u)
    check_inbound = {p["url"]: p.get("type") in ("service", "hub", "location") and not only for p in pages}
    e2, w2, inbound = qa_rendered({**docs, **core_docs}, check_inbound)
    e2 = [e for e in e2 if not only or any(e.startswith(p["url"] + ":") for p in qa_pages)]
    errors += e2
    warnings += w2
    for w in warnings:
        print("warn:", w)
    for e in errors:
        print("ERROR:", e)
    if "--inbound" in sys.argv:
        for u in sorted(inbound, key=lambda u: len(inbound[u])):
            print(f"{len(inbound[u]):3d}  {u}")
    if errors:
        print(f"\n{len(errors)} error(s); nothing written.")
        sys.exit(1)
    if check_only:
        print(f"QA passed for {len(pages)} page(s).")
        return
    for p in pages:
        out = ROOT / p["url"].strip("/") / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(docs[p["url"]])
    refresh_core()
    print(f"built {len(pages)} page(s) + {CSS_OUT}; refreshed nav/footer/css/schema on {len(CORE_PAGES)} core pages.")


if __name__ == "__main__":
    main()
