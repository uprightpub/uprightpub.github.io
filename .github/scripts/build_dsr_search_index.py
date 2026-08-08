from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[2]
DSR_ROOT = ROOT / "dsr"
ISSUES_ROOT = DSR_ROOT / "issues"
OUTPUT_FILE = DSR_ROOT / "assets" / "search-index.json"


class IssueParser(HTMLParser):

    def __init__(self):
        super().__init__()
        self.meta = {}
        self.articles = []

    def handle_starttag(self, tag, attrs):

        attrs = dict(attrs)

        if tag.lower() == "meta":

            name = attrs.get("name", "")
            content = attrs.get("content", "")

            if name.startswith("dsr-"):
                self.meta[name] = content

        class_value = attrs.get("class", "")
        classes = class_value.split()

        if "article-card" in classes:

            article = {
                "type": attrs.get("data-search-type", "article"),
                "title": attrs.get("data-title", ""),
                "authors": attrs.get("data-authors", ""),
                "volume": attrs.get("data-volume", ""),
                "issue": attrs.get("data-issue", ""),
                "year": attrs.get("data-year", ""),
                "pages": attrs.get("data-pages", ""),
                "url": attrs.get("data-url", ""),
                "keywords": attrs.get("data-keywords", ""),
                "abstract": attrs.get("data-abstract", ""),
                "doi": attrs.get("data-doi", "")
            }

            if article["title"]:
                self.articles.append(article)


def clean_text(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def parse_issue_page(file_path):

    parser = IssueParser()

    html = file_path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    parser.feed(html)

    return parser.meta, parser.articles


def build_index():

    search_index = [

        {
            "type": "journal",
            "title": "Digitalization & Sustainability Review",
            "authors": "",
            "keywords": (
                "digitalization sustainability DSR journal "
                "digital transformation sustainable development "
                "open access scholarly research"
            ),
            "abstract": (
                "Digitalization & Sustainability Review is an "
                "international peer-reviewed open-access scholarly journal."
            ),
            "volume": "",
            "issue": "",
            "year": "",
            "pages": "",
            "doi": "",
            "url": "/dsr/index.html"
        },

        {
            "type": "page",
            "title": "Editorial Board",
            "authors": "",
            "keywords": (
                "editor editorial board consulting editors "
                "editor in chief journal management"
            ),
            "abstract": (
                "Editorial Board of Digitalization & Sustainability Review."
            ),
            "volume": "",
            "issue": "",
            "year": "",
            "pages": "",
            "doi": "",
            "url": "/dsr/editorial-board.html"
        },

        {
            "type": "page",
            "title": "Archives",
            "authors": "",
            "keywords": (
                "archives issues volumes published issues "
                "2021 2022 2023 2024 2025 2026"
            ),
            "abstract": (
                "Browse all published volumes and issues of "
                "Digitalization & Sustainability Review."
            ),
            "volume": "",
            "issue": "",
            "year": "",
            "pages": "",
            "doi": "",
            "url": "/dsr/archives.html"
        }

    ]

    if not ISSUES_ROOT.exists():

        print("DSR issues directory not found.")
        return

    issue_files = sorted(
        ISSUES_ROOT.glob("**/index.html")
    )

    for issue_file in issue_files:

        meta, articles = parse_issue_page(issue_file)

        volume = clean_text(
            meta.get("dsr-volume", "")
        )

        issue = clean_text(
            meta.get("dsr-issue", "")
        )

        year = clean_text(
            meta.get("dsr-year", "")
        )

        publication_date = clean_text(
            meta.get("dsr-publication-date", "")
        )

        relative_path = issue_file.relative_to(ROOT)
        issue_url = "/" + relative_path.as_posix()

        if issue_url.endswith("/index.html"):
            issue_url = issue_url[:-10]

        if volume or issue or year:

            search_index.append({

                "type": "issue",

                "title": (
                    f"Volume {volume}, Number {issue}/{year}"
                ),

                "authors": "",

                "keywords": clean_text(
                    f"volume {volume} "
                    f"number {issue} "
                    f"issue {issue} "
                    f"{year} "
                    f"{publication_date} "
                    "archive issue research articles"
                ),

                "abstract": clean_text(
                    f"Digitalization & Sustainability Review, "
                    f"Volume {volume}, Number {issue}/{year}, "
                    f"published {publication_date}."
                ),

                "volume": volume,
                "issue": issue,
                "year": year,
                "pages": "",
                "doi": "",
                "url": issue_url
            })

        for article in articles:

            article["title"] = clean_text(article["title"])
            article["authors"] = clean_text(article["authors"])
            article["keywords"] = clean_text(article["keywords"])
            article["abstract"] = clean_text(article["abstract"])
            article["volume"] = clean_text(article["volume"] or volume)
            article["issue"] = clean_text(article["issue"] or issue)
            article["year"] = clean_text(article["year"] or year)
            article["pages"] = clean_text(article["pages"])
            article["doi"] = clean_text(article["doi"])
            article["url"] = clean_text(article["url"])

            search_index.append(article)

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    OUTPUT_FILE.write_text(
        json.dumps(
            search_index,
            ensure_ascii=False,
            indent=2
        ),
        encoding="utf-8"
    )

    print(
        f"Generated {OUTPUT_FILE} "
        f"with {len(search_index)} records."
    )


if __name__ == "__main__":
    build_index()