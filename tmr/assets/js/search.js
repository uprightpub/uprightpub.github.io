document.addEventListener("DOMContentLoaded", function () {

    const resultsContainer = document.getElementById("results");
    const resultCount = document.getElementById("result-count");
    const noResults = document.getElementById("no-results");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    if (
        !resultsContainer ||
        !resultCount ||
        !noResults ||
        !searchForm ||
        !searchInput
    ) {
        return;
    }

    if (typeof searchData === "undefined") {

        resultCount.textContent = "Search data could not be loaded.";
        noResults.style.display = "block";

        return;
    }

    const params = new URLSearchParams(window.location.search);
    const query = (params.get("q") || "").trim();

    searchInput.value = query;

    function escapeHTML(value) {

        const text = String(value || "");

        return text.replace(/[&<>"']/g, function (character) {

            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#039;"
            };

            return characters[character];

        });

    }

    function search(keyword) {

        const words = keyword
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);

        return searchData.filter(function (item) {

            const searchableText = [
                item.title,
                item.type,
                item.authors,
                item.keywords,
                item.abstract
            ]
            .join(" ")
            .toLowerCase();

            return words.every(function (word) {
                return searchableText.includes(word);
            });

        });

    }

    function render(results, keyword) {

        resultsContainer.innerHTML = "";

        if (results.length === 0) {

            resultCount.textContent =
                '0 results found for "' + keyword + '".';

            noResults.style.display = "block";

            return;
        }

        noResults.style.display = "none";

        resultCount.textContent =
            results.length +
            ' result(s) found for "' +
            keyword +
            '".';

        results.forEach(function (item) {

            const article = document.createElement("article");
            article.className = "result";

            article.innerHTML = `
                <h2>
                    <a href="${escapeHTML(item.url)}">
                        ${escapeHTML(item.title)}
                    </a>
                </h2>

                <div class="meta">
                    ${escapeHTML(item.type)}
                </div>

                <div class="abstract">
                    ${escapeHTML(item.abstract)}
                </div>

                <a class="read-btn" href="${escapeHTML(item.url)}">
                    Open Page
                </a>
            `;

            resultsContainer.appendChild(article);

        });

    }

    if (query !== "") {

        render(search(query), query);

    } else {

        resultCount.textContent = "Enter a keyword to search the journal.";

    }

    searchForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const keyword = searchInput.value.trim();

        if (keyword === "") {

            searchInput.focus();
            return;

        }

        window.location.href =
            "search-results.html?q=" +
            encodeURIComponent(keyword);

    });

});