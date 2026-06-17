export function initFooterYear(yearElement) {
  if (!yearElement) return;

  yearElement.textContent = new Date().getFullYear();
}
