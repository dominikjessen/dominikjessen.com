import { useRef, useEffect } from "react";

/** Distance-proportional follow: lerp factor = min(maxFactor, k * sqrt(d)) so blob moves faster when cursor is far. */
const LERP_K = 0.002;
const LERP_MAX_FACTOR = 0.08;

const BLOB_STYLE: React.CSSProperties = {
  backgroundColor: "hsl(var(--background))",
  backgroundImage: `
    radial-gradient(at 30% 34%, rgb(252, 212, 212) 0, transparent 78%),
    radial-gradient(at 3% 57%, rgb(196, 181, 253) 0, transparent 72%),
    radial-gradient(at 32% 67%, rgb(107, 114, 128) 0, transparent 18%),
    radial-gradient(at 14% 19%, rgb(71, 85, 105) 0, transparent 61%),
    radial-gradient(at 12% 31%, rgb(253, 186, 116) 0, transparent 5%),
    radial-gradient(at 14% 46%, rgb(250, 232, 255) 0, transparent 6%)
  `,
};

export default function Blob() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const blobRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const followEnabledRef = useRef(true);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const win = window;
    const centerX = win.innerWidth / 2;
    const centerY = win.innerHeight / 2;
    blobRef.current = { x: centerX, y: centerY };
    cursorRef.current = { x: centerX, y: centerY };

    const prefersReducedMotion = win.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hasHover = win.matchMedia("(hover: hover)").matches;
    followEnabledRef.current = hasHover && !prefersReducedMotion;

    const handlePointerMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) {
        rafIdRef.current = win.requestAnimationFrame(tick);
        return;
      }

      const cursor = followEnabledRef.current ? cursorRef.current : null;
      if (cursor) {
        const blob = blobRef.current;
        const dx = cursor.x - blob.x;
        const dy = cursor.y - blob.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const lerpFactor = Math.min(LERP_MAX_FACTOR, LERP_K * Math.sqrt(d));
        blobRef.current = {
          x: blob.x + dx * lerpFactor,
          y: blob.y + dy * lerpFactor,
        };
      }

      const { x, y } = blobRef.current;
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      wrapper.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)`;

      rafIdRef.current = win.requestAnimationFrame(tick);
    };

    win.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafIdRef.current = win.requestAnimationFrame(tick);

    return () => {
      win.removeEventListener("pointermove", handlePointerMove);
      win.cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed left-0 top-0 -z-50 h-[min(80vmax,600px)] w-[min(80vmax,600px)]"
      aria-hidden
    >
      <div
        className="h-full w-full rounded-full blur-[80px] animate-blob_breathe opacity-75"
        style={BLOB_STYLE}
      />
    </div>
  );
}
