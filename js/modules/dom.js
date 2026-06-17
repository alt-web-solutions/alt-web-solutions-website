export const selectors = {
  navToggle: ".nav-toggle",
  navActions: ".nav-actions",
  navLinks: ".nav-links",
  themeToggle: "#themeToggle",
  themeIcon: "#themeIcon",
  themeText: "#themeText",
  siteLogo: "#siteLogo",
  year: "#year",
  techBackground: "#techBackground",
  revealItems: ".reveal",
};

export const getElement = (selector, scope = document) => scope.querySelector(selector);
export const getElements = (selector, scope = document) => [...scope.querySelectorAll(selector)];
