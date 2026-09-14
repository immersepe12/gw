#!/usr/bin/env python3
"""
build_sitemap.py — generate sitemap.xml (+ split parts) for the Generations Wellness static site.

Walks the repo for every */index.html (plus the root index.html), skips 404.html and
non-site folders (docs/, tools/, assets/, .git/, design-sync folders), skips any page
carrying <meta name="robots" content="noindex">, and derives <lastmod> from:

    1. <meta property="article:modified_time" content="YYYY-MM-DD[THH:MM:SS+ZZ:ZZ]">   (if present)
    2. git:  last commit that touched the file (git log -1 --format=%cI -- <file>)
    3. filesystem mtime (fallback when not in git / uncommitted)

Output modes (--mode):
    auto    (default) single sitemap.xml while only the "pages" bucket has entries;
            switches to index + parts automatically once /conditions/, /learn/ or
            /locations/ pages exist.
    single  always write one sitemap.xml (urlset)
    index   always write sitemap.xml as a <sitemapindex> plus sitemap-<bucket>.xml parts

Buckets (first path segment -> part file):
    conditions/  -> sitemap-conditions.xml
    learn/       -> sitemap-learn.xml
    locations/   -> sitemap-locations.xml
    everything else (core pages, /faq/*, /compare/, /for-clinicians/, /cost/ ...)
                 -> sitemap-pages.xml

<changefreq> and <priority> are intentionally omitted: Google ignores both, and a
truthful <lastmod> is the only field that influences recrawl.

Usage:
    python3 tools/build_sitemap.py                      # write files, print summary
    python3 tools/build_sitemap.py --check              # exit 1 if on-disk sitemaps are stale (CI / pre-commit)
    python3 tools/build_sitemap.py --base https://gw-sage.vercel.app --dry-run
    python3 tools/build_sitemap.py --mode index

Python 3.9+ , no third-party dependencies.
"""
from __future__ import annotations

import argparse
import datetime as dt
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from xml.sax.saxutils import escape

DEFAULT_BASE = "https://www.generationswellness.net"

# folders that are never part of the public site
EXCLUDE_DIRS = {
    ".git", ".github", ".claude", ".design-sync", ".ds-sync", "ds-bundle",
    "docs", "tools", "assets", "node_modules", "content", ".vercel",
}
EXCLUDE_FILES = {"404.html"}

BUCKETS: Dict[str, str] = {
    "conditions": "sitemap-conditions.xml",
    "learn": "sitemap-learn.xml",
    "locations": "sitemap-locations.xml",
}
DEFAULT_BUCKET_FILE = "sitemap-pages.xml"
INDEX_FILE = "sitemap.xml"

NOINDEX_RE = re.compile(
    r'<meta\s+name=["\']robots["\']\s+content=["\'][^"\']*noindex[^"\']*["\']', re.I
)
CANONICAL_RE = re.compile(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']', re.I)
MODIFIED_META_RE = re.compile(
    r'<meta\s+property=["\']article:modified_time["\']\s+content=["\']([^"\']+)["\']', re.I
)


def repo_root() -> Path:
    """Repo root = parent of tools/ (works no matter the cwd)."""
    return Path(__file__).resolve().parent.parent


def git_lastmod(root: Path, rel: str) -> Optional[str]:
    try:
        out = subprocess.run(
            ["git", "-C", str(root), "log", "-1", "--format=%cI", "--", rel],
            capture_output=True, text=True, check=False, timeout=10,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    val = out.stdout.strip()
    return val or None


def git_is_dirty(root: Path, rel: str) -> bool:
    try:
        out = subprocess.run(
            ["git", "-C", str(root), "status", "--porcelain", "--", rel],
            capture_output=True, text=True, check=False, timeout=10,
        )
    except (OSError, subprocess.SubprocessError):
        return False
    return bool(out.stdout.strip())


def mtime_lastmod(path: Path) -> str:
    ts = dt.datetime.fromtimestamp(path.stat().st_mtime, tz=dt.timezone.utc)
    return ts.replace(microsecond=0).isoformat()


def normalise_date(value: str) -> str:
    """Accept YYYY-MM-DD or full ISO-8601; return W3C datetime (date-only stays date-only)."""
    value = value.strip()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        dt.date.fromisoformat(value)  # validates
        return value
    parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt.timezone.utc)
    return parsed.replace(microsecond=0).isoformat()


def lastmod_for(root: Path, path: Path, html: str) -> Tuple[str, str]:
    """Return (lastmod, source)."""
    m = MODIFIED_META_RE.search(html)
    if m:
        try:
            return normalise_date(m.group(1)), "meta"
        except ValueError:
            print(f"  ! invalid article:modified_time in {path}: {m.group(1)!r}; falling back", file=sys.stderr)
    rel = str(path.relative_to(root))
    if not git_is_dirty(root, rel):
        g = git_lastmod(root, rel)
        if g:
            return normalise_date(g), "git"
    return mtime_lastmod(path), "mtime"


