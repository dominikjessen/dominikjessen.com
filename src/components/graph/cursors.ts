// Live cursors on the career graph, as if the visitor and Dominik were in the same workflow file.
// - "you": follows the visitor's mouse while it's over the graph (mouse/trackpad only).
// - "Dominik": glides between a few spots around the current step and sometimes clicks.
// Each graph marks its area with [data-cursor-zone] and lists Dominik's spots in data-spots (graph px).

const GLIDE_MS = 1400; // matches the .cursor-dominik transition
const CLICK_MS = 320;
const CLICK_CHANCE = 0.5;
const FIRST_MOVE_MS = 2200;
const MIN_WAIT_MS = 2600;
const MAX_WAIT_MS = 5200;

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const placeAt = (el: HTMLElement, x: number, y: number) => {
  el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
};

function followVisitor(zone: HTMLElement, you: HTMLElement) {
  zone.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !finePointer.matches) return;
    const rect = zone.getBoundingClientRect();
    const scale = rect.width / zone.offsetWidth; // in case the graph is ever scaled down
    // -1px so the arrow's tip (drawn at 1.5, 1.5) sits on the pointer.
    placeAt(you, (e.clientX - rect.left) / scale - 1, (e.clientY - rect.top) / scale - 1);
    you.classList.add('is-on');
  });
  zone.addEventListener('pointerleave', () => you.classList.remove('is-on'));
}

function wanderDominik(dominik: HTMLElement, spots: [number, number][]) {
  if (spots.length < 2) return;

  let spot = 0;
  let timer = 0;

  const wander = () => {
    // Any spot except the current one.
    spot = (spot + 1 + Math.floor(Math.random() * (spots.length - 1))) % spots.length;
    placeAt(dominik, ...spots[spot]);

    if (Math.random() < CLICK_CHANCE) {
      window.setTimeout(() => {
        dominik.classList.add('is-clicking');
        window.setTimeout(() => dominik.classList.remove('is-clicking'), CLICK_MS + 20);
      }, GLIDE_MS + 50);
    }

    schedule(MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS));
  };

  const schedule = (ms: number) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(wander, ms);
  };

  // Don't queue up moves while the tab is in the background.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') window.clearTimeout(timer);
    else schedule(FIRST_MOVE_MS);
  });

  if (document.visibilityState === 'visible') schedule(FIRST_MOVE_MS);
}

document.querySelectorAll<HTMLElement>('[data-cursor-zone]').forEach((zone) => {
  const you = zone.querySelector<HTMLElement>('[data-cursor="you"]');
  const dominik = zone.querySelector<HTMLElement>('[data-cursor="dominik"]');

  // The "you" cursor isn't decorative motion, so it follows the pointer even with reduced motion on.
  if (you) followVisitor(zone, you);

  if (dominik && !reducedMotion.matches) {
    const spots = JSON.parse(zone.dataset.spots ?? '[]') as [number, number][];
    wanderDominik(dominik, spots);
  }
});

export {};
