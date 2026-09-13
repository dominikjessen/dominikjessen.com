import type { JSX } from "react";
import type { MealType } from "../../types/recipes";

type IconProps = {
  className?: string;
};

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function PlateIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M12.4 2.7 21.3 11.6a1 1 0 0 1 0 1.4l-8.3 8.3a1 1 0 0 1-1.4 0L2.7 12.4a1 1 0 0 1-.3-.7V3.7a1 1 0 0 1 1-1h7.9a1 1 0 0 1 .7.3Z" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
    </svg>
  );
}

export function DiceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BreakfastIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M17 8a5 5 0 0 0-10 0" />
      <path d="M4 14h16" />
      <path d="M6 14v2a6 6 0 0 0 12 0v-2" />
      <path d="M12 4v1" />
    </svg>
  );
}

function LunchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.3 17.7-1.4 1.4" />
      <path d="m19.1 4.9-1.4 1.4" />
    </svg>
  );
}

function DinnerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function SnackIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M12 22c5 0 8-3.6 8-8 0-5-4-7.5-8-12-4 4.5-8 7-8 12 0 4.4 3 8 8 8Z" />
    </svg>
  );
}

function DessertIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M20 21H4" />
      <path d="M5 21V11a7 7 0 0 1 14 0v10" />
      <path d="M8 7c0-1.5 1.3-3 4-3s4 1.5 4 3" />
      <path d="M8 11h8" />
    </svg>
  );
}

function DrinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="m8 2 1.5 7h5L16 2" />
      <path d="M9.5 9 8 22h8l-1.5-13" />
      <path d="M7 2h10" />
    </svg>
  );
}

const MEAL_TYPE_ICONS: Record<MealType, (props: IconProps) => JSX.Element> = {
  breakfast: BreakfastIcon,
  lunch: LunchIcon,
  dinner: DinnerIcon,
  snack: SnackIcon,
  dessert: DessertIcon,
  drink: DrinkIcon,
};

export function MealTypeIcon({ mealType, className }: IconProps & { mealType: MealType }) {
  const Icon = MEAL_TYPE_ICONS[mealType];
  return <Icon className={className} />;
}

function PastaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M4 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M4 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M4 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  );
}

function AsianIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M4 11h16" />
      <path d="M12 11v9" />
      <path d="M8 20h8" />
      <path d="M7 11c0-3 2.2-6 5-6s5 3 5 6" />
      <path d="m16 4 2 2" />
      <path d="m18 3 1 2" />
    </svg>
  );
}

function ComfortIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M4 11h16v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5Z" />
      <path d="M6 11V8a6 6 0 0 1 12 0v3" />
      <path d="M8 19v2" />
      <path d="M16 19v2" />
    </svg>
  );
}

function BakingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M7 21h10" />
      <path d="M12 3v3" />
      <path d="M6.5 8.5 12 21l5.5-12.5A4 4 0 0 0 12 6a4 4 0 0 0-5.5 2.5Z" />
    </svg>
  );
}

function SaladIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M7 21h10" />
      <path d="M12 15v6" />
      <path d="M12 15c4 0 7-2.7 7-6a4 4 0 0 0-4-4 4.5 4.5 0 0 0-7.6-1.4A3.5 3.5 0 0 0 5 9c0 3.3 3 6 7 6Z" />
    </svg>
  );
}

function SoupIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M4 12h16a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6Z" />
      <path d="M9 7c.5 1 .5 2 0 3" />
      <path d="M12 6c.5 1 .5 2 0 3" />
      <path d="M15 7c.5 1 .5 2 0 3" />
    </svg>
  );
}

function GrillIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M4 17h16" />
      <path d="M6 17V9" />
      <path d="M10 17V9" />
      <path d="M14 17V9" />
      <path d="M18 17V9" />
      <path d="M5 9h14" />
      <path d="M8 5c1 1 1 2 0 3" />
      <path d="M12 4c1 1 1 2 0 3" />
      <path d="M16 5c1 1 1 2 0 3" />
    </svg>
  );
}

function BrunchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v2" />
      <path d="M4 14h2" />
      <path d="M18 14h2" />
      <path d="M7 21h10" />
      <path d="M12 17v4" />
    </svg>
  );
}

function VegetarianIcon({ className }: IconProps) {
  return <LeafIcon className={className} />;
}

function VeganIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M7 20h10" />
      <path d="M12 20V10" />
      <path d="M12 10c3.5 0 6-2 7-5-4 0-7 2-7 5Z" />
      <path d="M12 10c-3.5 0-6-2-7-5 4 0 7 2 7 5Z" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  pasta: PastaIcon,
  asian: AsianIcon,
  comfort: ComfortIcon,
  baking: BakingIcon,
  salad: SaladIcon,
  soup: SoupIcon,
  grill: GrillIcon,
  brunch: BrunchIcon,
  vegetarian: VegetarianIcon,
  vegan: VeganIcon,
};

export function CategoryIcon({ category, className }: IconProps & { category: string }) {
  const Icon = CATEGORY_ICONS[category] ?? TagIcon;
  return <Icon className={className} />;
}
