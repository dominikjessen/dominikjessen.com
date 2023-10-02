import { useRef, useState, useEffect } from 'react';

export default function useDynamicSVGImport(name: string) {
  const ImportedIconRef = useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setLoading(true);

    async function getSVG() {
      try {
        const imgSrc = `../images${name}`;
        const images = import.meta.glob<ImageMetadata>('../images/*/*', { as: 'react' });
        ImportedIconRef.current = (await images[imgSrc]()).default;
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    getSVG();
  }, [name]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
}
