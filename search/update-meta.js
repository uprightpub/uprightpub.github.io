const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

/* =========================================================
   CONFIGURATION
========================================================= */

const BASE_URL = "https://uprightpub.github.io";

/*
Future:

https://www.uprightpublications.org

শুধু BASE_URL পরিবর্তন করলেই
সব canonical / og:url / pdf_url
automatic update হবে।
*/

/* =========================================================
   START
========================================================= */

console.log("\n=================================");
console.log("Upright Meta Updater Started...");
console.log("=================================\n");

const root = path.join(__dirname, "..");

/* =========================================================
   FIND JOURNALS
========================================================= */

const journalFolders = fs
    .readdirSync(root, { withFileTypes: true })
    .filter(
        item =>
            item.isDirectory() &&
            fs.existsSync(path.join(root, item.name, "issues"))
    )
    .map(item => item.name);

let updated = 0;

/* =========================================================
   LOOP JOURNALS
========================================================= */

journalFolders.forEach(journal => {

    console.log(`\nJournal: ${journal}`);

    const issuesPath = path.join(root, journal, "issues");

    const volumes = fs
        .readdirSync(issuesPath, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => item.name);

    volumes.forEach(volume => {

        const volumePath = path.join(issuesPath, volume);

        const articles = fs
            .readdirSync(volumePath)
            .filter(
                file =>
                    file.endsWith(".html") &&
                    file !== "index.html"
            );

        articles.forEach(article => {

            const articlePath = path.join(volumePath, article);

            console.log(`Updating: ${journal}/issues/${volume}/${article}`);

            const html = fs.readFileSync(articlePath, "utf8");

            const $ = cheerio.load(html);

            /* ============================================
               READ CURRENT VALUES
            ============================================ */

            let title =
                $("title").text().trim();

            let author =
                $('meta[name="author"]').attr("content") || "";

            let journalName =
                $('meta[name="journal"]').attr("content") || "";

            let keywords =
                $('meta[name="keywords"]').attr("content") || "";

            let year =
                $('meta[name="year"]').attr("content") || "";

            let description =
                $('meta[name="description"]').attr("content") || "";

            let doi =
                $('meta[name="citation_doi"]').attr("content") || "";

            let citation =
                $(".citation-box").text().trim();

            /* ============================================
               CLEAN TITLE
            ============================================ */

            title = title
                .split("|")[0]
                .replace(/\n/g, " ")
                .replace(/\s+/g, " ")
                .trim();
            /* ============================================
               BUILD VALUES
            ============================================ */

            const articleNo = article.replace(".html", "");

            const pdfUrl =
                `${BASE_URL}/${journal}/issues/${volume}/pdf/${articleNo}.pdf`;

            const articleUrl =
                `${BASE_URL}/${journal}/issues/${volume}/${article}`;

            /* ============================================
               UPDATE META TAGS
            ============================================ */

            $('meta[name="journal"]').attr("content", journalName);

            $('meta[name="year"]').attr("content", year);

            $('meta[name="description"]').attr("content", description);

            $('meta[name="citation_title"]').attr("content", title);

            $('meta[name="citation_author"]').attr("content", author);

            $('meta[name="citation_journal_title"]').attr("content", journalName);

            $('meta[name="citation_publication_date"]').attr("content", year);

            $('meta[name="citation_pdf_url"]').attr("content", pdfUrl);

            // Future DOI support
            $('meta[name="citation_doi"]').attr("content", doi);

            /* ============================================
               CANONICAL
            ============================================ */

            $('link[rel="canonical"]').attr("href", articleUrl);

            /* ============================================
               OPEN GRAPH
            ============================================ */

            $('meta[property="og:title"]').attr("content", title);

            $('meta[property="og:description"]').attr("content", description);

            $('meta[property="og:url"]').attr("content", articleUrl);

            /* ============================================
               TWITTER
            ============================================ */

            $('meta[name="twitter:title"]').attr("content", title);

            $('meta[name="twitter:description"]').attr("content", description);
            /* ============================================
               SAVE FILE
            ============================================ */

            fs.writeFileSync(
                articlePath,
                $.html(),
                "utf8"
            );

            updated++;

        });

    });

});

/* =========================================================
   FINISHED
========================================================= */

console.log("\n=================================");
console.log(`Done! ${updated} article(s) updated.`);
console.log("=================================\n");