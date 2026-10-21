import type { Company, CompanyIndustryId, CompanySize } from "../../types/data";

export type CompanyWhere = "europe" | "nl";
export type CompanyCustomers = "b2b" | "b2c";

export type CompanyFilters = {
  industry: CompanyIndustryId | null;
  sector: string | null; // slug of Company.sector
  where: CompanyWhere | null; // europe: HQ or office in Europe; nl: HQ in the Netherlands
  remote: boolean;
  customers: CompanyCustomers | null;
  sizes: readonly CompanySize[]; // any of them matches
  query: string;
  showPast: boolean; // include acquired companies
};

export const EMPTY_COMPANY_FILTERS: CompanyFilters = {
  industry: null,
  sector: null,
  where: null,
  remote: false,
  customers: null,
  sizes: [],
  query: "",
  showPast: false,
};

export const COMPANY_SIZES: readonly CompanySize[] = ["startup", "scale-up", "enterprise"];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function matchesCompany(company: Company, filters: CompanyFilters): boolean {
  if (company.status && !filters.showPast) return false;
  if (filters.industry && company.industry !== filters.industry) return false;
  if (filters.sector && slugify(company.sector) !== filters.sector) return false;
  if (filters.where === "europe" && !company.europe) return false;
  if (filters.where === "nl" && company.hq.country !== "NL") return false;
  if (filters.remote && !company.remote) return false;
  if (filters.customers && !company.customers.includes(filters.customers)) return false;
  if (filters.sizes.length > 0 && !filters.sizes.includes(company.size)) return false;

  const query = filters.query.trim().toLowerCase();
  if (query.length === 0) return true;
  return [company.name, company.sector, company.focus, company.hq.city, company.note ?? ""].some((field) =>
    field.toLowerCase().includes(query)
  );
}

export function parseCompanyFiltersFromSearch(
  search: string,
  industries: readonly CompanyIndustryId[]
): CompanyFilters {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const industry = params.get("industry");
  const where = params.get("where");
  const customers = params.get("sells");

  return {
    industry: industries.find((id) => id === industry) ?? null,
    sector: params.get("sector") || null,
    where: where === "europe" || where === "nl" ? where : null,
    remote: params.get("remote") === "1",
    customers: customers === "b2b" || customers === "b2c" ? customers : null,
    sizes: (params.get("size") ?? "")
      .split(",")
      .filter((value): value is CompanySize => (COMPANY_SIZES as readonly string[]).includes(value)),
    query: (params.get("q") ?? "").trim(),
    showPast: params.get("past") === "1",
  };
}

export function hasActiveCompanyFilters(filters: CompanyFilters): boolean {
  return (
    filters.industry !== null ||
    filters.sector !== null ||
    filters.where !== null ||
    filters.remote ||
    filters.customers !== null ||
    filters.sizes.length > 0 ||
    filters.query.trim().length > 0
  );
}

export function syncCompanyFiltersToUrl(filters: CompanyFilters): void {
  const params = new URLSearchParams();
  if (filters.industry) params.set("industry", filters.industry);
  if (filters.sector) params.set("sector", filters.sector);
  if (filters.where) params.set("where", filters.where);
  if (filters.remote) params.set("remote", "1");
  if (filters.customers) params.set("sells", filters.customers);
  if (filters.sizes.length > 0) params.set("size", filters.sizes.join(","));
  if (filters.query.trim().length > 0) params.set("q", filters.query.trim());
  if (filters.showPast) params.set("past", "1");

  const next = params.toString();
  const url = next.length > 0 ? `${window.location.pathname}?${next}` : window.location.pathname;
  if (url === `${window.location.pathname}${window.location.search}`) return;
  window.history.replaceState(window.history.state, "", url);
}
