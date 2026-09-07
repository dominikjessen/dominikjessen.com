import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { ALLERGENS, MEAL_TYPES } from "./types/recipes";

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
      allergens: z.array(z.enum(ALLERGENS)).default([]),
      tags: z.array(z.string()).default([]),
      timeMinutes: z.number().int().positive().optional(),
      servings: z.number().int().positive().optional(),
      heroImage: image(),
      heroImageAlt: z.string(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { recipes };
