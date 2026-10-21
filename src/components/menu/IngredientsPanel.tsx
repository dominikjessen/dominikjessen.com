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
      <span className="shrink-0 text-pine">{icon}</span>
      <div>
        <p className="font-mono text-label lowercase text-muted">{label}</p>
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
      className="flex size-8 items-center justify-center rounded-full border border-charcoal/16 bg-white text-charcoal transition duration-150 enabled:hover:border-pine/50 enabled:hover:text-pine disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
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
        <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-card border border-charcoal/16 bg-white px-5 py-4 shadow-card-sm">
          {timeMinutes !== undefined && (
            <Fact icon={<ClockIcon className="size-6" />} label="Time">
              <p className="text-[17px] font-semibold text-charcoal">{formatTime(timeMinutes)}</p>
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
                  className="min-w-6 text-center text-[17px] font-semibold tabular-nums text-charcoal"
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
              className="rounded-sm font-mono text-xs text-pine underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
            >
              reset to {servings}
            </button>
          )}
        </div>
      )}

      <h2 id="ingredients-heading" className="mb-4 font-display font-normal text-[32px] md:text-[40px] leading-none text-charcoal">
        Ingredients
      </h2>
      <ul className="flex flex-col gap-3">
        {ingredients.map((ingredient) => {
          const scaled = scaling && isScalable(ingredient.amount);
          return (
            <li
              key={ingredient.name}
              className="flex items-baseline gap-3 border-b border-charcoal/10 pb-3 text-base md:text-[17px] leading-snug text-body last:border-0"
            >
              <span className="grow">
                {scaleIngredientName(ingredient.name, ingredient.amount, factor)}
                {ingredient.optional && <span className="text-muted"> (optional)</span>}
              </span>
              {ingredient.amount && (
                <span
                  className={`shrink-0 font-mono text-ui tabular-nums transition-colors duration-200 ${
                    scaled ? "text-pine" : "text-muted"
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
        <p className="mt-4 text-sm italic text-muted">
          Amounts like “a pinch” stay as written — go by taste.
        </p>
      )}
    </>
  );
}
