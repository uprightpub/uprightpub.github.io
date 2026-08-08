document.addEventListener("DOMContentLoaded", function () {

    const headerContainer = document.getElementById("site-header");

    if (!headerContainer) return;

    fetch("/dsr/assets/header.html")
        .then(response => {

            if (!response.ok) {
                throw new Error("DSR header could not be loaded.");
            }

            return response.text();

        })
        .then(data => {

            headerContainer.innerHTML = data;

            /* Initialize header search after header loads */

            if (typeof initializeHeaderSearch === "function") {
                initializeHeaderSearch();
            }

            /* Active navigation */

            const currentPath = window.location.pathname;

            const navLinks = headerContainer.querySelectorAll("nav a");

            navLinks.forEach(link => {

                const href = link.getAttribute("href");

                if (!href || href.startsWith("http")) return;

                link.classList.remove("active");

                if (
                    (currentPath.endsWith("/dsr/") ||
                     currentPath.endsWith("/dsr/index.html")) &&
                    href === "/dsr/index.html"
                ) {
                    link.classList.add("active");
                }

                else if (
                    currentPath.includes("/editorial-board.html") &&
                    href === "/dsr/editorial-board.html"
                ) {
                    link.classList.add("active");
                }

                else if (
                    (
                        currentPath.includes("/archives.html") ||
                        currentPath.includes("/issues/")
                    ) &&
                    href === "/dsr/archives.html"
                ) {
                    link.classList.add("active");
                }

            });

        })
        .catch(error => {

            console.error("Header loading error:", error);

        });

});