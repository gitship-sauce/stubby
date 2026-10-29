// Where a visit to a short link goes. Kept away from the database, so a test can check it on its own.
export function linkTarget(link: { code: string; url: string }): string {
  return link.url;
}
