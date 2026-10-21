import type { ReactNode } from "react";
import type { CurrentlyCategoryKey } from "../types/data";
import { useCurrentlyFields } from "../hooks/useCurrentlyFields";

const Stroke = ({ children }: { children: ReactNode }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** A small live detail per category, drawn in a tinted tile. */
const TILE: Record<CurrentlyCategoryKey, { tint: string; icon: ReactNode }> = {
  reading: {
    tint: "bg-parchment text-parchment-text",
    icon: (
      <Stroke>
        <path d="M3 5.5c2.5-1 5.5-1 9 1 3.5-2 6.5-2 9-1V19c-2.5-1-5.5-1-9 1-3.5-2-6.5-2-9-1z" />
        <path d="M12 6.5V20" />
      </Stroke>
    ),
  },
  listening: {
    tint: "bg-sage text-pine-deep",
    icon: (
      <span className="flex h-5 items-end gap-0.75" aria-hidden="true">
        {[0, 0.3, 0.15, 0.45].map((delay) => (
          <span key={delay} className="w-0.75 h-full origin-bottom rounded-full bg-pine animate-eq" style={{ animationDelay: `${delay}s` }} />
        ))}
      </span>
    ),
  },
  watching: {
    tint: "bg-stone text-charcoal",
    icon: (
      <Stroke>
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M8.5 3l3.5 4 3.5-4" />
        <rect x="6" y="10" width="12" height="6" rx="1" fill="currentColor" stroke="none" className="animate-pulse-soft" opacity=".25" />
      </Stroke>
    ),
  },
  building: {
    tint: "bg-oat text-parchment-text",
    icon: (
      <Stroke>
        <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
      </Stroke>
    ),
  },
  thinking: {
    tint: "bg-white border-[1.5px] border-dashed border-wire-dash",
    icon: (
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 0.25, 0.5].map((delay) => (
          <span key={delay} className="size-1 rounded-full bg-pine animate-pulse-soft" style={{ animationDelay: `${delay}s` }} />
        ))}
      </span>
    ),
  },
  drinking: {
    tint: "bg-sage text-pine-deep",
    icon: (
      <Stroke>
        <path d="M5 11h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
        <path d="M16 12.5h1.5a2.5 2.5 0 0 1 0 5H16" />
        <path d="M8.5 8c0-1 1-1.5 1-2.5" className="animate-steam" />
        <path d="M12 8c0-1 1-1.5 1-2.5" className="animate-steam" style={{ animationDelay: "0.8s" }} />
      </Stroke>
    ),
  },
};

/** The Currently section: a "now playing" panel with one random item per category and a small live detail per field. */
export default function CurrentlyReact() {
  const { fields, shuffle } = useCurrentlyFields();

  return (
    <section id="currently" className="pb-16 lg:pb-28 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14 lg:items-start">
      <CurrentlyHeader />

      <div className="mt-8 lg:mt-0 overflow-hidden bg-white border border-charcoal/16 rounded-card shadow-card">
        <div className="flex items-center justify-between gap-3 px-5.5 py-2 bg-card-head border-b border-charcoal/10 font-mono text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="size-1.75 rounded-full bg-pine animate-pulse-soft" aria-hidden="true" />
            now playing
          </span>
          <ShuffleButton onClick={shuffle} />
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-charcoal/8">
          {fields.map(({ category, key, item }) => {
            const tile = TILE[category];
            return (
              <li key={key} className="flex items-start gap-3.5 bg-white px-4 py-4 md:px-5 md:py-5">
                <span className={`flex shrink-0 items-center justify-center size-10 rounded-button ${tile.tint}`}>{tile.icon}</span>
                <div key={item.title} className="flex flex-col gap-1 min-w-0 motion-safe:animate-menu-fade-up">
                  <span className="font-mono text-label text-muted">{key}</span>
                  <p className="text-[15px] md:text-base leading-snug font-semibold text-charcoal">
                    <FieldValue title={item.title} url={item.url} />
                    {category === "building" && <span className="ml-0.5 inline-block w-0.5 h-[1.05em] align-[-0.15em] bg-pine animate-blink" aria-hidden="true" />}
                  </p>
                  {category === "listening" && (
                    <span className="mt-1.5 block h-0.75 w-full max-w-40 overflow-hidden rounded-full bg-sage" aria-hidden="true">
                      <span className="block h-full w-full origin-left rounded-full bg-pine animate-progress" />
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function CurrentlyHeader() {
  return (
    <header className="flex flex-col">
      <p className="font-mono text-xs text-muted">03 · currently</p>
      <h2 className="mt-2 font-display font-normal text-heading md:text-heading-lg text-charcoal">
        Currently
      </h2>
      <p className="mt-4 text-intro md:text-intro-lg text-body">
        Some of the things I'm enjoying these days and always down to chat about!
      </p>
      <p className="mt-3 self-start font-hand text-[22px] leading-tight text-pine -rotate-2">updated whenever I remember</p>
    </header>
  );
}

function ShuffleButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 rounded-md bg-chip px-2.5 py-1.5 font-mono text-xs text-charcoal hover:bg-stone focus-visible:outline-2 focus-visible:outline-pine focus-visible:outline-offset-2 ${className}`}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="transition-transform duration-300 group-active:rotate-180"
      >
        <path d="M20 12a8 8 0 1 1-2.3-5.6" />
        <path d="M20 4v4.5h-4.5" />
      </svg>
      shuffle
    </button>
  );
}

/** Field value, linked when the item has a URL. */
function FieldValue({ title, url, className = "" }: { title: string; url?: string; className?: string }) {
  if (!url) return <span className={className}>{title}</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className={`rounded-sm hover:underline decoration-pine underline-offset-4 focus-visible:outline-2 focus-visible:outline-pine focus-visible:outline-offset-2 ${className}`}
    >
      {title}
    </a>
  );
}
