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

    searchToggle.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        searchForm.classList.toggle("active");

        if (searchForm.classList.contains("active")) {
            searchInput.focus();
        }

    });

    document.addEventListener("click", function (event) {

        if (
            !searchForm.contains(event.target) &&
            !searchToggle.contains(event.target)
        ) {
            searchForm.classList.remove("active");
        }

    });

    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            searchForm.classList.remove("active");
            searchToggle.focus();

        }

    });

    searchForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const keyword =
            searchInput.value.trim();

        if (keyword === "") {

            searchInput.focus();
            return;

        }

        window.location.href =
            "/tmr/search-results.html?q=" +
            encodeURIComponent(keyword);

    });

}


document.addEventListener(
    "tmr-header-loaded",
    function () {
        initializeHeaderSearch();
    }
);