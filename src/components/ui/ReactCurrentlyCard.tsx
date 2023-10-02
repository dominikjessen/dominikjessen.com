import type { CurrentlyItem } from '../../types/data';
import ReactSVGIcon from './ReactSVGIcon';

export interface ReactCurrentlyCardProps {
  item: CurrentlyItem;
  heading: string;
  iconType: 'text' | 'fill';
  className?: string;
}

export default function ReactCurrentlyCard({ item, heading, iconType, className }: any) {
  return (
    <div className={`${className} flex gap-4 md:gap-6 p-3 md:p-6 rounded-3xl w-full border border-foreground/10 bg-primary/10 backdrop-blur-xl`}>
      <ReactSVGIcon src={item.icon} className={`w-6 md:w-10 ${iconType}-primary`} />
      <div className="flex flex-col gap-2 grow">
        <h3 className="text-primary dark:text-foreground/80 uppercase text-sm md:text-base tracking-wide md:tracking-wider">{heading}</h3>
        <a
          href={item.url}
          target="_blank"
          className="text-sm md:text-base font-bold text-primary hover:text-primary/80 dark:text-foreground/80 dark:hover:text-foreground/90 tracking-wide"
        >
          {item.title}
          {item.by ? ` by ${item.by}` : ''}
        </a>
      </div>
    </div>
  );
}
