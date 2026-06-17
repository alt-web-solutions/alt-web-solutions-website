/**
 * Optional mouse-reactive card tilt
 *
 * Cards are no longer animated automatically. Add either of these to any card
 * you want to make interactive:
 *
 *   class="tilt-card"
 *   data-card-tilt
 *
 * Example:
 *   <article class="service-card tilt-card reveal">...</article>
 *
 * This keeps the effect selective, so important cards can feel premium without
 * making every card on the website move.
 */
const CARD_TILT_SELECTOR = '.tilt-card, [data-card-tilt]';
const MAX_TILT = 4;

export function initCardTilt() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  // Skip the effect for users who prefer reduced motion and for touch devices.
  if (prefersReducedMotion || !hasFinePointer) return;

  document.querySelectorAll(CARD_TILT_SELECTOR).forEach((card) => {
    card.classList.add('interactive-card');

    card.addEventListener('pointermove', (event) => handlePointerMove(event, card));
    card.addEventListener('pointerenter', () => card.classList.add('is-tilting'));
    card.addEventListener('pointerleave', () => resetCard(card));
  });
}

function handlePointerMove(event, card) {
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const xPercent = x / rect.width;
  const yPercent = y / rect.height;

  const rotateY = (xPercent - 0.5) * MAX_TILT * 2;
  const rotateX = (0.5 - yPercent) * MAX_TILT * 2;

  card.style.setProperty('--card-tilt-x', `${rotateX.toFixed(2)}deg`);
  card.style.setProperty('--card-tilt-y', `${rotateY.toFixed(2)}deg`);
}

function resetCard(card) {
  card.classList.remove('is-tilting');
  card.style.setProperty('--card-tilt-x', '0deg');
  card.style.setProperty('--card-tilt-y', '0deg');
}
