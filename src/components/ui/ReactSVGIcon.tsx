import { useEffect } from 'react';
import BookIcon from '../../images/icons/book-open.svg?react';
import useDynamicSVGImport from '../../hooks/useDynamicSVGImport';

export interface ReactSVGIconProps {
  src: string;
  className?: string;
}

export default function ReactSVGIcon({ src, className }: ReactSVGIconProps) {
  const { loading, error, SvgIcon } = useDynamicSVGImport(src);

  return <>{!loading && !error && SvgIcon && <SvgIcon className={className} />}</>;
}
