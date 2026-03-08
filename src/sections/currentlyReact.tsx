import { useState, useEffect } from "react";
import currently from "../data/currently.json";
import type { CurrentlyCategoryKey, CurrentlyItem } from "../types/data";
import ReactCurrentlyCard from "../components/ui/ReactCurrentlyCard";

/** Stable order: all six categories are always shown; one random item per category on load. */
const CURRENTLY_ORDER: CurrentlyCategoryKey[] = [
  "reading",
  "listening",
  "watching",
  "building",
  "thinking",
  "drinking",
];

interface CardData {
  heading: string;
  item: CurrentlyItem;
}

function pickRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export default function CurrentlyReact() {
  const [cardsData, setCardsData] = useState<CardData[]>();

  useEffect(() => {
    const data = CURRENTLY_ORDER.map((key) => {
      const category = currently[key as keyof typeof currently];
      if (!category || !category.items.length) return null;
      const item = pickRandomItem(category.items) as CurrentlyItem;
      return { heading: category.heading, item };
    }).filter((c): c is CardData => c !== null);

    setCardsData(data);
  }, []);

  return (
    <section
      id="currently"
      className="flex flex-col self-center items-center gap-6"
    >
      <h2 className="text-5xl md:text-6xl text-primary text-center">
        Currently
      </h2>
      <p className="text-xl md:text-2xl text-foreground/60 mb-4 md:mb-8 text-center">
        Some of the things I'm enjoying these days and always down to chat
        about!
      </p>
      <div className="w-5/6 md:w-3/5 lg:w-3/5 flex flex-col items-center gap-6">
        {cardsData?.map((data) => (
          <ReactCurrentlyCard
            key={`${data.heading}-${data.item.title}`}
            heading={data.heading}
            item={data.item}
            iconType={data.item.iconType}
            className="scroll-fade-in"
          />
        ))}
      </div>
    </section>
  );
}
