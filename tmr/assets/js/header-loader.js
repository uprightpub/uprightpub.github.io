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

        document.dispatchEvent(
            new CustomEvent("tmr-header-loaded")
        );

    } catch (error) {

        console.error("TMR Header Error:", error);

    }

});