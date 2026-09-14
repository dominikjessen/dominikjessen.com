import { useState, type ReactNode } from "react";
import { ClockIcon, MinusIcon, PlusIcon, UsersIcon } from "./MenuIcons";
import { isScalable, scaleAmount, scaleIngredientName } from "./scaleAmount";

type Ingredient = {
  name: string;
  amount?: string;
  optional?: boolean;
};

export type IngredientsPanelProps = {
  ingredients: readonly Ingredient[];
  /** Servings the amounts are written for. Without it, amounts can't be scaled. */
  servings?: number;
  timeMinutes?: number;
};

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 24;

/** 35 → "35 min", 90 → "1 h 30 min", 180 → "3 h". */
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-primary dark:text-primary-muted">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-subtle">{label}</p>
        {children}
      </div>
    </div>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-full border border-foreground-border bg-background text-foreground-soft transition duration-150 enabled:hover:border-primary/40 enabled:hover:text-primary disabled:opacity-40"
    >
      {children}
    </button>
  );
}

/**
 * Time, an adjustable serving count, and the ingredient list scaled to match.
 * Amounts without a number ("pinch", "to serve") stay as written.
 */
export default function IngredientsPanel({ ingredients, servings, timeMinutes }: IngredientsPanelProps) {
  const [count, setCount] = useState(servings ?? MIN_SERVINGS);
  const factor = servings ? count / servings : 1;
  const scaling = factor !== 1;
  const hasUnscalable = ingredients.some((ingredient) => ingredient.amount && !isScalable(ingredient.amount));

  return (
    <>
      {(timeMinutes !== undefined || servings !== undefined) && (
        <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-foreground-border bg-foreground-surface px-5 py-4">
          {timeMinutes !== undefined && (
            <Fact icon={<ClockIcon className="size-6" />} label="Time">
              <p className="font-signika text-lg text-foreground-strong">{formatTime(timeMinutes)}</p>
            </Fact>
          )}
          {servings !== undefined && (
            <Fact icon={<UsersIcon className="size-6" />} label="Serves">
              <div className="mt-0.5 flex items-center gap-2">
                <StepButton
                  label="Fewer servings"
                  disabled={count <= MIN_SERVINGS}
                  onClick={() => setCount((current) => Math.max(MIN_SERVINGS, current - 1))}
                >
                  <MinusIcon className="size-4" />
                </StepButton>
                <output
                  aria-live="polite"
                  aria-label={`Serves ${count}`}
                  className="min-w-6 text-center font-signika text-lg tabular-nums text-foreground-strong"
                >
                  {count}
                </output>
                <StepButton
                  label="More servings"
                  disabled={count >= MAX_SERVINGS}
                  onClick={() => setCount((current) => Math.min(MAX_SERVINGS, current + 1))}
                >
                  <PlusIcon className="size-4" />
                </StepButton>
              </div>
            </Fact>
          )}
          {scaling && servings !== undefined && (
            <button
              type="button"
              onClick={() => setCount(servings)}
              className="font-signika text-sm text-primary underline-offset-4 hover:underline dark:text-primary-muted"
            >
              Reset to {servings}
            </button>
          )}
        </div>
      )}

      <h2 id="ingredients-heading" className="text-2xl md:text-3xl text-primary mb-4">
        Ingredients
      </h2>
      <ul className="flex flex-col gap-3">
        {ingredients.map((ingredient) => {
          const scaled = scaling && isScalable(ingredient.amount);
          return (
            <li
              key={ingredient.name}
              className="flex gap-3 text-base md:text-lg text-foreground-soft leading-snug border-b border-foreground-border pb-3 last:border-0"
            >
              <span className="grow">
                {scaleIngredientName(ingredient.name, ingredient.amount, factor)}
                {ingredient.optional && <span className="text-foreground-subtle"> (optional)</span>}
              </span>
              {ingredient.amount && (
                <span
                  className={`shrink-0 tabular-nums transition-colors duration-200 ${
                    scaled ? "text-primary dark:text-primary-muted" : "text-foreground-muted"
                  }`}
                >
                  {scaleAmount(ingredient.amount, factor)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {scaling && hasUnscalable && (
        <p className="mt-4 text-sm italic text-foreground-subtle">
          Amounts like “a pinch” stay as written — go by taste.
        </p>
      )}
    </>
  );
}
