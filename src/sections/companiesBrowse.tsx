import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import CompanyCard, { type CompanyListItem } from "../components/companies/CompanyCard";
import {
  COMPANY_SIZES,
  EMPTY_COMPANY_FILTERS,
  hasActiveCompanyFilters,
  matchesCompany,
  parseCompanyFiltersFromSearch,
  slugify,
  syncCompanyFiltersToUrl,
  type CompanyFilters,
} from "../components/companies/companyFilters";
import { CloseIcon, SearchIcon } from "../components/menu/MenuIcons";
import type { CompanyIndustry, CompanyIndustryId } from "../types/data";

export type CompaniesBrowseProps = {
  industries: readonly CompanyIndustry[];
  companies: readonly CompanyListItem[];
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2";

function IndustryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 font-mono text-ui lowercase whitespace-nowrap transition duration-150 ease-out focus-visible:outline-oat ${focusRing} ${
        active ? "bg-oat text-charcoal" : "text-canvas/75 hover:bg-canvas/10 hover:text-canvas"
      }`}
    >
      {label}
    </button>
  );
}

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-ui lowercase whitespace-nowrap transition duration-150 focus-visible:outline-pine ${focusRing} ${
        active
          ? "border-pine bg-pine text-canvas"
          : "border-charcoal/16 bg-white text-charcoal hover:border-charcoal/30"
      }`}
    >
      {label}
      {count !== undefined && <span className={active ? "text-canvas/70" : "text-muted"}>{count}</span>}
    </button>
  );
}

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, "en", { sensitivity: "base" });

/** A small mono label in front of a group of chips. */
function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="mr-0.5 font-mono text-label text-muted">{label}</span>
      {children}
    </div>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M3.5 6h13M6 10h8M8.5 14h3" />
    </svg>
  );
}

