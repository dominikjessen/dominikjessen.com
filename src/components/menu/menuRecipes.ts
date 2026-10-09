import { getCollection, type CollectionEntry } from "astro:content";
import { MEAL_TYPES } from "../../types/recipes";

/**
 * Published recipes in menu order: by course, then title.
 * Shared by the index and recipe pages so "Next up" follows the menu as printed.
 */
export async function getMenuRecipes(): Promise<CollectionEntry<"recipes">[]> {
  const recipes = await getCollection("recipes", ({ data }) => !data.draft);
  return recipes.sort(
    (a, b) =>
      MEAL_TYPES.indexOf(a.data.mealType) - MEAL_TYPES.indexOf(b.data.mealType) ||
      a.data.title.localeCompare(b.data.title)
  );
}
