/**
 * Decode common HTML entities in strings (e.g. from API/database).
 * Use for display of title/description so "&amp;" shows as "&".
 */
const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

export function decodeHtmlEntities(s: string): string {
  if (!s || typeof s !== "string") return s;
  let out = s;
  for (const [entity, char] of Object.entries(ENTITIES)) {
    out = out.replace(new RegExp(entity, "g"), char);
  }
  // Numeric decimal entities (e.g. &#8217;)
  out = out.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  // Numeric hex entities (e.g. &#x2019;)
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return out;
}
