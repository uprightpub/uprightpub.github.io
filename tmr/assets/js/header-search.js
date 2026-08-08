function initializeHeaderSearch() {

    const searchToggle =
        document.getElementById("searchToggle");

    const searchForm =
        document.getElementById("headerSearchForm");

    if (!searchToggle || !searchForm) return;

    if (searchToggle.dataset.initialized === "true") return;

    searchToggle.dataset.initialized = "true";

    const searchInput =
        searchForm.querySelector("input[type='search']");

    if (!searchInput) return;

    searchToggle.addEventListener("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        searchForm.classList.toggle("active");

        if (searchForm.classList.contains("active")) {
            searchInput.focus();
        }

    });

    document.addEventListener("click", function (e) {

        if (
            !searchForm.contains(e.target) &&
            !searchToggle.contains(e.target)
        ) {
            searchForm.classList.remove("active");
        }

    });

    searchInput.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            searchForm.classList.remove("active");
            searchToggle.focus();

        }

    });

    searchForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const keyword =
            searchInput.value.trim();

        if (keyword === "") {

            searchInput.focus();
            return;

        }

        window.location.href =
            "/search-results.html?q=" +
            encodeURIComponent(keyword);

    });

}


document.addEventListener(
    "tmr-header-loaded",
    function () {
        initializeHeaderSearch();
    }
);