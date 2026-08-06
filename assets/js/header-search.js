const searchToggle = document.getElementById("searchToggle");
const searchForm = document.getElementById("headerSearchForm");

if (searchToggle && searchForm) {

    searchToggle.addEventListener("click", function () {

        searchForm.classList.toggle("active");

        if (searchForm.classList.contains("active")) {
            searchForm.querySelector("input").focus();
        }

    });

    document.addEventListener("click", function (e) {

        if (!e.target.closest(".header-search")) {
            searchForm.classList.remove("active");
        }

    });

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {
            searchForm.classList.remove("active");
        }

    });

}