import { REVEAL_OPTIONS } from "./config.js";

function addStaggeredDelays(elements) {
  elements.forEach((element, index) => {
    const delayClass = `delay-${(index % 4) + 1}`;
    element.classList.add(delayClass);
  });
}

export function initScrollReveal(elements) {
  if (!elements.length || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  addStaggeredDelays(elements);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, REVEAL_OPTIONS);

  elements.forEach((element) => observer.observe(element));
}
