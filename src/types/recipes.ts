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

/** Serializable recipe card data for the client browse island. */
export type RecipeListItem = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly mealType: MealType;
  readonly categories: readonly string[];
  readonly ingredientNames: readonly string[];
  readonly timeMinutes?: number;
  readonly heroImageSrc: string;
  readonly heroImageAlt: string;
};

export function formatRecipeLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
