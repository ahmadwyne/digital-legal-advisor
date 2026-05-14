"""
import_pak_law.py
=================
One-time script that imports the Ibtehaj10/supreme-court-of-pak-judgments
HuggingFace dataset (1,414 rows) into the existing `precedents` PostgreSQL
table on Supabase — without changing any schema, backend, or frontend code.

Prerequisites (install once in any Python 3.9+ environment):
  pip install datasets psycopg2-binary python-dotenv

Run from the backend/ directory:
  python scripts/import_pak_law.py

Optional flags:
  --preview   Print the first 3 rows as-parsed, then exit (no DB write).
  --dry-run   Parse all rows and show counts, but skip the DB insert.
"""

import argparse
import json
import os
import re
import sys
import uuid
from datetime import datetime
from pathlib import Path

# ── Environment ───────────────────────────────────────────────────────────────

from dotenv import load_dotenv

# Load backend/.env  (script lives in backend/scripts/, so parent is backend/)
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
if not ENV_PATH.exists():
    sys.exit(f"❌  .env not found at {ENV_PATH}")
load_dotenv(ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")
HF_TOKEN     = os.getenv("HUGGINGFACE_API_TOKEN")

if not DATABASE_URL:
    sys.exit("❌  DATABASE_URL not set in .env")

# ── Field-extraction helpers ──────────────────────────────────────────────────

YEAR_RE = re.compile(r"\b(19[5-9]\d|20[0-2]\d)\b")

# Map citation abbreviations → court name
COURT_MAP = {
    "SCMR":   "Supreme Court of Pakistan",
    "PLD.*SC": "Supreme Court of Pakistan",
    "PLD.*FC": "Federal Shariat Court",
    "YLRN":   "Lahore High Court",
    "PLC":    "Lahore High Court",
    "CLC":    "High Court",
    "PTD":    "Income Tax Appellate Tribunal",
    "MLD":    "High Court",
    "NLR":    "High Court",
}

LEGAL_KEYWORDS = [
    "bail", "murder", "qatl", "theft", "fraud", "contract", "property",
    "divorce", "khula", "custody", "maintenance", "tax", "corruption",
    "contempt", "habeas corpus", "FIR", "acquittal", "conviction",
    "sentence", "appeal", "revision", "writ", "constitutional",
    "injunction", "damages", "negligence", "land acquisition",
    "inheritance", "succession", "arbitration", "specific performance",
    "limitation", "jurisdiction", "NAB", "accountability",
    "pre-arrest bail", "section 302", "section 420",
]


def first_year(text: str) -> int | None:
    m = YEAR_RE.search(text or "")
    return int(m.group()) if m else None


def infer_court(citation: str) -> str:
    upper = (citation or "").upper()
    for pattern, court in COURT_MAP.items():
        if re.search(pattern, upper):
            return court
    return "Supreme Court of Pakistan"


def parse_case_details(raw) -> dict:
    """
    case_details can arrive as a dict, a JSON string, or a plain string.
    Returns a normalised dict (may be empty).
    """
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, str):
        raw = raw.strip()
        try:
            parsed = json.loads(raw)
            return parsed if isinstance(parsed, dict) else {"detail": raw}
        except (json.JSONDecodeError, ValueError):
            return {"detail": raw}
    return {}


def pick(d: dict, *keys, max_len: int = 0) -> str | None:
    """Return the first truthy string value found among keys."""
    for k in keys:
        v = d.get(k)
        if v and isinstance(v, str) and v.strip():
            val = v.strip()
            return val[:max_len] if max_len else val
    return None


def extract_title(details: dict, citation: str, text: str) -> str:
    # 1. Common dict keys
    title = pick(details, "title", "case_title", "case_name",
                 "heading", "parties", "name", max_len=490)
    if title:
        return title

    # 2. If case_details was a plain string, use it
    detail_str = details.get("detail", "").strip()
    if detail_str and len(detail_str) > 5:
        return detail_str[:490]

    # 3. First meaningful line of the judgment text
    for line in (text or "").splitlines():
        line = line.strip()
        if len(line) > 10:
            return line[:490]

    # 4. Fallback: the citation itself
    return citation[:490]


def extract_keywords(text: str) -> list:
    lower = (text or "").lower()
    return [kw for kw in LEGAL_KEYWORDS if kw in lower][:12]


def build_row(item: dict) -> dict | None:
    citation = (item.get("citation_number") or "").strip()
    text      = (item.get("text")           or "").strip()

    # Both are required
    if not citation or not text:
        return None

    details = parse_case_details(item.get("case_details", {}))

    # Year: prefer explicit field, then parse from citation, then text
    year_raw = details.get("year") or details.get("Year")
    year: int | None
    if year_raw:
        m = YEAR_RE.search(str(year_raw))
        year = int(m.group()) if m else None
    else:
        year = first_year(citation) or first_year(text[:300])

    court = (
        pick(details, "court", "court_name", "Court", max_len=190)
        or infer_court(citation)
    )
    judge = pick(details, "judge", "Judge", "bench", "Bench",
                 "justice", "Justice", max_len=290)

    title   = extract_title(details, citation, text)
    summary = re.sub(r"\s+", " ", text[:600]).strip() or None

    return {
        "id":        str(uuid.uuid4()),
        "title":     title,
        "citation":  citation[:290],
        "caseNo":    citation[:190],
        "court":     court[:190] if court else "Supreme Court of Pakistan",
        "judge":     judge,
        "year":      year,
        "content":   text,
        "summary":   summary,
        "keywords":  json.dumps(extract_keywords(text)),
        "fileUrl":   None,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }


