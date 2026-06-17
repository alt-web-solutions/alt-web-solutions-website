import { getElement, getElements, selectors } from "./modules/dom.js";
import { initCardTilt } from "./modules/card-tilt.js";
import { initFaqAccordions } from "./modules/faq-accordion.js";
import { initFooterYear } from "./modules/footer-year.js";
import { initMobileNavigation } from "./modules/mobile-nav.js";
import { initScrollReveal } from "./modules/reveal.js";
import { initTechBackground } from "./modules/tech-background.js";
import { initThemeToggle } from "./modules/theme.js";
import { initContactForm } from "./modules/contact-form.js";

/*
  Main site entrypoint.
  Each feature lives in its own module so motion, navigation, theme handling,
  reveal animations, and the interactive tech background can be maintained separately.
*/
const elements = {
  navToggle: getElement(selectors.navToggle),
  navActions: getElement(selectors.navActions),
  navLinks: getElement(selectors.navLinks),
  themeToggle: getElement(selectors.themeToggle),
  themeIcon: getElement(selectors.themeIcon),
  themeText: getElement(selectors.themeText),
  siteLogo: getElement(selectors.siteLogo),
  year: getElement(selectors.year),
  techBackground: getElement(selectors.techBackground),
  contactForm: getElement("[data-contact-form]"),
  revealItems: getElements(selectors.revealItems),
};

initMobileNavigation(elements);
initThemeToggle(elements);
initFooterYear(elements.year);
initScrollReveal(elements.revealItems);
initTechBackground(elements.techBackground);
initFaqAccordions();
initCardTilt();
initContactForm(elements.contactForm);