def discover_pages(root: Path) -> List[Path]:
    pages: List[Path] = []
    for dirpath, dirnames, filenames in os.walk(root):
        # prune excluded / hidden folders in place
        dirnames[:] = sorted(
            d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith(".")
        )
        for fn in filenames:
            if fn == "index.html" and fn not in EXCLUDE_FILES:
                pages.append(Path(dirpath) / fn)
    return sorted(pages)


def url_for(base: str, root: Path, page: Path) -> str:
    rel_dir = page.parent.relative_to(root).as_posix()
    if rel_dir in ("", "."):
        return base + "/"
    return f"{base}/{rel_dir}/"


def bucket_for(root: Path, page: Path) -> str:
    rel = page.parent.relative_to(root).as_posix()
    first = rel.split("/", 1)[0] if rel not in ("", ".") else ""
    return BUCKETS.get(first, DEFAULT_BUCKET_FILE)


def urlset_xml(entries: List[Tuple[str, str]]) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, lastmod in entries:
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(loc)}</loc>")
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def index_xml(base: str, parts: List[Tuple[str, str]]) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for filename, lastmod in parts:
        lines.append("  <sitemap>")
        lines.append(f"    <loc>{escape(base + '/' + filename)}</loc>")
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append("  </sitemap>")
    lines.append("</sitemapindex>")
    return "\n".join(lines) + "\n"


def build(base: str, mode: str, root: Path, verbose: bool = True) -> Dict[str, str]:
    """Return {filename: xml_content} for everything that should exist on disk."""
    base = base.rstrip("/")
    buckets: Dict[str, List[Tuple[str, str]]] = {}
    skipped: List[str] = []
    warnings: List[str] = []

    for page in discover_pages(root):
        html = page.read_text(encoding="utf-8", errors="replace")
        loc = url_for(base, root, page)
        if NOINDEX_RE.search(html):
            skipped.append(f"{loc}  (noindex)")
            continue
        canon = CANONICAL_RE.search(html)
        if not canon:
            warnings.append(f"{loc}: no <link rel=canonical>")
        elif canon.group(1).rstrip("/") + "/" != loc and canon.group(1) != loc:
            warnings.append(f"{loc}: canonical mismatch -> {canon.group(1)}")
        lastmod, source = lastmod_for(root, page, html)
        buckets.setdefault(bucket_for(root, page), []).append((loc, lastmod))
        if verbose:
            print(f"  {loc:<70} {lastmod:<25} [{source}]")

    non_default = [b for b in buckets if b != DEFAULT_BUCKET_FILE]
    use_index = mode == "index" or (mode == "auto" and bool(non_default))

    files: Dict[str, str] = {}
    if use_index:
        parts: List[Tuple[str, str]] = []
        for filename in sorted(buckets):
            entries = sorted(buckets[filename])
            files[filename] = urlset_xml(entries)
            parts.append((filename, max(lm for _, lm in entries)))
        files[INDEX_FILE] = index_xml(base, parts)
    else:
        all_entries = sorted(e for entries in buckets.values() for e in entries)
        files[INDEX_FILE] = urlset_xml(all_entries)

    if verbose:
        total = sum(len(v) for v in buckets.values())
        print(f"\n{total} URL(s) in {len(buckets)} bucket(s); mode={'index+parts' if use_index else 'single'}")
        for s in skipped:
            print(f"  skipped: {s}")
        for w in warnings:
            print(f"  WARNING: {w}", file=sys.stderr)
    return files


def stale_parts(root: Path, wanted: Dict[str, str]) -> List[str]:
    """Part files on disk that are no longer produced (so they should be deleted)."""
    stale = []
    for p in root.glob("sitemap-*.xml"):
        if p.name not in wanted:
            stale.append(p.name)
    return stale


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", default=DEFAULT_BASE, help=f"canonical origin (default {DEFAULT_BASE})")
    ap.add_argument("--mode", choices=["auto", "single", "index"], default="auto")
    ap.add_argument("--root", default=None, help="site root (default: parent of tools/)")
    ap.add_argument("--check", action="store_true", help="do not write; exit 1 if on-disk sitemaps differ")
    ap.add_argument("--dry-run", action="store_true", help="print what would be written, write nothing")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    root = Path(args.root).resolve() if args.root else repo_root()
    files = build(args.base, args.mode, root, verbose=not args.quiet)

    changed: List[str] = []
    for name, content in files.items():
        target = root / name
        if not target.exists() or target.read_text(encoding="utf-8") != content:
            changed.append(name)
    stale = stale_parts(root, files)

    if args.check:
        if changed or stale:
            print(f"STALE: would rewrite {changed} and delete {stale}. Run tools/build_sitemap.py", file=sys.stderr)
            return 1
        print("sitemaps up to date")
        return 0

    if args.dry_run:
        for name, content in files.items():
            print(f"\n----- {name} -----\n{content}")
        return 0

    for name, content in files.items():
        (root / name).write_text(content, encoding="utf-8")
    for name in stale:
        (root / name).unlink()
    if not args.quiet:
        print(f"wrote: {', '.join(sorted(files))}" + (f"; deleted stale: {', '.join(stale)}" if stale else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
