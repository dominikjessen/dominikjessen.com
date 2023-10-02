import { useState, useEffect } from 'react';
import currently from '../data/currently.json';
import type { CurrentlyItem } from '../types/data';
import ReactCurrentlyCard from '../components/ui/ReactCurrentlyCard';
type CurrentlyOptions = 'watching' | 'listening' | 'drinking' | 'playing' | 'reading';

interface CardsData {
  heading: string;
  item: CurrentlyItem;
}

export default function CurrentlyReact() {
  const [cardsData, setCardsData] = useState<CardsData[]>();

  useEffect(() => {
    const unshuffled: number[] = [];
    const currentlyKeys = Object.keys(currently);

    // Pick 3 random categories to display
    currentlyKeys.forEach((_, index) => {
      unshuffled.push(index);
    });

    let shuffled = unshuffled
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    const one = currently[currentlyKeys[shuffled[0]] as CurrentlyOptions];
    const itemOne = one.items[Math.floor(Math.random() * one.items.length)] as CurrentlyItem;
    const two = currently[currentlyKeys[shuffled[1]] as CurrentlyOptions];
    const itemTwo = two.items[Math.floor(Math.random() * two.items.length)] as CurrentlyItem;
    const three = currently[currentlyKeys[shuffled[2]] as CurrentlyOptions];
    const itemThree = three.items[Math.floor(Math.random() * three.items.length)] as CurrentlyItem;

    setCardsData([
      {
        heading: one.heading,
        item: itemOne
      },
      {
        heading: two.heading,
        item: itemTwo
      },
      {
        heading: three.heading,
        item: itemThree
      }
    ]);
  }, []);

  return (
    <section id="currently" className="flex flex-col self-center items-center gap-6">
      <h2 className="text-5xl md:text-6xl text-primary text-center">Currently</h2>
      <p className="text-xl md:text-2xl text-foreground/60 mb-4 md:mb-8 text-center">
        Some of the things I'm enjoying these days and always down to chat about!
      </p>
      <div className="w-5/6 md:w-3/5 lg:w-3/5 flex flex-col items-center gap-6">
        {cardsData &&
          cardsData.map((data) => (
            <ReactCurrentlyCard
              key={data.item.title}
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
