document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then(response => response.text())
    .then(html => {
      const header = document.getElementById("site-header");
      if (!header) return;

      header.innerHTML = html;

      const root = document.documentElement;
      const toggle = document.getElementById("theme-toggle");
      if (!toggle) return;

      // Apply system preference only if no saved theme
      if (!localStorage.getItem("theme")) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.setAttribute("data-theme", "dark");
        }
      }

      // Apply saved theme (overrides system)
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        root.setAttribute("data-theme", savedTheme);
      }

      // Set correct icon on load
      toggle.textContent =
        root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";

      // Toggle theme on click
      toggle.addEventListener("click", () => {
        const isDark = root.getAttribute("data-theme") === "dark";
        const nextTheme = isDark ? "light" : "dark";

        root.setAttribute("data-theme", nextTheme);
        localStorage.setItem("theme", nextTheme);
        toggle.textContent = nextTheme === "dark" ? "☀️" : "🌙";
      });
    })
    .catch(err => {
      console.error("Failed to load header:", err);
    });
});
