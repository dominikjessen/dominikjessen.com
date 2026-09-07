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
  }),
  schema: ({ image }) =>
    z.object({
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
