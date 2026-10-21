import { formatRecipeLabel, menuIconTags, type RecipeListItem } from "../../types/recipes";
import { CurlyArrowIcon, RecipeTagIcon } from "./MenuIcons";
import RecipeBadge from "./RecipeBadge";

export type MenuDishRowProps = {
  recipe: RecipeListItem;
  /** Position in the whole menu, for the staggered entrance. */
  index: number;
};

/** Cap the stagger so dishes far down the menu don't wait around to appear. */
const MAX_STAGGER_STEPS = 16;
const STAGGER_MS = 30;

export default function MenuDishRow({ recipe, index }: MenuDishRowProps) {
  const { id, title, timeMinutes, menuLine, tags, badges, marginNote } = recipe;
  const iconTags = menuIconTags(tags);

  return (
    <li
      className="motion-safe:animate-menu-fade-up"
      style={{ animationDelay: `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS}ms` }}
    >
      <a
        href={`/menu/${id}`}
        className="group -mx-3 flex flex-col gap-0.5 rounded-xl px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
      >
        {badges.length > 0 && (
          <div className="mb-1 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <RecipeBadge key={badge} badge={badge} />
            ))}
          </div>
        )}
        {/* Last-baseline so the leader and time sit on a wrapped title's final line, like a printed menu.
            Hover sweeps a parchment marker across the name (the site's highlight) and turns the leader, time and arrow pine. */}
        <div className="flex items-baseline-last gap-3">
          <h3 className="min-w-0 font-display font-normal text-[22px] md:text-2xl text-charcoal leading-tight">
            <span className="-mx-1 rounded-mark px-1 box-decoration-clone bg-[linear-gradient(var(--parchment),var(--parchment))] bg-no-repeat bg-[length:0%_100%] transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_100%] group-focus-visible:bg-[length:100%_100%]">
              {title}
            </span>
            {iconTags.length > 0 && (
              <>
                <span className="ml-2 inline-flex -translate-y-px items-center gap-1 whitespace-nowrap align-middle text-pine">
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
                className="min-w-6 grow -translate-y-1 border-b-2 border-dotted border-charcoal/20 transition-colors duration-150 group-hover:border-pine/50 group-focus-visible:border-pine/50"
              />
              <span className="shrink-0 font-mono text-xs text-muted tabular-nums transition-colors duration-150 group-hover:text-pine group-focus-visible:text-pine">
                {timeMinutes} min
              </span>
            </>
          )}
          {/* Space is always reserved, so nothing shifts when the arrow appears. */}
          <span
            aria-hidden
            className="w-3 shrink-0 font-mono text-xs text-pine opacity-0 -translate-x-1 transition duration-150 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            →
          </span>
        </div>
        {menuLine.length > 0 && (
          <p className="italic text-sm md:text-[15px] text-body leading-snug">{menuLine}</p>
        )}
        {marginNote && (
          <p className="mt-0.5 flex origin-left -rotate-1 items-end gap-1 font-hand text-lg md:text-xl leading-none text-pine">
            <CurlyArrowIcon className="size-4 shrink-0 -translate-y-0.5" />
            {marginNote}
          </p>
        )}
      </a>
    </li>
  );
}
