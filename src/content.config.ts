import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { MEAL_TYPES, RECIPE_BADGES, RECIPE_EFFORTS } from "./types/recipes";

const ingredientSchema = z.object({
  name: z.string(),
  amount: z.string().optional(),
  optional: z.boolean().optional(),
});

const recipes = defineCollection({
  loader: glob({
    base: "./src/content/recipes",
    pattern: "**/*.md",
    // Opaque short ids so multiple dishes can share a name; filenames stay human-readable.
    generateId: ({ data, entry }) => {
      const id = data.id;
      if (typeof id !== "string" || id.length === 0) {
        throw new Error(`Recipe "${entry}" is missing a required frontmatter id`);
      }
      return id;
    },
  }),
  schema: ({ image }) =>
    z.object({
      /** Stable URL id — 8-char hex (e.g. uuid4().hex[:8]). Not derived from the title. */
      id: z
        .string()
        .regex(/^[0-9a-f]{8}$/, "Use an 8-character lowercase hex id"),
      title: z.string(),
      summary: z.string(),
      mealType: z.enum(MEAL_TYPES),
      categories: z.array(z.string()).default([]),
      ingredients: z.array(ingredientSchema).min(1),
      tags: z.array(z.string()).default([]),
      timeMinutes: z.number().int().positive().optional(),
      servings: z.number().int().positive().optional(),
      /** Italic one-liner under the dish on the menu. Falls back to the first few ingredients. */
      menuLine: z.string().optional(),
      /** Personality badges above the dish on the menu, e.g. "chefs-special". */
      badges: z.array(z.enum(RECIPE_BADGES)).default([]),
      /** Short handwritten scribble on the menu and recipe page, e.g. "ask for seconds". */
      marginNote: z.string().optional(),
      /** Effort in plain words, shown next to the time on the recipe page. */
      effort: z.enum(RECIPE_EFFORTS).optional(),
      /** Drink suggestion, e.g. "a cold lager". */
      pairsWith: z.string().optional(),
      /** Rough count, shown as "Made 30+ times". */
      timesMade: z.number().int().positive().optional(),
      /** Personal note, rendered as a "From Dominik" callout on the recipe page. */
      note: z.string().optional(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { recipes };
