import { useState, useCallback, useRef } from "react";
import achievementsData from "../data/achievements.json";
import type { Achievement } from "../types/data";
import AchievementCard from "./AchievementCard";

const ACHIEVEMENTS: Achievement[] = achievementsData as Achievement[];

const TILT_Y_DEG = 7;
const TILT_X_DEG = 9;
const TILT_SCALE = 1.025;
const SWIPE_THRESHOLD = 40;

interface AchievementCardsProps {
  className?: string;
}

export default function AchievementCards({
  className = "",
}: AchievementCardsProps) {
  const touchStartXRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [hoverTilt, setHoverTilt] = useState<React.CSSProperties>({});
  const total = ACHIEVEMENTS.length;
  const current = ACHIEVEMENTS[activeIndex];
  const isCta = current?.isCta ?? false;
  const isPreCta = activeIndex === total - 2;
  const animating = exitingIndex !== null;

  const handleCardClick = useCallback(() => {
    if (animating || isCta) return;
    setExitingIndex(activeIndex);
  }, [animating, isCta, activeIndex]);

  const handleExitEnd = useCallback(() => {
    setExitingIndex(null);
    setActiveIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isCta || animating) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      setHoverTilt({
        transform: `perspective(37.5rem) rotateY(${dx * TILT_X_DEG}deg) rotateX(${-dy * TILT_Y_DEG}deg) scale(${TILT_SCALE})`,
      });
    },
    [isCta, animating],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverTilt({});
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStartXRef.current - e.changedTouches[0].clientX;
      if (diff > SWIPE_THRESHOLD && !animating && !isCta) {
        handleCardClick();
      }
    },
    [animating, isCta, handleCardClick],
  );

  const getStackClass = useCallback(
    (index: number): "active" | "behind-1" | "behind-2" | "behind-3" => {
      const offset = (index - activeIndex + total) % total;
      if (offset === 0) return "active";
      if (offset === 1) return "behind-1";
      if (offset === 2) return "behind-2";
      return "behind-3";
    },
    [activeIndex, total],
  );

  const contextLabel = "Things I've shipped...";
  const counterText = isCta ? "" : `${activeIndex + 1} / ${total - 1}`;
  const hintContent = isCta ? (
    <span className="text-primary">✉️ go on, do it</span>
  ) : isPreCta ? (
    <span>👀 one more...</span>
  ) : (
    <>
      <svg
        className="size-3 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      click to flip
    </>
  );

  return (
    <div
      className={`flex flex-col items-center gap-3.5 w-full max-w-(--width-achievement-stack-sm) lg:max-w-(--width-achievement-stack-lg) ${className}`}
    >
      <p className="text-xs tracking-widest uppercase font-semibold text-foreground/60">
        {contextLabel}
      </p>

      <div
        className="relative w-full h-(--height-achievement-stack-sm) lg:h-(--height-achievement-stack-lg)"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {ACHIEVEMENTS.map((achievement, i) => {
          const stackClass = getStackClass(i);
          const isActive = stackClass === "active";
          const isExiting = i === exitingIndex;
          const tiltStyle = isActive && !isExiting ? hoverTilt : undefined;

          return (
            <AchievementCard
              key={`${achievement.metric}-${achievement.company}-${i}`}
              achievement={achievement}
              tiltStyle={tiltStyle}
              isExiting={isExiting}
              stackClass={stackClass}
              onExitEnd={isExiting ? handleExitEnd : undefined}
              asButton={isActive && !achievement.isCta}
              onClick={handleCardClick}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between w-full min-h-5 mt-5">
        {counterText ? (
          <span
            className="text-xs tracking-wider font-semibold text-foreground/60"
            aria-live="polite"
          >
            {counterText}
          </span>
        ) : (
          <span aria-hidden />
        )}
        <span className="text-xs text-foreground/60 flex items-center gap-1.5 ml-auto">
          {hintContent}
        </span>
      </div>
    </div>
  );
}
