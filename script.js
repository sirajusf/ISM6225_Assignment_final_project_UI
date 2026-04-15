const searchForm = document.querySelector(".search-bar");
const searchInput = document.querySelector("#property-search");
const searchFeedback = document.querySelector("#search-feedback");
const revealItems = document.querySelectorAll(".reveal");
const searchTabs = document.querySelectorAll(".search-tabs .tab");
const searchButton = document.querySelector(".search-bar button");
const themeSwitch = document.querySelector("#theme-switch");
const THEME_KEY = "tip-theme-mode";

function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  if (themeSwitch) {
    themeSwitch.checked = mode === "dark";
  }
}

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let currentThemeMode = getInitialTheme();
applyTheme(currentThemeMode);

if (themeSwitch) {
  themeSwitch.addEventListener("change", () => {
    currentThemeMode = themeSwitch.checked ? "dark" : "light";
    localStorage.setItem(THEME_KEY, currentThemeMode);
    applyTheme(currentThemeMode);
  });
}

if (searchForm && searchInput && searchFeedback) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
      searchFeedback.textContent = "Try a prompt like: low-risk 2 bed near downtown under $1800.";
      return;
    }

    searchFeedback.textContent = `Showing demo insights for "${query}"...`;
    if (searchButton) {
      searchButton.classList.remove("pulse");
      requestAnimationFrame(() => searchButton.classList.add("pulse"));
    }

    if (searchTabs.length > 0) {
      searchTabs.forEach((tab) => tab.classList.remove("active"));
      const lowerQuery = query.toLowerCase();
      let activeIndex = 0;

      if (lowerQuery.includes("scam") || lowerQuery.includes("fraud")) {
        activeIndex = 1;
      } else if (lowerQuery.includes("lease") || lowerQuery.includes("risk")) {
        activeIndex = 2;
      } else if (lowerQuery.includes("fit") || lowerQuery.includes("match")) {
        activeIndex = 3;
      }

      searchTabs[activeIndex].classList.add("active");
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}
