document.addEventListener("DOMContentLoaded", async () => {

    const headerContainer = document.getElementById("site-header");

    if (!headerContainer) return;

    try {

        const response = await fetch("assets/includes/header.html");

        headerContainer.innerHTML = await response.text();

        // Highlight active menu
        const currentPage = location.pathname.split("/").pop() || "index.html";

        const links = headerContainer.querySelectorAll("nav a");

        links.forEach(link => {

            const href = link.getAttribute("href");

            if (href === currentPage ||
                (currentPage === "" && href === "index.html")) {

                link.classList.add("active");

            }

        });

        // Load header-search.js AFTER header is inserted
        const script = document.createElement("script");
        script.src = "assets/js/header-search.js";
        document.body.appendChild(script);

    } catch (error) {

        console.error("Header could not be loaded.", error);

    }

});