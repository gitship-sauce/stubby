import type { MetadataRoute } from "next";

// Search engines may list the home page and the sandbox. Everything else is a short link, a log-in page or the API,
// and a short link in search results would send people to someone else's saved site.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: ["/$", "/sandbox"], disallow: "/" },
  };
}
