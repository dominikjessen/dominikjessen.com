import type { Achievement } from "../types/data";

interface AchievementCardProps {
  achievement: Achievement;
  tiltStyle?: React.CSSProperties;
  isExiting?: boolean;
  stackClass?: "active" | "behind-1" | "behind-2" | "behind-3";
  onExitEnd?: () => void;
  asButton?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function AchievementCard({
  achievement,
  tiltStyle,
  isExiting = false,
  stackClass,
  onExitEnd,
  asButton = false,
  onClick,
  className = "",
}: AchievementCardProps) {
  const {
    emoji,
    company,
    year,
    metric,
    description,
    bgColor,
    isCta,
    tagLabel,
    ctaLabel,
    ctaUrl,
  } = achievement;

  const badgeLabel =
    tagLabel ??
    (company && year !== "" && year !== undefined
      ? `${company} · ${year}`
      : company || null);

  const isCtaCard = Boolean(isCta && ctaUrl);

  const cardTop = (
    <div className="flex items-start justify-between gap-3 text-left">
      <span
        className={`text-4xl lg:text-5xl leading-none shrink-0 ${isCtaCard ? "achievement-emoji-spin" : ""}`}
        role="img"
        aria-hidden
      >
        {emoji}
      </span>
      {badgeLabel && (
        <span
          className={
            isCtaCard
              ? "text-xs uppercase tracking-widest font-semibold text-white/65 bg-white/15 px-2.5 py-1 rounded-2xl backdrop-blur-sm whitespace-nowrap"
              : "text-xs uppercase tracking-widest font-semibold text-foreground/70 bg-white/55 dark:bg-foreground/15 px-2.5 py-1 rounded-2xl backdrop-blur-sm whitespace-nowrap"
          }
        >
          {badgeLabel}
        </span>
      )}
    </div>
  );

  const cardBody = (
    <div className="flex flex-1 flex-col justify-end gap-1 text-left">
      <p
        className={
          isCtaCard
            ? "font-signika italic font-bold text-2xl lg:text-3xl text-white leading-tight whitespace-pre-line"
            : "font-signika italic font-bold text-3xl lg:text-4xl text-foreground leading-tight whitespace-pre-line"
        }
      >
        {metric}
      </p>
      <p
        className={
          isCtaCard
            ? "text-sm lg:text-base font-medium text-white/72 leading-snug max-w-50 lg:max-w-achievement-desc"
            : "text-sm lg:text-base font-medium text-foreground/70 dark:text-foreground_lighter/90 leading-snug max-w-full lg:max-w-achievement-desc"
        }
      >
        {description}
      </p>
      {isCtaCard && ctaLabel && ctaUrl && (
        <a
          href={ctaUrl}
          className="mt-2 inline-flex items-center gap-2 bg-accent_seagreen text-foreground font-semibold text-sm py-2.5 px-4.5 rounded-full border-0 no-underline self-start transition-all hover:bg-accent_seagreen/90 hover:-translate-y-0.5 hover:shadow-lg shadow-md"
          aria-label={ctaLabel}
        >
          <svg
            className="size-3 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {ctaLabel}
        </a>
      )}
    </div>
  );

  const content = (
    <>
      {cardTop}
      {cardBody}
    </>
  );

  const baseClass = `absolute inset-0 rounded-3xl p-8 pb-7 lg:p-10 lg:pb-8 flex flex-col select-none will-change-transform border border-white/65 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-left ${bgColor} ${isCtaCard ? "cursor-default" : "cursor-pointer"} ${className}`;

  const stackClassName =
    stackClass === "behind-1"
      ? "achievement-behind-1"
      : stackClass === "behind-2"
        ? "achievement-behind-2"
        : stackClass === "behind-3"
          ? "achievement-behind-3"
          : stackClass === "active"
            ? "achievement-card-active"
            : "";

  const exitClass = isExiting ? "achievement-exit" : "";

  const combinedClass = `${baseClass} ${stackClassName} ${exitClass}`.trim();

  if (isCtaCard) {
    return (
      <div className={combinedClass} style={tiltStyle}>
        {content}
      </div>
    );
  }

  if (asButton) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={combinedClass}
        style={tiltStyle}
        aria-label="Show next achievement"
        onAnimationEnd={isExiting ? onExitEnd : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={combinedClass}
      style={tiltStyle}
      onAnimationEnd={isExiting ? onExitEnd : undefined}
    >
      {content}
    </div>
  );
}
