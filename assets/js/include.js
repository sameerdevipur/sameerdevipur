fetch("header.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("site-header").innerHTML = data;

    const root = document.documentElement;
    const toggle = document.getElementById("theme-toggle");

    if (!localStorage.getItem("theme")) {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  }
}
    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      root.setAttribute("data-theme", savedTheme);
    }

    toggle.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";

      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      toggle.textContent = next === "dark" ? "☀️" : "🌙";
    });
  });
