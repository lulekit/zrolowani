// Sticky nav: dodaje tło po przewinięciu.
const nav = document.querySelector('[data-nav]');
const onScroll = () => {
  if (!nav) return;
  nav.classList.toggle('bg-brand-950/90', window.scrollY > 8);
  nav.classList.toggle('backdrop-blur', window.scrollY > 8);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobilne.
const toggle = document.querySelector('[data-nav-toggle]');
const menu = document.querySelector<HTMLElement>('[data-nav-menu]');
toggle?.addEventListener('click', () => {
  if (!menu) return;
  const open = menu.hasAttribute('hidden');
  if (open) menu.removeAttribute('hidden');
  else menu.setAttribute('hidden', '');
  toggle.setAttribute('aria-expanded', String(open));
});
menu?.querySelectorAll('[data-nav-link]').forEach((link) =>
  link.addEventListener('click', () => {
    menu.setAttribute('hidden', '');
    toggle?.setAttribute('aria-expanded', 'false');
  }),
);

// Animacja pojawiania sekcji (z poszanowaniem reduced-motion).
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}