export default function CompaniesBrowse({ industries, companies }: CompaniesBrowseProps) {
  const [filters, setFilters] = useState<CompanyFilters>(EMPTY_COMPANY_FILTERS);
  const [urlReady, setUrlReady] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  // Mobile only: the tag filters fold into a panel under the sticky bar.
  const [filtersOpen, setFiltersOpen] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsed = parseCompanyFiltersFromSearch(
      window.location.search,
      industries.map((industry) => industry.id)
    );
    setFilters(parsed);
    setSearchOpen(parsed.query.length > 0);
    setUrlReady(true);
  }, [industries]);

  useEffect(() => {
    if (!urlReady) return;
    syncCompanyFiltersToUrl(filters);
  }, [filters, urlReady]);

  // When the bar is stuck and the filters change, jump back to the first result instead of leaving the
  // visitor somewhere in the middle of a shorter list.
  useEffect(() => {
    const results = resultsRef.current;
    const bar = stickyRef.current;
    if (!results || !bar) return;
    const gap = results.getBoundingClientRect().top - bar.getBoundingClientRect().bottom;
    if (gap < 0) window.scrollTo({ top: window.scrollY + gap - 16 });
  }, [filters]);

  const filtered = useMemo(
    () => companies.filter((company) => matchesCompany(company, filters)).sort(byName),
    [companies, filters]
  );

  // Industry → sector → companies, in the directory's industry order and alphabetical sectors.
  const groups = useMemo(
    () =>
      industries
        .map((industry) => {
          const inIndustry = filtered.filter((company) => company.industry === industry.id);
          const sectors = [...new Set(inIndustry.map((company) => company.sector))]
            .sort((a, b) => a.localeCompare(b))
            .map((sector) => ({
              sector,
              companies: inIndustry.filter((company) => company.sector === sector),
            }));
          return { industry, count: inIndustry.length, sectors };
        })
        .filter((group) => group.count > 0),
    [industries, filtered]
  );

  // Sector chips for the chosen industry, counted with every filter except the sector itself.
  const sectorChips = useMemo(() => {
    if (!filters.industry) return [];
    const counts = new Map<string, number>();
    for (const company of companies) {
      if (!matchesCompany(company, { ...filters, sector: null })) continue;
      counts.set(company.sector, (counts.get(company.sector) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [companies, filters]);

  const pastCount = useMemo(
    () =>
      companies.filter((company) => company.status && matchesCompany(company, { ...filters, showPast: true }))
        .length,
    [companies, filters]
  );

  const hasActiveFilters = hasActiveCompanyFilters(filters);

  function setIndustry(industry: CompanyIndustryId | null): void {
    setFilters((current) => ({ ...current, industry, sector: null }));
  }

  function toggleSector(sector: string): void {
    const slug = slugify(sector);
    setFilters((current) => ({ ...current, sector: current.sector === slug ? null : slug }));
  }

  /** Click the active chip again to turn it off. */
  function toggle<K extends "where" | "customers">(key: K, value: NonNullable<CompanyFilters[K]>): void {
    setFilters((current) => ({ ...current, [key]: current[key] === value ? null : value }));
  }

  function toggleSize(size: (typeof COMPANY_SIZES)[number]): void {
    setFilters((current) => ({
      ...current,
      sizes: current.sizes.includes(size) ? current.sizes.filter((s) => s !== size) : [...current.sizes, size],
    }));
  }

  const activeTagCount =
    (filters.where ? 1 : 0) + (filters.remote ? 1 : 0) + (filters.customers ? 1 : 0) + filters.sizes.length;

  const tagFilters = (
    <>
      <ChipGroup label="where">
        <Chip label="europe" active={filters.where === "europe"} onClick={() => toggle("where", "europe")} />
        <Chip label="netherlands" active={filters.where === "nl"} onClick={() => toggle("where", "nl")} />
        <Chip
          label="remote-friendly"
          active={filters.remote}
          onClick={() => setFilters((current) => ({ ...current, remote: !current.remote }))}
        />
      </ChipGroup>
      <ChipGroup label="sells to">
        <Chip label="businesses" active={filters.customers === "b2b"} onClick={() => toggle("customers", "b2b")} />
        <Chip label="consumers" active={filters.customers === "b2c"} onClick={() => toggle("customers", "b2c")} />
      </ChipGroup>
      <ChipGroup label="size">
        {COMPANY_SIZES.map((size) => (
          <Chip key={size} label={size} active={filters.sizes.includes(size)} onClick={() => toggleSize(size)} />
        ))}
      </ChipGroup>
    </>
  );

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

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      {/* Pine bar, as on the menu: industries, or the search field when it's open.
          It sticks just below the fixed nav (68px tall on mobile, 76px from md) while the list scrolls. */}
      <div ref={stickyRef} className="sticky top-19.5 z-40 md:top-22">
        <div className="flex items-center gap-2 rounded-full bg-pine-deep p-1.5 shadow-[0_8px_20px_rgb(34_56_43/0.22)]">
          {searchOpen ? (
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-canvas/60" />
              <input
                ref={searchRef}
                type="search"
                value={filters.query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeSearch();
                }}
                placeholder="Search companies or what they do…"
                aria-label="Search companies or what they do"
                className="w-full rounded-full bg-canvas/10 py-2 pl-10 pr-10 text-sm md:text-base text-canvas placeholder:text-canvas/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oat [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-canvas/60 hover:bg-canvas/10 hover:text-canvas focus-visible:outline-2 focus-visible:outline-oat"
                aria-label="Close search"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <nav
                aria-label="Industries"
                className="flex min-w-0 flex-1 gap-1 overflow-x-auto pr-6 [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)]"
              >
                <IndustryPill label="All" active={filters.industry === null} onClick={() => setIndustry(null)} />
                {industries.map((industry) => (
                  <IndustryPill
                    key={industry.id}
                    label={industry.short}
                    active={filters.industry === industry.id}
                    onClick={() => setIndustry(industry.id)}
                  />
                ))}
              </nav>
              <button
                type="button"
                onClick={openSearch}
                className="shrink-0 rounded-full p-2.5 text-canvas/75 transition duration-150 hover:bg-canvas/10 hover:text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oat"
                aria-label="Search companies or what they do"
              >
                <SearchIcon className="size-5" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls="company-filters-panel"
            aria-label={activeTagCount > 0 ? `Filters, ${activeTagCount} on` : "Filters"}
            className={`relative shrink-0 rounded-full p-2.5 transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oat md:hidden ${
              filtersOpen ? "bg-oat text-charcoal" : "text-canvas/75 hover:bg-canvas/10 hover:text-canvas"
            }`}
          >
            <FilterIcon className="size-5" />
            {activeTagCount > 0 && (
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-oat font-mono text-label leading-none text-charcoal ring-2 ring-pine-deep"
              >
                {activeTagCount}
              </span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <div
            id="company-filters-panel"
            className="mt-2 flex flex-col gap-3 rounded-card border border-charcoal/14 bg-canvas p-4 shadow-card md:hidden"
          >
            {tagFilters}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-1 rounded-button bg-pine px-4 py-2.5 font-mono text-ui text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
            >
              show {filtered.length} {filtered.length === 1 ? "company" : "companies"}
            </button>
          </div>
        )}
      </div>

      {sectorChips.length > 1 && (
        // One scrolling row on mobile, bleeding to the screen edges; wrapped from md.
        <div
          className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
          role="group"
          aria-label="Sectors"
        >
          {sectorChips.map(([sector, count]) => (
            <Chip
              key={sector}
              label={sector}
              count={count}
              active={filters.sector === slugify(sector)}
              onClick={() => toggleSector(sector)}
            />
          ))}
        </div>
      )}

      <div className="hidden flex-wrap items-center gap-x-6 gap-y-3 md:flex">{tagFilters}</div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 px-1 font-mono text-xs text-muted" aria-live="polite">
          <span>
            {filtered.length} {filtered.length === 1 ? "company" : "companies"}
            {hasActiveFilters ? " match" : " in the directory"}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setFilters((current) => ({ ...EMPTY_COMPANY_FILTERS, showPast: current.showPast }));
                setSearchOpen(false);
              }}
              className="inline-flex items-center gap-1 rounded-sm text-pine underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-pine focus-visible:outline-offset-2"
            >
              <CloseIcon className="size-3.5" />
              clear
            </button>
          )}
        </div>
        {(pastCount > 0 || filters.showPast) && (
          <button
            type="button"
            aria-pressed={filters.showPast}
            onClick={() => setFilters((current) => ({ ...current, showPast: !current.showPast }))}
            className="rounded-sm px-1 font-mono text-xs text-muted underline-offset-4 hover:text-pine hover:underline focus-visible:outline-2 focus-visible:outline-pine focus-visible:outline-offset-2"
          >
            {filters.showPast ? "hide acquired" : `+ ${pastCount} acquired`}
          </button>
        )}
      </div>

      {groups.length > 0 ? (
        <div ref={resultsRef} className="mt-4 flex flex-col gap-14 md:gap-18">
          {groups.map(({ industry, count, sectors }) => (
            <section key={industry.id} aria-labelledby={`industry-${industry.id}`} className="flex flex-col gap-6">
              <header className="flex items-baseline justify-between gap-4 border-b border-charcoal/14 pb-3">
                <h2
                  id={`industry-${industry.id}`}
                  className="font-display font-normal text-[34px] leading-none tracking-[-0.015em] md:text-heading text-charcoal"
                >
                  {industry.label}
                </h2>
                <span className="shrink-0 font-mono text-xs text-muted tabular-nums">{count}</span>
              </header>
              {sectors.map(({ sector, companies: sectorCompanies }) => (
                <div key={sector} className="flex flex-col gap-3">
                  {/* A sector heading is noise when it just repeats the industry. */}
                  {sectors.length > 1 && (
                    <h3 className="flex items-center gap-3 font-mono text-xs font-normal lowercase text-muted">
                      {sector}
                      <span aria-hidden className="grow border-t border-dashed border-wire-dash" />
                      <span className="tabular-nums">{sectorCompanies.length}</span>
                    </h3>
                  )}
                  <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sectorCompanies.map((company) => (
                      <CompanyCard key={company.id} company={company} />
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-14 text-center">
          <SearchIcon className="size-8 text-muted" />
          <p className="text-lg md:text-xl text-muted max-w-md">
            No companies match that. Try another industry or search.
          </p>
        </div>
      )}
    </div>
  );
}
