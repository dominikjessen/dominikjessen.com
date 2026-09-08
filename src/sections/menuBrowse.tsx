import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  ChevronDownIcon,
  CloseIcon,
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

type DropdownOption = {
  value: string;
  label: string;
  icon: ReactNode;
};

function toggleValue<T extends string>(selected: readonly T[], value: T): T[] {
  return selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
}

function FilterDropdown({
  label,
  icon,
  options,
  selected,
  onToggle,
}: {
  label: string;
  icon: ReactNode;
  options: readonly DropdownOption[];
  selected: readonly string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selectedCount = selected.length;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm md:text-base transition duration-150 ease-out ${
          selectedCount > 0
            ? "border-primary/40 bg-primary-soft text-primary"
            : "border-foreground-border bg-foreground-surface text-foreground-soft hover:border-primary/40"
        }`}
      >
        <span className="shrink-0 opacity-90">{icon}</span>
        <span className="font-signika whitespace-nowrap">
          {label}
          {selectedCount > 0 ? ` · ${selectedCount}` : ""}
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 text-foreground-subtle transition duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 top-full z-30 mt-2 min-w-[15rem] max-h-80 overflow-auto rounded-2xl border border-foreground-border bg-background p-2.5 shadow-lg"
        >
          <div className="flex flex-col gap-1.5">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onToggle(option.value)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm md:text-base transition duration-100 ${
                    isSelected
                      ? "bg-primary-soft text-primary ring-1 ring-inset ring-primary/20"
                      : "text-foreground-soft hover:bg-foreground-surface"
                  }`}
                >
                  <span className="shrink-0 opacity-90">{option.icon}</span>
                  <span className="grow">{option.label}</span>
                  {isSelected && <CloseIcon className="size-3.5 shrink-0 opacity-70" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ActiveFilterChip({
  label,
  icon,
  onDismiss,
}: {
  label: string;
  icon: ReactNode;
  onDismiss: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      className="inline-flex items-center gap-2 rounded-full border border-foreground-border bg-foreground-surface px-3 py-1.5 text-sm text-foreground-soft transition duration-150 hover:border-primary/30 hover:bg-primary-soft hover:text-primary"
      aria-label={`Remove ${label} filter`}
    >
      <span className="shrink-0 opacity-90">{icon}</span>
      <span>{label}</span>
      <CloseIcon className="size-3.5 shrink-0 opacity-70" />
    </button>
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

  const mealTypeOptions = useMemo<DropdownOption[]>(
    () =>
      availableMealTypes.map((mealType) => ({
        value: mealType,
        label: MEAL_TYPE_LABELS[mealType],
        icon: <MealTypeIcon mealType={mealType} className="size-4" />,
      })),
    [availableMealTypes]
  );

  const categoryOptions = useMemo<DropdownOption[]>(
    () =>
      availableCategories.map((category) => ({
        value: category,
        label: formatRecipeLabel(category),
        icon: <CategoryIcon category={category} className="size-4" />,
      })),
    [availableCategories]
  );

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
  const trimmedQuery = filters.ingredientQuery.trim();

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
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="sticky top-4 z-20 flex flex-col gap-3 rounded-2xl border border-foreground-border bg-background/95 backdrop-blur-md px-3 py-3 md:px-4 md:py-3.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <FilterDropdown
              label="Meal type"
              icon={<PlateIcon className="size-4" />}
              options={mealTypeOptions}
              selected={filters.mealTypes}
              onToggle={(value) =>
                setMealTypes(toggleValue(filters.mealTypes, value as MealType))
              }
            />
            {categoryOptions.length > 0 && (
              <FilterDropdown
                label="Category"
                icon={<TagIcon className="size-4" />}
                options={categoryOptions}
                selected={filters.categories}
                onToggle={(value) => setCategories(toggleValue(filters.categories, value))}
              />
            )}
          </div>

          <div className="relative min-w-0 flex-1 md:max-w-sm md:ml-auto">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle" />
            <input
              id="menu-ingredient-search"
              type="search"
              value={filters.ingredientQuery}
              onChange={(event) => setIngredientQuery(event.target.value)}
              placeholder="Search ingredients…"
              className="w-full rounded-full border border-foreground-border bg-foreground-surface pl-10 pr-10 py-2 text-sm md:text-base text-foreground-soft placeholder:text-foreground-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-search-cancel-button]:hidden"
            />
            {trimmedQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setIngredientQuery("")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-foreground-subtle hover:bg-foreground-surface-strong hover:text-foreground-soft"
                aria-label="Clear ingredient search"
              >
                <CloseIcon className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasActiveFilters ? (
            <>
              {filters.mealTypes.map((mealType) => (
                <ActiveFilterChip
                  key={`meal-${mealType}`}
                  label={MEAL_TYPE_LABELS[mealType]}
                  icon={<MealTypeIcon mealType={mealType} className="size-3.5" />}
                  onDismiss={() =>
                    setMealTypes(filters.mealTypes.filter((value) => value !== mealType))
                  }
                />
              ))}
              {filters.categories.map((category) => (
                <ActiveFilterChip
                  key={`category-${category}`}
                  label={formatRecipeLabel(category)}
                  icon={<CategoryIcon category={category} className="size-3.5" />}
                  onDismiss={() =>
                    setCategories(filters.categories.filter((value) => value !== category))
                  }
                />
              ))}
              {trimmedQuery.length > 0 && (
                <ActiveFilterChip
                  label={`“${trimmedQuery}”`}
                  icon={<SearchIcon className="size-3.5" />}
                  onDismiss={() => setIngredientQuery("")}
                />
              )}
              <span className="text-sm text-foreground-subtle ml-1" aria-live="polite">
                {filteredRecipes.length}{" "}
                {filteredRecipes.length === 1 ? "dish" : "dishes"}
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto inline-flex items-center gap-1.5 text-sm font-signika text-primary hover:text-primary-muted dark:text-foreground-soft"
              >
                <CloseIcon className="size-3.5" />
                Clear
              </button>
            </>
          ) : (
            <p className="text-sm text-foreground-subtle" aria-live="polite">
              {filteredRecipes.length}{" "}
              {filteredRecipes.length === 1 ? "dish" : "dishes"} on the board
            </p>
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
