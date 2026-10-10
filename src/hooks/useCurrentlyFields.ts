import { useCallback, useEffect, useState } from "react";
import currently from "../data/currently.json";
import type { CurrentlyCategoryKey, CurrentlyItem } from "../types/data";

/** Stable order: all six categories are always shown; one item per category. */
export const CURRENTLY_ORDER: CurrentlyCategoryKey[] = [
  "reading",
  "listening",
  "watching",
  "building",
  "thinking",
  "drinking",
];

export interface CurrentlyField {
  category: CurrentlyCategoryKey;
  key: string; // the heading in snake_case, e.g. "vibing_to"
  item: CurrentlyItem;
}

type Pick = (items: CurrentlyItem[], current?: CurrentlyItem) => CurrentlyItem;

const first: Pick = (items) => items[0];

/** A random item, avoiding the one already shown when there's a choice. */
const random: Pick = (items, current) => {
  const pool = items.length > 1 && current ? items.filter((i) => i.title !== current.title) : items;
  return pool[Math.floor(Math.random() * pool.length)];
};

function pickFields(pick: Pick, previous?: CurrentlyField[]): CurrentlyField[] {
  return CURRENTLY_ORDER.map((category) => {
    const data = currently[category as keyof typeof currently];
    if (!data || !data.items.length) return null;
    const current = previous?.find((f) => f.category === category)?.item;
    return {
      category,
      key: data.heading.toLowerCase().replace(/\s+/g, "_"),
      item: pick(data.items as CurrentlyItem[], current),
    };
  }).filter((f): f is CurrentlyField => f !== null);
}

/**
 * One field per "Currently" category. The server render shows each category's first item so nothing
 * paints empty; after hydration every field gets a random item. `shuffle` re-rolls them.
 */
export function useCurrentlyFields() {
  const [fields, setFields] = useState<CurrentlyField[]>(() => pickFields(first));
  const [round, setRound] = useState(0);

  useEffect(() => {
    setFields(pickFields(random));
  }, []);

  const shuffle = useCallback(() => {
    setFields((prev) => pickFields(random, prev));
    setRound((r) => r + 1);
  }, []);

  return { fields, shuffle, round };
}
