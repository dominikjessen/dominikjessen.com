import {
  ALLERGEN_LABELS,
  MEAL_TYPE_LABELS,
  type RecipeListItem,
} from "../../types/recipes";

export type ReactRecipeCardProps = {
  recipe: RecipeListItem;
};

export default function ReactRecipeCard({ recipe }: ReactRecipeCardProps) {
  const { id, title, summary, mealType, allergens, heroImageSrc, heroImageAlt, timeMinutes } =
    recipe;

  return (
    <article className="group flex flex-col h-full rounded-3xl border border-foreground-border bg-surface-card overflow-hidden transition duration-200 ease-out hover:-translate-y-1 hover:border-primary/30">
      <a
        href={`/menu/${id}`}
        className="flex flex-col h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-primary-soft">
          <img
            src={heroImageSrc}
            alt={heroImageAlt}
            width={720}
            height={480}
            className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-3 grow p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-sm rounded-full bg-foreground-surface text-foreground-soft">
              {MEAL_TYPE_LABELS[mealType]}
            </span>
            {timeMinutes !== undefined && (
              <span className="text-sm text-foreground-subtle">{timeMinutes} min</span>
            )}
          </div>
          <h3 className="font-signika text-2xl md:text-3xl font-bold text-foreground-strong leading-tight">
            {title}
          </h3>
          <p className="text-base md:text-lg text-foreground-soft leading-relaxed grow">
            {summary}
          </p>
          {allergens.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-1" aria-label="Contains allergens">
              {allergens.map((allergen) => (
                <li
                  key={allergen}
                  className="px-3 py-1 text-xs md:text-sm rounded-full border border-foreground-border text-foreground-muted"
                >
                  {ALLERGEN_LABELS[allergen]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </a>
    </article>
  );
}
