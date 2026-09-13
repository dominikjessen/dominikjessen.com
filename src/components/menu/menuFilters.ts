import { MEAL_TYPES, type MealType } from "../../types/recipes";

export type MenuFilters = {
  mealTypes: readonly MealType[];
  query: string;
};

export const EMPTY_MENU_FILTERS: MenuFilters = {
  mealTypes: [],
  query: "",
};

const MEAL_TYPE_SET = new Set<string>(MEAL_TYPES);

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

export function parseMenuFiltersFromSearch(search: string): MenuFilters {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);

  const mealTypes = parseList(params.get("meal")).filter((value): value is MealType =>
    MEAL_TYPE_SET.has(value)
  );
  const query = (params.get("q") ?? "").trim();

  return {
    mealTypes,
    query,
  };
}

export function menuFiltersToSearchParams(filters: MenuFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.mealTypes.length > 0) {
    params.set("meal", filters.mealTypes.join(","));
  }
  if (filters.query.trim().length > 0) {
    params.set("q", filters.query.trim());
  }

  return params;
}

export function hasActiveMenuFilters(filters: MenuFilters): boolean {
  return filters.mealTypes.length > 0 || filters.query.trim().length > 0;
}

export function syncMenuFiltersToUrl(filters: MenuFilters): void {
  const params = menuFiltersToSearchParams(filters);
  const next = params.toString();
  const url = next.length > 0 ? `${window.location.pathname}?${next}` : window.location.pathname;
  const current = `${window.location.pathname}${window.location.search}`;
  if (url === current) return;
  window.history.replaceState(window.history.state, "", url);
}
