// Where a visit to a short link goes. Kept away from the database, so a test can check it on its own.
export function linkTarget(link: { code: string; url: string }): string {
  // Beta: show a preview page first, so people see where a link goes before they leave Stubby.
  if (process.env.BETA === "on") return `/preview/${link.code}`;
  return link.url;
}
