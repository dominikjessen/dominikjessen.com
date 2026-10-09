import { useEffect, useRef, useState } from "react";
import type { RecipeListItem } from "../../types/recipes";
import { DiceIcon } from "./MenuIcons";

/** How long the names shuffle before the chef "decides", and how long the pick stays up. */
const SHUFFLE_MS = 1400;
const REVEAL_MS = 1400;

export type ChefsChoiceProps = {
  pool: readonly RecipeListItem[];
  onClose: () => void;
};

/**
 * "Surprise me" moment: a rolling die and a slot-machine shuffle of dish names that slows down,
 * lands on the chef's choice, then opens it. Reduced motion skips straight to the reveal.
 */
export default function ChefsChoice({ pool, onClose }: ChefsChoiceProps) {
  // Pool and pick are fixed when the dialog opens, so re-renders behind it can't restart the show.
  const [names] = useState(pool);
  const [pick] = useState(() => pool[Math.floor(Math.random() * pool.length)]);
  const [shown, setShown] = useState(pick);
  const [chosen, setChosen] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timers: number[] = [];
    const reveal = () => {
      setShown(pick);
      setChosen(true);
      timers.push(
        window.setTimeout(() => {
          window.location.href = `/menu/${pick.id}`;
        }, REVEAL_MS)
      );
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || names.length < 2) {
      reveal();
    } else {
      // Decelerating shuffle: each name stays up a little longer than the last.
      let delay = 55;
      let elapsed = 0;
      const tick = () => {
        if (elapsed >= SHUFFLE_MS) {
          reveal();
          return;
        }
        setShown(names[Math.floor(Math.random() * names.length)]);
        elapsed += delay;
        delay *= 1.12;
        timers.push(window.setTimeout(tick, delay));
      };
      tick();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [names, pick]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The chef is choosing a dish"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-6 backdrop-blur-sm motion-safe:animate-menu-fade-in"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-w-lg flex-col items-center gap-4 text-center"
      >
        <DiceIcon
          key={chosen ? "landed" : "rolling"}
          className={`size-14 md:size-16 text-primary dark:text-primary-muted ${
            chosen ? "motion-safe:animate-dice-land" : "motion-safe:animate-dice-roll"
          }`}
        />
        <p className="font-hand text-2xl md:text-3xl text-foreground-subtle">
          {chosen ? "The chef has chosen…" : "The chef is choosing…"}
        </p>
        <p
          key={chosen ? "chosen" : "shuffling"}
          aria-hidden={!chosen}
          className={`font-signika text-3xl md:text-5xl font-bold leading-tight ${
            chosen
              ? "text-primary dark:text-primary-muted motion-safe:animate-pop-in"
              : "text-foreground-subtle"
          }`}
        >
          {shown.title}
        </p>
        <p
          className={`italic text-foreground-muted transition-opacity duration-300 ${
            chosen ? "opacity-100" : "opacity-0"
          }`}
        >
          {pick.menuLine}
        </p>
        {/* Announce only the final pick, not every shuffled name. */}
        <p className="sr-only" aria-live="polite">
          {chosen ? `The chef has chosen ${pick.title}. Opening the recipe.` : ""}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 text-sm text-foreground-subtle underline-offset-4 hover:text-foreground-soft hover:underline"
        >
          Never mind
        </button>
      </div>
    </div>
  );
}