# ── Database helpers ──────────────────────────────────────────────────────────

INSERT_SQL = """
    INSERT INTO precedents
      (id, title, citation, "caseNo", court, judge, year,
       content, summary, keywords, "fileUrl", "createdAt", "updatedAt")
    VALUES
      (%(id)s, %(title)s, %(citation)s, %(caseNo)s, %(court)s,
       %(judge)s, %(year)s, %(content)s, %(summary)s,
       %(keywords)s::jsonb, %(fileUrl)s, %(createdAt)s, %(updatedAt)s)
"""


def get_existing_citations(cur) -> set:
    cur.execute('SELECT citation FROM precedents')
    return {row[0] for row in cur.fetchall()}


def insert_batch(cur, batch: list[dict]) -> int:
    inserted = 0
    for row in batch:
        try:
            cur.execute(INSERT_SQL, row)
            inserted += 1
        except Exception as exc:
            # Log and skip individual row failures (e.g. constraint violations)
            print(f"    ⚠  Skipped row (citation={row['citation']!r}): {exc}")
    return inserted


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Import Pak-Law dataset into precedents table.")
    parser.add_argument("--preview",  action="store_true", help="Print first 3 parsed rows and exit.")
    parser.add_argument("--dry-run",  action="store_true", help="Parse all rows but skip DB insert.")
    parser.add_argument("--batch",    type=int, default=50,   help="Rows per commit batch (default 50).")
    args = parser.parse_args()

    # ── 1. Load dataset ───────────────────────────────────────────────────────
    print("⏳  Loading dataset from HuggingFace…")
    try:
        from datasets import load_dataset
    except ImportError:
        sys.exit("❌  `datasets` package not found. Run: pip install datasets psycopg2-binary python-dotenv")

    ds = load_dataset(
        "Ibtehaj10/supreme-court-of-pak-judgments",
        token=HF_TOKEN or None,
        split="train",
        trust_remote_code=True,
    )
    print(f"    Loaded {len(ds):,} rows from HuggingFace.")

    # ── 2. Parse rows ─────────────────────────────────────────────────────────
    print("⏳  Parsing rows…")
    rows: list[dict] = []
    skipped_empty = 0

    for item in ds:
        row = build_row(item)
        if row:
            rows.append(row)
        else:
            skipped_empty += 1

    print(f"    {len(rows):,} valid rows, {skipped_empty} skipped (missing citation or text).")

    # ── Preview mode ──────────────────────────────────────────────────────────
    if args.preview:
        print("\n─── First 3 parsed rows ──────────────────────────────────────────")
        for r in rows[:3]:
            preview = {k: (v[:120] if isinstance(v, str) and len(v) > 120 else v)
                       for k, v in r.items() if k != "content"}
            preview["content_preview"] = (r["content"] or "")[:120] + "…"
            print(json.dumps(preview, indent=2, default=str))
        print("─────────────────────────────────────────────────────────────────\n")
        print("Re-run without --preview to import into the database.")
        return

    if args.dry_run:
        print("✅  Dry-run complete. No data written.")
        return

    # ── 3. Connect to DB ──────────────────────────────────────────────────────
    print("⏳  Connecting to Supabase PostgreSQL…")
    try:
        import psycopg2
    except ImportError:
        sys.exit("❌  `psycopg2-binary` not found. Run: pip install psycopg2-binary")

    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    conn.autocommit = False
    cur = conn.cursor()

    # ── 4. Deduplicate against existing rows ──────────────────────────────────
    print("⏳  Fetching existing citations from DB…")
    existing = get_existing_citations(cur)
    print(f"    {len(existing)} citations already in DB.")

    new_rows = [r for r in rows if r["citation"] not in existing]
    print(f"    {len(new_rows):,} new rows to insert ({len(rows) - len(new_rows)} duplicates skipped).")

    if not new_rows:
        print("✅  Nothing to insert — all citations already present.")
        cur.close(); conn.close()
        return

    # ── 5. Batch insert ───────────────────────────────────────────────────────
    print(f"⏳  Inserting in batches of {args.batch}…")
    total_inserted = 0
    BATCH = args.batch

    for i in range(0, len(new_rows), BATCH):
        batch = new_rows[i : i + BATCH]
        n = insert_batch(cur, batch)
        conn.commit()
        total_inserted += n
        pct = (i + len(batch)) / len(new_rows) * 100
        print(f"    Batch {i // BATCH + 1:>4}: {n}/{len(batch)} inserted  [{pct:.0f}%]")

    cur.close()
    conn.close()

    print(f"\n✅  Done.  {total_inserted:,} precedents imported into `precedents` table.")
    print("    The LegalPrecedents page will now search across all imported cases.")


if __name__ == "__main__":
    main()
