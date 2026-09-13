import { formatRecipeLabel, menuIconTags, type RecipeListItem } from "../../types/recipes";
import { RecipeTagIcon } from "./MenuIcons";

export type MenuDishRowProps = {
  recipe: RecipeListItem;
};

export default function MenuDishRow({ recipe }: MenuDishRowProps) {
  const { id, title, timeMinutes, menuLine, tags } = recipe;
  const iconTags = menuIconTags(tags);

  return (
    <li>
      <a
        href={`/menu/${id}`}
        className="group -mx-3 flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition duration-150 ease-out hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {/* Last-baseline so the leader and time sit on a wrapped title's final line, like a printed menu. */}
        <div className="flex items-baseline-last gap-3">
          <h3 className="min-w-0 font-signika text-lg md:text-xl font-semibold text-foreground-strong leading-snug transition-colors group-hover:text-primary">
            {title}
            {iconTags.length > 0 && (
              <>
                <span className="ml-2 inline-flex -translate-y-px items-center gap-1 whitespace-nowrap align-middle text-primary dark:text-primary-muted">
                  {iconTags.map((tag) => (
                    <span key={tag} title={formatRecipeLabel(tag)}>
                      <RecipeTagIcon tag={tag} className="size-4" />
                    </span>
                  ))}
                </span>
                <span className="sr-only">: {iconTags.map(formatRecipeLabel).join(", ")}</span>
              </>
            )}
          </h3>
          {timeMinutes !== undefined && (
            <>
              <span
                aria-hidden
                className="min-w-6 grow -translate-y-1 border-b-2 border-dotted border-foreground-subtle/40"
              />
              <span className="shrink-0 text-sm text-foreground-muted tabular-nums">
                {timeMinutes} min
              </span>
            </>
          )}
        </div>
        {menuLine.length > 0 && (
          <p className="italic text-sm md:text-base text-foreground-muted leading-snug">{menuLine}</p>
        )}
      </a>
    </li>
  );
}
