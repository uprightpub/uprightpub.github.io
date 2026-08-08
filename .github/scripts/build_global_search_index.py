from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[2]

OUTPUT_FILE = ROOT / "assets" / "search-index.json"


# =========================================================
# JOURNAL SEARCH INDEXES
# =========================================================

JOURNAL_INDEXES = [

    {
        "name": "Technology & Management Review",
        "code": "TMR",
        "path": ROOT / "tmr" / "assets" / "search-index.json"
    },

    {
        "name": "Digitalization & Sustainability Review",
        "code": "DSR",
        "path": ROOT / "dsr" / "assets" / "search-index.json"
    },

    {
        "name": "International Journal of Research in Science, Technology and Policy",
        "code": "IJRSTP",
        "path": ROOT / "ijrstp" / "assets" / "search-index.json"
    },

    {
        "name": "AJASE",
        "code": "AJASE",
        "path": ROOT / "ajase" / "assets" / "search-index.json"
    }

]


# =========================================================
# PUBLISHER PAGES
# =========================================================

PUBLISHER_PAGES = [

    {
        "type": "publisher",
        "journal": "Upright Publications",
        "journal_code": "UP",
        "title": "Upright Publications",
        "authors": "",
        "keywords": (
            "upright publications publisher journals "
            "academic scholarly research open access"
        ),
        "abstract": (
            "Upright Publications is an academic publishing platform "
            "for scholarly journals and research publications."
        ),
        "volume": "",
        "issue": "",
        "year": "",
        "pages": "",
        "doi": "",
        "url": "/index.html"
    },

    {
        "type": "publisher-page",
        "journal": "Upright Publications",
        "journal_code": "UP",
        "title": "About Upright Publications",
        "authors": "",
        "keywords": (
            "about upright publications academic publisher "
            "scholarly journals publishing"
        ),
        "abstract": (
            "Information about Upright Publications and its "
            "academic publishing activities."
        ),
        "volume": "",
        "issue": "",
        "year": "",
        "pages": "",
        "doi": "",
        "url": "/about.html"
    },

    {
        "type": "publisher-page",
        "journal": "Upright Publications",
        "journal_code": "UP",
        "title": "Author Guidelines",
        "authors": "",
        "keywords": (
            "author guidelines manuscript preparation submission "
            "authors publishing requirements"
        ),
        "abstract": (
            "Author guidelines and manuscript preparation "
            "requirements for journals published by Upright Publications."
        ),
        "volume": "",
        "issue": "",
        "year": "",
        "pages": "",
        "doi": "",
        "url": "/author-guidelines.html"
    },

    {
        "type": "publisher-page",
        "journal": "Upright Publications",
        "journal_code": "UP",
        "title": "Editorial Policy",
        "authors": "",
        "keywords": (
            "editorial policy peer review journal editorial process "
            "academic publishing"
        ),
        "abstract": (
            "Editorial policies and scholarly publishing procedures "
            "of Upright Publications."
        ),
        "volume": "",
        "issue": "",
        "year": "",
        "pages": "",
        "doi": "",
        "url": "/editorial-policy.html"
    },

    {
        "type": "publisher-page",
        "journal": "Upright Publications",
        "journal_code": "UP",
        "title": "Publication Ethics",
        "authors": "",
        "keywords": (
            "publication ethics research integrity misconduct "
            "plagiarism authors editors peer review"
        ),
        "abstract": (
            "Publication ethics and research integrity policies "
            "of Upright Publications."
        ),
        "volume": "",
        "issue": "",
        "year": "",
        "pages": "",
        "doi": "",
        "url": "/publication-ethics.html"
    },

    {
        "type": "publisher-page",
        "journal": "Upright Publications",
        "journal_code": "UP",
        "title": "Manuscript Submission",
        "authors": "",
        "keywords": (
            "manuscript submission submit paper article "
            "journal publication"
        ),
        "abstract": (
            "Manuscript submission page for journals "
            "published by Upright Publications."
        ),
        "volume": "",
        "issue": "",
        "year": "",
        "pages": "",
        "doi": "",
        "url": "/submission.html"
    }

]


def clean_text(value):

    return re.sub(
        r"\s+",
        " ",
        str(value or "")
    ).strip()


def normalize_record(record, journal_name, journal_code):

    normalized = {

        "type": clean_text(
            record.get("type", "")
        ),

        "journal": clean_text(
            record.get("journal", journal_name)
        ),

        "journal_code": clean_text(
            record.get("journal_code", journal_code)
        ),

        "title": clean_text(
            record.get("title", "")
        ),

        "authors": clean_text(
            record.get("authors", "")
        ),

        "keywords": clean_text(
            record.get("keywords", "")
        ),

        "abstract": clean_text(
            record.get("abstract", "")
        ),

        "volume": clean_text(
            record.get("volume", "")
        ),

        "issue": clean_text(
            record.get("issue", "")
        ),

        "year": clean_text(
            record.get("year", "")
        ),

        "pages": clean_text(
            record.get("pages", "")
        ),

        "doi": clean_text(
            record.get("doi", "")
        ),

        "url": clean_text(
            record.get("url", "")
        )

    }

    return normalized


def load_journal_index(journal):

    index_file = journal["path"]

    if not index_file.exists():

        print(
            f"Skipped {journal['code']}: "
            f"{index_file} not found."
        )

        return []

    try:

        data = json.loads(
            index_file.read_text(
                encoding="utf-8"
            )
        )

    except Exception as error:

        print(
            f"Could not read {journal['code']} index: "
            f"{error}"
        )

        return []

    records = []

    for item in data:

        if not isinstance(item, dict):
            continue

        record = normalize_record(
            item,
            journal["name"],
            journal["code"]
        )

        if record["title"]:
            records.append(record)

    print(
        f"Loaded {len(records)} records "
        f"from {journal['code']}."
    )

    return records


def remove_duplicates(records):

    unique = []
    seen = set()

    for record in records:

        key = (
            record.get("url", "").lower(),
            record.get("title", "").lower()
        )

        if key in seen:
            continue

        seen.add(key)
        unique.append(record)

    return unique


def build_global_index():

    global_index = []

    # Publisher pages

    for page in PUBLISHER_PAGES:

        global_index.append(
            normalize_record(
                page,
                "Upright Publications",
                "UP"
            )
        )

    # Journal indexes

    for journal in JOURNAL_INDEXES:

        records = load_journal_index(
            journal
        )

        global_index.extend(records)

    # Remove duplicate entries

    global_index = remove_duplicates(
        global_index
    )

    # Sort for stable output

    global_index.sort(
        key=lambda item: (
            item.get("journal_code", ""),
            item.get("year", ""),
            item.get("volume", ""),
            item.get("issue", ""),
            item.get("title", "").lower()
        )
    )

    # Create output folder

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    # Write global search index

    OUTPUT_FILE.write_text(
        json.dumps(
            global_index,
            ensure_ascii=False,
            indent=2
        ),
        encoding="utf-8"
    )

    print(
        f"Generated global search index: "
        f"{OUTPUT_FILE}"
    )

    print(
        f"Total searchable records: "
        f"{len(global_index)}"
    )


if __name__ == "__main__":
    build_global_index()