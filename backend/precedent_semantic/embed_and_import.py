"""
embed_and_import.py
===================
One-time script that:
  1. Loads Ibtehaj10/supreme-court-of-pak-judgments from HuggingFace (1,414 rows)
  2. Generates a 384-dim embedding for each document using the local
     all-MiniLM-L6-v2 model (no API calls, runs on CPU)
  3. Inserts everything into the existing `precedents` table on Supabase,
     including the embedding in the new VECTOR(384) column

Also supports --backfill, --clean, and --fresh modes.

Prerequisites:
  pip install -r requirements.txt

Run from the backend/ directory:
  python precedent_semantic/embed_and_import.py            # full import
  python precedent_semantic/embed_and_import.py --fresh    # DELETE all rows, then full import
  python precedent_semantic/embed_and_import.py --backfill # embed existing rows
  python precedent_semantic/embed_and_import.py --clean    # fix content/summary in-place
  python precedent_semantic/embed_and_import.py --preview  # inspect 3 rows, no write
  python precedent_semantic/embed_and_import.py --dry-run  # parse all, no DB write
"""

import argparse
import json
import os
import re
import sys
import uuid
import warnings
from datetime import datetime
from pathlib import Path

# Block TensorFlow from loading entirely — we only need PyTorch.
# Must be set before any ML library is imported.
os.environ["USE_TF"]                      = "0"
os.environ["USE_TORCH"]                   = "1"
os.environ["TF_CPP_MIN_LOG_LEVEL"]        = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"]       = "0"
os.environ["TOKENIZERS_PARALLELISM"]      = "false"
os.environ["TRANSFORMERS_NO_ADVISORY_WARNINGS"] = "1"
warnings.filterwarnings("ignore")

from dotenv import load_dotenv

# Load backend/.env  (this script lives in backend/precedent_semantic/)
_ENV = Path(__file__).resolve().parent.parent / ".env"
if not _ENV.exists():
    sys.exit(f"ERROR: .env not found at {_ENV}")
load_dotenv(_ENV)

DATABASE_URL = os.getenv("DATABASE_URL")
HF_TOKEN     = os.getenv("HUGGINGFACE_API_TOKEN")

if not DATABASE_URL:
    sys.exit("ERROR: DATABASE_URL not set in backend/.env")

# ── Field-extraction helpers ──────────────────────────────────────────────────
# The dataset structure (discovered from preview):
#   citation_number : dict  {'id': 'C.A.10_2021.pdf', 'url': ''}
#   case_details    : dict  {'id': 'C.A.10_2021.pdf', 'url': ''}  (same)
#   text            : str   full judgment text — all real data lives here
#
# So citation = filename without .pdf, and title/judge come from parsing text.

YEAR_RE        = re.compile(r"\b(19[5-9]\d|20[0-2]\d)\b")
JUSTICE_RE     = re.compile(r"(?:Mr\.|Ms\.|Mrs\.)?\s*Justice\s+([A-Z][A-Za-z\s\-\.]+?)(?:\n|,|$)")
PARTIES_RE     = re.compile(r"([A-Z][A-Za-z\s\(\)\.]+?)\s+[Vv][Ss]?\.?\s+([A-Z][A-Za-z\s\(\)\.]+)")

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


def first_year(text: str):
    m = YEAR_RE.search(text or "")
    return int(m.group()) if m else None


def extract_citation(raw) -> str:
    """
    citation_number arrives as either:
      - a dict  {'id': 'C.A.10_2021.pdf', 'url': ''}
      - a str   "{'id': 'C.A.10_2021.pdf', 'url': ''}"  (Python repr via REST API JSON)
    Returns the clean filename without extension, e.g. 'C.A.10_2021'.
    """
    import ast
    if isinstance(raw, dict):
        fname = raw.get("id") or ""
    elif isinstance(raw, str):
        raw = raw.strip()
        if raw.startswith("{"):
            try:
                parsed = ast.literal_eval(raw)
                fname = parsed.get("id") or "" if isinstance(parsed, dict) else raw
            except (ValueError, SyntaxError):
                fname = raw
        else:
            fname = raw
    else:
        return ""
    return fname.replace(".pdf", "").replace(".PDF", "").strip()


