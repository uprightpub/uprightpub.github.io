document.addEventListener("DOMContentLoaded", async function () {

    const headerContainer = document.getElementById("site-header");

    if (!headerContainer) return;

    try {

        const response = await fetch("/tmr/assets/header.html");

        if (!response.ok) {
            throw new Error("Unable to load TMR master header.");
        }

        const html = await response.text();

        headerContainer.innerHTML = html;

        const pathname = window.location.pathname;

        document
            .querySelectorAll("#site-header nav a")
            .forEach(function (link) {

                link.classList.remove("active");

            });

        let activeHref = "";

        if (pathname.includes("/tmr/issues/")) {

            activeHref = "/tmr/archives.html";

        } else if (pathname.endsWith("/tmr/editorial-board.html")) {

            activeHref = "/tmr/editorial-board.html";

        } else if (pathname.endsWith("/tmr/archives.html")) {

            activeHref = "/tmr/archives.html";

        } else if (
            pathname.endsWith("/tmr/") ||
            pathname.endsWith("/tmr/index.html")
        ) {

            activeHref = "/tmr/index.html";

        }

        if (activeHref) {

            const activeLink = document.querySelector(
                '#site-header nav a[href="' + activeHref + '"]'
            );

            if (activeLink) {
                activeLink.classList.add("active");
            }

        }

        const searchToggle =
            document.getElementById("searchToggle");

        const searchForm =
            document.getElementById("headerSearchForm");

        if (searchToggle && searchForm) {

            const searchInput =
                searchForm.querySelector("input[type='search']");

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

                const keyword =
                    searchInput.value.trim();

                if (keyword === "") {

                    event.preventDefault();
                    searchInput.focus();

                }

            });

        }

    } catch (error) {

        console.error("TMR Header Error:", error);

    }

});