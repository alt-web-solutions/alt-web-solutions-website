/*
  Theme defaults
  ----------------
  Dark mode is the default brand experience for new visitors.

  The storage key is versioned so older testing values such as altTheme="light"
  do not force the live site to load in light mode after this update.
*/
export const THEME_STORAGE_KEY = "altThemePreferenceV2";
export const DEFAULT_THEME = "dark";

export const LOGO_PATHS = {
  light: "assets/alt-web-solutions-logo-black-icon.png",
  dark: "assets/alt-web-solutions-logo-white-icon.png",
};

export const REVEAL_OPTIONS = {
  threshold: 0.14,
  rootMargin: "0px 0px -60px 0px",
};
