import { DEFAULT_THEME, LOGO_PATHS, THEME_STORAGE_KEY } from "./config.js";

function getStoredTheme() {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    // Only honour themes created by the current site version.
    // Anything missing or unexpected falls back to the dark brand default.
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors so the theme toggle still works in restricted browsers.
  }
}

export function applyTheme(theme, elements) {
  const isLight = theme === "light";

  document.documentElement.dataset.theme = theme;
  document.body.classList.toggle("light-theme", isLight);
  document.body.dataset.theme = theme;
  storeTheme(theme);

  if (elements.themeIcon) {
    elements.themeIcon.textContent = isLight ? "☀" : "☾";
  }

  if (elements.themeText) {
    elements.themeText.textContent = isLight ? "Light" : "Dark";
  }

  if (elements.siteLogo) {
    elements.siteLogo.src = isLight ? LOGO_PATHS.light : LOGO_PATHS.dark;
  }
}

export function initThemeToggle(elements) {
  applyTheme(getStoredTheme(), elements);
  if (elements.themeToggle) {
    elements.themeToggle.setAttribute(
      "aria-pressed",
      String(document.body.classList.contains("light-theme"))
    );
  }

  if (!elements.themeToggle) return;

  elements.themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");
    elements.themeToggle.classList.remove("is-changing");
    void elements.themeToggle.offsetWidth;
    elements.themeToggle.classList.add("is-changing");
    applyTheme(isLight ? "dark" : "light", elements);
    elements.themeToggle.setAttribute("aria-pressed", String(!isLight));
  });

  elements.themeToggle.addEventListener("animationend", () => {
    elements.themeToggle.classList.remove("is-changing");
  });
}
