const params = new URLSearchParams(window.location.search);
const query = (params.get("q") || "").trim();

const searchInput = document.getElementById("searchInput");
searchInput.value = query;

document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const q = searchInput.value.trim();

    if (!q) return;

    window.location.href =
        "search-results.html?q=" +
        encodeURIComponent(q);
});

if (query) {

    fetch("search/index.json")
        .then(response => response.json())
        .then(data => {

            const keyword = query.toLowerCase();

            const results = data.filter(article => {

                return (

                    (article.title || "").toLowerCase().includes(keyword) ||

                    (article.author || "").toLowerCase().includes(keyword) ||

                    (article.journal || "").toLowerCase().includes(keyword) ||

                    (article.keywords || "").toLowerCase().includes(keyword) ||

                    (article.abstract || "").toLowerCase().includes(keyword)

                );

            });

            document.getElementById("result-count").innerHTML =
                `<strong>${results.length}</strong> article(s) found`;

            const container =
                document.getElementById("results");

            if (results.length === 0) {

                document.getElementById("no-results").style.display =
                    "block";

                return;

            }

            results.forEach(article => {

                container.innerHTML += `

<div class="result">

<h2>

<a href="${article.url}">

${article.title}

</a>

</h2>

<div class="meta">

<strong>Author:</strong>
${article.author}

<br>

<strong>Journal:</strong>
${article.journal}

<br>

<strong>Volume:</strong>
${article.volume}

&nbsp;&nbsp;

<strong>Issue:</strong>
${article.issue}

${article.year ? `&nbsp;&nbsp;<strong>Year:</strong> ${article.year}` : ""}

</div>

<div class="abstract">

${article.abstract || ""}

</div>

<a
class="read-btn"
href="${article.url}">

Read Article →

</a>

</div>

`;

            });

        })

        .catch(error => {

            console.error(error);

            document.getElementById("result-count").innerHTML =
                "Unable to load search index.";

        });

}