def extract_judges_from_text(text: str) -> str | None:
    """Look for 'Justice XYZ' patterns in the first 50 lines."""
    names = []
    for line in (text or "").splitlines()[:50]:
        for m in JUSTICE_RE.finditer(line):
            name = m.group(1).strip().rstrip(".,")
            if 3 < len(name) < 60:
                names.append(name)
    seen, unique = set(), []
    for n in names:
        if n not in seen:
            seen.add(n); unique.append(n)
    return "; ".join(unique[:4]) or None


def extract_title_from_text(text: str, citation: str) -> str:
    """
    Look for a 'Petitioner vs Respondent' line in the first 80 lines.
    Fall back to a cleaned-up version of the citation filename.
    """
    for line in (text or "").splitlines()[:80]:
        line = line.strip()
        if PARTIES_RE.search(line) and len(line) > 8:
            return line[:490]
    # Fallback: prettify the filename  e.g. "C.A.10_2021" -> "C.A. 10/2021"
    pretty = re.sub(r"_(\d{4})$", r"/\1", citation).replace(".", ". ").strip()
    return pretty[:490] if pretty else citation[:490]


def extract_court_from_text(text: str) -> str:
    """Detect which court issued the judgment from the header text."""
    header = (text or "")[:500].upper()
    if "SUPREME COURT"    in header: return "Supreme Court of Pakistan"
    if "LAHORE HIGH"      in header: return "Lahore High Court"
    if "SINDH HIGH"       in header: return "High Court of Sindh"
    if "ISLAMABAD HIGH"   in header: return "Islamabad High Court"
    if "PESHAWAR HIGH"    in header: return "Peshawar High Court"
    if "BALOCHISTAN HIGH" in header: return "High Court of Balochistan"
    if "FEDERAL SHARIAT"  in header: return "Federal Shariat Court"
    return "Supreme Court of Pakistan"


def extract_keywords(text: str) -> list:
    lower = (text or "").lower()
    return [kw for kw in LEGAL_KEYWORDS if kw in lower][:12]


# ── Garbage / font detection ──────────────────────────────────────────────────
# Many PDFs in this dataset used Wingdings / Symbol / custom fonts.
# PDF text extraction preserves the raw glyph codes as Unicode Private Use Area
# characters in the range U+F000 to U+F0FF.  These appear as blank boxes or
# random symbols and contain no readable legal content.
#
# We detect them using ord() so no literal Unicode chars appear in this file.
# U+F000 = 61440 decimal, U+F0FF = 61695 decimal.

_GARBAGE_LO = 0xF000   # 61440
_GARBAGE_HI = 0xF0FF   # 61695

# Regex that matches a single garbage glyph (built dynamically to avoid
# embedding literal private-use chars in source)
_GARBAGE_RE = re.compile(
    "[" + chr(_GARBAGE_LO) + "-" + chr(_GARBAGE_HI) + "]"
)


def _garbage_ratio(text: str) -> float:
    """Fraction of non-whitespace chars that are private-use Wingdings glyphs."""
    non_ws = [c for c in text if not c.isspace()]
    if not non_ws:
        return 0.0
    junk = sum(1 for c in non_ws if _GARBAGE_LO <= ord(c) <= _GARBAGE_HI)
    return junk / len(non_ws)


def is_garbage_text(text: str) -> bool:
    """True when >15% of the text is Wingdings/Symbol font garbage."""
    return _garbage_ratio(text or "") > 0.15


# ── Text cleaning ─────────────────────────────────────────────────────────────

