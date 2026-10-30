// "Show more" under Your links asks for the next page of links. The login and the database are passed in, so a test
// can run this exact code without either.
// made is an ISO date, so it reads the same on the server and in the browser.
export type SavedLink = { code: string; url: string; clicks: number; made: string };

export type ShowMoreNeeds = {
  currentUser: () => Promise<{ id: number } | null>;
  listLinks: (userId: number, page: number) => Promise<SavedLink[]>;
};

export type ShowMoreAnswer = { status: 200; links: SavedLink[] } | { status: 400 | 401 | 403; error: string };

export async function showMore(needs: ShowMoreNeeds, params: URLSearchParams): Promise<ShowMoreAnswer> {
  const asked = Number(params.get("user"));
  const page = Number(params.get("page") ?? "2");
  if (!Number.isInteger(asked) || !Number.isInteger(page) || page < 1 || page > 1000) {
    return { status: 400, error: "Send the page as ?user=<your number>&page=<number>." };
  }
  const me = await needs.currentUser();
  if (!me) return { status: 401, error: "Log in to see your links." };
  if (asked !== me.id) return { status: 403, error: "Those aren't your links." };
  return { status: 200, links: await needs.listLinks(me.id, page) };
}
