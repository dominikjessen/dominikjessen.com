import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChefsChoice from "../components/menu/ChefsChoice";
import CourseDoodle from "../components/menu/CourseDoodle";
import MenuDishRow from "../components/menu/MenuDishRow";
import {
  EMPTY_MENU_FILTERS,
  hasActiveMenuFilters,
  parseMenuFiltersFromSearch,
  syncMenuFiltersToUrl,
  type MenuFilters,
} from "../components/menu/menuFilters";
import { CloseIcon, DiceIcon, RecipeTagIcon, SearchIcon } from "../components/menu/MenuIcons";
import {
  MEAL_TYPE_LABELS,
  MEAL_TYPES,
  MENU_ICON_TAGS,
  formatRecipeLabel,
  menuIconTags,
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
          ? "bg-brass text-ink"
          : "text-ink-foreground/75 hover:bg-ink-foreground/10 hover:text-ink-foreground"
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
  const [choosing, setChoosing] = useState(false);
  const closeChefsChoice = useCallback(() => setChoosing(false), []);

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

  // Only explain the icons that actually appear on the menu.
  const legendTags = useMemo(() => {
    const used = new Set(recipes.flatMap((recipe) => menuIconTags(recipe.tags)));
    return MENU_ICON_TAGS.filter((tag) => used.has(tag));
  }, [recipes]);

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

  // Each course also knows where its rows start, so the entrance stagger runs across the whole menu.
  const courses = useMemo(() => {
    let startIndex = 0;
    return MEAL_TYPES.map((mealType) => ({
      mealType,
      recipes: filteredRecipes.filter((recipe) => recipe.mealType === mealType),
    }))
      .filter((course) => course.recipes.length > 0)
      .map((course) => {
        const withStart = { ...course, startIndex };
        startIndex += course.recipes.length;
        return withStart;
      });
  }, [filteredRecipes]);

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

  // The chef picks from whatever is on screen, or the whole menu if the filters match nothing.
  const surprisePool = filteredRecipes.length > 0 ? filteredRecipes : recipes;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {choosing && surprisePool.length > 0 && (
        <ChefsChoice pool={surprisePool} onClose={closeChefsChoice} />
      )}

      {/* Bottle-green bar: the page's colour anchor, with brass for the active course. */}
      <div className="flex items-center gap-2 rounded-full bg-ink p-1.5 shadow-lg shadow-ink/25">
        {searchOpen ? (
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-foreground/60" />
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
              className="w-full rounded-full bg-ink-foreground/10 py-2 pl-10 pr-10 text-sm md:text-base text-ink-foreground placeholder:text-ink-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-foreground/60 hover:bg-ink-foreground/10 hover:text-ink-foreground"
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
              className="shrink-0 rounded-full p-2.5 text-ink-foreground/75 transition duration-150 hover:bg-ink-foreground/10 hover:text-ink-foreground"
              aria-label="Search dishes or ingredients"
            >
              <SearchIcon className="size-5" />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setChoosing(true)}
          aria-label="Surprise me with a random dish"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-foreground/10 px-3 py-2 font-signika text-sm md:text-base text-ink-foreground transition duration-150 hover:bg-brass hover:text-ink sm:px-4"
        >
          <DiceIcon className="size-4 transition-transform duration-300 ease-out group-hover:rotate-90" />
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
        <>
          {/* Two columns on wide screens, filled top-to-bottom like a folded menu; courses never split.
              A single course stays one column so it doesn't sit lopsided on the left. */}
          <div
            className={`max-w-3xl ${courses.length > 1 ? "lg:max-w-none lg:columns-2 lg:gap-x-16" : ""}`}
          >
            {courses.map(({ mealType, recipes: courseRecipes, startIndex }, courseIndex) => (
              <section
                key={mealType}
                aria-labelledby={`course-${mealType}`}
                className="mb-8 break-inside-avoid md:mb-10"
              >
                <h2
                  id={`course-${mealType}`}
                  className="mb-2 flex items-center gap-3 font-sans text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-foreground-subtle"
                >
                  {/* Alternate the tilt so the doodles look drawn, not stamped. */}
                  <CourseDoodle
                    mealType={mealType}
                    className={`size-7 shrink-0 text-primary dark:text-primary-muted ${
                      courseIndex % 2 === 0 ? "-rotate-6" : "rotate-6"
                    }`}
                  />
                  {MEAL_TYPE_LABELS[mealType]}
                  <span aria-hidden className="menu-squiggle ml-1 h-2 grow text-foreground-subtle/35" />
                </h2>
                <ul className="flex flex-col">
                  {courseRecipes.map((recipe, i) => (
                    <MenuDishRow key={recipe.id} recipe={recipe} index={startIndex + i} />
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {legendTags.length > 0 && (
            <ul
              aria-label="Key"
              className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2 border-t border-foreground-border pt-5 text-sm text-foreground-subtle lg:max-w-none"
            >
              {legendTags.map((tag) => (
                <li key={tag} className="inline-flex items-center gap-1.5">
                  <RecipeTagIcon tag={tag} className="size-4 text-primary dark:text-primary-muted" />
                  {formatRecipeLabel(tag)}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="flex max-w-3xl flex-col items-center gap-3 py-14 text-center">
          <SearchIcon className="size-8 text-foreground-subtle" />
          <p className="text-lg md:text-xl text-foreground-subtle max-w-md">
            Nothing on the menu matches that. Try another course or ingredient.
          </p>
        </div>
      )}
    </div>
  );
}
