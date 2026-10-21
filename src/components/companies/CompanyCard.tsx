import type { Company } from "../../types/data";

/** A company as the browse island gets it: the logo already resized by astro:assets. */
export type CompanyListItem = Company & { logoSrc?: string };

export type CompanyCardProps = {
  company: CompanyListItem;
};

const REGION = new Intl.DisplayNames(["en"], { type: "region" });

function location({ city, country }: Company["hq"]): string {
  if (city === "Remote" || !country) return city;
  if (!city) return REGION.of(country) ?? country;
  return `${city}, ${country}`;
}

function Tag({ children, className }: { children: string; className: string }) {
  return <li className={`rounded-tag px-1.5 py-0.5 font-mono text-label lowercase ${className}`}>{children}</li>;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const { name, focus, note, status, url, logoSrc, remote, europe } = company;

  const body = (
    <>
      {/* Logo in a white tile, as CompanyLogo; the initial when there's no logo. */}
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-button border border-charcoal/10 bg-white"
      >
        {logoSrc ? (
          <img src={logoSrc} alt="" width={28} height={28} loading="lazy" draggable={false} className="size-7 object-contain" />
        ) : (
          <span className="font-display text-xl leading-none text-muted">{name.charAt(0).toUpperCase()}</span>
        )}
      </span>
      <div className="flex min-w-0 grow flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-[15px] font-semibold leading-snug text-charcoal">{name}</h4>
          {url && (
            <span
              aria-hidden
              className="shrink-0 font-mono text-xs text-pine opacity-0 transition duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              ↗
            </span>
          )}
        </div>
        <p className="text-xs leading-snug text-muted">{focus}</p>
        {note && <p className="text-xs italic leading-snug text-body">{note}</p>}
        <ul className="mt-1 flex flex-wrap items-center gap-1.5" aria-label="Details">
          <li className="mr-0.5 font-mono text-label text-muted">
            {location(company.hq)}
            {europe === "office" && <span title="Has a European office"> · eu office</span>}
          </li>
          {status && <Tag className="bg-chip text-muted">{status}</Tag>}
          {remote && <Tag className="bg-sage text-pine-deep">remote</Tag>}
        </ul>
      </div>
    </>
  );

  const card = `flex h-full gap-3 rounded-card border border-charcoal/16 bg-white p-3.5 shadow-card-sm ${
    status ? "opacity-65" : ""
  }`;

  return (
    <li>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${card} transition-colors duration-150 hover:border-charcoal/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine`}
        >
          {body}
          <span className="sr-only"> (website, opens in a new tab)</span>
        </a>
      ) : (
        <div className={card}>{body}</div>
      )}
    </li>
  );
}