def clean_text(text: str) -> str:
    """Aggressively clean PDF-extraction artifacts from a judgment.

    Removes:
      - Lines where >30% of chars are private-use glyphs (Symbol/Wingdings)
      - Any remaining private-use chars on lines that pass the above filter
      - Digit-only lines (page numbers such as "251")
      - Lines shorter than 10 chars after stripping (layout fragments)
      - Decorative separator lines (---, ===, ___, ***)
    Then collapses runs of blank lines to a single blank line.
    """
    if not text:
        return text

    cleaned = []
    for line in text.splitlines():
        s = line.strip()

        # Drop lines that are mostly garbage glyphs
        if _garbage_ratio(s) > 0.30:
            cleaned.append("")   # preserve paragraph spacing
            continue

        # Strip any remaining garbage chars from the line
        s = _GARBAGE_RE.sub("", s).strip()

        if not s:
            cleaned.append("")
            continue

        # Page numbers (standalone 1-5 digit lines)
        if re.match(r"^\d{1,5}$", s):
            continue

        # Very short lines are almost always layout noise from PDF columns
        if len(s) < 10:
            continue

        # Decorative rules
        if re.match(r"^[-_=*\.]{3,}$", s):
            continue

        cleaned.append(s)

    # Collapse consecutive blank lines to one
    result = []
    prev_blank = False
    for line in cleaned:
        if line == "":
            if not prev_blank:
                result.append(line)
            prev_blank = True
        else:
            prev_blank = False
            result.append(line)

    return "\n".join(result).strip()


# Patterns that look like document headers — skip when building summary
_HEADER_PAT = re.compile(
    r"^(SUPREME COURT|LAHORE HIGH|SINDH HIGH|ISLAMABAD|PESHAWAR|BALOCHISTAN"
    r"|IN THE|JUDGMENT|BEFORE|BENCH|CORAM|HON|ORDER|DATED"
    r"|APPEAL|CRIMINAL|CIVIL|Crl\.|C\.A\.|W\.P\.|C\.P\.|I\.C\.A\.|S\.M\.C\.)",
    re.IGNORECASE,
)


def build_summary(text: str, max_chars: int = 500) -> str | None:
    """Return the first substantive passage from cleaned judgment text.

    Skips header lines (case numbers, court names, bench listings) and
    returns up to max_chars of the first paragraph that looks like real prose.
    """
    lines = [l for l in text.splitlines() if l.strip()]
    # Find first non-header line with >= 40 chars
    start = 0
    for i, line in enumerate(lines):
        if len(line) >= 40 and not _HEADER_PAT.match(line.strip()):
            start = i
            break

    excerpt = " ".join(lines[start : start + 25])
    summary = re.sub(r"\s+", " ", excerpt).strip()
    return summary[:max_chars] if summary else None


def build_row(item: dict) -> dict | None:
    citation = extract_citation(item.get("citation_number"))
    raw_text = (item.get("text") or "").strip()

    if not citation or not raw_text:
        return None

    # Skip documents that are predominantly Wingdings/Symbol font garbage
    if is_garbage_text(raw_text):
        return None

    text = clean_text(raw_text)

    # Require at least 200 chars of readable content after cleaning
    if len(text) < 200:
        return None

    year    = first_year(citation) or first_year(text[:400])
    title   = extract_title_from_text(text, citation)
    court   = extract_court_from_text(text)
    judge   = extract_judges_from_text(text)
    summary = build_summary(text)

    return {
        "id":        str(uuid.uuid4()),
        "title":     title,
        "citation":  citation[:290],
        "caseNo":    citation[:190],
        "court":     court[:190],
        "judge":     judge,
        "year":      year,
        "content":   text,
        "summary":   summary,
        "keywords":  json.dumps(extract_keywords(text)),
        "fileUrl":   None,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }


def vec_to_pg(vec: list) -> str:
    """Format a Python list of floats as a pgvector literal: '[0.12,0.34,...]'"""
    return "[" + ",".join(f"{x:.8f}" for x in vec) + "]"


# ── SQL ───────────────────────────────────────────────────────────────────────

