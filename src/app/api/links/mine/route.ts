import { currentUser } from "@/lib/auth";
import { listLinks } from "@/lib/links";
import { showMore } from "@/lib/show-more";

// The Show more button under Your links sends ?user=<number>&page=<number> here.
export async function GET(request: Request) {
  const answer = await showMore({ currentUser, listLinks }, new URL(request.url).searchParams);
  if (answer.status !== 200) return Response.json({ error: answer.error }, { status: answer.status });
  return Response.json({ links: answer.links });
}
