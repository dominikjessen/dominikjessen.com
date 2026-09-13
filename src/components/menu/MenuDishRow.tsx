import { formatRecipeLabel, type RecipeListItem } from "../../types/recipes";
import { StarIcon } from "./MenuIcons";

export type MenuDishRowProps = {
  recipe: RecipeListItem;
};

export default function MenuDishRow({ recipe }: MenuDishRowProps) {
  const { id, title, timeMinutes, menuLine, tags, featured } = recipe;

  return (
    <li>
      <a
        href={`/menu/${id}`}
        className="group -mx-3 flex flex-col gap-1 rounded-2xl px-3 py-4 transition duration-150 ease-out hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {/* Last-baseline so the leader and time sit on a wrapped title's final line, like a printed menu. */}
        <div className="flex items-baseline-last gap-3">
          <h3 className="min-w-0 font-signika text-xl md:text-2xl font-semibold text-foreground-strong leading-snug transition-colors group-hover:text-primary">
            {title}
            {featured && (
              <>
                <StarIcon className="ml-2 inline size-4 -translate-y-0.5 fill-current text-brass" />
                <span className="sr-only"> (Chef's pick)</span>
              </>
            )}
          </h3>
          {timeMinutes !== undefined && (
            <>
              <span
                aria-hidden
                className="min-w-6 grow -translate-y-1 border-b-2 border-dotted border-foreground-subtle/40"
              />
              <span className="shrink-0 text-sm md:text-base text-foreground-muted tabular-nums">
                {timeMinutes} min
              </span>
            </>
          )}
        </div>
        {menuLine.length > 0 && (
          <p className="italic text-base text-foreground-muted leading-snug">{menuLine}</p>
        )}
        {tags.length > 0 && (
          <p className="font-signika text-sm text-primary dark:text-primary-muted">
            {tags.map(formatRecipeLabel).join(" · ")}
          </p>
        )}
      </a>
    </li>
  );
}
