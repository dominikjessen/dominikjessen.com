import { RECIPE_BADGE_LABELS, type RecipeBadge as RecipeBadgeValue } from "../../types/recipes";
import { RecipeBadgeIcon } from "./MenuIcons";

const BADGE_STYLES: Record<RecipeBadgeValue, string> = {
  "chefs-special": "bg-brass/25 text-foreground-soft dark:bg-brass/15 dark:text-brass",
};

export type RecipeBadgeProps = {
  badge: RecipeBadgeValue;
};

export default function RecipeBadge({ badge }: RecipeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] ${BADGE_STYLES[badge]}`}
    >
      <RecipeBadgeIcon badge={badge} className="size-3" />
      {RECIPE_BADGE_LABELS[badge]}
    </span>
  );
}
