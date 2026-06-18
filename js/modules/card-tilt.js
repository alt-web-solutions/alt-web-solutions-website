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
const MAX_TILT = 3;

export function initCardTilt() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  // Skip the effect for users who prefer reduced motion and for touch devices.
  if (prefersReducedMotion || !hasFinePointer) return;

  document.querySelectorAll(CARD_TILT_SELECTOR).forEach((card) => {
    card.classList.add('interactive-card');
    const state = {
      frame: null,
      rect: null,
      x: 0,
      y: 0,
    };

    card.addEventListener('pointermove', (event) => handlePointerMove(event, card, state));
    card.addEventListener('pointerenter', () => {
      state.rect = card.getBoundingClientRect();
      card.classList.add('is-tilting');
    });
    card.addEventListener('pointerleave', () => resetCard(card, state));
  });
}

function handlePointerMove(event, card, state) {
  const rect = state.rect || card.getBoundingClientRect();
  state.x = event.clientX - rect.left;
  state.y = event.clientY - rect.top;

  if (state.frame) return;

  state.frame = requestAnimationFrame(() => {
    state.frame = null;
    updateCardTilt(card, state);
  });
}

function updateCardTilt(card, state) {
  const rect = state.rect || card.getBoundingClientRect();
  const x = state.x;
  const y = state.y;

  const xPercent = x / rect.width;
  const yPercent = y / rect.height;

  const rotateY = (xPercent - 0.5) * MAX_TILT * 2;
  const rotateX = (0.5 - yPercent) * MAX_TILT * 2;

  card.style.setProperty('--card-tilt-x', `${rotateX.toFixed(2)}deg`);
  card.style.setProperty('--card-tilt-y', `${rotateY.toFixed(2)}deg`);
}

function resetCard(card, state) {
  if (state.frame) {
    cancelAnimationFrame(state.frame);
    state.frame = null;
  }

  state.rect = null;
  card.classList.remove('is-tilting');
  card.style.setProperty('--card-tilt-x', '0deg');
  card.style.setProperty('--card-tilt-y', '0deg');
}
