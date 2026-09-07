import { useMemo, useState } from "react";
import ReactRecipeCard from "../components/menu/ReactRecipeCard";
import {
  MEAL_TYPE_LABELS,
  MEAL_TYPES,
  formatRecipeLabel,
  type MealType,
  type RecipeListItem,
} from "../types/recipes";

export type MenuBrowseProps = {
  recipes: readonly RecipeListItem[];
};

function toggleValue<T extends string>(selected: readonly T[], value: T): T[] {
  return selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
}

function FilterPill({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`px-4 py-2 text-sm md:text-base rounded-full border transition duration-150 ease-out ${
        pressed
          ? "bg-primary text-background border-primary"
          : "bg-foreground-surface text-foreground-soft border-foreground-border hover:border-primary/40"
      }`}
    >
      {label}
    </button>
  );
}

export default function MenuBrowse({ recipes }: MenuBrowseProps) {
  const [mealTypes, setMealTypes] = useState<readonly MealType[]>([]);
  const [categories, setCategories] = useState<readonly string[]>([]);

  const availableMealTypes = useMemo(() => {
    const present = new Set(recipes.map((recipe) => recipe.mealType));
    return MEAL_TYPES.filter((mealType) => present.has(mealType));
  }, [recipes]);

  const availableCategories = useMemo(() => {
    const present = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.categories.forEach((category) => present.add(category));
    });
    return [...present].sort((a, b) => a.localeCompare(b));
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesMealType =
        mealTypes.length === 0 || mealTypes.includes(recipe.mealType);
      const matchesCategory =
        categories.length === 0 ||
        categories.some((category) => recipe.categories.includes(category));
      return matchesMealType && matchesCategory;
    });
  }, [recipes, mealTypes, categories]);

  const hasActiveFilters = mealTypes.length > 0 || categories.length > 0;

  function clearFilters(): void {
    setMealTypes([]);
    setCategories([]);
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-6 sticky top-4 z-20 rounded-3xl border border-foreground-border bg-background/95 backdrop-blur-md px-4 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-3">
          <p className="font-signika text-sm uppercase tracking-wider text-foreground-subtle">
            Meal type
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by meal type">
            {availableMealTypes.map((mealType) => (
              <FilterPill
                key={mealType}
                label={MEAL_TYPE_LABELS[mealType]}
                pressed={mealTypes.includes(mealType)}
                onClick={() => setMealTypes(toggleValue(mealTypes, mealType))}
              />
            ))}
          </div>
        </div>

        {availableCategories.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="font-signika text-sm uppercase tracking-wider text-foreground-subtle">
              Category
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {availableCategories.map((category) => (
                <FilterPill
                  key={category}
                  label={formatRecipeLabel(category)}
                  pressed={categories.includes(category)}
                  onClick={() => setCategories(toggleValue(categories, category))}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-base md:text-lg text-foreground-subtle" aria-live="polite">
            {filteredRecipes.length}{" "}
            {filteredRecipes.length === 1 ? "dish" : "dishes"}
            {hasActiveFilters ? " match" : " on the board"}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-signika text-base text-primary hover:text-primary-muted dark:text-foreground-soft dark:hover:text-foreground-strong"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <section
          aria-label="Recipes"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredRecipes.map((recipe) => (
            <ReactRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      ) : (
        <p className="text-lg md:text-xl text-foreground-subtle py-8">
          Nothing matches those filters. Clear them and try again.
        </p>
      )}
    </div>
  );
}
