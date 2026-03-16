/**
 * Scroll reveal — uses IntersectionObserver to add .visible class
 * when elements with .reveal class enter the viewport.
 */
export function initScrollReveal(): void {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((el) => {
    obs.observe(el);
  });
}
