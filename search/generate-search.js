const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
console.log("Search Generator Started...");
const searchIndex = [];

const root = path.join(__dirname, "..");

console.log("Project Root:");
console.log(root);
const journalFolders = fs.readdirSync(root, { withFileTypes: true })
    .filter(item =>
        item.isDirectory() &&
        fs.existsSync(path.join(root, item.name, "issues"))
    )
    .map(item => item.name);

console.log("\nJournals Found:");
console.log(journalFolders);
journalFolders.forEach(journal => {

    const issuesPath = path.join(root, journal, "issues");

    const volumes = fs.readdirSync(issuesPath, { withFileTypes: true })
        .filter(item => item.isDirectory())
        .map(item => item.name);

    console.log(`\n${journal.toUpperCase()} Volumes:`);

    console.log(volumes);
volumes.forEach(volume => {
    const volumeMatch = volume.match(/^v(\d+)n(\d+)$/);

const volumeNumber = volumeMatch ? volumeMatch[1] : "";
const issueNumber = volumeMatch ? volumeMatch[2] : "";

    const volumePath = path.join(issuesPath, volume);

    const articles = fs.readdirSync(volumePath)
        .filter(file =>
            file.endsWith(".html") &&
            file !== "index.html"
        );

    console.log(`\n${volume} Articles:`);

    console.log(articles);
articles.forEach(article => {

    const articlePath = path.join(volumePath, article);

    const html = fs.readFileSync(articlePath, "utf8");
    const $ = cheerio.load(html);
    const title = $("title").text().trim();

const author =
    $('meta[name="author"]').attr("content") || "";

const journalName =
    $('meta[name="journal"]').attr("content") || "";

const keywords =
    $('meta[name="keywords"]').attr("content") || "";

const year =
    $('meta[name="year"]').attr("content") || "";

const abstract =
    $('meta[name="description"]').attr("content") || "";

const doi =
    $('meta[name="citation_doi"]').attr("content") || "";

const pdf =
    $('meta[name="citation_pdf_url"]').attr("content") || "";

const citation =
    $(".citation-box").text().trim();

    console.log("\n--------------------------------");
    console.log(articlePath);
    console.log("--------------------------------");

    searchIndex.push({
    title,
    author,
    journal: journalName,
    keywords,
    year,
    volume: volumeNumber,
    issue: issueNumber,
    publisher: "Upright Publications",
    url: `${journal}/issues/${volume}/${article}`,
    abstract,
doi,
pdf,
citation
});

});
});
});
fs.writeFileSync(
    path.join(__dirname, "index.json"),
    JSON.stringify(searchIndex, null, 2),
    "utf8"
);

console.log(`\nDone! ${searchIndex.length} articles indexed.`);