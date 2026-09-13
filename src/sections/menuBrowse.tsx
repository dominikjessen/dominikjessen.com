import { useEffect, useMemo, useRef, useState } from "react";
import ChefsPick from "../components/menu/ChefsPick";
import MenuDishRow from "../components/menu/MenuDishRow";
import {
  EMPTY_MENU_FILTERS,
  hasActiveMenuFilters,
  parseMenuFiltersFromSearch,
  syncMenuFiltersToUrl,
  type MenuFilters,
} from "../components/menu/menuFilters";
import { CloseIcon, DiceIcon, SearchIcon } from "../components/menu/MenuIcons";
import {
  MEAL_TYPE_LABELS,
  MEAL_TYPES,
  type MealType,
  type RecipeListItem,
} from "../types/recipes";

export type MenuBrowseProps = {
  recipes: readonly RecipeListItem[];
};

function CoursePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 font-signika text-sm md:text-base whitespace-nowrap transition duration-150 ease-out ${
        active
          ? "bg-primary-soft text-primary ring-1 ring-inset ring-primary/20 dark:text-primary-muted"
          : "text-foreground-soft hover:bg-foreground-surface-strong"
      }`}
    >
      {label}
    </button>
  );
}

export default function MenuBrowse({ recipes }: MenuBrowseProps) {
  const [filters, setFilters] = useState<MenuFilters>(EMPTY_MENU_FILTERS);
  const [urlReady, setUrlReady] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const parsed = parseMenuFiltersFromSearch(window.location.search);
    setFilters(parsed);
    setSearchOpen(parsed.query.length > 0);
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

  const featured = useMemo(() => recipes.find((recipe) => recipe.featured), [recipes]);

  const filteredRecipes = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const matchesMealType =
        filters.mealTypes.length === 0 || filters.mealTypes.includes(recipe.mealType);
      const matchesQuery =
        query.length === 0 ||
        recipe.title.toLowerCase().includes(query) ||
        recipe.ingredientNames.some((name) => name.toLowerCase().includes(query));

      return matchesMealType && matchesQuery;
    });
  }, [recipes, filters]);

  const courses = useMemo(
    () =>
      MEAL_TYPES.map((mealType) => ({
        mealType,
        recipes: filteredRecipes.filter((recipe) => recipe.mealType === mealType),
      })).filter((course) => course.recipes.length > 0),
    [filteredRecipes]
  );

  const hasActiveFilters = hasActiveMenuFilters(filters);

  function setMealType(mealType: MealType | null): void {
    setFilters((current) => ({ ...current, mealTypes: mealType ? [mealType] : [] }));
  }

  function setQuery(query: string): void {
    setFilters((current) => ({ ...current, query }));
  }

  function openSearch(): void {
    setSearchOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  }

  function closeSearch(): void {
    setQuery("");
    setSearchOpen(false);
  }

  function surpriseMe(): void {
    const pool = filteredRecipes.length > 0 ? filteredRecipes : recipes;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) window.location.href = `/menu/${pick.id}`;
  }

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {featured && <ChefsPick recipe={featured} />}

      <div className="flex flex-col gap-6 md:gap-8">
        <div className="sticky top-4 z-20 flex items-center gap-2 rounded-full border border-foreground-border bg-background/95 p-1.5 backdrop-blur-md">
          {searchOpen ? (
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle" />
              <input
                ref={searchRef}
                id="menu-search"
                type="search"
                value={filters.query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeSearch();
                }}
                placeholder="Search dishes or ingredients…"
                aria-label="Search dishes or ingredients"
                className="w-full rounded-full bg-foreground-surface py-2 pl-10 pr-10 text-sm md:text-base text-foreground-soft placeholder:text-foreground-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-foreground-subtle hover:bg-foreground-surface-strong hover:text-foreground-soft"
                aria-label="Close search"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <nav
                aria-label="Courses"
                className="flex min-w-0 flex-1 gap-1 overflow-x-auto pr-6 [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] sm:pr-0 sm:[mask-image:none]"
              >
                <CoursePill
                  label="All"
                  active={filters.mealTypes.length === 0}
                  onClick={() => setMealType(null)}
                />
                {availableMealTypes.map((mealType) => (
                  <CoursePill
                    key={mealType}
                    label={MEAL_TYPE_LABELS[mealType]}
                    active={filters.mealTypes.includes(mealType)}
                    onClick={() => setMealType(mealType)}
                  />
                ))}
              </nav>
              <button
                type="button"
                onClick={openSearch}
                className="shrink-0 rounded-full p-2.5 text-foreground-soft transition duration-150 hover:bg-foreground-surface-strong hover:text-primary"
                aria-label="Search dishes or ingredients"
              >
                <SearchIcon className="size-5" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={surpriseMe}
            aria-label="Surprise me with a random dish"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-foreground-border bg-foreground-surface px-3 py-2 font-signika text-sm md:text-base text-foreground-soft transition duration-150 hover:border-primary/40 hover:text-primary sm:px-4"
          >
            <DiceIcon className="size-4" />
            <span className="hidden sm:inline">Surprise me</span>
          </button>
        </div>

        <div className="flex items-center gap-3 px-1 text-sm text-foreground-subtle" aria-live="polite">
          <span>
            {filteredRecipes.length} {filteredRecipes.length === 1 ? "dish" : "dishes"}
            {hasActiveFilters ? " match" : " on the menu"}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setFilters(EMPTY_MENU_FILTERS);
                setSearchOpen(false);
              }}
              className="inline-flex items-center gap-1 font-signika text-primary hover:text-primary-muted dark:text-foreground-soft"
            >
              <CloseIcon className="size-3.5" />
              Clear
            </button>
          )}
        </div>

        {courses.length > 0 ? (
          <div className="flex max-w-3xl flex-col gap-10 md:gap-12">
            {courses.map(({ mealType, recipes: courseRecipes }) => (
              <section key={mealType} aria-labelledby={`course-${mealType}`}>
                <h2
                  id={`course-${mealType}`}
                  className="mb-2 flex items-center gap-4 font-sans text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-foreground-subtle"
                >
                  {MEAL_TYPE_LABELS[mealType]}
                  <span aria-hidden className="h-px grow bg-foreground-border" />
                </h2>
                <ul className="flex flex-col">
                  {courseRecipes.map((recipe) => (
                    <MenuDishRow key={recipe.id} recipe={recipe} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="flex max-w-3xl flex-col items-center gap-3 py-14 text-center">
            <SearchIcon className="size-8 text-foreground-subtle" />
            <p className="text-lg md:text-xl text-foreground-subtle max-w-md">
              Nothing on the menu matches that. Try another course or ingredient.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
