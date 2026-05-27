// Wait for the DOM to fully load before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  
  // Fetch and insert the header HTML component
  fetch("/header.html")
    .then(response => response.text())
    .then(html => {
      const header = document.getElementById("site-header");
      if (!header) return;

      // Inject the fetched HTML into the header element
      header.innerHTML = html;

      const root = document.documentElement;
      const toggle = document.getElementById("theme-toggle");
      if (!toggle) return;

      // --- THEME INITIALIZATION ---
      
      // Apply system preference only if no saved theme exists in local storage
      if (!localStorage.getItem("theme")) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.setAttribute("data-theme", "dark");
        }
      }

      // Apply saved theme from local storage (overrides system preference)
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        root.setAttribute("data-theme", savedTheme);
      }

      // Set correct toggle icon on initial load based on current theme
      toggle.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";

      // --- THEME TOGGLE EVENT LISTENER ---
      
      // Toggle theme between light and dark on button click
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
