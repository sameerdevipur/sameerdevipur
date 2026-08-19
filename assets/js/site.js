const ANALYTICS_ID = "G-ND56G7GR4N";
const CONSENT_KEY = "analytics-consent";

function readPreference(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removePreference(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // The next page load will continue without a persisted preference.
  }
}

function initializeThemeToggle() {
  const root = document.documentElement;
  const toggle = document.querySelector("#theme-toggle");

  if (!toggle) {
    return;
  }

  function updateToggle() {
    const isDark = root.dataset.theme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  }

  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    writePreference("theme", nextTheme);
    updateToggle();
  });

  updateToggle();
}

function initializeDisclosures() {
  document.querySelectorAll(".read-more-btn").forEach((button, index) => {
    const card = button.closest(".featured-card, .thinking-card");
    const panel = card?.querySelector(".expand-content");

    if (!card || !panel) {
      return;
    }

    const panelId = panel.id || `disclosure-panel-${index + 1}`;
    panel.id = panelId;
    panel.hidden = true;
    button.type = "button";
    button.setAttribute("aria-controls", panelId);
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const nextExpanded = !isExpanded;

      button.setAttribute("aria-expanded", String(nextExpanded));
      button.textContent = nextExpanded ? "Read less" : "Read more";
      panel.hidden = !nextExpanded;
      card.classList.toggle("expanded", nextExpanded);
    });
  });
}

function prepareConsentMode() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
}

function loadAnalytics() {
  if (document.querySelector(`script[data-analytics-id="${ANALYTICS_ID}"]`)) {
    return;
  }

  prepareConsentMode();
  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("config", ANALYTICS_ID, {
    anonymize_ip: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.dataset.analyticsId = ANALYTICS_ID;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  document.head.append(script);
}

function disableAnalytics() {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }

  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();

    if (name === "_ga" || name.startsWith("_ga_")) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}; SameSite=Lax`;
    }
  });
}

function initializeAnalyticsConsent() {
  const banner = document.querySelector("#analytics-consent");
  const status = document.querySelector("#analytics-status");
  const resetButton = document.querySelector("[data-reset-consent]");
  const globalPrivacyControl = navigator.globalPrivacyControl === true;
  let preference = readPreference(CONSENT_KEY);

  if (globalPrivacyControl && preference !== "denied") {
    preference = "denied";
    writePreference(CONSENT_KEY, preference);
  }

  function updateStatus() {
    if (!status) {
      return;
    }

    if (globalPrivacyControl) {
      status.textContent =
        "Analytics is disabled because your browser sends a Global Privacy Control signal.";
    } else if (preference === "granted") {
      status.textContent = "Analytics is currently allowed.";
    } else if (preference === "denied") {
      status.textContent = "Analytics is currently disabled.";
    } else {
      status.textContent = "No analytics preference has been saved.";
    }
  }

  function showBanner() {
    if (banner && !globalPrivacyControl) {
      banner.hidden = false;
    }
  }

  if (preference === "granted" && !globalPrivacyControl) {
    loadAnalytics();
  } else if (preference !== "denied") {
    showBanner();
  }

  banner?.querySelectorAll("[data-consent]").forEach((button) => {
    button.addEventListener("click", () => {
      preference = button.dataset.consent;
      writePreference(CONSENT_KEY, preference);
      banner.hidden = true;

      if (preference === "granted") {
        loadAnalytics();
      } else {
        disableAnalytics();
      }

      updateStatus();
    });
  });

  resetButton?.addEventListener("click", () => {
    disableAnalytics();
    removePreference(CONSENT_KEY);
    preference = null;
    updateStatus();
    showBanner();
  });

  updateStatus();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeThemeToggle();
  initializeDisclosures();
  initializeAnalyticsConsent();
});
