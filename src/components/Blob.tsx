import { useRef, useEffect } from "react";

/** Distance-proportional follow: lerp factor = min(maxFactor, k * sqrt(d)) so blob moves faster when cursor is far. */
const LERP_K = 0.002;
const LERP_MAX_FACTOR = 0.08;

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
        className="blob-fill h-full w-full rounded-full blur-[80px] animate-blob_breathe opacity-75"
      />
    </div>
  );
}
