/**
 * Small typo-tolerant search for the catalog. Every word of the query must
 * match some word of the item's text: as a prefix ("пал" → "палатка") or
 * within a few typos (Damerau–Levenshtein: "палтка", "плаатка"). Text typed
 * in the wrong keyboard layout ("gfkfnrf" → "палатка") is tried as well.
 */

const EN = "`qwertyuiop[]asdfghjkl;'zxcvbnm,.";
const RU = "ёйцукенгшщзхъфывапролджэячсмитьбю";
const toRu = new Map([...EN].map((c, i) => [c, RU[i]]));
const toEn = new Map([...RU].map((c, i) => [c, EN[i]]));

const swapLayout = (s: string, map: Map<string, string>) => [...s].map((c) => map.get(c) ?? c).join("");

const normalize = (s: string) => s.toLowerCase().replace(/ё/g, "е");

const words = (s: string) =>
  normalize(s)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

/** Typos allowed for a query word of this length. */
const maxTypos = (len: number) => (len <= 3 ? 0 : len <= 6 ? 1 : 2);

/** Damerau–Levenshtein (optimal string alignment) distance, capped at `max + 1`. */
function distance(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, prev2[j - 2] + 1);
      cur.push(d);
      rowMin = Math.min(rowMin, d);
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

/** 0 for a prefix match, the number of typos otherwise, Infinity for no match. */
function wordScore(q: string, w: string) {
  if (w.startsWith(q)) return 0;
  const max = maxTypos(q.length);
  if (max === 0) return Infinity;
  // Whole word with typos, or its start with typos while the query is still being typed
  const d = Math.min(distance(q, w, max), w.length > q.length ? distance(q, w.slice(0, q.length), max) : Infinity);
  return d <= max ? d : Infinity;
}

/** Total typos needed to match every query word, Infinity if one doesn't match. */
function queryScore(query: string[], text: string[]) {
  let total = 0;
  for (const q of query) total += Math.min(...text.map((w) => wordScore(q, w)));
  return total;
}

/** Items whose `text` matches `query`, closest matches first; all items for an empty query. */
export function fuzzySearch<T>(items: T[], query: string, text: (item: T) => string): T[] {
  const q = normalize(query).trim();
  if (!q) return items;
  const variants = [q, swapLayout(q, toRu), swapLayout(q, toEn)]
    .filter((v, i, all) => all.indexOf(v) === i)
    .map(words)
    .filter((v) => v.length > 0);
  return items
    .map((item) => {
      const w = words(text(item));
      return { item, score: Math.min(...variants.map((v) => queryScore(v, w))) };
    })
    .filter((r) => r.score !== Infinity)
    .sort((a, b) => a.score - b.score)
    .map((r) => r.item);
}