INSERT_SQL = """
    INSERT INTO precedents
      (id, title, citation, "caseNo", court, judge, year,
       content, summary, keywords, "fileUrl", embedding, "createdAt", "updatedAt")
    VALUES
      (%(id)s, %(title)s, %(citation)s, %(caseNo)s, %(court)s,
       %(judge)s, %(year)s, %(content)s, %(summary)s,
       %(keywords)s::jsonb, %(fileUrl)s, %(embedding)s::vector,
       %(createdAt)s, %(updatedAt)s)
"""


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    # Force UTF-8 output so emoji/ellipsis characters print on Windows consoles
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except AttributeError:
        pass

    parser = argparse.ArgumentParser(
        description="Import Pak-Law dataset with embeddings into the precedents table."
    )
    parser.add_argument("--preview",  action="store_true",
                        help="Print first 3 parsed rows and exit (no DB write).")
    parser.add_argument("--dry-run",  action="store_true",
                        help="Parse + embed all rows but skip the DB write.")
    parser.add_argument("--backfill", action="store_true",
                        help="Only embed and update rows already in the DB that have NULL embedding.")
    parser.add_argument("--batch",    type=int, default=50,
                        help="Rows per commit batch (default 50). Lower if RAM is tight.")
    parser.add_argument("--clean",    action="store_true",
                        help="Strip PDF artifacts from content/summary of all existing rows (no re-embedding).")
    parser.add_argument("--fresh",    action="store_true",
                        help="DELETE all existing precedent rows, then run a clean full import.")
    args = parser.parse_args()

    # ── 1. Load embedding model (not needed for --clean, which only does SQL) ───
    if not args.clean:
        print("Loading embedding model (all-MiniLM-L6-v2)...")
        try:
            import torch
            import torch.nn.functional as F
            from transformers import AutoTokenizer, AutoModel
        except ImportError as e:
            sys.exit(f"ERROR: Missing dependency: {e}\n    Run: pip install torch transformers")

        MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
        try:
            _tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
            _model     = AutoModel.from_pretrained(MODEL_ID)
            _model.eval()
        except Exception as e:
            sys.exit(f"ERROR: Failed to load model: {e}")

        def embed_texts(texts: list) -> list:
            """Mean-pool + L2-normalise — identical to SentenceTransformer.encode(normalize=True)."""
            encoded = _tokenizer(
                texts,
                padding=True,
                truncation=True,
                max_length=256,
                return_tensors="pt",
            )
            with torch.no_grad():
                out = _model(**encoded)
            mask   = encoded["attention_mask"].unsqueeze(-1).float()
            pooled = (out.last_hidden_state * mask).sum(1) / mask.sum(1).clamp(min=1e-9)
            normed = F.normalize(pooled, p=2, dim=1)
            return normed.tolist()

        test_dim = len(embed_texts(["test"])[0])
        print(f"    Model ready -- {test_dim}-dim embeddings.")

    # ── 2. Connect to Supabase ────────────────────────────────────────────────
    print("Connecting to Supabase PostgreSQL...")
    try:
        import psycopg2
    except ImportError:
        sys.exit("ERROR: psycopg2-binary not installed. Run: pip install -r requirements.txt")

    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    conn.autocommit = False
    cur  = conn.cursor()

    # ── Backfill mode ─────────────────────────────────────────────────────────
    if args.backfill:
        print("Backfill mode: fetching rows with NULL embedding...")
        cur.execute('SELECT id, content FROM precedents WHERE embedding IS NULL')
        to_embed = cur.fetchall()

        if not to_embed:
            print("All rows already have embeddings. Nothing to do.")
            cur.close(); conn.close(); return

        print(f"    Found {len(to_embed)} rows to embed.")
        BATCH = args.batch

        try:
            from tqdm import tqdm
            items = tqdm(range(0, len(to_embed), BATCH), unit="batch")
        except ImportError:
            items = range(0, len(to_embed), BATCH)

        total = 0
        for i in items:
            batch = to_embed[i : i + BATCH]
            texts   = [r[1][:2000] for r in batch]
            vectors = embed_texts(texts)
            for (pid, _), vec in zip(batch, vectors):
                cur.execute(
                    'UPDATE precedents SET embedding = %s::vector WHERE id = %s',
                    (vec_to_pg(vec), pid)
                )
                total += 1
            conn.commit()

        cur.close(); conn.close()
        print(f"\nBackfill complete -- {total} rows updated with embeddings.")
        return

    # ── Clean mode ────────────────────────────────────────────────────────────
    if args.clean:
        print("Clean mode: removing PDF artifacts from content + summary...")
        cur.execute('SELECT id, content FROM precedents')
        all_rows = cur.fetchall()
        print(f"    Found {len(all_rows):,} rows.")

        BATCH = args.batch
        total = 0
        for i in range(0, len(all_rows), BATCH):
            chunk = all_rows[i : i + BATCH]
            for (pid, content) in chunk:
                cleaned = clean_text(content or "")
                new_summary = build_summary(cleaned)
                cur.execute(
                    'UPDATE precedents SET content = %s, summary = %s, "updatedAt" = NOW() WHERE id = %s',
                    (cleaned, new_summary, pid),
                )
                total += 1
            conn.commit()
            print(f"    {min(i + BATCH, len(all_rows)):,}/{len(all_rows):,} rows cleaned...",
                  end="\r", flush=True)

        cur.close(); conn.close()
        print(f"\nClean complete -- {total:,} rows updated.")
        return

    # ── Fresh mode — delete all rows before importing ─────────────────────────
    if args.fresh:
        cur.execute("SELECT COUNT(*) FROM precedents")
        existing_count = cur.fetchone()[0]
        if existing_count > 0:
            print(f"--fresh: deleting {existing_count:,} existing rows from precedents...")
            cur.execute("DELETE FROM precedents")
            conn.commit()
            print("    Deleted. Starting fresh import.")
        else:
            print("    Table already empty.")

    # ── 3. Load HuggingFace dataset ───────────────────────────────────────────
    # Use the HuggingFace Datasets Server REST API instead of the datasets library.
    # This is pure Python + requests -- no pyarrow, no C extensions, no crashes.
    print("Loading dataset via HuggingFace REST API...")
    import requests as _requests

    DATASET_ID = "Ibtehaj10/supreme-court-of-pak-judgments"
    HF_API     = "https://datasets-server.huggingface.co"
    _headers   = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}

    # Step 1 -- discover config name
    _info = _requests.get(
        f"{HF_API}/info",
        params={"dataset": DATASET_ID},
        headers=_headers,
        timeout=30,
    )
    if _info.status_code != 200:
        sys.exit(f"ERROR: Cannot reach HF Datasets Server: {_info.status_code} {_info.text[:300]}")

    _configs = list(_info.json().get("dataset_info", {}).keys())
    _config  = _configs[0] if _configs else "default"
    print(f"    Config: {_config!r}")

    # Step 2 -- paginate through all rows with retry on transient errors
    import time as _time
    _rows      = []
    _offset    = 0
    _page_size = 50   # smaller pages = less likely to hit server timeout
    _max_retries = 4

    while True:
        _page_data = None
        for _attempt in range(_max_retries):
            try:
                _resp = _requests.get(
                    f"{HF_API}/rows",
                    params={
                        "dataset": DATASET_ID,
                        "config":  _config,
                        "split":   "train",
                        "offset":  _offset,
                        "length":  _page_size,
                    },
                    headers=_headers,
                    timeout=60,
                )
                if _resp.status_code == 200:
                    _page_data = _resp.json()
                    break
                elif _resp.status_code in (429, 502, 503, 504):
                    _wait = 2 ** _attempt
                    print(f"\n    Server returned {_resp.status_code}, retrying in {_wait}s...", flush=True)
                    _time.sleep(_wait)
                else:
                    print(f"\n    HTTP {_resp.status_code} at offset {_offset} -- stopping early.")
                    break
            except _requests.exceptions.RequestException as _e:
                _wait = 2 ** _attempt
                print(f"\n    Network error: {_e}. Retrying in {_wait}s...", flush=True)
                _time.sleep(_wait)

        if _page_data is None:
            print(f"\n    Could not fetch offset {_offset} after {_max_retries} retries.")
            print(f"    Continuing with {len(_rows):,} rows already fetched.")
            break

        _page_rows = [r["row"] for r in _page_data.get("rows", [])]
        _rows.extend(_page_rows)

        _total = _page_data.get("num_rows_total", "?")
        print(f"    Fetched {len(_rows)}/{_total} rows...", end="\r", flush=True)

        if len(_page_rows) < _page_size:
            break   # last page
        _offset += _page_size

    print(f"\n    Loaded {len(_rows):,} rows total.")

    ds = _rows

    # ── 4. Parse rows ─────────────────────────────────────────────────────────
    print("Parsing rows (skipping Wingdings/garbage-font documents)...")
    rows, skipped_empty, skipped_garbage = [], 0, 0
    for item in ds:
        raw = (item.get("text") or "").strip()
        if is_garbage_text(raw):
            skipped_garbage += 1
            continue
        row = build_row(item)
        if row:
            rows.append(row)
        else:
            skipped_empty += 1
    print(f"    {len(rows):,} valid rows  |  {skipped_garbage} garbage-font skipped  |  {skipped_empty} other skipped.")

    # ── Preview mode ──────────────────────────────────────────────────────────
    if args.preview:
        print("\n--- First 3 parsed rows (no embedding shown) ---")
        for r in rows[:3]:
            preview = {
                k: (v[:120] + "..." if isinstance(v, str) and len(v) > 120 else v)
                for k, v in r.items()
                if k not in ("content",)
            }
            preview["content_preview"] = (r["content"][:300] + "...") if r.get("content") else ""
            print(json.dumps(preview, indent=2, default=str))
        print("---\n")
        cur.close(); conn.close(); return

    # ── 5. Deduplicate ────────────────────────────────────────────────────────
    cur.execute('SELECT citation FROM precedents')
    existing = {r[0] for r in cur.fetchall()}
    new_rows = [r for r in rows if r["citation"] not in existing]
    dupes    = len(rows) - len(new_rows)
    print(f"    {len(new_rows):,} new rows to insert  ({dupes} already in DB -- skipped).")

    if not new_rows:
        print("Nothing to insert -- all citations already in DB.")
        cur.close(); conn.close(); return

    if args.dry_run:
        print("Dry-run complete. No data written.")
        cur.close(); conn.close(); return

    # ── 6. Generate embeddings + insert ───────────────────────────────────────
    print(f"\nGenerating embeddings and inserting in batches of {args.batch}...")
    print(  f"    (Encoding up to 2,000 chars per document -- full content stored in DB)\n")

    BATCH = args.batch
    total_inserted = 0

    try:
        from tqdm import tqdm
        batches = tqdm(range(0, len(new_rows), BATCH), unit="batch",
                       desc="Importing", ncols=80)
    except ImportError:
        batches = range(0, len(new_rows), BATCH)

    for i in batches:
        batch   = new_rows[i : i + BATCH]
        texts   = [r["content"][:2000] for r in batch]
        vectors = embed_texts(texts)

        batch_ok = 0
        for row, vec in zip(batch, vectors):
            row["embedding"] = vec_to_pg(vec)
            try:
                cur.execute(INSERT_SQL, row)
                batch_ok += 1
            except Exception as exc:
                conn.rollback()
                print(f"\n  Skipped {row['citation']!r}: {exc}")

        conn.commit()
        total_inserted += batch_ok

    cur.close()
    conn.close()

    print(f"\nDone.  {total_inserted:,} precedents imported with 384-dim embeddings.")
    print(  f"    Run with --backfill at any time to embed rows added later.")


if __name__ == "__main__":
    main()
