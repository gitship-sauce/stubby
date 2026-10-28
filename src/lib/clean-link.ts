// The sitemap standard caps links at 2,048 characters, and real links stay far below it.
export const MAX_LINK_LENGTH = 2048;

// Turns what the visitor pasted into the link Stubby saves, or an error message.
export function checkLink(input: string): { url: string } | { error: string } {
  if (input.length > MAX_LINK_LENGTH) {
    return { error: `That link is too long. Stubby takes links up to ${MAX_LINK_LENGTH.toLocaleString("en-GB")} characters.` };
  }
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return { error: "That doesn't look like a link. Paste the whole thing, starting with https://" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { error: "Stubby only shortens web links (http or https)." };
  }
  return { url: cleanLink(url.href) };
}

// Removes tracking junk like ?utm_source=newsletter, so the short link is clean.
export function cleanLink(link: string): string {
  // The URL parser reads the link once, start to end, so a long link can't make it slow.
  const url = new URL(link);
  for (const name of [...url.searchParams.keys()]) {
    if (name.startsWith("utm_") || name === "fbclid" || name === "gclid") {
      url.searchParams.delete(name);
    }
  }
  return url.href;
}
