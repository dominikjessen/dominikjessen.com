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

/** Author-declared allergens (not inferred from ingredients). */
export const ALLERGENS = [
  "gluten",
  "dairy",
  "eggs",
  "nuts",
  "shellfish",
  "soy",
  "sesame",
  "fish",
] as const;

export type Allergen = (typeof ALLERGENS)[number];

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

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: "Gluten",
  dairy: "Dairy",
  eggs: "Eggs",
  nuts: "Nuts",
  shellfish: "Shellfish",
  soy: "Soy",
  sesame: "Sesame",
  fish: "Fish",
};
