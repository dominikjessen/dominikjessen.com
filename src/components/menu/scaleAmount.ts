/**
 * Scales free-text ingredient amounts ("200 g", "1.5 tbsp", "3 cloves", "half") for a new serving
 * count, rounding to amounts a cook would actually measure. Amounts without a leading quantity
 * ("pinch", "to serve", "handful") are left as they are.
 */

const UNICODE_FRACTIONS: Record<string, number> = {
  '½': 0.5,
  '¼': 0.25,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
};
const WORD_QUANTITIES: Record<string, number> = { half: 0.5, quarter: 0.25 };

const METRIC_UNITS = new Set(['g', 'kg', 'ml', 'l']);
const SPOON_UNITS = new Set(['tsp', 'tbsp', 'cup', 'cups']);

// Fractions first, so "1/2" isn't read as "1" followed by "/2".
const NUMBER = String.raw`\d+\/\d+|\d*[½¼¾⅓⅔]|\d+(?:\.\d+)?(?:\s+\d+\/\d+)?`;
const AMOUNT_PATTERN = new RegExp(`^(${NUMBER})(?:\\s*[-–]\\s*(${NUMBER}))?\\s*(.*)$`);

type ParsedAmount = {
  quantity: number;
  /** Upper bound for ranges like "2–3". */
  quantityTo?: number;
  /** Everything after the number: "g", "cloves", "g tin", or "". */
  rest: string;
};

function parseNumber(text: string): number {
  const value = text.trim();
  const unicode = value.match(/^(\d*)([½¼¾⅓⅔])$/);
  if (unicode) return Number(unicode[1] || 0) + UNICODE_FRACTIONS[unicode[2]];
  const [whole, fraction] = value.includes(' ')
    ? value.split(/\s+/)
    : value.includes('/')
      ? ['0', value]
      : [value, undefined];
  if (!fraction) return Number(whole);
  const [numerator, denominator] = fraction.split('/').map(Number);
  return Number(whole) + numerator / denominator;
}

