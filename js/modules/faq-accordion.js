/**
 * Smooth FAQ accordions
 * Native <details> elements open/close instantly by default. This module keeps
 * the accessible <details>/<summary> structure, but measures the answer height
 * so both opening and closing can animate smoothly.
 */
export function initFaqAccordions() {
  const accordions = [...document.querySelectorAll('.faq-list details')];
  if (!accordions.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  accordions.forEach((details) => {
    const summary = details.querySelector('summary');
    if (!summary) return;

    const answer = document.createElement('div');
    answer.className = 'faq-answer';

    const inner = document.createElement('div');
    inner.className = 'faq-answer-inner';

    // Move all non-summary content into an animatable wrapper.
    [...details.children].forEach((child) => {
      if (child !== summary) inner.appendChild(child);
    });

    answer.appendChild(inner);
    details.appendChild(answer);

    if (details.open) {
      details.classList.add('is-open');
      answer.style.height = `${inner.scrollHeight}px`;
      answer.style.opacity = '1';
    }

    summary.addEventListener('click', (event) => {
      event.preventDefault();

      if (prefersReducedMotion) {
        details.open = !details.open;
        details.classList.toggle('is-open', details.open);
        answer.style.height = details.open ? 'auto' : '0px';
        answer.style.opacity = details.open ? '1' : '0';
        return;
      }

      details.open ? closeAccordion(details, answer) : openAccordion(details, answer, inner);
    });
  });
}

function openAccordion(details, answer, inner) {
  details.open = true;
  details.classList.add('is-open', 'is-animating');

  answer.style.height = '0px';
  answer.style.opacity = '0';

  requestAnimationFrame(() => {
    answer.style.height = `${inner.scrollHeight}px`;
    answer.style.opacity = '1';
  });

  answer.addEventListener('transitionend', function handleOpen(event) {
    if (event.propertyName !== 'height') return;
    answer.style.height = 'auto';
    details.classList.remove('is-animating');
    answer.removeEventListener('transitionend', handleOpen);
  });
}

function closeAccordion(details, answer) {
  details.classList.add('is-animating');
  answer.style.height = `${answer.scrollHeight}px`;
  answer.style.opacity = '1';

  requestAnimationFrame(() => {
    answer.style.height = '0px';
    answer.style.opacity = '0';
  });

  answer.addEventListener('transitionend', function handleClose(event) {
    if (event.propertyName !== 'height') return;
    details.open = false;
    details.classList.remove('is-open', 'is-animating');
    answer.removeEventListener('transitionend', handleClose);
  });
}
