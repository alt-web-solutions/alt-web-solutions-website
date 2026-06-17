export function initMobileNavigation({ navToggle, navActions, navLinks }) {
  if (!navToggle || !navActions) return;

  navToggle.setAttribute("aria-expanded", "false");

  navToggle.addEventListener("click", () => {
    const isOpen = navActions.classList.toggle("active");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  if (!navLinks) return;

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navActions.classList.remove("active");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}
