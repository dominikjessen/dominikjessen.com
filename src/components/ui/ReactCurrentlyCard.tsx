import type { CurrentlyItem } from "../../types/data";

export interface ReactCurrentlyCardProps {
  item: CurrentlyItem;
  heading: string;
  className?: string;
}

export default function ReactCurrentlyCard({
  item,
  heading,
  className,
}: ReactCurrentlyCardProps) {
  return (
    <div
      className={`${className} flex items-center gap-4 md:gap-6 p-3 md:p-6 rounded-3xl w-full border border-foreground-border bg-surface-card backdrop-blur-xl`}
    >
      <span
        className="text-3xl md:text-4xl leading-none shrink-0"
        role="img"
        aria-hidden
      >
        {item.emoji}
      </span>
      <div className="flex flex-col gap-2 grow">
        <h3 className="text-primary dark:text-foreground-soft uppercase text-sm md:text-base tracking-wide md:tracking-wider">
          {heading}
        </h3>
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm md:text-base font-bold text-primary hover:text-primary-muted dark:text-foreground-soft dark:hover:text-foreground-strong tracking-wide"
          >
            {item.title}
          </a>
        ) : (
          <span className="text-sm md:text-base font-bold text-primary dark:text-foreground-soft tracking-wide">
            {item.title}
          </span>
        )}
      </div>
    </div>
  );
}
