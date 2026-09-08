import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReactRecipeCard from "../components/menu/ReactRecipeCard";
import {
  EMPTY_MENU_FILTERS,
  hasActiveMenuFilters,
  parseMenuFiltersFromSearch,
  syncMenuFiltersToUrl,
  type MenuFilters,
} from "../components/menu/menuFilters";
import {
  CategoryIcon,
  CloseIcon,
  LeafIcon,
  MealTypeIcon,
  PlateIcon,
  SearchIcon,
  TagIcon,
} from "../components/menu/MenuIcons";
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
  icon,
  pressed,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm md:text-base rounded-full border transition duration-150 ease-out ${
        pressed
          ? "bg-primary text-background border-primary shadow-sm"
          : "bg-foreground-surface/80 text-foreground-soft border-foreground-border hover:border-primary/40 hover:bg-foreground-surface"
      }`}
    >
      <span className="shrink-0 opacity-90">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function FilterSection({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-foreground-subtle">
        <span className="shrink-0">{icon}</span>
        <p className="font-signika text-sm uppercase tracking-[0.16em]">{label}</p>
      </div>
      {children}
    </div>
  );
}

export default function MenuBrowse({ recipes }: MenuBrowseProps) {
  const [filters, setFilters] = useState<MenuFilters>(EMPTY_MENU_FILTERS);
  const [urlReady, setUrlReady] = useState(false);

  useEffect(() => {
    setFilters(parseMenuFiltersFromSearch(window.location.search));
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    syncMenuFiltersToUrl(filters);
  }, [filters, urlReady]);

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
    const query = filters.ingredientQuery.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const matchesMealType =
        filters.mealTypes.length === 0 || filters.mealTypes.includes(recipe.mealType);
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.some((category) => recipe.categories.includes(category));
      const matchesIngredient =
        query.length === 0 ||
        recipe.ingredientNames.some((name) => name.toLowerCase().includes(query));

      return matchesMealType && matchesCategory && matchesIngredient;
    });
  }, [recipes, filters]);

  const hasActiveFilters = hasActiveMenuFilters(filters);
  const hasIngredientQuery = filters.ingredientQuery.trim().length > 0;

  function clearFilters(): void {
    setFilters(EMPTY_MENU_FILTERS);
  }

  function setMealTypes(mealTypes: readonly MealType[]): void {
    setFilters((current) => ({ ...current, mealTypes }));
  }

  function setCategories(categories: readonly string[]): void {
    setFilters((current) => ({ ...current, categories }));
  }

  function setIngredientQuery(ingredientQuery: string): void {
    setFilters((current) => ({ ...current, ingredientQuery }));
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-6 sticky top-4 z-20 rounded-3xl border border-foreground-border bg-background/95 backdrop-blur-md px-5 py-5 md:px-7 md:py-6 shadow-[0_1px_0_hsl(var(--foreground-border))]">
        <FilterSection
          icon={<LeafIcon className="size-4" />}
          label="Ingredients"
        >
          <div className="relative w-full">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground-subtle" />
            <input
              id="menu-ingredient-search"
              type="search"
              value={filters.ingredientQuery}
              onChange={(event) => setIngredientQuery(event.target.value)}
              placeholder="Search garlic, lemon, gochujang…"
              className="w-full rounded-full border border-foreground-border bg-foreground-surface pl-12 pr-12 py-3 text-base text-foreground-soft placeholder:text-foreground-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-search-cancel-button]:hidden"
            />
            {hasIngredientQuery && (
              <button
                type="button"
                onClick={() => setIngredientQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-foreground-subtle hover:bg-foreground-surface-strong hover:text-foreground-soft"
                aria-label="Clear ingredient search"
              >
                <CloseIcon className="size-4" />
              </button>
            )}
          </div>
        </FilterSection>

        <div className="h-px w-full bg-foreground-border/80" aria-hidden />

        <FilterSection icon={<PlateIcon className="size-4" />} label="Meal type">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by meal type">
            {availableMealTypes.map((mealType) => (
              <FilterPill
                key={mealType}
                label={MEAL_TYPE_LABELS[mealType]}
                icon={<MealTypeIcon mealType={mealType} className="size-4" />}
                pressed={filters.mealTypes.includes(mealType)}
                onClick={() => setMealTypes(toggleValue(filters.mealTypes, mealType))}
              />
            ))}
          </div>
        </FilterSection>

        {availableCategories.length > 0 && (
          <FilterSection icon={<TagIcon className="size-4" />} label="Category">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {availableCategories.map((category) => (
                <FilterPill
                  key={category}
                  label={formatRecipeLabel(category)}
                  icon={<CategoryIcon category={category} className="size-4" />}
                  pressed={filters.categories.includes(category)}
                  onClick={() => setCategories(toggleValue(filters.categories, category))}
                />
              ))}
            </div>
          </FilterSection>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground-border/80 pt-4">
          <p
            className="inline-flex items-center gap-2 text-base md:text-lg text-foreground-subtle"
            aria-live="polite"
          >
            <PlateIcon className="size-4 shrink-0" />
            <span>
              {filteredRecipes.length}{" "}
              {filteredRecipes.length === 1 ? "dish" : "dishes"}
              {hasActiveFilters ? " match" : " on the board"}
            </span>
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-full border border-foreground-border px-3.5 py-1.5 font-signika text-sm text-primary hover:bg-foreground-surface dark:text-foreground-soft"
            >
              <CloseIcon className="size-3.5" />
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
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <SearchIcon className="size-8 text-foreground-subtle" />
          <p className="text-lg md:text-xl text-foreground-subtle max-w-md">
            Nothing matches those filters. Clear them and try again.
          </p>
        </div>
      )}
    </div>
  );
}
