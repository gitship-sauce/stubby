// Turns what the visitor pasted into the link Stubby saves, or an error message.
export function checkLink(input: string): { url: string } | { error: string } {
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
  // Only links with something=value in them can have tracking junk.
  if (!/.*=.*/.test(link)) return link;

  const url = new URL(link);
  for (const name of [...url.searchParams.keys()]) {
    if (name.startsWith("utm_") || name === "fbclid" || name === "gclid") {
      url.searchParams.delete(name);
    }
  }
  return url.href;
}
