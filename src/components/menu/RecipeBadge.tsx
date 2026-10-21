import { RECIPE_BADGE_LABELS, type RecipeBadge as RecipeBadgeValue } from "../../types/recipes";
import { RecipeBadgeIcon } from "./MenuIcons";

const BADGE_STYLES: Record<RecipeBadgeValue, string> = {
  "chefs-special": "bg-parchment text-parchment-text",
};

export type RecipeBadgeProps = {
  badge: RecipeBadgeValue;
};

export default function RecipeBadge({ badge }: RecipeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-tag px-2 py-0.75 font-mono text-label uppercase ${BADGE_STYLES[badge]}`}
    >
      <RecipeBadgeIcon badge={badge} className="size-3" />
      {RECIPE_BADGE_LABELS[badge]}
    </span>
  );
}
