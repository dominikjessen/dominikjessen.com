import { useState, useEffect } from "react";

type SVGComponent = React.FC<React.SVGProps<SVGSVGElement>>;

// Vite resolves this at build time — keep it outside the hook
const svgModules = import.meta.glob<{ default: SVGComponent }>(
  "../images/*/*",
  {
    query: "?react",
  },
);

export default function useDynamicSVGImport(name: string) {
  const [SvgIcon, setSvgIcon] = useState<SVGComponent | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(undefined);

    async function getSVG() {
      try {
        const pathSuffix = name.startsWith("/") ? name.slice(1) : name;

        const key = Object.keys(svgModules).find((k) =>
          k.replace(/\\/g, "/").endsWith(pathSuffix),
        );

        if (!key) {
          if (!cancelled) setError(new Error(`No SVG found for: ${name}`));
          return;
        }

        const mod = await svgModules[key]();
        const component = mod.default;

        if (!cancelled) {
          if (typeof component === "function") {
            setSvgIcon(() => component); // wrap to avoid React's functional update form
          } else {
            setError(
              new Error(`SVG module did not export a component: ${name}`),
            );
          }
        }
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getSVG();
    return () => {
      cancelled = true;
    };
  }, [name]);

  return { error, loading, SvgIcon };
}