export function parseAmount(amount: string): ParsedAmount | null {
  const text = amount.trim();
  const word = text.match(/^(half|quarter)\b\s*(.*)$/i);
  if (word) return { quantity: WORD_QUANTITIES[word[1].toLowerCase()], rest: word[2] };

  const match = text.match(AMOUNT_PATTERN);
  if (!match) return null;
  return {
    quantity: parseNumber(match[1]),
    quantityTo: match[2] ? parseNumber(match[2]) : undefined,
    rest: match[3],
  };
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/** Rounds grams/millilitres to what you'd weigh out: 1 under 20, 5 under 200, then 10. */
function roundMetric(value: number): number {
  const step = value < 20 ? 1 : value < 200 ? 5 : 10;
  return Math.max(1, roundTo(value, step));
}

/**
 * Scales a plain metric amount, switching between g/kg and ml/l so it stays readable:
 * "900 g" × 1.5 → "1.4 kg", "1 l" × 0.5 → "500 ml".
 */
function scaleMetric(quantity: number, unit: string, factor: number): string {
  const isMass = unit === 'g' || unit === 'kg';
  const base = quantity * (unit === 'kg' || unit === 'l' ? 1000 : 1) * factor;
  if (base >= 1000) return `${Math.round(base / 100) / 10} ${isMass ? 'kg' : 'l'}`;
  return `${roundMetric(base)} ${isMass ? 'g' : 'ml'}`;
}

/** The number actually shown, so plural/singular decisions match what the reader sees. */
function displayedValue(value: number, unit: string): number {
  if (unit === 'kg' || unit === 'l') return Math.max(0.1, Math.round(value * 10) / 10);
  if (METRIC_UNITS.has(unit)) return roundMetric(value);
  // Spoons measure to a quarter; counts (eggs, cloves, lemons) to a half. Never scale to zero.
  const step = SPOON_UNITS.has(unit) ? 0.25 : 0.5;
  return Math.max(step, roundTo(value, step));
}

function formatValue(value: number, unit: string): string {
  // Metric amounts read as decimals ("1.5 kg"), never fractions.
  if (METRIC_UNITS.has(unit)) return String(value);
  const whole = Math.floor(value);
  const part = value - whole;
  const glyph = part === 0.25 ? '¼' : part === 0.5 ? '½' : part === 0.75 ? '¾' : '';
  if (!glyph) return String(Number.isInteger(value) ? value : Number(value.toFixed(1)));
  return whole === 0 ? glyph : `${whole}${glyph}`;
}

const MEASUREMENT_WORDS = new Set([...METRIC_UNITS, ...SPOON_UNITS]);

/** Pluralises or singularises a count word ("clove" ↔ "cloves", "tomato" ↔ "tomatoes"). */
function matchCount(word: string, from: number, to: number): string {
  // Any letters (so "jalapeño" counts), but not measurement units like "g" or "tbsp".
  if (!/^\p{L}[\p{L}-]*$/u.test(word) || MEASUREMENT_WORDS.has(word.toLowerCase())) return word;

  // Only tomato/potato take "-oes"; most "-o" words just add "s" (jalapeños, avocados).
  if (from <= 1 && to > 1 && !word.endsWith('s')) {
    if (/^(tomato|potato)$/i.test(word) || /(ch|sh|x)$/i.test(word)) return `${word}es`;
    if (/[^aeiou]y$/i.test(word)) return `${word.slice(0, -1)}ies`;
    return `${word}s`;
  }
  if (from > 1 && to <= 1 && word.endsWith('s') && !word.endsWith('ss')) {
    if (/^(tomato|potato)es$/i.test(word) || /(ch|sh|x)es$/i.test(word)) return word.slice(0, -2);
    if (/ies$/i.test(word)) return `${word.slice(0, -3)}y`;
    return word.slice(0, -1);
  }
  return word;
}

/** Scales one amount by `factor`. Returns it unchanged when it has no leading quantity. */
export function scaleAmount(amount: string, factor: number): string {
  if (factor === 1) return amount;
  const parsed = parseAmount(amount);
  if (!parsed) return amount;

  const unit = parsed.rest.split(/\s+/)[0]?.toLowerCase() ?? '';
  // A bare metric amount ("900 g") may switch unit; "400 g tin" keeps its wording as-is.
  if (METRIC_UNITS.has(unit) && parsed.rest.toLowerCase() === unit && parsed.quantityTo === undefined) {
    return scaleMetric(parsed.quantity, unit, factor);
  }

  const to = displayedValue(parsed.quantity * factor, unit);
  let quantity = formatValue(to, unit);
  if (parsed.quantityTo !== undefined) {
    quantity += `–${formatValue(displayedValue(parsed.quantityTo * factor, unit), unit)}`;
  }
  // Only a lone count word follows the number ("cloves"); "g tin" and friends stay put.
  const rest = /\s/.test(parsed.rest) ? parsed.rest : matchCount(parsed.rest, parsed.quantity, to);
  return rest ? `${quantity} ${rest}` : quantity;
}

/** For unitless counts ("eggs" · "4"), keeps the name's plural in step with the scaled number. */
export function scaleIngredientName(name: string, amount: string | undefined, factor: number): string {
  if (!amount || factor === 1) return name;
  const parsed = parseAmount(amount);
  if (!parsed || parsed.rest) return name;

  const to = displayedValue(parsed.quantity * factor, '');
  const words = name.split(' ');
  words[words.length - 1] = matchCount(words[words.length - 1], parsed.quantity, to);
  return words.join(' ');
}

/** Whether an amount changes with servings at all (false for "pinch", "to serve", …). */
export function isScalable(amount: string | undefined): boolean {
  return Boolean(amount && parseAmount(amount));
}
