import { MEAL_TYPE_LABELS, type RecipeListItem } from "../../types/recipes";
import { MealTypeIcon, StarIcon } from "./MenuIcons";

export type ChefsPickProps = {
  recipe: RecipeListItem;
};

export default function ChefsPick({ recipe }: ChefsPickProps) {
  const { id, title, summary, mealType, timeMinutes, heroImageSrc, heroImageAlt } = recipe;

  return (
    <a
      href={`/menu/${id}`}
      aria-label={`Chef's pick: ${title}`}
      className="group grid overflow-hidden rounded-3xl border border-foreground-border bg-surface-card transition duration-200 ease-out hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
    >
      <div
        className={`relative overflow-hidden bg-primary-soft ${
          heroImageSrc ? "aspect-[16/9] md:aspect-auto md:min-h-72" : "h-24 md:h-auto md:min-h-64"
        }`}
      >
        {heroImageSrc ? (
          <img
            src={heroImageSrc}
            alt={heroImageAlt ?? ""}
            width={720}
            height={480}
            className="absolute inset-0 h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 flex items-center justify-center">
            <MealTypeIcon mealType={mealType} className="size-12 md:size-20 text-primary/40" />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-3 p-6 md:p-10">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-background px-3 py-1 font-signika text-sm text-primary dark:text-primary-muted">
          <StarIcon className="size-3.5 fill-current text-brass" />
          Chef's pick
        </span>
        <h2 className="font-signika text-3xl md:text-4xl font-bold text-foreground-strong leading-tight">
          {title}
        </h2>
        <p className="text-lg text-foreground-soft leading-relaxed">{summary}</p>
        <p className="text-sm text-foreground-subtle">
          {MEAL_TYPE_LABELS[mealType]}
          {timeMinutes !== undefined && ` · ${timeMinutes} min`}
        </p>
        <span className="mt-1 inline-flex items-center gap-2 font-signika text-lg text-primary dark:text-primary-muted">
          See the recipe
          <span aria-hidden className="transition duration-150 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </a>
  );
}
