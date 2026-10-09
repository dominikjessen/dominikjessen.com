/**
 * Recipe URL ids are opaque 8-char hex strings set in frontmatter (`id`),
 * not derived from the title — so you can have multiple shakshukas.
 * Generate with: `python3 -c "import uuid; print(uuid.uuid4().hex[:8])"`
 */

/** Canonical meal types for the house menu. */
export const MEAL_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
  "drink",
] as const;

export type MealType = (typeof MEAL_TYPES)[number];

/** Shared category vocabulary — keep spellings consistent when authoring. */
export const RECIPE_CATEGORIES = [
  "pasta",
  "asian",
  "comfort",
  "baking",
  "salad",
  "soup",
  "grill",
  "brunch",
  "vegetarian",
  "vegan",
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];

export const RECIPE_TAGS = [
  "vegetarian",
  "vegan",
  "quick",
  "spicy",
  "make-ahead",
  "one-pot",
] as const;

export type RecipeTag = (typeof RECIPE_TAGS)[number];

/** Tags shown as icons on the menu, in display order. */
export const MENU_ICON_TAGS = [
  "vegan",
  "vegetarian",
  "spicy",
  "quick",
] as const satisfies readonly RecipeTag[];

export type MenuIconTag = (typeof MENU_ICON_TAGS)[number];

/** A dish's icon tags in display order. Vegan supersedes vegetarian, like a printed menu. */
export function menuIconTags(tags: readonly string[]): MenuIconTag[] {
  const present = new Set(tags);
  if (present.has("vegan")) present.delete("vegetarian");
  return MENU_ICON_TAGS.filter((tag) => present.has(tag));
}

/** Set-once personality badges shown above a dish on the menu. */
export const RECIPE_BADGES = ["chefs-special"] as const;

export type RecipeBadge = (typeof RECIPE_BADGES)[number];

export const RECIPE_BADGE_LABELS: Record<RecipeBadge, string> = {
  "chefs-special": "Chef's special",
};

/** How much effort a dish takes, in plain words rather than minutes. */
export const RECIPE_EFFORTS = ["weeknight", "lazy-sunday", "showing-off"] as const;

export type RecipeEffort = (typeof RECIPE_EFFORTS)[number];

export const RECIPE_EFFORT_LABELS: Record<RecipeEffort, string> = {
  weeknight: "Weeknight",
  "lazy-sunday": "Lazy Sunday",
  "showing-off": "Showing off",
};

export type RecipeIngredient = {
  readonly name: string;
  readonly amount?: string;
  readonly optional?: boolean;
};

/** Display labels for filters and chips. */
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  dessert: "Dessert",
  drink: "Drink",
};

/** Serializable recipe data for the client menu island. */
export type RecipeListItem = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly mealType: MealType;
  readonly tags: readonly string[];
  readonly badges: readonly RecipeBadge[];
  readonly menuLine: string;
  readonly marginNote?: string;
  readonly ingredientNames: readonly string[];
  readonly timeMinutes?: number;
};

export function formatRecipeLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
