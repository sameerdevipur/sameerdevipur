(function initializeTheme() {
  const root = document.documentElement;
  root.classList.add("js");

  let savedTheme = null;

  try {
    savedTheme = window.localStorage.getItem("theme");
  } catch {
    // Storage can be unavailable in restricted browsing contexts.
  }

  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
    return;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.dataset.theme = "dark";
  }
})();
