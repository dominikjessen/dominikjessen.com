import type { JSX } from "react";
import type { MealType, MenuIconTag, RecipeBadge } from "../../types/recipes";

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
      <path d="M12 21v-9" />
      <path d="M12 12c0-4 2.5-7 8-7 0 4.5-3 7-8 7Z" />
      <path d="M12 15c0-3-2-5.5-6.5-5.5 0 3.5 2.5 5.5 6.5 5.5Z" />
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

function ChilliIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M15.5 7c0-2 1-3.5 3-4" />
      <path d="M12.8 8c1.2 1 3.2 1 4.4 0" />
      <path d="M15.5 7c2.5 1 3 4 1 7-2.5 3.5-7.5 6.5-12.5 6.5 4-3 6.5-7.5 8-12 .5-1.5 1.5-2 3.5-1.5Z" />
    </svg>
  );
}

function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

const RECIPE_TAG_ICONS: Record<MenuIconTag, (props: IconProps) => JSX.Element> = {
  vegetarian: VegetarianIcon,
  vegan: VeganIcon,
  spicy: ChilliIcon,
  quick: BoltIcon,
};

export function RecipeTagIcon({ tag, className }: IconProps & { tag: MenuIconTag }) {
  const Icon = RECIPE_TAG_ICONS[tag];
  return <Icon className={className} />;
}

function ChefHatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M6 13.5V20h12v-6.5" />
      <path d="M6 13.5A4 4 0 0 1 7.5 6a4.5 4.5 0 0 1 9 0A4 4 0 0 1 18 13.5Z" />
      <path d="M6 17h12" />
    </svg>
  );
}

const RECIPE_BADGE_ICONS: Record<RecipeBadge, (props: IconProps) => JSX.Element> = {
  "chefs-special": ChefHatIcon,
};

export function RecipeBadgeIcon({ badge, className }: IconProps & { badge: RecipeBadge }) {
  const Icon = RECIPE_BADGE_ICONS[badge];
  return <Icon className={className} />;
}

/** Four strokes and a slash — for "Made 30+ times". */
export function TallyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M6 5v14" />
      <path d="M10 5v14" />
      <path d="M14 5v14" />
      <path d="M18 5v14" />
      <path d="M3.5 16 20.5 8" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <path d="M18 13.8c2.1.8 3.5 2.9 3.5 5.2" />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

/** WhatsApp-style chat bubble with a phone handset, for the "Have chef make you this" link. */
export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M3.5 20.5l1.3-4.6A8.5 8.5 0 1 1 8.2 19.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path
        d="M9.1 7.9c.3-.5.8-.5 1.1-.2l1.1 1.6c.2.3.1.7-.2 1l-.6.4c.5 1.1 1.3 1.9 2.4 2.4l.4-.6c.2-.3.7-.4 1-.2l1.6 1.1c.3.2.3.7-.1 1.1-.6.6-1.5.9-2.3.6-2.2-.8-3.9-2.5-4.7-4.7-.3-.8 0-1.7.3-2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Hand-drawn arrow that points back up at the dish, for margin notes. */
export function CurlyArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...strokeProps}>
      <path d="M20 20c-7 0-12-4-13-11" />
      <path d="m4 11 3-3 3 3" />
    </svg>
  );
}
