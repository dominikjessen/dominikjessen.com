import type { JSX } from "react";
import type { MealType } from "../../types/recipes";

type DoodleProps = {
  className?: string;
};

/** Slightly wobbly, round-capped strokes so these read as pen doodles rather than icons. */
const doodleProps = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Steaming coffee cup on a saucer. */
function CoffeeCup({ className }: DoodleProps) {
  return (
    <svg className={className} {...doodleProps}>
      <path d="M6.5 13.2c5.8.4 11.6.3 17.6 0" />
      <path d="M7 13.5c.2 5.2 2 9.5 7.8 9.5 5.9 0 7.6-4.4 8-9.7" />
      <path d="M23.6 15.5c2.6-.6 3.9 1 3.4 2.8-.5 1.8-2.3 2.4-4.4 1.9" />
      <path d="M5 26.2c7.2.8 14.8.8 22-.1" />
      <path d="M11.5 10c-1.2-1.5.9-2.6-.2-4.3" />
      <path d="M15.5 9.5c-1.2-1.6.9-2.7-.2-4.5" />
      <path d="M19.5 10c-1.2-1.5.9-2.6-.2-4.3" />
    </svg>
  );
}

/** Salad bowl with a few leaves poking out. */
function SaladBowl({ className }: DoodleProps) {
  return (
    <svg className={className} {...doodleProps}>
      <path d="M4.5 15.8c7.7.5 15.3.4 23-.2" />
      <path d="M5 16c.6 5.8 5 9 11 9s10.4-3.2 11-9.2" />
      <path d="M9.5 15.4c-.6-3 1-5.6 4-6.2-.2 3-1.6 5.1-4 6.2Z" />
      <path d="M16.2 15.6c.3-3.4 2.4-5.8 5.8-6.1-.4 3.2-2.4 5.4-5.8 6.1Z" />
      <path d="M13.8 15.2c.7-2.3.1-4.7-1.3-6.4" />
    </svg>
  );
}

/** Serving cloche — dinner is served. */
function Cloche({ className }: DoodleProps) {
  return (
    <svg className={className} {...doodleProps}>
      <path d="M5 21.2c-.1-6.2 4.8-11.3 11-11.3s11.1 5 11 11.2" />
      <path d="M3.5 21.4c8.3.6 16.7.5 25-.2" />
      <path d="M16 9.9V8" />
      <path d="M14.4 7.7c1.1-.4 2.2-.4 3.2.1" />
      <path d="M9.5 16.5c.8-1.6 2-2.8 3.6-3.6" />
    </svg>
  );
}

/** Two olives on a cocktail stick. */
function Olives({ className }: DoodleProps) {
  return (
    <svg className={className} {...doodleProps}>
      <path d="M24.5 5.5 9 25.5" />
      <path d="M16.3 10.4c2.1-1.6 5.1-1.3 6.2.6 1.1 1.9-.1 4.6-2.5 5.8-2.4 1.2-4.9.5-5.4-1.3-.4-1.6.1-3.7 1.7-5.1Z" />
      <path d="M10.2 17.8c2.1-1.6 5.1-1.3 6.2.6 1.1 1.9-.1 4.6-2.5 5.8-2.4 1.2-4.9.5-5.4-1.3-.4-1.6.1-3.7 1.7-5.1Z" />
      <path d="M19.2 12.9c.4-.4 1-.4 1.3 0" />
      <path d="M13.1 20.3c.4-.4 1-.4 1.3 0" />
    </svg>
  );
}

/** Slice of layer cake with a cherry on top. */
function CakeSlice({ className }: DoodleProps) {
  return (
    <svg className={className} {...doodleProps}>
      <path d="M4.8 24.2c7.2.3 14.4.2 21.7-.2" />
      <path d="M5.4 24v-7.6c6.8-1.6 13.6-3.3 20.3-5.2.2 4.3.3 8.6.3 12.9" />
      <path d="M5.6 19.8c6.8-.8 13.6-1.9 20.3-3.4" />
      <path d="M23.3 9.9c.8-1.4 2.9-1.2 3.1.4.2 1.7-2.1 2.4-3 1.1" />
      <path d="M25.4 9.4c.2-1.6 1.1-2.8 2.6-3.4" />
    </svg>
  );
}

/** Wine glass, half full (or half empty, depending on the evening). */
function WineGlass({ className }: DoodleProps) {
  return (
    <svg className={className} {...doodleProps}>
      <path d="M10 5.5c4-.3 8-.3 12 0 .6 5.6-1.3 10.3-6 10.5-4.7-.2-6.6-4.9-6-10.5Z" />
      <path d="M10.5 10.6c3.7.6 7.4.6 11 0" />
      <path d="M16 16.1c.1 2.7.1 5.3 0 8" />
      <path d="M11.4 26.2c3.1-.6 6.1-.5 9.2.1" />
    </svg>
  );
}

const COURSE_DOODLES: Record<MealType, (props: DoodleProps) => JSX.Element> = {
  breakfast: CoffeeCup,
  lunch: SaladBowl,
  dinner: Cloche,
  snack: Olives,
  dessert: CakeSlice,
  drink: WineGlass,
};

export default function CourseDoodle({ mealType, className }: DoodleProps & { mealType: MealType }) {
  const Doodle = COURSE_DOODLES[mealType];
  return <Doodle className={className} />;
}
